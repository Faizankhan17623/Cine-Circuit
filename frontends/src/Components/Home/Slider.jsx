import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules'
import { FaPlay } from 'react-icons/fa'
import { BannerImages } from '../../Services/operations/User'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

const Slider = () => {

  const dispatch = useDispatch()
  const [bannerData, setBannerData] = useState([])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await dispatch(BannerImages())

        if (response?.data?.success) {
          const data = response.data.data

          const slidesArray = []

          // 🔥 Most Liked (Trending)
          if (data.mostLiked) {
            slidesArray.push({
              ...data.mostLiked,
              tag: "Trending",
            })
          }

          // 🆕 Recently Created
          if (data.recentlyCreated) {
            slidesArray.push({
              ...data.recentlyCreated,
              tag: "New",
            })
          }

          // 🎬 Coming Soon (can be multiple)
          if (data.comingSoon?.length > 0) {
            data.comingSoon.forEach(movie => {
              slidesArray.push({
                ...movie,
                tag: "Upcoming",
              })
            })
          }

          // 🏆 Top Trending
          if (data.topTrending?.length > 0) {
            data.topTrending.forEach(movie => {
              slidesArray.push({
                ...movie,
                tag: "Popular",
              })
            })
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

      <div className='w-full h-[380px] lg:h-[480px] rounded-3xl overflow-hidden relative border border-richblack-700/50 shadow-2xl shadow-black/40 group'>

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

          {bannerData.map((movie, index) => (
            <SwiperSlide key={index} className="relative">

              <img
                src={movie.Posterurl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-10 left-10 flex flex-col gap-4">

                <span className='inline-block w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-yellow-400/20'>
                  {movie.tag}
                </span>

                <h2 className="text-3xl lg:text-5xl font-extrabold text-white drop-shadow-xl tracking-tight">
                  {movie.title}
                </h2>

                {/* ✅ Release Date Display */}
                <p className="text-yellow-300 text-sm font-medium">
                  Release Date: {movie.releasedate}
                </p>

                <button className='group/btn w-fit flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg'>
                  <div className='w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform'>
                    <FaPlay className='text-black text-xs ml-0.5' />
                  </div>
                  Watch Now
                </button>

              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </div>
  )
}

export default Slider
