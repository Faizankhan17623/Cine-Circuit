import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../Home/Navbar"
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa"
import { TheatreDetails } from "../../Services/operations/User"
import { MakePayment } from "../../Services/operations/Payment"
import Loader from "../extra/Loading"

// Convert 24hr time to 12hr AM/PM format
const formatTime12hr = (time) => {
  if (!time) return ""
  const parts = time.split(":")
  let hours = parseInt(parts[0], 10)
  const minutes = parts[1] || "00"
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours}:${minutes} ${ampm}`
}

const Purchase = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, isLoggedIn } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(null)
  const [theatres, setTheatres] = useState([])
  const [ticketData, setTicketData] = useState([])

  const [selectedTheatre, setSelectedTheatre] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [tickets, setTickets] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await dispatch(TheatreDetails(id))
        if (response?.success) {
          setShow(response.data.data.show)
          setTheatres(response.data.data.Theatres)
          setTicketData(response.data.data.TicketData)
        }
      } catch (error) {
        console.log("Purchase fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // console.log(ticketData)
  // Get tickets for the selected theatre
  const theatreTickets = selectedTheatre
    ? ticketData.filter(
        (t) => t.theatreId === selectedTheatre._id && t.Status !== "Expired"
      )
    : []

  // Get unique dates for the selected theatre, filter out past dates
  const availableDates = [...new Set(theatreTickets.map((t) => t.Date))].filter((dateStr) => {
    const parts = dateStr.split("/")
    if (parts.length !== 3) return true
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
    const today = new Date()
    d.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return d >= today
  })

  // Get timings for the selected date
  const selectedDateTicket = selectedDate
    ? theatreTickets.find((t) => t.Date === selectedDate)
    : null

  // Filter out past times if the selected date is today
  const allTimings = selectedDateTicket?.timings || []
  const availableTimings = (() => {
    if (!selectedDate) return []
    const parts = selectedDate.split("/")
    if (parts.length !== 3) return allTimings

    const dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`
    const selectedDateObj = new Date(dateStr)
    const today = new Date()

    selectedDateObj.setHours(0, 0, 0, 0)
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (selectedDateObj.getTime() !== todayOnly.getTime()) return allTimings

    const currentHours = today.getHours()
    const currentMinutes = today.getMinutes()

    return allTimings.filter((time) => {
      const timeParts = time.split(":")
      const h = parseInt(timeParts[0], 10)
      const m = parseInt(timeParts[1] || "0", 10)
      return h > currentHours || (h === currentHours && m > currentMinutes)
    })
  })()

  const handleSelectTheatre = (theatre) => {
    setSelectedTheatre(theatre)
    setSelectedDate(null)
    setSelectedTime(null)
    setTickets([])
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setTickets([])
  }

  const handleSelectTime = (time) => {
    setSelectedTime(time)
    // Initialize ticket quantities from categories
    const dateTicket = theatreTickets.find((t) => t.Date === selectedDate)
    // console.log(dateTicket)
    if (dateTicket?.ticketsCategory) {
      setTickets(
        dateTicket.ticketsCategory.map((cat) => ({
          category: cat.category,
          price: cat.price,
          available: cat.ticketsPurchaseafterRemaining,
          quantity: 0,
          id:cat._id
        }))
      )
    }
  }

  const MAX_TICKETS_PER_CATEGORY = 5

  const increase = (index) => {
    const updated = [...tickets]
    const maxAllowed = Math.min(MAX_TICKETS_PER_CATEGORY, updated[index].available)
    if (updated[index].quantity < maxAllowed) {
      updated[index].quantity += 1
      setTickets(updated)
    }
  }

  const decrease = (index) => {
    const updated = [...tickets]
    if (updated[index].quantity > 0) {
      updated[index].quantity -= 1
      setTickets(updated)
    }
  }

  const totalAmount = tickets.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0)
  // console.log(tickets)

  const handlePayment = () => {
    const dateTicket = theatreTickets.find((t) => t.Date === selectedDate)
    if (!dateTicket) return

    const selectedTickets = tickets.filter((t) => t.quantity > 0)
    const Categories = selectedTickets.map((t) => t.id)
    const ticketCounts = selectedTickets.map((t) => String(t.quantity))

    dispatch(
      MakePayment(
        show._id,
        selectedTheatre._id,
        dateTicket._id,
        Categories,
        ticketCounts,
        selectedTime,
        user?._id,
        token,
        navigate,
        setPaymentLoading
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-richblack-900 text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <p className="text-richblack-300 text-lg">Show not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-white">
      {/* Payment Loading Overlay */}
      {paymentLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-richblack-900/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 p-10 rounded-2xl bg-richblack-800 border border-richblack-700 shadow-2xl">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Processing Payment</h3>
              <p className="text-richblack-300 text-sm">Please do not close or refresh this page</p>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* Show Banner */}
      <div className="relative h-72 md:h-80">
        <img
          src={show.Posterurl}
          alt={show.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 to-transparent" />
        <div className="absolute bottom-6 left-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold">{show.title}</h1>
          <p className="text-richblack-300 text-sm mt-1">
            {show.movieDuration} mins {show.releasedate ? `• ${show.releasedate}` : ""}
          </p>
          {show.tagline && (
            <p className="text-richblack-400 text-sm mt-1">{show.tagline}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition font-medium mb-8"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Step 1: Select Theatre */}
        <h2 className="text-xl font-semibold mb-6">Select Theatre</h2>

        {theatres.length === 0 ? (
          <p className="text-richblack-400">No theatres available for this show.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {theatres.map((theatre) => (
              <div
                key={theatre._id}
                onClick={() => handleSelectTheatre(theatre)}
                className={`p-6 rounded-2xl border cursor-pointer transition
                ${
                  selectedTheatre?._id === theatre._id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-richblack-700 bg-richblack-800 hover:border-yellow-400"
                }`}
              >
                <h3 className="font-semibold text-lg">{theatre.Theatrename}</h3>
                <div className="flex items-center gap-2 text-richblack-400 text-sm mt-2">
                  <FaMapMarkerAlt />
                  {theatre.locationName}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Select Date */}
        {selectedTheatre && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">
              Select Date - {selectedTheatre.Theatrename}
            </h2>

            {availableDates.length === 0 ? (
              <p className="text-richblack-400">
                No dates available for this theatre.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {availableDates.map((date) => (
                  <div
                    key={date}
                    onClick={() => handleSelectDate(date)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition
                    ${
                      selectedDate === date
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-richblack-700 bg-richblack-800 hover:border-yellow-400 text-richblack-200"
                    }`}
                  >
                    <FaCalendarAlt />
                    <span className="font-medium">{date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Time */}
        {selectedDate && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">
              Select Showtime - {selectedDate}
            </h2>

            {availableTimings.length === 0 ? (
              <p className="text-richblack-400">
                No showtimes available for this date.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {availableTimings.map((time, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectTime(time)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition
                    ${
                      selectedTime === time
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "border-richblack-700 bg-richblack-800 hover:border-yellow-400 text-richblack-200"
                    }`}
                  >
                    <FaClock />
                    <span className="font-medium">{formatTime12hr(time)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Ticket selection with +/- and total */}
        {selectedTime && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-2">
              Select Tickets
            </h2>
            <p className="text-richblack-400 text-sm mb-6">
              {selectedTheatre.Theatrename} &bull; {selectedDate} &bull; {formatTime12hr(selectedTime)}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Ticket Categories with +/- */}
              <div className="md:col-span-2 space-y-4">
                {tickets.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-richblack-800 p-5 rounded-xl border border-richblack-700"
                  >
                    <div>
                      <h3 className="font-semibold">{item.category}</h3>
                      <p className="text-yellow-400 text-sm">₹{item.price}</p>
                      <p className="text-richblack-500 text-xs mt-1">
                        {item.available > 0 ? (
                          <span className="text-green-400">
                            {item.available} available (max {Math.min(MAX_TICKETS_PER_CATEGORY, item.available)} per person)
                          </span>
                        ) : (
                          <span className="text-red-400">Sold out</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decrease(index)}
                        disabled={item.available === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-richblack-700 hover:bg-red-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="text-lg font-semibold w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(index)}
                        disabled={item.available === 0 || item.quantity >= Math.min(MAX_TICKETS_PER_CATEGORY, item.available)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-richblack-700 hover:bg-green-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="bg-richblack-800 p-6 rounded-2xl border border-richblack-700 h-fit sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Total</h3>

                {tickets.filter((t) => t.quantity > 0).length === 0 ? (
                  <p className="text-richblack-500 text-sm">No tickets selected</p>
                ) : (
                  <>
                    {tickets.map(
                      (item, index) =>
                        item.quantity > 0 && (
                          <div
                            key={index}
                            className="flex justify-between text-sm mb-2"
                          >
                            <span className="text-richblack-300">
                              {item.category} x {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        )
                    )}

                    <hr className="border-richblack-700 my-4" />

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-richblack-300">Total Tickets</span>
                      <span className="font-semibold">{totalTickets}</span>
                    </div>

                    <div className="flex justify-between font-bold text-yellow-400 text-lg">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </>
                )}

                <div className={`mt-5 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                  !isLoggedIn
                    ? "bg-orange-500/10 border border-orange-500/30 text-orange-400"
                    : user?.usertype === "Viewer"
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    !isLoggedIn
                      ? "bg-orange-400"
                      : user?.usertype === "Viewer" ? "bg-green-400" : "bg-red-400"
                  }`} />
                  {!isLoggedIn
                    ? "Not logged in"
                    : <>Your role: <span className="font-bold">{user?.usertype || "Guest"}</span></>
                  }
                </div>

                <button
                  onClick={handlePayment}
                  disabled={totalAmount === 0 || !isLoggedIn || user?.usertype !== "Viewer"}
                  className={`mt-4 w-full py-3 rounded-xl font-semibold transition ${
                    totalAmount === 0 || !isLoggedIn || user?.usertype !== "Viewer"
                      ? "bg-richblack-700 cursor-not-allowed text-richblack-500"
                      : "bg-yellow-400 hover:bg-yellow-300 text-black"
                  }`}
                >
                  Make Payment
                </button>
                {!isLoggedIn && (
                  <p className="text-orange-400 text-xs text-center mt-2">
                    Please login to make a payment
                  </p>
                )}
                {isLoggedIn && user?.usertype !== "Viewer" && (
                  <p className="text-red-400 text-xs text-center mt-2">
                    Only viewers can make a payment
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Purchase
