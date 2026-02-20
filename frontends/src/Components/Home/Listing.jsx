  import { useState, useEffect } from 'react';
  import { useDispatch } from 'react-redux';
  import About from '../extra/AboutUs'
  import JoinCard from '../extra/joinCard'
  import { Swiper, SwiperSlide } from 'swiper/react';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/free-mode';
  import 'swiper/css/pagination';
  import { FreeMode, Pagination, Mousewheel, Autoplay, Keyboard, Navigation } from 'swiper/modules';
  import Footer from './Footer';
  import Navbar from './Navbar';
  import { FaStar, FaFire, FaHeart, FaTheaterMasks, FaPlay, FaChevronRight } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { getMostLikedMovies, getHighlyRatedMovies, getRecentlyReleasedMovies } from '../../Services/operations/Auth';

  const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png';

  const MovieCard = ({ slide, badgeColor, onClick }) => (
    <div
      className="group relative w-full h-[280px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img
        src={slide.Posterurl || PLACEHOLDER_IMG}
        alt={slide.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Rating badge */}
      <div className={`absolute top-3 right-3 bg-gradient-to-r ${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg`}>
        <FaStar className="text-[10px]" />
        {slide.averageRating || slide.BannerLiked || 0}
      </div>

      {/* Genre tag */}
      <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
        {slide.genre?.genreName || "Movie"}
      </div>

      {/* Play button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors transform group-hover:scale-100 scale-75 duration-300">
          <FaPlay className="text-white text-sm ml-0.5" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-sm sm:text-base truncate">{slide.title}</h3>
        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <span className="text-richblack-300 text-xs">View Details</span>
          <FaChevronRight className="text-richblack-300 text-[8px]" />
        </div>
      </div>
    </div>
  );

  const MovieSection = ({ title, highlight, icon, iconColor, badgeColor, data, onCardClick, onViewAllClick }) => (
    <div className="w-full max-w-[92%] mx-auto py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {title} <span className={`bg-gradient-to-r ${iconColor} bg-clip-text text-transparent`}>{highlight}</span>
            </h2>
            <div className={`mt-1 w-12 h-[2px] bg-gradient-to-r ${iconColor} rounded-full`} />
          </div>
        </div>
        <button
          onClick={onViewAllClick}
          className="text-richblack-300 hover:text-white text-sm flex items-center gap-1 transition-colors group"
        >
          View All
          <FaChevronRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Swiper */}
      <Swiper
        slidesPerView={2}
        spaceBetween={12}
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
        {data.map((slide, index) => (
          <SwiperSlide key={slide._id || index}>
            <MovieCard slide={slide} badgeColor={badgeColor} onClick={() => onCardClick(slide)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  const Listing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [mostLikedData, setMostLikedData] = useState([])
    const [highlyRatedData, setHighlyRatedData] = useState([])
    const [recentlyReleasedData, setRecentlyReleasedData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const mostLiked = await dispatch(getMostLikedMovies())
        if (mostLiked?.success) {
          setMostLikedData(mostLiked.data)
        }

        const highlyRated = await dispatch(getHighlyRatedMovies())
        if (highlyRated?.success) {
          const sorted = [...highlyRated.data].sort((a, b) => {
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
          setHighlyRatedData(sorted)
        }

        const recentlyReleased = await dispatch(getRecentlyReleasedMovies())
        if (recentlyReleased?.success) {
          setRecentlyReleasedData(recentlyReleased.data)
        }
      }
      fetchData()
    }, [dispatch])

    const sectionConfig = [
      {
        title: "Top Rated",
        highlight: "Movies",
        icon: <FaStar />,
        iconColor: "from-yellow-400 to-amber-500",
        badgeColor: "from-yellow-400 to-amber-500",
        data: highlyRatedData,
        route: "top-rated",
      },
      {
        title: "Most Liked",
        highlight: "Movies",
        icon: <FaHeart />,
        iconColor: "from-pink-400 to-rose-500",
        badgeColor: "from-pink-400 to-rose-500",
        data: mostLikedData,
        route: "most-liked",
      },
      {
        title: "Recently Released",
        highlight: "Movies",
        icon: <FaFire />,
        iconColor: "from-orange-400 to-red-500",
        badgeColor: "from-orange-400 to-red-500",
        data: recentlyReleasedData,
        route: "recently-released",
      },
    ];

    return (
      <div className="text-white w-full min-h-screen flex flex-col items-center gap-0">

        <JoinCard
          title="Become an Organizer with Us"
          subttitle="Organise your show with us and reach millions"
          btn="Become An Organizer"
          imaage="https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976775/5_dwplzn.png"
           onClick={() => navigate("/SignUp")}
        />

        {sectionConfig.map((section, index) => (
          section.data.length > 0 && (
            <MovieSection
              key={index}
              title={section.title}
              highlight={section.highlight}
              icon={section.icon}
              iconColor={section.iconColor}
              badgeColor={section.badgeColor}
              data={section.data}
              onCardClick={(movie) => navigate(`/Movie/${movie._id}`)}
              onViewAllClick={() => navigate(`/${section.route}`)}
            />
          )
        ))}

        <JoinCard
          title="Register your Theatre with Us"
          subttitle="Register your theatre and get a chance to earn more with us"
          btn="Become A Theatrer"
          imaage="https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png"
           onClick={() => navigate("/Contact")}
        />

        <About />
        <Footer />
      </div>
    );
  };

  export default Listing;
