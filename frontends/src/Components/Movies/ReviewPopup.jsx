import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { PurcahsedTickets } from "../../Services/operations/User"
import { createRating } from "../../Services/operations/Auth"
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa"

const ReviewPopup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, isLoggedIn } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [showPopup, setShowPopup] = useState(false)
  const [movieToReview, setMovieToReview] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !token || user?.usertype !== "Viewer") return

    const checkForReview = async () => {
      try {
        const response = await dispatch(PurcahsedTickets(token, navigate))
        if (!response?.success || !response.data?.data) return

        const tickets = response.data.data
        const now = new Date()

        // Check dismissed popups from sessionStorage
        const dismissed = JSON.parse(sessionStorage.getItem("dismissedReviews") || "[]")

        for (const ticket of tickets) {
          if (ticket.Payment_Status !== "success") continue
          if (dismissed.includes(ticket.showid)) continue

          const showDateStr = ticket.Showdate
          const time = ticket.time
          if (!showDateStr || !time) continue

          // Parse date DD/MM/YYYY
          const dateParts = showDateStr.split("/")
          if (dateParts.length !== 3) continue

          const timeParts = time.split(":")
          const showHours = parseInt(timeParts[0], 10)
          const showMinutes = parseInt(timeParts[1] || "0", 10)

          const showDateTime = new Date(
            `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
          )
          showDateTime.setHours(showHours, showMinutes, 0, 0)

          // Movie duration is typically ~2 hours, add 1 hour buffer = 3 hours after showtime
          // We'll use a 3 hour window after the show starts
          const movieEndTime = new Date(showDateTime.getTime() + 3 * 60 * 60 * 1000)
          // Popup should show for 24 hours after movie ends
          const popupExpiry = new Date(movieEndTime.getTime() + 24 * 60 * 60 * 1000)

          if (now >= movieEndTime && now <= popupExpiry) {
            setMovieToReview({
              showId: ticket.showid,
              showDate: showDateStr,
              time: time,
            })
            setShowPopup(true)
            break
          }
        }
      } catch (error) {
        console.log("Review popup check error:", error)
      }
    }

    // Check after a small delay so app loads first
    const timer = setTimeout(checkForReview, 3000)
    return () => clearTimeout(timer)
  }, [isLoggedIn, token])

  const handleDismiss = () => {
    if (movieToReview) {
      const dismissed = JSON.parse(sessionStorage.getItem("dismissedReviews") || "[]")
      dismissed.push(movieToReview.showId)
      sessionStorage.setItem("dismissedReviews", JSON.stringify(dismissed))
    }
    setShowPopup(false)
    setMovieToReview(null)
  }

  const handleSubmit = async () => {
    if (!userRating || !reviewText.trim() || !movieToReview) return
    setSubmitting(true)
    try {
      const res = await dispatch(
        createRating(userRating, movieToReview.showId, reviewText.trim(), token)
      )
      if (res?.success) {
        handleDismiss()
      }
    } catch (error) {
      console.log("Review popup submit error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!showPopup || !movieToReview) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-richblack-800 rounded-2xl border border-richblack-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border-b border-richblack-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">How was the movie?</h3>
            <p className="text-xs text-richblack-400 mt-1">
              Share your experience from today's show
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg hover:bg-richblack-700 text-richblack-400 hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Star Picker */}
          <p className="text-sm text-richblack-300 mb-3">Rate this movie</p>
          <div className="flex items-center gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
                className="transition-transform hover:scale-125"
              >
                {star <= (hoverRating || userRating) ? (
                  <FaStar className="text-3xl text-yellow-400" />
                ) : (
                  <FaRegStar className="text-3xl text-richblack-500" />
                )}
              </button>
            ))}
            {userRating > 0 && (
              <span className="text-sm text-yellow-400 ml-3 font-semibold">
                {userRating}/5
              </span>
            )}
          </div>

          {/* Review Text */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us what you liked or didn't like..."
            rows={3}
            className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-3 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400/50 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-richblack-300 bg-richblack-700 hover:bg-richblack-600 transition"
          >
            Maybe Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!userRating || !reviewText.trim() || submitting}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              !userRating || !reviewText.trim() || submitting
                ? "bg-richblack-700 text-richblack-500 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 text-black"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewPopup
