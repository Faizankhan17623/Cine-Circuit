import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { FreeMode, Pagination, Mousewheel, Autoplay, Keyboard, Navigation } from 'swiper/modules'
import { FaStar, FaFire, FaHeart, FaPlay, FaChevronRight, FaArrowLeft, FaClock, FaCalendarAlt, FaThumbsUp, FaFilm } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getMostLikedMovies, getHighlyRatedMovies, getRecentlyReleasedMovies } from '../../Services/operations/Auth'
import Navbar from './Navbar'
import Footer from './Footer'

const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png'

const MovieCard = ({ slide, badgeColor, onClick, showDetails = false }) => (
  <div
    className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${showDetails ? 'h-full' : 'h-[280px] sm:h-[300px]'}`}
    onClick={onClick}
  >
    <img
      src={slide.Posterurl || PLACEHOLDER_IMG}
      alt={slide.title}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
    <div className={`absolute top-3 right-3 bg-gradient-to-r ${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg`}>
      <FaStar className="text-[10px]" />
      {slide.averageRating || slide.BannerLiked || 0}
    </div>
    <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
      {slide.genre?.genreName || "Movie"}
    </div>
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors transform group-hover:scale-100 scale-75 duration-300">
        <FaPlay className="text-white text-sm ml-0.5" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-white font-bold text-sm sm:text-base truncate">{slide.title}</h3>
      <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
        <span className="text-richblack-300 text-xs">View Details</span>
        <FaChevronRight className="text-richblack-300 text-[8px]" />
      </div>
    </div>
  </div>
)

const DetailedMovieCard = ({ movie, badgeColor, onClick }) => (
  <div
    className="group bg-richblack-800 rounded-2xl overflow-hidden border border-richblack-700 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
    onClick={onClick}
  >
    {/* Poster */}
    <div className="w-full md:w-48 h-64 md:h-auto relative flex-shrink-0">
      <img
        src={movie.Posterurl || PLACEHOLDER_IMG}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent md:from-transparent" />
    </div>

    {/* Content */}
    <div className="flex-1 p-5 flex flex-col justify-between">
      <div>
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          <div className={`flex items-center gap-1.5 bg-gradient-to-r ${badgeColor} px-3 py-1 rounded-lg`}>
            <FaStar className="text-white text-sm" />
            <span className="text-white font-bold">{movie.averageRating || 0}</span>
          </div>
        </div>

        {/* Tagline */}
        {movie.tagline && (
          <p className="text-richblack-400 text-sm mb-4 italic">"{movie.tagline}"</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4">
          {movie.movieDuration && (
            <span className="flex items-center gap-1.5 text-richblack-300 text-xs bg-richblack-700 px-3 py-1.5 rounded-lg">
              <FaClock className="text-yellow-400" />
              {movie.movieDuration} mins
            </span>
          )}
          {movie.releasedate && (
            <span className="flex items-center gap-1.5 text-richblack-300 text-xs bg-richblack-700 px-3 py-1.5 rounded-lg">
              <FaCalendarAlt className="text-yellow-400" />
              {movie.releasedate}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-richblack-300 text-xs bg-richblack-700 px-3 py-1.5 rounded-lg">
            <FaFilm className="text-yellow-400" />
            {movie.genre?.genreName || "Movie"}
          </span>
          {movie.reviewCount && (
            <span className="flex items-center gap-1.5 text-richblack-300 text-xs bg-richblack-700 px-3 py-1.5 rounded-lg">
              <FaThumbsUp className="text-yellow-400" />
              {movie.reviewCount} reviews
            </span>
          )}
        </div>

        {/* Description */}
        {movie.description && (
          <p className="text-richblack-300 text-sm line-clamp-3 mb-4">
            {movie.description}
          </p>
        )}
      </div>

      {/* Action */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-richblack-700">
        <span className="text-yellow-400 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-2">
          View Details <FaChevronRight className="text-xs" />
        </span>
        {movie.movieStatus && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            movie.movieStatus === 'Released' ? 'bg-green-500/20 text-green-400' :
            movie.movieStatus === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {movie.movieStatus}
          </span>
        )}
      </div>
    </div>
  </div>
)

const categoryConfig = {
  'top-rated': {
    title: 'Top Rated',
    highlight: 'Movies',
    subtitle: 'Discover the best movies based on user ratings',
    icon: <FaStar />,
    iconColor: 'from-yellow-400 to-amber-500',
    badgeColor: 'from-yellow-400 to-amber-500',
    fetchFn: 'getHighlyRatedMovies',
  },
  'most-liked': {
    title: 'Most Liked',
    highlight: 'Movies',
    subtitle: 'Popular movies loved by our community',
    icon: <FaHeart />,
    iconColor: 'from-pink-400 to-rose-500',
    badgeColor: 'from-pink-400 to-rose-500',
    fetchFn: 'getMostLikedMovies',
  },
  'recently-released': {
    title: 'Recently Released',
    highlight: 'Movies',
    subtitle: 'Fresh movies just out in theatres',
    icon: <FaFire />,
    iconColor: 'from-orange-400 to-red-500',
    badgeColor: 'from-orange-400 to-red-500',
    fetchFn: 'getRecentlyReleasedMovies',
  },
}

const MovieCategory = ({ type: propType }) => {
  const { type: paramType } = useParams()
  const type = propType || paramType
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'slider'

  const config = categoryConfig[type]

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      let response
      if (type === 'top-rated') {
        response = await dispatch(getHighlyRatedMovies())
      } else if (type === 'most-liked') {
        response = await dispatch(getMostLikedMovies())
      } else if (type === 'recently-released') {
        response = await dispatch(getRecentlyReleasedMovies())
      }
      if (response?.success) {
        let data = response.data
        if (type === 'top-rated') {
          data = [...data].sort((a, b) => {
            const aRating = a.averageRating || 0
            const bRating = b.averageRating || 0
            const aReviews = a.reviewCount || 0
            const bReviews = b.reviewCount || 0
            if (aReviews === 0 && bReviews === 0) return (b.BannerLiked || 0) - (a.BannerLiked || 0)
            if (aReviews === 0) return 1
            if (bReviews === 0) return -1
            if (bRating !== aRating) return bRating - aRating
            return bReviews - aReviews
          })
        }
        setMovies(data)
      }
      setLoading(false)
    }
    fetchMovies()
  }, [type, dispatch])

  if (!config) {
    return (
      <div className="bg-richblack-900 min-h-screen">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl text-white">Category not found</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-richblack-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-richblack-800 to-richblack-900 pt-8 pb-12">
        <div className="max-w-[1440px] mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-richblack-300 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            Back to Home
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${config.iconColor} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                {config.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {config.title} <span className={`bg-gradient-to-r ${config.iconColor} bg-clip-text text-transparent`}>{config.highlight}</span>
                </h1>
                <p className="text-richblack-400 mt-1">{config.subtitle}</p>
                <div className={`mt-2 w-20 h-1.5 bg-gradient-to-r ${config.iconColor} rounded-full`} />
              </div>
            </div>

            {/* View Toggle & Stats */}
            <div className="flex items-center gap-4">
              {movies.length > 0 && (
                <div className="bg-richblack-800 px-4 py-2 rounded-xl border border-richblack-700">
                  <span className="text-richblack-400 text-sm">Total:</span>
                  <span className="text-white font-bold ml-2">{movies.length}</span>
                  <span className="text-richblack-400 text-sm ml-1">movies</span>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex bg-richblack-800 rounded-xl border border-richblack-700 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-yellow-400 text-black'
                      : 'text-richblack-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'slider'
                      ? 'bg-yellow-400 text-black'
                      : 'text-richblack-400 hover:text-white'
                  }`}
                >
                  Slider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 -mt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex bg-richblack-800 rounded-2xl border border-richblack-700 overflow-hidden animate-pulse">
                <div className="w-48 h-48 bg-richblack-600 flex-shrink-0" />
                <div className="flex-1 p-5 flex flex-col gap-3">
                  <div className="h-6 bg-richblack-600 rounded-lg w-3/4" />
                  <div className="h-4 bg-richblack-700 rounded w-1/2" />
                  <div className="flex gap-2 mt-1">
                    <div className="h-7 w-20 bg-richblack-700 rounded-lg" />
                    <div className="h-7 w-24 bg-richblack-700 rounded-lg" />
                    <div className="h-7 w-16 bg-richblack-700 rounded-lg" />
                  </div>
                  <div className="h-4 bg-richblack-700 rounded w-full mt-2" />
                  <div className="h-4 bg-richblack-700 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-richblack-800 rounded-2xl border border-richblack-700">
            <div className={`w-20 h-20 bg-gradient-to-br ${config.iconColor} rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 opacity-50`}>
              {config.icon}
            </div>
            <p className="text-richblack-400 text-lg">No movies found in this category</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 bg-yellow-400 text-black font-medium rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DetailedMovieCard
                  movie={movie}
                  badgeColor={config.badgeColor}
                  onClick={() => navigate(`/Movie/${movie._id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Slider View */
          <Swiper
            slidesPerView={2}
            spaceBetween={16}
            freeMode={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            mousewheel={{ forceToAxis: true }}
            keyboard={true}
            loop={true}
            navigation={true}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 12 },
              640: { slidesPerView: 3, spaceBetween: 14 },
              768: { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 18 },
              1280: { slidesPerView: 6, spaceBetween: 20 },
            }}
            modules={[FreeMode, Pagination, Mousewheel, Keyboard, Autoplay, Navigation]}
            className="listing-swiper !pb-10"
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie._id}>
                <MovieCard
                  slide={movie}
                  badgeColor={config.badgeColor}
                  onClick={() => navigate(`/Movie/${movie._id}`)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MovieCategory
