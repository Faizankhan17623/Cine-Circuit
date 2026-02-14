import React, { useEffect, useState } from "react"
import Navbar from "../Home/Navbar"
import { FaFilm, FaSearch, FaStar } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { MovieFinding } from "../../Services/operations/User"
import Loader from "../extra/Loading"
import { useNavigate, useParams } from "react-router-dom"
import Movie from './Movie'

const Heading = () => {
  const currentUrl = window.location.href
  const token = currentUrl.split("/")
  const MainToken = decodeURIComponent(token[4])

  const {id} = useParams() 
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [allMovies, setAllMovies] = useState([]) // ✅ backend movies

  // ✅ Filter using backend data
  const filteredMovies = allMovies.filter(movie =>
    movie.title?.toLowerCase().includes(search.toLowerCase())
  )

  // console.log(filteredMovies)
  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      try {
        const Response = await dispatch(MovieFinding(MainToken))
        if (Response?.success) {
          // ✅ store backend movies
          setAllMovies(Response.data.data || [])
        }
      } catch (error) {
        console.log("Movie fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    handler()
  }, [MainToken]) // ❌ removed currentUrl (caused extra rerenders)

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen bg-richblack-900">
      <Navbar />

      {/* Header */}
      <div className="w-full py-16 flex flex-col justify-center items-center animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-4 shadow-lg">
          <FaFilm className="text-2xl text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-yellow-200 to-yellow-50 bg-clip-text text-transparent">
            {MainToken}
          </span>{" "}
          Movies
        </h1>

        <p className="text-richblack-300 text-sm">
          Browse movies in the {MainToken} genre
        </p>

        <div className="mt-4 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full" />
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" />
          <input
            type="text"
            placeholder={`Search ${MainToken} movies...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-richblack-800 border border-richblack-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-richblack-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="group bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
              >
                {/* Poster */}
                <div className="relative">
                  <img
                    src={movie.Posterurl}
                    alt={movie.title}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-yellow-400">
                    {movie.movieStatus}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-yellow-300 transition-colors">
                    {movie.title}
                  </h3>

                  <p className="text-xs text-richblack-400 mt-1">
                    {movie.releasedate}
                  </p>

                  <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold py-2 rounded-lg transition-all" onClick={()=>{
                    navigate(`/movie/${movie._id}`,{
                      state:{tag:MainToken}
                    })
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <FaFilm className="text-4xl text-richblack-600 mb-4" />
            <h3 className="text-lg font-semibold text-white">
              No movies found
            </h3>
            <p className="text-richblack-400 text-sm mt-2">
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Heading
