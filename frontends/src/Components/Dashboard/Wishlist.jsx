import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFavourite } from '../../Slices/AddtoFavouritslistSlice'
import { CiBookmark } from 'react-icons/ci'
import { FaBookmark, FaPlay, FaTrash } from 'react-icons/fa'

const PLACEHOLDER_IMG = 'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png'

const Wishlist = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const wishlist = useSelector((state) => state.addtofavourite.Add)

  if (wishlist.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-richblack-700 flex items-center justify-center mb-4">
          <CiBookmark className="text-3xl text-yellow-200" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
        <p className="text-richblack-300 text-sm max-w-sm mb-6">
          Movies and shows you bookmark will appear here. Start exploring and save your favourites!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl transition-all"
        >
          Browse Movies
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 text-white overflow-y-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <FaBookmark className="text-black text-base" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm">{wishlist.length} saved {wishlist.length === 1 ? 'movie' : 'movies'}</p>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlist.map((movie) => (
          <div
            key={movie._id}
            className="group relative rounded-xl overflow-hidden bg-richblack-800 border border-richblack-700 hover:border-yellow-400/50 transition-all duration-300"
          >
            {/* Poster */}
            <div className="relative h-[200px] overflow-hidden">
              <img
                src={movie.Posterurl || PLACEHOLDER_IMG}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => navigate(`/Movie/${movie._id}`)}
                  className="w-10 h-10 rounded-full bg-yellow-400/90 hover:bg-yellow-300 flex items-center justify-center transition-all active:scale-95"
                  title="View movie"
                >
                  <FaPlay className="text-black text-sm ml-0.5" />
                </button>
                <button
                  onClick={() => dispatch(removeFavourite(movie))}
                  className="w-10 h-10 rounded-full bg-red-500/90 hover:bg-red-400 flex items-center justify-center transition-all active:scale-95"
                  title="Remove from wishlist"
                >
                  <FaTrash className="text-white text-sm" />
                </button>
              </div>

              {/* Genre tag */}
              {movie.genre?.genreName && (
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {movie.genre.genreName}
                </div>
              )}

              {/* Bookmark badge */}
              <div className="absolute top-2 right-2 w-7 h-7 bg-yellow-400/90 rounded-lg flex items-center justify-center">
                <FaBookmark className="text-black text-xs" />
              </div>
            </div>

            {/* Title + Remove */}
            <div className="p-3">
              <p
                className="text-white text-sm font-semibold truncate mb-2 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => navigate(`/Movie/${movie._id}`)}
              >
                {movie.title}
              </p>
              <button
                onClick={() => dispatch(removeFavourite(movie))}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all"
              >
                <FaTrash className="text-[10px]" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
