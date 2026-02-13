import React, { useEffect, useState } from 'react'
import { VerifiedTheatres, AllotTickets,TicketDetails } from '../../../Services/operations/orgainezer'
import { useDispatch, useSelector } from 'react-redux'
import { AllVerifiedData } from '../../../Services/operations/CreateShow'
import { useNavigate } from 'react-router-dom'
import {
  FaTicketAlt,
  FaArrowLeft,
  FaTheaterMasks,
  FaMapMarkerAlt,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaTimes,
  FaUser,
  FaParking,
  FaChair,
  FaLanguage
} from 'react-icons/fa'
import { MdMovie, MdConfirmationNumber, MdScreenShare } from 'react-icons/md'

const TicketAllotment = () => {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Shows state
  const [shows, setShows] = useState([])
  const [showsLoading, setShowsLoading] = useState(false)
  const [showsError, setShowsError] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)

  // Theatres state
  const [theatres, setTheatres] = useState([])
  const [theatresLoading, setTheatresLoading] = useState(false)
  const [theatresError, setTheatresError] = useState(null)

  // Allotment form state
  const [selectedTheatre, setSelectedTheatre] = useState(null)
  const [totalToAllot, setTotalToAllot] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Ticket details state
  const [ticketDetails, setTicketDetails] = useState(null)
  const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false)

  // Fetch shows
  const fetchShows = async () => {
    if (!token) {
      setShowsError("No token found. Please login again.")
      return
    }
    setShowsLoading(true)
    setShowsError(null)
    try {
      const response = await dispatch(AllVerifiedData(token, navigate))
      console.log("THis ist he the repsonse data",response)
      if (response?.success) {
        setShows(response.data || [])
      } else {
        setShowsError(response?.error || "Failed to fetch shows")
      }
    } catch (err) {
      console.error("Error fetching shows:", err)
      setShowsError(err?.message || "Error fetching shows")
    } finally {
      setShowsLoading(false)
    }
  }

  // Fetch theatres
  const fetchTheatres = async () => {
    setTheatresLoading(true)
    setTheatresError(null)
    try {
      const response = await dispatch(VerifiedTheatres(token, navigate))
      console.log("Logging all the verified theatre from the ticketallotment", response)
      if (response) {
        setTheatres(Array.isArray(response) ? response : [])
      } else {
        setTheatresError("Failed to fetch theatres")
      }
    } catch (err) {
      console.error("Error fetching theatres:", err)
      setTheatresError(err?.message || "Error fetching theatres")
    } finally {
      setTheatresLoading(false)
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

  // Fetch ticket details for a show
const fetchTicketDetails = async (showId) => {
  console.log("Fetching ticket details for show:", showId)
  setTicketDetailsLoading(true)
  setTicketDetails(null)
  try {
    // ✅ CORRECT: (token, showId, navigate)
    const response = await dispatch(TicketDetails(token, showId, navigate))
    console.log("Ticket details response:", response)
    
    // ✅ Check response.success and use response.data
    if (response?.success) {
      // API returns an array, take the first item
      const details = Array.isArray(response.data) ? response.data[0] : response.data
      setTicketDetails(details || null)
    } else {
      setTicketDetails(null)
    }
  } catch (err) {
    console.error("Error fetching ticket details:", err)
    setTicketDetails(null)
  } finally {
    setTicketDetailsLoading(false)
  }
}

// When a show is selected, also fetch theatres and ticket details
const handleSelectShow = (show) => {
  setSelectedShow(show)
  setSelectedTheatre(null)
  setTotalToAllot('')
  fetchTheatres()
  // ✅ CORRECT: only pass showId
  fetchTicketDetails(show._id)
  console.log("Selected show:", show)
}

// Handle allotment
const handleAllot = async () => {
  if (!selectedShow?._id || !selectedTheatre?._id || !totalToAllot) return
  setSubmitting(true)
  try {
    await dispatch(AllotTickets(selectedShow._id, selectedTheatre._id, totalToAllot))
    setTotalToAllot('')
    setSelectedTheatre(null)
    // Refresh theatres list and ticket details after successful allotment
    fetchTheatres()
    fetchTicketDetails(selectedShow._id)  // ✅ Already correct here
  } catch (err) {
    console.error('Error allotting tickets:', err)
  } finally {
    setSubmitting(false)
  }
}

  const handleCancel = () => {
    setSelectedShow(null)
    setSelectedTheatre(null)
    setTotalToAllot('')
  }



  // ✅ Filter function to get available theatres (that haven't received tickets yet)
  const getAvailableTheatres = () => {
    if (!selectedShow) return theatres

    return theatres.filter((theatre) => {
      // If theatre has no showAlloted array, it's available
      if (!theatre.showAlloted || !Array.isArray(theatre.showAlloted)) {
        return true
      }
      
      // Check if current show ID exists in showAlloted array
      const hasReceivedTickets = theatre.showAlloted.some(
        (showId) => showId.toString() === selectedShow._id.toString()
      )
      
      return !hasReceivedTickets // Only show if NOT already allotted
    })
  }

  // ---- SHOW CARD (same style as CreateTicketes) ----
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

        <button
          onClick={() => handleSelectShow(show)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FaTicketAlt />
          Allot Tickets
        </button>
      </div>
    </div>
  )

  // ---- FULL SCREEN ALLOTMENT UI ----
  if (selectedShow) {
    const availableTheatres = getAvailableTheatres()

    return (
      <div className="w-full h-full text-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700/50 shrink-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Shows</span>
          </button>
          <div className="ml-4 flex items-center gap-2">
            <FaTicketAlt className="text-yellow-500" />
            <h1 className="text-xl font-bold">Allot Tickets — {selectedShow.title}</h1>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE — Form */}
          <div className="w-[380px] shrink-0 border-r border-gray-700/50 p-6 overflow-y-auto">
            {/* Show Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-gray-700/50">
              {selectedShow.Posterurl ? (
                <img src={selectedShow.Posterurl} alt={selectedShow.title} className="w-14 h-20 rounded-lg object-cover shadow-lg" />
              ) : (
                <div className="w-14 h-20 rounded-lg bg-gray-700 flex items-center justify-center">
                  <MdMovie className="text-2xl text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">{selectedShow.title}</h3>
                <p className="text-gray-400 text-xs truncate">{selectedShow.tagline || 'No tagline'}</p>
                {selectedShow.genre?.genreName && (
                  <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                    {selectedShow.genre.genreName}
                  </span>
                )}
              </div>
            </div>

            {/* Ticket Remaining Info */}
            {ticketDetailsLoading && (
              <div className="mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-gray-700/50 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Loading ticket info...</span>
              </div>
            )}

            {!ticketDetailsLoading && ticketDetails && (
              <div className="mb-6 p-4 bg-gradient-to-br from-[#1a1a2e] to-[#12122a] rounded-xl border border-yellow-500/20">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <MdConfirmationNumber className="text-yellow-500" />
                  Ticket Overview
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Created</p>
                    <p className="text-lg font-bold text-white">
                      {Number(ticketDetails.overallTicketCreated || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="text-lg font-bold text-green-400">
                      ₹{Number(ticketDetails.priceoftheticket || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Allotted</p>
                    <p className="text-lg font-bold text-orange-400">
                      {Array.isArray(ticketDetails.totalTicketsAlloted)
                        ? ticketDetails.totalTicketsAlloted.reduce((sum, val) => sum + Number(val || 0), 0).toLocaleString('en-IN')
                        : '0'}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-yellow-500/30">
                    <p className="text-xs text-yellow-400 mb-1">Remaining</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {Number(ticketDetails.TicketsRemaining || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                {ticketDetails.TicketCreationTime && (
                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-1 justify-center">
                    <FaCalendarAlt className="text-yellow-500 text-[10px]" />
                    Created: {ticketDetails.TicketCreationTime}
                  </p>
                )}
                {ticketDetails.timeofAllotmentofTicket && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-center">
                    <FaClock className="text-yellow-500 text-[10px]" />
                    Last Allotment: {ticketDetails.timeofAllotmentofTicket}
                  </p>
                )}
                {ticketDetails.allotedToTheatres && ticketDetails.allotedToTheatres.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Allotted to {ticketDetails.allotedToTheatres.length} theatre{ticketDetails.allotedToTheatres.length !== 1 ? 's' : ''} so far
                  </p>
                )}
              </div>
            )}

            {!ticketDetailsLoading && !ticketDetails && (
              <div className="mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-red-500/20 text-center">
                <p className="text-red-400 text-sm">No ticket data found for this show.</p>
                <p className="text-gray-500 text-xs mt-1">Create tickets first before allotting.</p>
              </div>
            )}

            {/* Selected Theatre Info */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FaTheaterMasks className="text-yellow-500" />
                Selected Theatre
              </label>
              {!selectedTheatre ? (
                <div className="w-full bg-gray-800/80 border border-gray-600/50 border-dashed rounded-xl px-4 py-4 text-gray-500 text-sm text-center">
                  Click a theatre on the right to select
                </div>
              ) : (
                <div className="bg-gray-800/80 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <FaTheaterMasks className="text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">
                        {selectedTheatre.Theatrename || 'Theatre'}
                      </h4>
                      {selectedTheatre.locationName && (
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                          <FaMapMarkerAlt className="text-yellow-500 text-[10px]" />
                          {selectedTheatre.locationName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Theatre details grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedTheatre.TheatreOwner && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Owner</p>
                        <p className="text-white truncate">{selectedTheatre.TheatreOwner}</p>
                      </div>
                    )}
                    {selectedTheatre.theatreformat && selectedTheatre.theatreformat.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Format</p>
                        <p className="text-yellow-400 truncate">{selectedTheatre.theatreformat.join(', ')}</p>
                      </div>
                    )}
                    {selectedTheatre.typesofseatsAvailable && selectedTheatre.typesofseatsAvailable.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Seat Types</p>
                        <p className="text-white truncate">{selectedTheatre.typesofseatsAvailable.join(', ')}</p>
                      </div>
                    )}
                    {selectedTheatre.movieScreeningType && selectedTheatre.movieScreeningType.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Screening</p>
                        <p className="text-blue-400 truncate">{selectedTheatre.movieScreeningType.join(', ')}</p>
                      </div>
                    )}
                    {selectedTheatre.languagesAvailable && selectedTheatre.languagesAvailable.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Languages</p>
                        <p className="text-white truncate">{selectedTheatre.languagesAvailable.join(', ')}</p>
                      </div>
                    )}
                    {selectedTheatre.parking && selectedTheatre.parking.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-2">
                        <p className="text-gray-500 mb-0.5">Parking</p>
                        <p className="text-green-400 truncate">{selectedTheatre.parking.join(', ')}</p>
                      </div>
                    )}
                  </div>

                  {selectedTheatre.CreationDate && (
                    <p className="text-gray-600 text-[10px] mt-2 flex items-center gap-1">
                      <FaCalendarAlt className="text-yellow-500" />
                      Created: {selectedTheatre.CreationDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Total Tickets */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <MdConfirmationNumber className="text-yellow-500" />
                Total Tickets to Allot
              </label>
              <input
                type="number"
                min="1"
                value={totalToAllot}
                onChange={(e) => setTotalToAllot(e.target.value)}
                placeholder="Enter number of tickets"
                className="w-full bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all"
              />
            </div>

            {/* Summary */}
            {selectedTheatre && totalToAllot && (
              <div className="mb-5 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Allotment Summary</p>
                <p className="text-white text-sm">
                  <span className="text-yellow-400 font-bold">{Number(totalToAllot).toLocaleString('en-IN')}</span> tickets
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Theatre: {selectedTheatre.Theatrename || selectedTheatre.theatrename || selectedTheatre.userName || selectedTheatre.name}
                </p>
                <p className="text-gray-500 text-xs">Show: {selectedShow.title}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAllot}
                disabled={!selectedTheatre || !totalToAllot || submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Allotting...
                  </>
                ) : (
                  <>
                    <FaTicketAlt />
                    Allot Tickets
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — Theatres */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300">Select a Theatre</h2>
              {availableTheatres.length > 0 && (
                <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold">
                  {availableTheatres.length} Available
                </span>
              )}
            </div>

            {/* Theatres Loading */}
            {theatresLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-400">Loading theatres...</span>
              </div>
            )}

            {/* Theatres Error */}
            {theatresError && !theatresLoading && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{theatresError}</p>
                <button onClick={fetchTheatres} className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline">
                  Try Again
                </button>
              </div>
            )}

            {/* Theatres Grid */}
            {!theatresLoading && !theatresError && availableTheatres.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {availableTheatres.map((theatre) => (
                  <div
                    key={theatre._id}
                    onClick={() => setSelectedTheatre(theatre)}
                    className={`bg-[#1a1a2e] border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTheatre?._id === theatre._id
                        ? 'border-yellow-500 shadow-yellow-500/10 shadow-lg'
                        : 'border-gray-700/50 hover:border-yellow-500/30'
                    }`}
                  >
                    {/* Header with icon and check */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <FaTheaterMasks className="text-yellow-400" />
                      </div>
                      {selectedTheatre?._id === theatre._id && (
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <FaCheck className="text-black text-xs" />
                        </div>
                      )}
                    </div>

                    {/* Theatre Name */}
                    <h3 className="text-white font-semibold truncate">
                      {theatre.Theatrename || 'Theatre'}
                    </h3>

                    {/* Location */}
                    {theatre.locationName && (
                      <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="text-yellow-500 text-xs" />
                        {theatre.locationName}
                      </p>
                    )}

                    {/* Owner */}
                    {theatre.TheatreOwner && (
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <FaUser className="text-yellow-500 text-[10px]" />
                        {theatre.TheatreOwner}
                      </p>
                    )}

                    {/* Theatre Format Tags */}
                    {theatre.theatreformat && theatre.theatreformat.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {theatre.theatreformat.map((format, idx) => (
                          <span key={idx} className="bg-yellow-500/10 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded">
                            {format}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Screening Types */}
                    {theatre.movieScreeningType && theatre.movieScreeningType.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {theatre.movieScreeningType.map((type, idx) => (
                          <span key={idx} className="bg-blue-500/10 text-blue-400 text-[10px] px-1.5 py-0.5 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom info row */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                      {theatre.typesofseatsAvailable && theatre.typesofseatsAvailable.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <FaChair className="text-yellow-500" />
                          {theatre.typesofseatsAvailable.length} seat type{theatre.typesofseatsAvailable.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {theatre.languagesAvailable && theatre.languagesAvailable.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <FaLanguage className="text-yellow-500" />
                          {theatre.languagesAvailable.length}
                        </span>
                      )}
                    </div>

                    {/* Creation Date */}
                    {theatre.CreationDate && (
                      <p className="text-gray-600 text-[10px] mt-2 flex items-center gap-1">
                        <FaCalendarAlt className="text-yellow-500" />
                        {theatre.CreationDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty - No verified theatres at all */}
            {!theatresLoading && !theatresError && theatres.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-10 text-center max-w-md">
                  <FaTheaterMasks className="text-6xl text-yellow-500/30 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">No Theatres Found</h2>
                  <p className="text-gray-400 text-sm">There are no verified theatres available.</p>
                  <button onClick={fetchTheatres} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline">
                    Refresh
                  </button>
                </div>
              </div>
            )}

            {/* All theatres already have tickets for this show */}
            {!theatresLoading && !theatresError && theatres.length > 0 && availableTheatres.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-10 text-center max-w-md">
                  <FaTheaterMasks className="text-6xl text-green-500/30 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">All Theatres Already Allotted</h2>
                  <p className="text-gray-400 text-sm">All available theatres have already received tickets for this show.</p>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">
                      <FaCheck className="inline mr-1" />
                      {theatres.length} theatre{theatres.length !== 1 ? 's' : ''} allotted
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ---- MAIN PAGE — Show Cards ----
  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaTicketAlt className="text-2xl text-yellow-500" />
        <h1 className="text-2xl md:text-3xl font-bold">Ticket Allotment</h1>
        <span className="ml-auto bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg text-sm font-semibold">
          {shows.length} Shows
        </span>
      </div>

      {/* Loading */}
      {showsLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Loading shows...</span>
        </div>
      )}

      {/* Error */}
      {showsError && !showsLoading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{showsError}</p>
          <button onClick={fetchShows} className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* Shows Grid */}
      {!showsLoading && !showsError && shows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shows.map((show) => (
            <ShowCard key={show._id} show={show} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!showsLoading && !showsError && shows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
            <FaFilm className="text-8xl text-yellow-500/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No Shows Found</h2>
            <p className="text-gray-400">There are no shows available right now.</p>
            <button onClick={fetchShows} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm underline">
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketAllotment