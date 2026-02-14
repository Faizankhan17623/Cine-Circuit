import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { MovieDetailsFinding } from "../../Services/operations/User"
import { createRating, getAverageRating, bannerLike, bannerDislike } from "../../Services/operations/Auth"
import { PurcahsedTickets } from "../../Services/operations/User"
import { FaArrowLeft } from "react-icons/fa"
import {
  FaPlay,
  FaMapMarkerAlt,
  FaClock,
  FaFilm,
  FaTag,
  FaStar,
  FaRegStar,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa"
import Loader from "../extra/Loading"
import Navbar from "../Home/Navbar"

const Movie = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [hasPurchased, setHasPurchased] = useState(false)

  const { token, isLoggedIn } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  
const previousTag = location.state?.tag
// console.log(movie)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      try {
        const response = await dispatch(MovieDetailsFinding(id))
        if (response?.success) {
          const movieData = response.data.data
          setMovie(movieData)
          setLikeCount(movieData.BannerLiked || 0)
          setDislikeCount(movieData.BannerDisLiked || 0)
        }
        const ratingRes = await dispatch(getAverageRating(id))
        if (ratingRes?.success) {
          setAverageRating(ratingRes.averageRating)
        }
        // Check if user has purchased tickets for this movie
        if (token) {
          const ticketRes = await dispatch(PurcahsedTickets(token, navigate))
          if (ticketRes?.success) {
            const purchased = ticketRes.data.data?.some(
              (t) => t.showid === id && t.Payment_Status === "success"
            )
            setHasPurchased(!!purchased)
          }
        }
      } catch (error) {
        console.log("Movie fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleSubmitReview = async () => {
    if (!userRating || !reviewText.trim()) return
    setSubmitting(true)
    try {
      const res = await dispatch(createRating(userRating, id, reviewText.trim(), token))
      if (res?.success) {
        setReviewSubmitted(true)
        setUserRating(0)
        setReviewText("")
        const ratingRes = await dispatch(getAverageRating(id))
        if (ratingRes?.success) {
          setAverageRating(ratingRes.averageRating)
        }
      }
    } catch (error) {
      console.log("Review submit error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async () => {
    if (!isLoggedIn || !token) return
    const res = await dispatch(bannerLike(id, token))
    if (res?.success) {
      if (res.likes !== undefined) {
        setLikeCount(res.likes)
        setDislikeCount(res.dislikes)
      } else {
        setLikeCount((prev) => prev + 1)
      }
    }
  }

  const handleDislike = async () => {
    if (!isLoggedIn || !token) return
    const res = await dispatch(bannerDislike(id, token))
    if (res?.success) {
      if (res.likes !== undefined) {
        setLikeCount(res.likes)
        setDislikeCount(res.dislikes)
      } else {
        setDislikeCount((prev) => prev + 1)
      }
    }
  }

  if (loading || !movie) {
    return (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-white flex flex-col">
      <Navbar />
<div className=" pt-2 ">
  <button
    onClick={() => {
      if (previousTag) {
        navigate(`/genre/${previousTag}`)
      } else {
        navigate(-1) // fallback
      }
    }}
    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition font-medium"
  >
    <FaArrowLeft />
    Back to {previousTag ? previousTag : "Movies"}
  </button>
</div>
      {/* Add spacing for navbar */}
      <div className="pt-20">

        {/* 🔥 HERO SECTION */}
        <div className="relative w-full h-[520px] overflow-hidden">
          <img
            src={movie.Posterurl}
            alt={movie.title}
            className="w-full h-full object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 via-richblack-900/70 to-transparent" />

          <div className="absolute bottom-12 left-10 max-w-2xl z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {movie.title}
            </h1>

            <p className="text-richblack-300 mb-4">
              {movie.tagline}
            </p>

            <div className="flex items-center gap-4 text-sm text-richblack-300 mb-5 flex-wrap">
              <span>{movie.releasedate}</span>
              <span>•</span>
              <span>{movie.movieDuration} mins</span>
              <span>•</span>
              <span className="text-yellow-400 font-medium">
                {movie.movieStatus}
              </span>
              {averageRating > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <FaStar className="text-xs" />
                    {Math.round(averageRating * 10) / 10}/5
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={movie.trailerurl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-yellow-400/20"
              >
                <FaPlay />
                Watch Trailer
              </a>

              {/* Like / Dislike */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={!isLoggedIn}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-green-500/20 hover:border-green-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaThumbsUp className="text-green-400" />
                  <span className="text-sm font-semibold">{likeCount}</span>
                </button>
                <button
                  onClick={handleDislike}
                  disabled={!isLoggedIn}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaThumbsDown className="text-red-400" />
                  <span className="text-sm font-semibold">{dislikeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 DETAILS SECTION */}
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-14">

          {/* Genre */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Genre</h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                {movie.genre?.genreName}
              </span>

              {movie.SUbGenre?.map((sub) => (
                <span
                  key={sub._id}
                  className="px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Languages</h2>
            <div className="flex gap-3 flex-wrap">
              {movie.language?.map((lang) => (
                <span
                  key={lang._id}
                  className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {movie.castName?.map((cast) => (
                <div
                  key={cast._id}
                  className="bg-richblack-800 p-5 rounded-2xl text-center hover:scale-105 transition border border-richblack-700"
                >
                  <img
                    src={cast.images}
                    alt={cast.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-yellow-400/30"
                  />
                  <p className="text-sm font-medium">{cast.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Theatres */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Available Theatres</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {movie.AllotedToTheNumberOfTheatres?.map((theatre) => (
                <div
                  key={theatre._id}
                  className="bg-richblack-800 p-6 rounded-2xl border border-richblack-700 hover:border-yellow-400 transition shadow-lg shadow-black/20"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {theatre.Theatrename}
                  </h3>

                  <div className="flex items-center gap-2 text-richblack-400 text-sm mb-3">
                    <FaMapMarkerAlt />
                    {theatre.locationName}
                  </div>

                  {/* <div className="text-sm text-yellow-400 font-semibold">
                    Ticket Price: ₹{theatre.priceoftheTicket?.[0]}
                  </div> */}
                </div>
              ))}
            </div>
          </div>

          {/* Extra Info */}
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              <ul className="space-y-3 text-richblack-300 text-sm">
                <li><FaClock className="inline mr-2 text-yellow-400" /> Duration: {movie.movieDuration} mins</li>
                <li><FaFilm className="inline mr-2 text-yellow-400" /> Director: {movie.directorname?.join(", ")}</li>
                <li>Producer: {movie.producername?.join(", ")}</li>
                <li>Writers: {movie.writersname?.join(", ")}</li>
                <li> Budget: ₹{Number(movie.totalbudget).toLocaleString("en-IN")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Hashtags</h2>
              <div className="flex gap-3 flex-wrap">
                {movie.hashtags?.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1"
                  >
                    <FaTag /> #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rating & Review Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Ratings & Reviews</h2>

            {/* Average Rating Card */}
            <div className="flex items-center gap-6 bg-richblack-800 rounded-2xl p-6 border border-richblack-700 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-400">
                  {averageRating > 0 ? (Math.round(averageRating * 10) / 10) : "N/A"}
                </p>
                <div className="flex items-center gap-0.5 mt-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-sm ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-richblack-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-richblack-400 mt-1">
                  {movie.ratingAndReviews?.length || 0} reviews
                </p>
              </div>

              <div className="h-16 w-px bg-richblack-600" />

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = movie.ratingAndReviews?.filter(
                    (r) => Math.round(r.rating) === star
                  ).length || 0
                  const total = movie.ratingAndReviews?.length || 1
                  const percent = Math.round((count / total) * 100)

                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-richblack-300 w-3">{star}</span>
                      <FaStar className="text-[10px] text-yellow-400" />
                      <div className="flex-1 h-2 bg-richblack-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-richblack-400 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Existing Reviews */}
            {movie.ratingAndReviews?.length > 0 && (
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
                {movie.ratingAndReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-richblack-800 rounded-xl p-4 border border-richblack-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`text-xs ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-richblack-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-richblack-400">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-richblack-200">{review.review}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Form */}
            {isLoggedIn && user?.usertype === "Viewer" && hasPurchased && !reviewSubmitted ? (
              <div className="bg-richblack-800 rounded-2xl p-6 border border-richblack-700">
                <h3 className="text-sm font-semibold mb-4 text-richblack-200">Write a Review</h3>

                {/* Star Picker */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-125"
                    >
                      {star <= (hoverRating || userRating) ? (
                        <FaStar className="text-2xl text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-2xl text-richblack-500" />
                      )}
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-sm text-yellow-400 ml-2 font-medium">
                      {userRating}/5
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  rows={3}
                  className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-3 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400/50 resize-none mb-4"
                />

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={!userRating || !reviewText.trim() || submitting}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    !userRating || !reviewText.trim() || submitting
                      ? "bg-richblack-700 text-richblack-500 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-300 text-black"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            ) : reviewSubmitted ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-green-400 text-sm font-medium">
                  Your review has been submitted successfully!
                </p>
              </div>
            ) : !isLoggedIn ? (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                <p className="text-orange-400 text-sm">
                  Please login to submit a review
                </p>
              </div>
            ) : user?.usertype !== "Viewer" ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-400 text-sm">
                  Only viewers can submit reviews
                </p>
              </div>
            ) : isLoggedIn && user?.usertype === "Viewer" && !hasPurchased ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <p className="text-blue-400 text-sm">
                  You need to purchase a ticket for this movie before you can leave a review
                </p>
              </div>
            ) : null}
          </div>

<button className="w-full bg-yellow-400
hover:bg-yellow-300
text-black font-bold py-3 rounded-xl
border border-yellow-300
transition-all duration-200
shadow-md shadow-yellow-500/20
hover:shadow-yellow-500/40
active:scale-95" onClick={()=>{
   navigate(`/Purchase/${movie._id}`)
}}>
  Purchase Tickets
</button>

        </div>
      </div>
    </div>
  )
}

export default Movie
