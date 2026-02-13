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

  const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png';

  const topRatedMovies = [
    { id: 1, image: PLACEHOLDER_IMG, title: "Inception", genre: "Sci-Fi", rating: 9.2 },
    { id: 2, image: PLACEHOLDER_IMG, title: "The Dark Knight", genre: "Action", rating: 9.0 },
    { id: 3, image: PLACEHOLDER_IMG, title: "Interstellar", genre: "Sci-Fi", rating: 8.8 },
    { id: 4, image: PLACEHOLDER_IMG, title: "Pulp Fiction", genre: "Crime", rating: 8.9 },
    { id: 5, image: PLACEHOLDER_IMG, title: "Fight Club", genre: "Drama", rating: 8.8 },
    { id: 6, image: PLACEHOLDER_IMG, title: "Forrest Gump", genre: "Drama", rating: 8.7 },
    { id: 7, image: PLACEHOLDER_IMG, title: "The Matrix", genre: "Sci-Fi", rating: 8.7 },
    { id: 8, image: PLACEHOLDER_IMG, title: "Goodfellas", genre: "Crime", rating: 8.6 },
  ];

  const highlyRatedMovies = [
    { id: 9, image: PLACEHOLDER_IMG, title: "Parasite", genre: "Thriller", rating: 8.5 },
    { id: 10, image: PLACEHOLDER_IMG, title: "Whiplash", genre: "Music", rating: 8.5 },
    { id: 11, image: PLACEHOLDER_IMG, title: "Gladiator", genre: "Action", rating: 8.5 },
    { id: 12, image: PLACEHOLDER_IMG, title: "The Prestige", genre: "Mystery", rating: 8.5 },
    { id: 13, image: PLACEHOLDER_IMG, title: "Memento", genre: "Thriller", rating: 8.4 },
    { id: 14, image: PLACEHOLDER_IMG, title: "The Departed", genre: "Crime", rating: 8.5 },
    { id: 15, image: PLACEHOLDER_IMG, title: "Django", genre: "Western", rating: 8.4 },
    { id: 16, image: PLACEHOLDER_IMG, title: "Joker", genre: "Drama", rating: 8.4 },
  ];

  const mostLikedMovies = [
    { id: 17, image: PLACEHOLDER_IMG, title: "Avengers", genre: "Action", rating: 8.4 },
    { id: 18, image: PLACEHOLDER_IMG, title: "Spider-Man", genre: "Action", rating: 8.3 },
    { id: 19, image: PLACEHOLDER_IMG, title: "Frozen", genre: "Animation", rating: 7.5 },
    { id: 20, image: PLACEHOLDER_IMG, title: "Titanic", genre: "Romance", rating: 7.9 },
    { id: 21, image: PLACEHOLDER_IMG, title: "Avatar", genre: "Sci-Fi", rating: 7.9 },
    { id: 22, image: PLACEHOLDER_IMG, title: "Toy Story", genre: "Animation", rating: 8.3 },
    { id: 23, image: PLACEHOLDER_IMG, title: "The Lion King", genre: "Animation", rating: 8.5 },
    { id: 24, image: PLACEHOLDER_IMG, title: "Up", genre: "Animation", rating: 8.3 },
  ];

  const topTheatres = [
    { id: 25, image: PLACEHOLDER_IMG, title: "PVR Cinemas", genre: "Premium", rating: 4.5 },
    { id: 26, image: PLACEHOLDER_IMG, title: "INOX Leisure", genre: "Multiplex", rating: 4.3 },
    { id: 27, image: PLACEHOLDER_IMG, title: "Cinepolis", genre: "Luxury", rating: 4.4 },
    { id: 28, image: PLACEHOLDER_IMG, title: "Carnival", genre: "Standard", rating: 4.2 },
    { id: 29, image: PLACEHOLDER_IMG, title: "Miraj Cinemas", genre: "Premium", rating: 4.1 },
    { id: 30, image: PLACEHOLDER_IMG, title: "Rajhans", genre: "Multiplex", rating: 4.0 },
    { id: 31, image: PLACEHOLDER_IMG, title: "SRS Cinemas", genre: "Standard", rating: 3.9 },
    { id: 32, image: PLACEHOLDER_IMG, title: "Fun Cinemas", genre: "Multiplex", rating: 4.0 },
  ];

  const sectionConfig = [
    {
      title: "Top Rated",
      highlight: "Movies",
      icon: <FaStar />,
      iconColor: "from-yellow-400 to-amber-500",
      badgeColor: "from-yellow-400 to-amber-500",
      data: topRatedMovies,
    },
    {
      title: "Highly Rated",
      highlight: "Movies",
      icon: <FaFire />,
      iconColor: "from-orange-400 to-red-500",
      badgeColor: "from-orange-400 to-red-500",
      data: highlyRatedMovies,
    },
    {
      title: "Most Liked",
      highlight: "Movies",
      icon: <FaHeart />,
      iconColor: "from-pink-400 to-rose-500",
      badgeColor: "from-pink-400 to-rose-500",
      data: mostLikedMovies,
    },
    {
      title: "Top Rated",
      highlight: "Theatres",
      icon: <FaTheaterMasks />,
      iconColor: "from-purple-400 to-indigo-500",
      badgeColor: "from-purple-400 to-indigo-500",
      data: topTheatres,
    },
  ];

  const MovieCard = ({ slide, badgeColor }) => (
    <div className="group relative w-full h-[280px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer">
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Rating badge */}
      <div className={`absolute top-3 right-3 bg-gradient-to-r ${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg`}>
        <FaStar className="text-[10px]" />
        {slide.rating}
      </div>

      {/* Genre tag */}
      <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/20">
        {slide.genre}
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

  const MovieSection = ({ title, highlight, icon, iconColor, badgeColor, data }) => (
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
        <button className="text-richblack-300 hover:text-white text-sm flex items-center gap-1 transition-colors group">
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
        {data.map((slide) => (
          <SwiperSlide key={slide.id}>
            <MovieCard slide={slide} badgeColor={badgeColor} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  const Listing = () => {
    const navigate = useNavigate()
    return (
      <div className="text-white w-full min-h-screen flex flex-col items-center gap-2">

        <JoinCard
          title="Become an Organizer with Us"
          subttitle="Organise your show with us and reach millions"
          btn="Become An Organizer"
          imaage="https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976775/5_dwplzn.png"
           onClick={() => navigate("/SignUp")}
        />

        {sectionConfig.map((section, index) => (
          <MovieSection
            key={index}
            title={section.title}
            highlight={section.highlight}
            icon={section.icon}
            iconColor={section.iconColor}
            badgeColor={section.badgeColor}
            data={section.data}
            navigate={section.navigate}
          />
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
