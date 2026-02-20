import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FetchAllTicketsDetails } from '../../Services/operations/Theatre'

const TheatreAllTickets = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [ticketData, setTicketData] = useState(null)

  useEffect(() => {
    const fetchTickets = async () => {
      const result = await dispatch(FetchAllTicketsDetails(token))
      if (result?.success) {
        setTicketData(result.data.data)
      }
      setLoading(false)
    }
    if (token) fetchTickets()
  }, [dispatch, token])

  if (loading) {
    return <div className="text-white text-center mt-10">Loading Ticket Details...</div>
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6">All Tickets</h1>

      {ticketData?.theatre && (
        <div className="bg-richblack-800 rounded-lg p-4 mb-6 border border-richblack-700">
          <p className="text-richblack-300 text-sm">Theatre: <span className="text-white font-semibold">{ticketData.theatre.name}</span></p>
          <p className="text-richblack-300 text-sm">Location: <span className="text-white">{ticketData.theatre.location}</span></p>
          <p className="text-richblack-300 text-sm">Total Shows: <span className="text-yellow-200 font-semibold">{ticketData.totalShows}</span></p>
          <p className="text-richblack-300 text-sm">Total Tickets Received: <span className="text-yellow-200 font-semibold">{ticketData.totalTicketsReceived}</span></p>
        </div>
      )}

      {ticketData?.shows && ticketData.shows.length > 0 ? (
        <div className="grid gap-4">
          {ticketData.shows.map((item, index) => (
            <div key={index} className="bg-richblack-800 rounded-lg p-4 border border-richblack-700">
              <p className="font-semibold">{item.showDetails?.title || `Show ${index + 1}`}</p>
              <div className="flex gap-6 mt-2 text-sm text-richblack-300">
                <p>Tickets Received: <span className="text-white">{item.ticketDetails?.ticketsReceived || 0}</span></p>
                <p>Price: <span className="text-yellow-200">₹{item.ticketDetails?.ticketPrice || 0}</span></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-richblack-800 rounded-lg p-6">
          <p className="text-richblack-300">No ticket details found yet.</p>
        </div>
      )}
    </div>
  )
}

export default TheatreAllTickets
