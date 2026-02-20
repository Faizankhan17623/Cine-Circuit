import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules'
import { FaPlay, FaFire, FaStar, FaClock, FaTicketAlt, FaTrophy } from 'react-icons/fa'
import { BannerImages } from '../../Services/operations/User'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const tagConfig = {
  "Trending": {
    gradient: "from-orange-500 to-red-500",
    shadow: "shadow-red-500/30",
    icon: FaFire,
  },
  "New": {
    gradient: "from-green-400 to-emerald-500",
    shadow: "shadow-green-500/30",
    icon: FaStar,
  },
  "Coming Soon": {
    gradient: "from-blue-400 to-indigo-500",
    shadow: "shadow-blue-500/30",
    icon: FaClock,
  },
  "Top Pick": {
    gradient: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/30",
    icon: FaTicketAlt,
  },
  "Blockbuster": {
    gradient: "from-purple-400 to-pink-500",
    shadow: "shadow-purple-500/30",
    icon: FaTicketAlt,
  },
  "Highest Rated": {
    gradient: "from-yellow-300 to-yellow-500",
    shadow: "shadow-yellow-400/30",
    icon: FaTrophy,
  },
}

const Slider = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [bannerData, setBannerData] = useState([])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await dispatch(BannerImages())

        if (response?.data?.success) {
          const data = response.data.data
          const slidesArray = []

          if (data.mostLiked) {
            slidesArray.push({ ...data.mostLiked, tag: "Trending" })
          }

          if (data.recentlyCreated) {
            slidesArray.push({ ...data.recentlyCreated, tag: "New" })
          }

          if (data.comingSoon?.length > 0) {
            data.comingSoon.forEach(movie => {
              slidesArray.push({ ...movie, tag: "Coming Soon" })
            })
          }

          if (data.topPicks?.length > 0) {
            data.topPicks.forEach((movie, i) => {
              slidesArray.push({
                ...movie,
                tag: i === 0 ? "Top Pick" : "Blockbuster",
              })
            })
          }

          if (data.highestRated) {
            slidesArray.push({ ...data.highestRated, tag: "Highest Rated" })
          }

          setBannerData(slidesArray)
        }

      } catch (error) {
        console.log(error)
      }
    }

    fetchBanner()
  }, [dispatch])

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8 lg:py-4'>

      <div className='text-center mb-5'>
        <h2 className='text-3xl lg:text-5xl font-bold text-white'>
          Now <span className='bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>Showing</span>
        </h2>
        <p className='text-richblack-300 mt-4 text-lg'>Discover what's playing near you</p>
        <div className='mt-4 w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto' />
      </div>

      <div className='w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden relative border border-richblack-700/50 shadow-2xl shadow-black/40 group'>

        <Swiper
          cssMode={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          mousewheel={true}
          keyboard={true}
          loop={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
          className="w-full h-full"
        >

          {bannerData.map((movie, index) => {
            const config = tagConfig[movie.tag] || tagConfig["Trending"]
            const TagIcon = config.icon

            return (
              <SwiperSlide key={index} className="relative">

                <img
                  src={movie.Posterurl}
                  alt={movie.title}
                  className="w-full h-full object-cover scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-12 flex flex-col gap-3">

                  {/* Tag Badge */}
                  <span className={`inline-flex items-center gap-1.5 w-fit bg-gradient-to-r ${config.gradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ${config.shadow}`}>
                    <TagIcon className="text-[10px]" />
                    {movie.tag}
                  </span>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-5xl font-extrabold text-white drop-shadow-xl tracking-tight leading-tight max-w-2xl">
                    {movie.title}
                  </h2>

                  {/* Tagline */}
                  {movie.tagline && (
                    <p className="text-richblack-200 text-sm lg:text-base max-w-xl line-clamp-2">
                      {movie.tagline}
                    </p>
                  )}

                  {/* Meta Info Row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {movie.releasedate && (
                      <span className="text-richblack-300 text-xs lg:text-sm border border-richblack-600 px-3 py-1 rounded-full">
                        {movie.releasedate}
                      </span>
                    )}
                    {movie.movieDuration && (
                      <span className="text-richblack-300 text-xs lg:text-sm border border-richblack-600 px-3 py-1 rounded-full">
                        {movie.movieDuration} mins
                      </span>
                    )}
                    {movie.averageRating && (
                      <span className="text-yellow-400 text-xs lg:text-sm border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaStar className="text-[10px]" /> {movie.averageRating}
                      </span>
                    )}
                    {movie.ticketspurchased?.length > 0 && (
                      <span className="text-richblack-300 text-xs lg:text-sm border border-richblack-600 px-3 py-1 rounded-full">
                        {movie.ticketspurchased.length} tickets sold
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-1">
                    {movie.trailerurl && (
                      <a
                        href={movie.trailerurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='group/btn flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg'
                      >
                        <div className='w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform'>
                          <FaPlay className='text-black text-xs ml-0.5' />
                        </div>
                        Watch Trailer
                      </a>
                    )}
                    {movie.movieStatus !== "Upcoming" && movie.movieStatus !== "Coming Soon" && movie.movieStatus !== "Expired" && (
                      <button
                        onClick={() => navigate(`/Movie/${movie._id}`)}
                        className='px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-yellow-400/20'
                      >
                        Book Tickets
                      </button>
                    )}
                  </div>

                </div>
              </SwiperSlide>
            )
          })}

        </Swiper>
      </div>
    </div>
  )
}

export default Slider
