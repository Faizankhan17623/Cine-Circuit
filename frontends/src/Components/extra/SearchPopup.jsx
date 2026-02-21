import { useState, useRef, useEffect } from 'react'
import { IoIosSearch, IoMdClose } from 'react-icons/io'
import { FaFilm } from 'react-icons/fa'
import { MdTheaters } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { apiConnector } from '../../Services/apiConnector'
import { SearchApi } from '../../Services/Apis/UserApi'

const SearchPopup = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ movies: [], theatres: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const navigate = useNavigate()

  // Reset + auto-focus when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults({ movies: [], theatres: [] })
      setSearched(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Debounced search — fires 400ms after user stops typing
  useEffect(() => {
    clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults({ movies: [], theatres: [] })
      setSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiConnector(
          'GET',
          `${SearchApi.search}?q=${encodeURIComponent(query.trim())}`
        )
        if (res.data.success) {
          setResults(res.data.data)
          setSearched(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleMovieClick = (movie) => {
    navigate(`/Movie/${movie._id}`)
    onClose()
  }

  const handleTheatreClick = (theatre) => {
    navigate(`/theatre/full-details/${theatre._id}`)
    onClose()
  }

  const hasResults = results.movies.length > 0 || results.theatres.length > 0

  if (!open) return null

  return (
    <>
      {/* Backdrop — starts below navbar, clicking closes popup */}
      <div
        className="fixed inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm z-40"
        style={{ top: '72px' }}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[78%] max-w-4xl"
        style={{ top: '88px' }}
      >
        <div className="bg-richblack-800 border border-richblack-600 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

          {/* Input Row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-richblack-700">
            {loading ? (
              <svg className="w-5 h-5 text-yellow-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <IoIosSearch className="text-xl text-richblack-400 shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, theatres..."
              className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-richblack-500"
            />
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-richblack-600 hidden sm:block">ESC to close</span>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-richblack-700 text-richblack-400 hover:text-white transition-colors"
              >
                <IoMdClose className="text-lg" />
              </button>
            </div>
          </div>

          {/* Results Body */}
          <div className="max-h-[58vh] overflow-y-auto">

            {/* Idle — nothing typed yet */}
            {!searched && !loading && query.trim().length < 2 && (
              <div className="px-4 py-10 text-center">
                <IoIosSearch className="text-3xl text-richblack-700 mx-auto mb-2" />
                <p className="text-richblack-500 text-sm">Type at least 2 characters to search</p>
              </div>
            )}

            {/* No results */}
            {searched && !hasResults && !loading && (
              <div className="px-4 py-10 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-richblack-300 text-sm">
                  No results for <span className="text-white font-medium">"{query}"</span>
                </p>
                <p className="text-richblack-600 text-xs mt-1">Try a different movie or theatre name</p>
              </div>
            )}

            {/* Movies section */}
            {results.movies.length > 0 && (
              <div className="pt-3 pb-1">
                <p className="px-4 text-[11px] font-semibold text-richblack-500 uppercase tracking-widest mb-1">
                  Movies
                </p>
                {results.movies.map((movie) => (
                  <button
                    key={movie._id}
                    onClick={() => handleMovieClick(movie)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-richblack-700 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-yellow-400/20 transition-colors">
                      {movie.image
                        ? <img src={movie.image} alt="" className="w-full h-full object-cover" />
                        : <FaFilm className="text-yellow-400 text-sm" />
                      }
                    </div>
                    <p className="flex-1 text-left text-white text-sm font-medium truncate group-hover:text-yellow-300 transition-colors">
                      {movie.title}
                    </p>
                    <span className="text-richblack-600 text-xs shrink-0">Movie →</span>
                  </button>
                ))}
              </div>
            )}

            {/* Divider between sections */}
            {results.movies.length > 0 && results.theatres.length > 0 && (
              <div className="mx-4 border-t border-richblack-700 my-1" />
            )}

            {/* Theatres section */}
            {results.theatres.length > 0 && (
              <div className="pt-3 pb-3">
                <p className="px-4 text-[11px] font-semibold text-richblack-500 uppercase tracking-widest mb-1">
                  Theatres
                </p>
                {results.theatres.map((theatre) => (
                  <button
                    key={theatre._id}
                    onClick={() => handleTheatreClick(theatre)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-richblack-700 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0 group-hover:bg-purple-400/20 transition-colors">
                      <MdTheaters className="text-purple-400 text-sm" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">
                        {theatre.Theatrename}
                      </p>
                      {theatre.locationname && (
                        <p className="text-richblack-500 text-xs truncate">{theatre.locationname}</p>
                      )}
                    </div>
                    <span className="text-richblack-600 text-xs shrink-0">Theatre →</span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default SearchPopup
