import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetTicketsCreatedData, UpdateTicketTimeData, GetTheatreDetails } from '../../Services/operations/Theatre'

// Helper to convert 24-hour time to 12-hour format with AM/PM
const formatTo12Hour = (time24) => {
  if (!time24) return ''
  const [hours, minutes] = time24.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

// Helper to convert 12-hour time (with AM/PM) to 24-hour format for backend
const convertTo24Hour = (time12) => {
  if (!time12) return ''
  const [time, ampm] = time12.split(' ')
  const [hours, minutes] = time.split(':')
  let h = parseInt(hours, 10)

  if (ampm?.toUpperCase() === 'PM' && h !== 12) {
    h += 12
  } else if (ampm?.toUpperCase() === 'AM' && h === 12) {
    h = 0
  }

  return `${h.toString().padStart(2, '0')}:${minutes}`
}

const UpdateTicketTime = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [theatreData, setTheatreData] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTime, setNewTime] = useState('')
  const [newTimePeriod, setNewTimePeriod] = useState('AM')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch theatre details to get theatre ID
      const theatreResult = await dispatch(GetTheatreDetails(token))
      if (theatreResult?.success) {
        setTheatreData(theatreResult.data.TheatreDetails)
      }

      // Fetch created tickets
      const ticketsResult = await dispatch(GetTicketsCreatedData(token))
      if (ticketsResult?.success) {
        setTickets(ticketsResult.data.data || [])
      }

      setLoading(false)
    }
    if (token) fetchData()
  }, [dispatch, token])

  const handleUpdateTime = async () => {
    if (!selectedTicket || !newTime) {
      alert('Please select a ticket and enter a time')
      return
    }

    // Convert 12-hour time to 24-hour format for backend
    const time24 = convertTo24Hour(`${newTime} ${newTimePeriod}`)

    setUpdating(true)
    const result = await dispatch(UpdateTicketTimeData(
      theatreData?._id,
      selectedTicket.showId,
      selectedTicket._id,
      time24,
      token
    ))
    setUpdating(false)

    if (result?.success) {
      alert('Ticket time updated successfully!')
      setNewTime('')
      setSelectedTicket(null)
      // Refresh tickets
      const ticketsResult = await dispatch(GetTicketsCreatedData(token))
      if (ticketsResult?.success) {
        setTickets(ticketsResult.data.data || [])
      }
    } else {
      alert(result?.message || 'Failed to update ticket time')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Released':
        return 'bg-green-500'
      case 'Upcoming':
        return 'bg-yellow-500'
      case 'Expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tickets...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Update Ticket Time</h1>

      {/* Existing Timings Info */}
      <div className="bg-richblack-800 rounded-lg p-6 mb-6 border border-richblack-700">
        <h2 className="text-lg font-semibold text-white mb-4">How to Update Ticket Time</h2>
        <ul className="text-richblack-400 space-y-2">
          <li>• Select a ticket from the list below</li>
          <li>• Enter the new show time in HH:mm format with AM/PM (e.g., 2:30 PM)</li>
          <li>• The new timing will be added to the existing timings</li>
          <li>• Timings are automatically spaced based on movie duration + 30 min buffer</li>
        </ul>
      </div>

      {/* Tickets List */}
      <div className="bg-richblack-800 rounded-lg p-6 mb-6 border border-richblack-700">
        <h2 className="text-lg font-semibold text-white mb-4">Select Ticket</h2>
        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket, index) => (
              <div
                key={index}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTicket?._id === ticket._id
                    ? 'bg-yellow-200 border-2 border-yellow-500'
                    : 'bg-richblack-700 border-2 border-transparent hover:border-richblack-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-richblack-900">{ticket.Date || 'N/A'}</p>
                  <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(ticket.Status)}`}>
                    {ticket.Status}
                  </span>
                </div>
                <p className="text-sm text-richblack-600">Show ID: {ticket.showId?.slice(0, 10)}...</p>
                <div className="mt-2">
                  <p className="text-xs text-richblack-500">Existing Timings:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ticket.timings?.length > 0 ? (
                      ticket.timings.map((time, i) => (
                        <span key={i} className="px-2 py-1 bg-richblack-600 text-white text-xs rounded">
                          {formatTo12Hour(time)}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-richblack-400">No timings set</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-richblack-600">
                  <p className="text-xs text-richblack-500">Ticket Price: ₹{ticket.pricefromtheorg}</p>
                  <p className="text-xs text-richblack-500">Total Tickets: {ticket.totalticketfromorg}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-richblack-400">No tickets created yet.</p>
        )}
      </div>

      {/* Update Time Form */}
      {selectedTicket && (
        <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Time</h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-richblack-300 text-sm mb-1">New Show Time</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newTime.split(':')[0] || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    const mins = newTime.split(':')[1] || '00'
                    setNewTime(`${val}:${mins}`)
                  }}
                  placeholder="HH"
                  className="w-20 px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-center"
                />
                <span className="text-white flex items-center">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={newTime.split(':')[1] || ''}
                  onChange={(e) => {
                    const val = e.target.value.padStart(2, '0').slice(0, 2)
                    const hours = newTime.split(':')[0] || '12'
                    setNewTime(`${hours}:${val}`)
                  }}
                  placeholder="MM"
                  className="w-20 px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-center"
                />
                <select
                  value={newTimePeriod}
                  onChange={(e) => setNewTimePeriod(e.target.value)}
                  className="px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <p className="text-richblack-400 text-xs mt-1">
                Format: HH:mm AM/PM (e.g., 2:30 PM)
              </p>
            </div>
            <button
              onClick={handleUpdateTime}
              disabled={updating || !newTime}
              className={`px-6 py-2 bg-yellow-200 text-richblack-900 rounded-lg font-semibold transition-colors ${
                updating || !newTime ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300'
              }`}
            >
              {updating ? 'Updating...' : 'Add Time'}
            </button>
          </div>

          {/* Current Timings Display */}
          <div className="mt-4 pt-4 border-t border-richblack-600">
            <p className="text-richblack-300 text-sm mb-2">Current Timings:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTicket.timings?.length > 0 ? (
                selectedTicket.timings.map((time, i) => (
                  <span key={i} className="px-3 py-1 bg-richblack-600 text-white rounded-lg">
                    {formatTo12Hour(time)}
                  </span>
                ))
              ) : (
                <span className="text-richblack-400 text-sm">No timings set yet</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateTicketTime
