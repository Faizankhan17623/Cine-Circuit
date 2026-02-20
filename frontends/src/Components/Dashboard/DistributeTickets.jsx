import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetShowAllotedDetails, DistributeTicketsInfo } from '../../Services/operations/Theatre'
import {  FaCalendarAlt, FaFilm, FaHeart, FaUsers, FaCrown, FaStar, FaCouch } from 'react-icons/fa'
import { GiCash } from 'react-icons/gi'
import { FaTicketSimple } from "react-icons/fa6";
import toast from 'react-hot-toast';

const DistributeTickets = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [shows, setShows] = useState([])
  const [selectedShow, setSelectedShow] = useState(null)
  const [selectedShowData, setSelectedShowData] = useState(null)
  const [selectedShowIndex, setSelectedShowIndex] = useState(null)
  const [releaseDate, setReleaseDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [ticketCategories, setTicketCategories] = useState([
    { category: 'Loyalty', numberOftickets: '', price: '', icon: FaHeart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/10', textColor: 'text-pink-400' },
    { category: 'Family', numberOftickets: '', price: '', icon: FaUsers, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
    { category: 'VIP', numberOftickets: '', price: '', icon: FaCrown, color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400' },
    { category: 'Premium', numberOftickets: '', price: '', icon: FaStar, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
    { category: 'Standard', numberOftickets: '', price: '', icon: FaCouch, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10', textColor: 'text-green-400' }
  ])
  const [distributing, setDistributing] = useState(false)
  const [step, setStep] = useState(1)

  // Get today's date and max date (10 days from now)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 90)

  const formatDateForInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Parse date string in DD/MM/YYYY format (backend format)
const parseDMYDate = (dateStr) => {
  if (!dateStr) return null

  // Format: DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const year = parseInt(parts[2], 10)
      return new Date(year, month, day)
    }
  }

  // ✅ Format: "Fri, 20 Feb 2026" (backend format)
  if (dateStr.includes(',')) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
  }

  // Format: ISO string or YYYY-MM-DD
  if (dateStr.includes('-')) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
  }

  return null
}
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const date = parseDMYDate(dateStr)
    if (!date) return dateStr
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  useEffect(() => {
    const fetchShows = async () => {
      const result = await dispatch(GetShowAllotedDetails(token))
      if (result?.success) {
        setShows(result.data.show || [])
      }
      setLoading(false)
    }
    if (token) fetchShows()
  }, [dispatch, token])

const handleShowSelect = (show, index) => {
  console.log('releasedate from backend:', show.data?.releasedate) 
  setSelectedShow(show.data?._id)
  setSelectedShowData(show.data)
  setSelectedShowIndex(show.index)
  setDateError('')

  // ✅ Pre-set the date input to the movie's release date
  if (show.data?.releasedate) {
    const parsed = parseDMYDate(show.data.releasedate)
    if (parsed) {
      setReleaseDate(formatDateForInput(parsed))
    } else {
      setReleaseDate('')
    }
  } else {
    setReleaseDate('')
  }

  setStep(2)
}
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value + 'T00:00:00')
    selectedDate.setHours(0, 0, 0, 0)

    // Check if date is in the past (before today)
    if (selectedDate < today) {
      setDateError('Cannot select past dates')
      return
    }

    // Check if date is today
    if (selectedDate.getTime() === today.getTime()) {
      setDateError('Cannot create tickets for today')
      return
    }

    // Check if date is beyond 10 days from today
    if (selectedDate > maxDate) {
  setDateError('Cannot create tickets more than 90 days in advance')
  return
}

    // Check if date is before the movie release date
    if (selectedShowData?.releasedate) {
      const releaseDateParsed = parseDMYDate(selectedShowData.releasedate)
      if (releaseDateParsed) {
        releaseDateParsed.setHours(0, 0, 0, 0)
        // Block only if selected date is BEFORE release date
        if (selectedDate < releaseDateParsed) {
          setDateError(`Cannot create tickets before movie release (${formatDateDisplay(selectedShowData.releasedate)})`)
          return
        }
      }
    }

    setDateError('')
    setReleaseDate(e.target.value)
  }

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...ticketCategories]
    newCategories[index][field] = value
    setTicketCategories(newCategories)
  }

  const handleDistribute = async () => {
    if (!selectedShow || !releaseDate) {
      alert('Please select a show and release date')
      return
    }

    if (dateError) {
      alert('Please fix the date error first')
      return
    }

    const validTickets = ticketCategories
      .filter(t => t.category && t.numberOftickets && t.price)
      .map(t => ({
        category: t.category,
        numberOftickets: Number(t.numberOftickets),
        price: Number(t.price)
      }))
    if (validTickets.length === 0) {
      alert('Please fill at least one ticket category')
      return
    }

    if (distributing) return // Prevent double click

    setDistributing(true)
    toast.loading("Distributing Tickets...", { id: 'distribute-tickets' })

    // Convert date from YYYY-MM-DD to DD/MM/YYYY format for backend
    const formatDateForBackend = (dateStr) => {
        if (!dateStr) return ''
        const [year, month, day] = dateStr.split('-')
        return `${day}/${month}/${year}`
    }

    const backendDate = formatDateForBackend(releaseDate)

    const result = await dispatch(DistributeTicketsInfo(validTickets, backendDate, selectedShow, token))

    if (result?.success) {
      toast.success('Tickets distributed successfully!', { id: 'distribute-tickets' })
      setReleaseDate('')
      setTicketCategories(ticketCategories.map(t => ({ ...t, numberOftickets: '', price: '' })))
      setSelectedShow(null)
      setSelectedShowData(null)
      setSelectedShowIndex(null)
      setStep(1)
    } else {
      toast.error(result?.message || 'Failed to distribute tickets', { id: 'distribute-tickets' })
    }
    setDistributing(false)
  }

  const getMinDate = () => {
    // Default minimum is tomorrow (can't sell for today)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    if (selectedShowData?.releasedate) {
      const releaseDateParsed = parseDMYDate(selectedShowData.releasedate)
      if (releaseDateParsed) {
        // Force the date to midnight to avoid timezone issues
        const releaseDateOnly = new Date(releaseDateParsed.getFullYear(), releaseDateParsed.getMonth(), releaseDateParsed.getDate())

        // If release date is in the future (after tomorrow), use release date
        if (releaseDateOnly.getTime() > tomorrow.getTime()) {
          return formatDateForInput(releaseDateOnly)
        }
      }
    }
    // Default: minimum is tomorrow
    return formatDateForInput(tomorrow)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-400/20 mb-4">
          <FaTicketSimple className="text-4xl text-richblack-900" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Distribute Tickets</h1>
        <p className="text-richblack-400 text-lg">Create and distribute tickets for your alloted shows</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? 'bg-yellow-400 text-richblack-900' : 'bg-richblack-700 text-richblack-400'}`}>
            <FaFilm className="text-lg" />
            <span className="font-semibold">1. Select Show</span>
          </div>
          <div className="w-12 h-1 bg-richblack-700 rounded">
            <div className={`h-full bg-yellow-400 rounded transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? 'bg-yellow-400 text-richblack-900' : 'bg-richblack-700 text-richblack-400'}`}>
            <FaCalendarAlt className="text-lg" />
            <span className="font-semibold">2. Release Date</span>
          </div>
          <div className="w-12 h-1 bg-richblack-700 rounded">
            <div className={`h-full bg-yellow-400 rounded transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 3 ? 'bg-yellow-400 text-richblack-900' : 'bg-richblack-700 text-richblack-400'}`}>
            <GiCash className="text-lg" />
            <span className="font-semibold">3. Set Prices</span>
          </div>
        </div>
      </div>

      {/* Show Selection */}
      {step === 1 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-richblack-800 via-richblack-800 to-richblack-700 rounded-2xl p-8 border border-richblack-600 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                <FaFilm className="text-xl text-yellow-400" />
              </div>
              Select a Show
            </h2>
            {shows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shows.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleShowSelect(item, index)}
                    className="group relative bg-richblack-700/50 rounded-2xl p-6 border-2 border-richblack-600 hover:border-yellow-400 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 hover:-translate-y-1"
                  >
                    <div className="absolute top-4 right-4 w-3 h-3 bg-richblack-600 rounded-full group-hover:bg-yellow-400 transition-colors"></div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {item.data?.title || `Show ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
                        {item.data?.movieStatus || 'N/A'}
                      </span>
                    </div>

                    {/* Ticket Allocation Info */}
                    {item.ticketAllocation && (
                      <div className="bg-richblack-800/50 rounded-xl p-3 mb-3 space-y-2">
                        <p className="text-yellow-400 text-sm font-semibold flex items-center gap-2">
                          <FaTicketSimple className="text-xs" />
                          Ticket Allocation from Organizer
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-richblack-300">
                            <FaTicketSimple className="text-xs text-green-400" />
                            <span>Total: <span className="text-white font-semibold">{item.ticketAllocation.ticketsReceived}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-richblack-300">
                            <span className="text-green-400">₹</span>
                            <span>Price: <span className="text-white font-semibold">₹{item.ticketAllocation.ticketPrice}</span></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.data?.releasedate && (
                      <p className="text-richblack-400 text-sm flex items-center gap-2">
                        <FaCalendarAlt className="text-xs" />
                        Movie Release: {formatDateDisplay(item.data.releasedate)}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-richblack-600">
                      <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                        Click to select <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-richblack-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFilm className="text-5xl text-richblack-500" />
                </div>
                <p className="text-richblack-400 text-xl">No shows alloted to your theatre yet</p>
                <p className="text-richblack-500 mt-2">Shows assigned by organizers will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Release Date */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-richblack-800 via-richblack-800 to-richblack-700 rounded-2xl p-8 border border-richblack-600 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-yellow-400" />
                </div>
                Select Release Date
              </h2>
              <button
                onClick={() => setStep(1)}
                className="text-richblack-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>

            <div className="mb-6">
              {/* Show Info & Ticket Allocation */}
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent rounded-xl p-4 mb-6 border border-yellow-400/20">
                <p className="text-white font-bold text-lg mb-2">{selectedShowData?.title}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-richblack-400 text-sm flex items-center gap-2">
                    <FaCalendarAlt className="text-yellow-400" />
                    Movie Release: {formatDateDisplay(selectedShowData?.releasedate)}
                  </p>
                  {shows.find(s => s.data?._id === selectedShow)?.ticketAllocation && (
                    <div className="flex gap-4">
                      <p className="text-richblack-400 text-sm flex items-center gap-2">
                        <FaTicketSimple className="text-green-400" />
                        Allocated: <span className="text-white font-semibold">
                          {shows.find(s => s.data?._id === selectedShow)?.ticketAllocation?.ticketsReceived}
                        </span> tickets
                      </p>
                      <p className="text-richblack-400 text-sm flex items-center gap-2">
                        <span className="text-green-400">₹</span>
                        Price: <span className="text-white font-semibold">
                          ₹{shows.find(s => s.data?._id === selectedShow)?.ticketAllocation?.ticketPrice}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <input
                type="date"
                value={releaseDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={formatDateForInput(maxDate)}
                className="w-full px-6 py-4 bg-richblack-700 border-2 border-richblack-500 rounded-xl text-white text-lg focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all"
              />

              {dateError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <span className="text-red-400 text-xl">⚠️</span>
                  <p className="text-red-400">{dateError}</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-400 text-sm">
                  <span className="font-bold">Rules:</span>
                  <ul className="mt-2 space-y-1">
                    <li>• Cannot select past dates</li>
                    <li>• Cannot select today's date</li>
                    <li>• Cannot select more than 90 days in advance</li>
                    <li>• Cannot select dates before movie release ({formatDateDisplay(selectedShowData?.releasedate)})</li>
                  </ul>
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => releaseDate && !dateError && setStep(3)}
                disabled={!releaseDate || !!dateError}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  releaseDate && !dateError
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-richblack-900 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-105'
                    : 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Categories */}
      {step === 3 && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-richblack-800 via-richblack-800 to-richblack-700 rounded-2xl p-8 border border-richblack-600 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <GiCash className="text-xl text-yellow-400" />
                </div>
                Ticket Categories
              </h2>
              <button
                onClick={() => setStep(2)}
                className="text-richblack-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-transparent rounded-xl p-4 mb-6 border border-yellow-400/20">
              <div className="flex flex-wrap gap-4 mb-3">
                <div className="flex items-center gap-2 text-white">
                  <FaFilm className="text-yellow-400" />
                  <span className="font-medium">{selectedShowData?.title}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <FaCalendarAlt className="text-yellow-400" />
                  <span className="font-medium">{formatDateDisplay(releaseDate)}</span>
                </div>
              </div>
              {shows.find(s => s.data?._id === selectedShow)?.ticketAllocation && (
                <div className="flex gap-6 text-sm">
                  <p className="text-richblack-400 flex items-center gap-2">
                    <FaTicketSimple className="text-green-400" />
                    Allocated: <span className="text-white font-semibold">
                      {shows.find(s => s.data?._id === selectedShow)?.ticketAllocation?.ticketsReceived}
                    </span> tickets
                  </p>
                  <p className="text-richblack-400 flex items-center gap-2">
                    <span className="text-green-400">₹</span>
                    Min Price: <span className="text-white font-semibold">
                      ₹{shows.find(s => s.data?._id === selectedShow)?.ticketAllocation?.ticketPrice}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {ticketCategories.map((category, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${category.bgColor} to-transparent rounded-2xl p-6 border border-richblack-600 hover:border-yellow-400/50 transition-all`}
                >
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-40 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <category.icon className="text-2xl text-white" />
                      </div>
                      <span className={`text-xl font-bold ${category.textColor}`}>{category.category}</span>
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-richblack-400 text-sm mb-2 ml-1">Number of Tickets</label>
                      <input
                        type="number"
                        value={category.numberOftickets}
                        onChange={(e) => handleCategoryChange(index, 'numberOftickets', e.target.value)}
                        placeholder="Enter ticket count"
                        min="0"
                        className="w-full px-5 py-3 bg-richblack-700 border-2 border-richblack-500 rounded-xl text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all placeholder-richblack-500"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-richblack-400 text-sm mb-2 ml-1">Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-richblack-400 text-lg">₹</span>
                        <input
                          type="number"
                          value={category.price}
                          onChange={(e) => handleCategoryChange(index, 'price', e.target.value)}
                          placeholder="Enter price"
                          min="0"
                          className="w-full pl-10 pr-5 py-3 bg-richblack-700 border-2 border-richblack-500 rounded-xl text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all placeholder-richblack-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleDistribute}
                disabled={distributing}
                className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 ${
                  distributing
                    ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-richblack-900 hover:shadow-2xl hover:shadow-yellow-400/30'
                }`}
              >
                {distributing ? (
                  <span className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-richblack-400 border-t-yellow-400 rounded-full animate-spin"></div>
                    Distributing...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <FaTicketSimple className="text-2xl" />
                    Distribute Tickets
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DistributeTickets
