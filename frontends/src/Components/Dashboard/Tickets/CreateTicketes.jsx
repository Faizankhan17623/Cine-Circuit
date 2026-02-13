import React, { useEffect, useState } from 'react'
import { AllVerifiedData } from '../../../Services/operations/CreateShow'
import {
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaTimes,
  FaFilm,
  FaArrowLeft,
  FaRupeeSign,
  FaUsers
} from 'react-icons/fa'
import { MdMovie, MdConfirmationNumber } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MakeTicket } from '../../../Services/operations/orgainezer'

const CreateTicketes = () => {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [totalTickets, setTotalTickets] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch shows using AllVerifiedData API
  const fetchShows = async () => {
    if (!token) {
      setError("No token found. Please login again.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // AWAIT the dispatch to get the actual response
      const response = await dispatch(AllVerifiedData(token, navigate))

      console.log("AllVerifiedData API response:", response)

      if (response?.success) {
        setShows(response.data || [])
        console.log("Shows fetched:", response.data)
      } else {
        setError(response?.error || "Failed to fetch shows")
      }
    } catch (err) {
      console.error("Error fetching shows:", err)
      setError(err?.message || "Error fetching shows")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShows()
  }, [token])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    const minutes = parseInt(duration)
    if (isNaN(minutes)) return duration
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  // ---- SHOW CARD ----
  const ShowCard = ({ show }) => (
    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-500/30 group">
      <div className="relative aspect-[2/3] overflow-hidden">
        {show.Posterurl ? (
          <img
            src={show.Posterurl}
            alt={show.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <MdMovie className="text-6xl text-gray-600" />
          </div>
        )}

        {show.genre?.genreName && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
              {show.genre.genreName}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{show.title}</h3>

        {show.tagline && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{show.tagline}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-yellow-500" />
            <span>{formatDate(show.releasedate)}</span>
          </div>
          {(show.movieDuration || show.TotalDuration) && (
            <div className="flex items-center gap-1">
              <FaClock className="text-yellow-500" />
              <span>{formatDuration(show.movieDuration || show.TotalDuration)}</span>
            </div>
          )}
        </div>

        {show.showType && (
          <p className="text-xs text-gray-500 mb-3">Type: {show.showType}</p>
        )}
{/* http://localhost:5173/Dashboard/Tickets/Update */}
        <button
          onClick={() => setSelectedShow(show)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FaTicketAlt />
          Create Tickets
        </button>
      </div>
    </div>
  )

  // Handle ticket creation
  const handleCreateTicket = async () => {
    if (!totalTickets || !price) return
    setSubmitting(true)
    try {
      await dispatch(MakeTicket(selectedShow._id, totalTickets, price))
      setTotalTickets('')
      setPrice('')
      setSelectedShow(null)
    } catch (err) {
      console.error('Error creating ticket:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTotalTickets('')
    setPrice('')
    setSelectedShow(null)
  }

  // ---- CREATE TICKET UI ----
  if (selectedShow) {
    return (
      <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Shows</span>
          </button>

          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-gray-700/50 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <FaTicketAlt className="text-xl text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Tickets</h2>
                  <p className="text-gray-400 text-sm">Set up tickets for your show</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Show Info Card */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-800/60 rounded-xl border border-gray-700/40">
                {selectedShow.Posterurl ? (
                  <img src={selectedShow.Posterurl} alt={selectedShow.title} className="w-16 h-24 rounded-lg object-cover shadow-lg" />
                ) : (
                  <div className="w-16 h-24 rounded-lg bg-gray-700 flex items-center justify-center">
                    <MdMovie className="text-2xl text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{selectedShow.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{selectedShow.tagline || 'No tagline'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendarAlt className="text-yellow-500" />
                      {formatDate(selectedShow.releasedate)}
                    </span>
                    {selectedShow.genre?.genreName && (
                      <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                        {selectedShow.genre.genreName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Total Tickets */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <MdConfirmationNumber className="text-yellow-500" />
                    Total Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalTickets}
                    onChange={(e) => setTotalTickets(e.target.value)}
                    placeholder="Enter total number of tickets"
                    className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FaRupeeSign className="text-yellow-500" />
                    Price per Ticket
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price per ticket"
                    className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Summary */}
              {totalTickets && price && (
                <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Estimated Revenue</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ₹{(Number(totalTickets) * Number(price)).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Number(totalTickets).toLocaleString('en-IN')} tickets × ₹{Number(price).toLocaleString('en-IN')} each
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleCreateTicket}
                  disabled={!totalTickets || !price || submitting}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaTicketAlt />
                      Create Tickets
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- MAIN PAGE ----
  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaTicketAlt className="text-2xl text-yellow-500" />
        <h1 className="text-2xl md:text-3xl font-bold">Create Tickets</h1>
        <span className="ml-auto bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold">
          {shows.length} Shows
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Loading shows...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchShows}
            className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Shows Grid */}
      {!loading && !error && shows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shows.map((show) => (
            <ShowCard key={show._id} show={show} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && shows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
            <FaFilm className="text-8xl text-yellow-500/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No Shows Found</h2>
            <p className="text-gray-400">
              There are no shows available right now.
            </p>
            <button
              onClick={fetchShows}
              className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateTicketes