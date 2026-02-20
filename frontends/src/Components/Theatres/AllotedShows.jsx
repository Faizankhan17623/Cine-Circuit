import React, { useEffect, useState } from "react"
import Navbar from "../Home/Navbar"
import { FaTheaterMasks, FaTicketAlt, FaFilm, FaArrowLeft, FaClock, FaCalendarAlt } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { TheatreShowsFinding } from "../../Services/operations/User"
import Loader from "../extra/Loading"

const AllotedShows = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true)
      try {
        const response = await dispatch(TheatreShowsFinding(id))
        if (response?.success) {
          setShows(response.data.data || [])
        }
      } catch (error) {
        console.log("Shows fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchShows()
  }, [id])

  const filters = ["All", "Released", "Upcoming", "Expired"]

  const filteredShows = filter === "All"
    ? shows
    : shows.filter(show => show.movieStatus === filter)

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-richblack-900">
        <Loader />
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen bg-richblack-900">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-richblack-300 hover:text-white text-sm mb-6 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Back to Theatres
        </button>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
            <FaTheaterMasks className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Alloted Shows
              </span>
            </h1>
            <p className="text-richblack-400 text-sm mt-1">
              {shows.length} {shows.length === 1 ? "show" : "shows"} available
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => {
            const count = f === "All" ? shows.length : shows.filter(s => s.movieStatus === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter === f
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-richblack-800 text-richblack-400 border border-richblack-700 hover:border-richblack-500"
                }`}
              >
                {f}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  filter === f ? "bg-purple-500/30 text-purple-300" : "bg-richblack-700 text-richblack-500"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Shows Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filteredShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredShows.map((show) => (
              <div
                key={show._id}
                className="bg-richblack-800 rounded-2xl border border-richblack-700 overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group cursor-pointer flex flex-col"
                onClick={() => navigate(`/Movie/${show._id}`)}
              >
                {/* Poster */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={show.Posterurl}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-richblack-800 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
                    show.movieStatus === "Released"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : show.movieStatus === "Upcoming"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {show.movieStatus}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors truncate">
                    {show.title}
                  </h4>

                  {show.tagline && (
                    <p className="text-richblack-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {show.tagline}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-richblack-400">
                    {show.movieDuration && (
                      <span className="flex items-center gap-1">
                        <FaClock className="text-purple-400 text-[10px]" />
                        {show.movieDuration} mins
                      </span>
                    )}
                    {show.releasedate && (
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-indigo-400 text-[10px]" />
                        {show.releasedate}
                      </span>
                    )}
                  </div>

                  {/* Genre Tags */}
                  {show.genre && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(Array.isArray(show.genre) ? show.genre : [show.genre]).slice(0, 3).map((g, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-richblack-700 text-richblack-300 border border-richblack-600"
                        >
                          {g}
                        </span>
                      ))}
                      {Array.isArray(show.genre) && show.genre.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-richblack-700 text-richblack-400">
                          +{show.genre.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Book Button */}
                  {show.movieStatus !== "Expired" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/Purchase/${show._id}`)
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-yellow-500/10"
                    >
                      <FaTicketAlt />
                      Book Tickets
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <FaFilm className="text-5xl text-richblack-600 mb-4" />
            <h3 className="text-lg font-semibold text-white">
              No shows found
            </h3>
            <p className="text-richblack-400 text-sm mt-2">
              {filter !== "All"
                ? `No ${filter.toLowerCase()} shows available. Try a different filter.`
                : "No shows have been alloted to this theatre yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllotedShows
