import { useEffect, useState } from 'react'
import { FaChevronDown, FaRobot } from "react-icons/fa"
import { MdOutlineShoppingCart } from "react-icons/md"
import { IoIosSearch, IoMdMenu, IoMdClose } from "react-icons/io"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
import { UserLogout, getNavbarMovieData, getNavbarTheatreData } from '../../Services/operations/Auth'
import { toast } from 'react-hot-toast'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
]

const FALLBACK_MOVIE_TAGS = [
  "Adventure", "Martial", "Superhero", "Disaster", "Spy Secret", "War", "Crime","Hello"
]

const FALLBACK_THEATRE_TYPES = [
  "Multiplex Theatre", "IMAX Theatre", "3D Theatre", "4DX Theatre",
  "Drive-in Theatre", "Single Screen Theatre", "Open Air Theatre","Laser Projection"
]

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoggedIn, image } = useSelector((state) => state.auth)

  const [path, setPath] = useState('/')
  const [menuOpen, setMenuOpen] = useState(false)
  const [movieTags, setMovieTags] = useState(FALLBACK_MOVIE_TAGS)
  const [theatreTypes, setTheatreTypes] = useState(FALLBACK_THEATRE_TYPES)

  useEffect(() => {
    setPath(window.location.pathname)

    const fetchNavbarData = async () => {
      const movieResult = await dispatch(getNavbarMovieData())
      if (movieResult?.success && movieResult.data.length > 0) {
        const genres = movieResult.data.map((item) => item.genreName)
        setMovieTags(genres)
      }

      const theatreResult = await dispatch(getNavbarTheatreData())
      if (theatreResult?.success && theatreResult.data.length > 0) {
        const formats = theatreResult.data.map((item) => item._id)
        setTheatreTypes(formats)
      }
    }
    fetchNavbarData()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(UserLogout())
      toast.success("Logged out successfully")
      setMenuOpen(false)
      navigate('/Login')
    } catch (error) {
      toast.error("Error during logout")
    }
  }

  const DropdownMenu = ({ label, items, basePath, isActive }) => (
    <div className='relative group'>
      <button className={`flex items-center gap-1.5 py-2 px-1 text-sm font-medium transition-colors hover:text-yellow-400 ${isActive ? 'text-yellow-400' : 'text-richblack-25'}`}>
        {label}
        <FaChevronDown className='text-[10px] text-richblack-300 group-hover:text-yellow-400 group-hover:rotate-180 transition-transform duration-200' />
      </button>
      <div className='invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 pt-2 z-50'>
        <div className='bg-richblack-800 border border-richblack-600 rounded-xl shadow-2xl shadow-black/40 py-2 min-w-[200px] overflow-hidden'>
          {items.map((item, index) => (
            <Link
              to={`${basePath}/${item}`}
              key={index}
              className='block px-4 py-2.5 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-400 transition-colors'
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <nav className='w-full h-[72px] flex justify-between items-center text-white bg-richblack-800/95 backdrop-blur-md sticky top-0 z-50 border-b border-richblack-700/80 px-6'>
      {/* Logo */}
      <Link to="/" className='flex-shrink-0'>
        <img
          src='https://res.cloudinary.com/dit2bnxnd/image/upload/v1767978923/cc41_abjbkq.png'
          alt="Cine Circuit"
          className='h-14 w-auto'
          loading='lazy'
        />
      </Link>

      {/* Nav Links */}
      <div className='hidden lg:flex items-center gap-6'>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors hover:text-yellow-400 py-2 ${path === link.to ? 'text-yellow-400' : 'text-richblack-25'}`}
          >
            {link.label}
          </Link>
        ))}

        <DropdownMenu
          label="Movies"
          items={movieTags}
          basePath="/Movies"
          isActive={path.startsWith('/Movies')}
        />

        <DropdownMenu
          label="Theatres"
          items={theatreTypes}
          basePath="/Theatres"
          isActive={path.startsWith('/Theatres')}
        />

        <Link
          to="/About"
          className={`text-sm font-medium transition-colors hover:text-yellow-400 py-2 ${path === '/About' ? 'text-yellow-400' : 'text-richblack-25'}`}
        >
          About Us
        </Link>
        <Link
          to="/Contact"
          className={`text-sm font-medium transition-colors hover:text-yellow-400 py-2 ${path === '/Contact' ? 'text-yellow-400' : 'text-richblack-25'}`}
        >
          Contact Us
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className='flex items-center gap-3'>
        <button className='w-9 h-9 flex items-center justify-center rounded-lg hover:bg-richblack-700 transition-colors'>
          <IoIosSearch className='text-xl text-richblack-100' />
        </button>
        <button className='w-9 h-9 flex items-center justify-center rounded-lg hover:bg-richblack-700 transition-colors'>
          <MdOutlineShoppingCart className='text-xl text-richblack-100' />
        </button>

        {/* User Menu */}
        <div className='relative'>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='flex items-center gap-2 h-10 px-3 bg-richblack-700 border border-richblack-600 rounded-full hover:border-richblack-400 transition-colors'
          >
            <IoMdMenu className='text-lg text-richblack-100' />
            <img
              src={isLoggedIn && image ? image : "https://res.cloudinary.com/dit2bnxnd/image/upload/v1767979026/cc41_utqhtd.png"}
              alt="User"
              loading='lazy'
              className='w-7 h-7 rounded-full object-cover'
            />
          </button>

          {menuOpen && (
            <>
              <div className='fixed inset-0 z-40' onClick={() => setMenuOpen(false)} />
              <div className='absolute right-0 top-full mt-2 z-50 bg-richblack-800 border border-richblack-600 rounded-xl shadow-2xl shadow-black/40 py-2 min-w-[180px] overflow-hidden'>
                <Link
                  to={isLoggedIn ? "/Dashboard/my-profile" : "/SignUp"}
                  onClick={() => setMenuOpen(false)}
                  className='block px-4 py-2.5 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-400 transition-colors'
                >
                  {isLoggedIn ? "Dashboard" : "Sign Up"}
                </Link>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2.5 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-400 transition-colors'
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/Login"
                    onClick={() => setMenuOpen(false)}
                    className='block px-4 py-2.5 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-400 transition-colors'
                  >
                    Login
                  </Link>
                )}

                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className='block px-4 py-2.5 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-400 transition-colors'
                >
                  Help Center
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
