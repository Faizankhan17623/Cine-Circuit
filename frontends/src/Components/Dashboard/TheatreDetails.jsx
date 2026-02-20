import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetTheatreDetails } from '../../Services/operations/Theatre'
import { FaTheaterMasks, FaMapMarkerAlt, FaUser, FaDesktop, FaLanguage, FaFilm, FaCheckCircle, FaTicketAlt, FaExclamationCircle } from 'react-icons/fa'

const DetailCard = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="bg-richblack-700/50 rounded-xl p-4 flex items-start gap-4 hover:bg-richblack-700/70 transition-all duration-200">
    <div className={`p-3 rounded-lg ${highlight ? 'bg-yellow-200/20 text-yellow-200' : 'bg-richblack-600/50 text-richblack-300'}`}>
      <Icon className="text-xl" />
    </div>
    <div className="flex-1">
      <p className="text-richblack-400 text-sm mb-1">{label}</p>
      <p className={`font-medium ${highlight ? 'text-yellow-200 text-lg' : 'text-white'}`}>
        {value || 'N/A'}
      </p>
    </div>
  </div>
)

const Badge = ({ verified }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
    verified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
  }`}>
    {verified ? <FaCheckCircle /> : <FaExclamationCircle />}
    {verified ? 'Verified' : 'Not Verified'}
  </span>
)

const TheatreDetails = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [theatre, setTheatre] = useState(null)
  const [ticketDetails, setTicketDetails] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      const result = await dispatch(GetTheatreDetails(token))
      if (result?.success) {
        setTheatre(result.data.TheatreDetails)
        setTicketDetails(result.data.TheatreTicketDetails)
      }
      setLoading(false)
    }
    if (token) fetchDetails()
  }, [dispatch, token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-200"></div>
      </div>
    )
  }

  return (
    <div className="text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Theatre Details
          </h1>
          <p className="text-richblack-400 mt-1">Manage your theatre information</p>
        </div>
        {theatre && <Badge verified={theatre.Verified} />}
      </div>

      {theatre ? (
        <>
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailCard
              icon={FaTheaterMasks}
              label="Theatre Name"
              value={theatre.Theatrename}
              highlight
            />
            <DetailCard
              icon={FaMapMarkerAlt}
              label="Location"
              value={theatre.locationname || theatre.locationName}
            />
            <DetailCard
              icon={FaUser}
              label="Theatre Owner"
              value={theatre.TheatreOwner}
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard
              icon={FaDesktop}
              label="Screen Types"
              value={theatre.Screentypes?.join(', ')}
            />
            <DetailCard
              icon={FaLanguage}
              label="Languages Available"
              value={theatre.languagesAvailable?.join(', ')}
            />
            <DetailCard
              icon={FaFilm}
              label="Theatre Format"
              value={theatre.theatreformat?.join(', ')}
            />
            <DetailCard
              icon={FaTicketAlt}
              label="Total Tickets"
              value={ticketDetails ? `${ticketDetails.length} ticket types` : 'N/A'}
            />
          </div>

          {/* Ticket Details Section */}
          {ticketDetails && ticketDetails.length > 0 && (
            <div className="bg-richblack-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaTicketAlt className="text-yellow-200" />
                Ticket Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ticketDetails.map((ticket, index) => (
                  <div key={index} className="bg-richblack-700/50 rounded-lg p-4 hover:bg-richblack-700/70 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">{ticket.ticketType || 'Standard'}</span>
                      <span className="text-yellow-200 font-semibold">₹{ticket.price}</span>
                    </div>
                    <div className="text-sm text-richblack-400">
                      <p>Available: {ticket.availableTickets || 0}</p>
                      {ticket.totalTickets && <p>Total: {ticket.totalTickets}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-richblack-800 rounded-xl p-12 text-center">
          <FaExclamationCircle className="text-5xl text-richblack-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-richblack-300 mb-2">No Theatre Found</h2>
          <p className="text-richblack-400">Your theatre may not be set up yet. Please contact support or create a theatre.</p>
        </div>
      )}
    </div>
  )
}

export default TheatreDetails
