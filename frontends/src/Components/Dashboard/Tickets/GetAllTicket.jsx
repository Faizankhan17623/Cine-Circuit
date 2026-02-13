import React, { useEffect, useState } from 'react'
import { Alldetails } from '../../../Services/operations/orgainezer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  FaTicketAlt,
  FaTheaterMasks,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaChevronDown,
  FaChevronUp,
  FaRupeeSign,
  FaSearch
} from 'react-icons/fa'
import { MdMovie, MdConfirmationNumber, MdLocalActivity } from 'react-icons/md'

const GetAllTicket = () => {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAllTickets = async () => {
    if (!token) {
      setError('No token found. Please login again.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await dispatch(Alldetails(token, navigate))
      if (response?.success) {
        setTickets(response.data || [])
      } else {
        setError('Failed to fetch ticket details')
      }
    } catch (err) {
      console.error('Error fetching tickets:', err)
      setError(err?.message || 'Error fetching ticket details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTickets()
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

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  // Filter tickets by search term
  const filteredTickets = tickets.filter((ticket) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const showTitle = ticket.show?.title?.toLowerCase() || ''
    const showType = ticket.showtype?.toLowerCase() || ''
    return showTitle.includes(term) || showType.includes(term)
  })

  // Stats
  const totalTicketsCreated = tickets.reduce(
    (sum, t) => sum + Number(t.overallTicketCreated || 0),
    0
  )
  const totalTicketsRemaining = tickets.reduce(
    (sum, t) => sum + Number(t.TicketsRemaining || 0),
    0
  )
  const totalAllotted = totalTicketsCreated - totalTicketsRemaining
  const totalTheatres = tickets.reduce(
    (sum, t) => sum + (t.totalTheatresAllotted || 0),
    0
  )

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading ticket details...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
          <MdLocalActivity className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchAllTickets}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && tickets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
          <FaTicketAlt className="text-7xl text-yellow-500/30 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">No Tickets Yet</h2>
          <p className="text-gray-400 text-sm">
            You haven't created any tickets for your shows yet. Create tickets first and then allot them to theatres.
          </p>
          <button
            onClick={fetchAllTickets}
            className="mt-6 text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <MdConfirmationNumber className="text-2xl text-yellow-500" />
          <h1 className="text-2xl md:text-3xl font-bold">All Tickets</h1>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search by show name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/80 border border-gray-600/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 w-56"
            />
          </div>
          <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap">
            {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Created</p>
          <p className="text-2xl font-bold text-white">
            {totalTicketsCreated.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-600 mt-1">across {tickets.length} shows</p>
        </div>
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Allotted</p>
          <p className="text-2xl font-bold text-orange-400">
            {totalAllotted.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {totalTicketsCreated > 0
              ? `${Math.round((totalAllotted / totalTicketsCreated) * 100)}% distributed`
              : '0% distributed'}
          </p>
        </div>
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Remaining</p>
          <p className="text-2xl font-bold text-yellow-400">
            {totalTicketsRemaining.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-600 mt-1">available to allot</p>
        </div>
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Theatres Covered</p>
          <p className="text-2xl font-bold text-green-400">{totalTheatres}</p>
          <p className="text-xs text-gray-600 mt-1">total allotments</p>
        </div>
      </div>

      {/* Ticket Cards */}
      <div className="flex flex-col gap-5">
        {filteredTickets.map((ticket) => {
          const isExpanded = expandedCard === ticket._id
          const created = Number(ticket.overallTicketCreated || 0)
          const remaining = Number(ticket.TicketsRemaining || 0)
          const allotted = created - remaining
          const allotPercent = created > 0 ? Math.round((allotted / created) * 100) : 0

          return (
            <div
              key={ticket._id}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600/70"
            >
              {/* Main Row */}
              <div className="flex flex-col md:flex-row">
                {/* Poster */}
                <div className="w-full md:w-40 h-48 md:h-auto shrink-0">
                  {ticket.show?.Posterurl ? (
                    <img
                      src={ticket.show.Posterurl}
                      alt={ticket.show.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <MdMovie className="text-5xl text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  {/* Title + Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {ticket.show?.title || 'Untitled Show'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                        {ticket.show?.releasedate && (
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-yellow-500 text-xs" />
                            {formatDate(ticket.show.releasedate)}
                          </span>
                        )}
                        {(ticket.show?.movieDuration || ticket.show?.TotalDuration) && (
                          <span className="flex items-center gap-1">
                            <FaClock className="text-yellow-500 text-xs" />
                            {formatDuration(ticket.show.movieDuration || ticket.show.TotalDuration)}
                          </span>
                        )}
                        {ticket.showtype && (
                          <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs">
                            {ticket.showtype}
                          </span>
                        )}
                        {ticket.typeofticket && (
                          <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-xs">
                            {ticket.typeofticket}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-lg text-sm font-semibold">
                        <FaRupeeSign className="inline text-xs" />
                        {Number(ticket.priceoftheticket || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-lg font-bold text-white">
                        {created.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Allotted</p>
                      <p className="text-lg font-bold text-orange-400">
                        {allotted.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-yellow-400">Remaining</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {remaining.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Theatres</p>
                      <p className="text-lg font-bold text-blue-400">
                        {ticket.totalTheatresAllotted || 0}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Allotment Progress</span>
                      <span>{allotPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          allotPercent === 100
                            ? 'bg-green-500'
                            : allotPercent > 50
                              ? 'bg-yellow-500'
                              : 'bg-orange-500'
                        }`}
                        style={{ width: `${allotPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Created At + Expand */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Created: {ticket.TicketCreationTime || 'N/A'}
                      {ticket.timeofAllotmentofTicket &&
                        ` | Last Allotment: ${ticket.timeofAllotmentofTicket}`}
                    </p>
                    {ticket.allotments && ticket.allotments.length > 0 && (
                      <button
                        onClick={() => toggleExpand(ticket._id)}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide Theatres <FaChevronUp className="text-xs" />
                          </>
                        ) : (
                          <>
                            View Theatres <FaChevronDown className="text-xs" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Theatre List */}
              {isExpanded && ticket.allotments && ticket.allotments.length > 0 && (
                <div className="border-t border-gray-700/50 bg-[#12122a] p-5">
                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <FaTheaterMasks className="text-yellow-500" />
                    Allotted Theatres ({ticket.allotments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ticket.allotments.map((allot, idx) => (
                      <div
                        key={allot.theatreId || idx}
                        className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-4 flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                          <FaTheaterMasks className="text-yellow-400 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {allot.theatreName || 'Unknown Theatre'}
                          </p>
                          {allot.theatreLocation && (
                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <FaMapMarkerAlt className="text-yellow-500 text-[10px]" />
                              {allot.theatreLocation}
                            </p>
                          )}
                          <div className="mt-2 bg-orange-500/10 border border-orange-500/20 rounded px-2 py-1 inline-block">
                            <p className="text-orange-400 text-xs font-semibold">
                              {Number(allot.ticketsAlloted || 0).toLocaleString('en-IN')} tickets
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* No results from search */}
      {filteredTickets.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center py-16">
          <FaSearch className="text-4xl text-gray-600 mb-4" />
          <p className="text-gray-400">No tickets found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default GetAllTicket
