import { useState } from "react"
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaFilm, FaTheaterMasks, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { ClipLoader } from "react-spinners"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import {Finders} from '../../Services/operations/User'
import { useDispatch } from "react-redux"

const DATA = [
  { id: 1, location: "Nagar", date: "21-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 2, location: "pune", date: "22/05/2025", theatreName: "pune theatre", movieName: "rascalling " },
  { id: 3, location: "kondhave", date: "23/05/2025", theatreName: "kondhave theatre", movieName: "kondhaving" },
  { id: 4, location: "sada galli", date: "24-05-2025", theatreName: "sada theatre", movieName: "sada souda" },
  { id: 5, location: "name nahi", date: "25-05-2025", theatreName: "nameching theatre", movieName: "nameing" },
  { id: 6, location: "Nagar", date: "28-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 7, location: "Nagar", date: "28-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 8, location: "Nagar", date: "28-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 9, location: "Nagar", date: "28-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 10, location: "Nagar", date: "21-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 11, location: "Nagar", date: "21-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 12, location: "Nagar", date: "21-05-2025", theatreName: "nagar", movieName: "rascal" },
  { id: 13, location: "Nagar", date: "21-05-2025", theatreName: "nagar", movieName: "rascal" },
]

const Finder = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [matches, setMatches] = useState([])
  const [locationMsg, setLocationMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searched, setSearched] = useState(false)
  const [movie,setMovie] = useState([])
  const [theatre,setTheatre] = useState([])
  const [tickets,setTickets] = useState([])

  const resultsPerPage = 3

  const onSubmit = async(data) => {
    setIsLoading(true)
    setCurrentPage(0)
    const [year, month, day] = data.date.split("-")
    const formattedDate = `${day}/${month}/${year}`
    const searchObj = { ...data, date: formattedDate }


    const Response = await dispatch(Finders(searchObj.location,searchObj.movieName,searchObj.theatreName,searchObj.date))
    // console.log(Response)
     if (Response.data.success) {
             setMatches(Response.data.data)
            //  setMovie(Response.data.data.movie)
            //  setTheatre(Response.data.data.theatre)
            //  setTickets(Response.data.data.tickets)
        }
    // setTimeout(() => {
    //   const found = DATA.filter(item =>
    //     item.location === searchObj.location &&
    //     item.date === searchObj.date &&
    //     item.movieName === searchObj.movieName &&
    //     item.theatreName === searchObj.theatreName
    //   )
    //   if (found.length > 0) {
    //     setLocationMsg("All fields match!")
    //     setMatches(found)
    //   } else {
    //     setLocationMsg("No match found.")
    //     setMatches([])
    //   }
    // }, 1000)
     setIsLoading(false)
      setSearched(true)
  }

  console.log(matches)
  const totalPages = Math.ceil(matches.length / resultsPerPage)
  const startIndex = currentPage * resultsPerPage
  const visibleResults = matches.slice(startIndex, startIndex + resultsPerPage)

  const getMinDate = () => new Date().toISOString().split('T')[0]
  const getMaxDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 45)
    return d.toISOString().split('T')[0]
  }

  return (
    <div className='w-full py-10'>
      {/* Section Header */}
      <div className='text-center mb-8'>
        <div className='flex items-center justify-center gap-4 mb-3'>
          <h2 className='text-3xl lg:text-4xl font-bold text-white'>FIND</h2>
          <div className='flex items-center gap-4'>
            <button className='text-yellow-400 font-semibold text-lg border-b-2 border-yellow-400 pb-0.5'>
              Movies
            </button>
            <button
              className='text-richblack-300 font-medium text-lg hover:text-richblack-100 transition-colors'
              onClick={() => toast.error('Coming soon!')}
            >
              Web Series
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-5xl mx-auto bg-richblack-800 border border-richblack-600 rounded-2xl p-2 flex flex-col lg:flex-row items-stretch'>

          {/* Location */}
          <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-600'>
            <FaMapMarkerAlt className={`text-lg flex-shrink-0 ${errors.location ? 'text-red-400' : 'text-yellow-400'}`} />
            <div className='flex-1'>
              <label className='text-xs font-medium text-richblack-300 block'>Location</label>
              <input
                type="text"
                placeholder="Which city?"
                {...register("location", { required: true })}
                className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-400 mt-0.5'
              />
            </div>
          </div>

          {/* Date */}
          <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-600'>
            <FaCalendarAlt className={`text-lg flex-shrink-0 ${errors.date ? 'text-red-400' : 'text-yellow-400'}`} />
            <div className='flex-1'>
              <label className='text-xs font-medium text-richblack-300 block'>Date</label>
              <input
                type="date"
                {...register("date", {
                  required: true,
                  validate: {
                    isInRange: value => {
                      const sel = new Date(value)
                      return (sel >= new Date(getMinDate()) && sel <= new Date(getMaxDate())) ||
                        "Select a date within 45 days"
                    }
                  }
                })}
                min={getMinDate()}
                max={getMaxDate()}
                className='w-full bg-transparent text-white text-sm outline-none mt-0.5 [color-scheme:dark]'
              />
            </div>
          </div>

          {/* Movie Name */}
          <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-600'>
            <FaFilm className={`text-lg flex-shrink-0 ${errors.movieName ? 'text-red-400' : 'text-yellow-400'}`} />
            <div className='flex-1'>
              <label className='text-xs font-medium text-richblack-300 block'>Movie</label>
              <input
                type="text"
                placeholder="Movie name"
                {...register("movieName", { required: true })}
                className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-400 mt-0.5'
              />
            </div>
          </div>

          {/* Theatre Name */}
          <div className='flex-1 flex items-center gap-3 px-4 py-3'>
            <FaTheaterMasks className='text-lg text-yellow-400 flex-shrink-0' />
            <div className='flex-1'>
              <label className='text-xs font-medium text-richblack-300 block'>Theatre</label>
              <input
                type="text"
                placeholder="Theatre name"
                {...register("theatreName")}
                className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-400 mt-0.5'
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className='w-full lg:w-14 h-12 lg:h-auto bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl lg:rounded-xl flex items-center justify-center transition-colors flex-shrink-0 mt-2 lg:mt-0 lg:ml-1'
          >
            <FaSearch className='text-lg' />
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className='max-w-5xl mx-auto mt-8'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <ClipLoader color="#facc15" size={40} />
            </div>
          ) : matches.length > 0 ? (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${currentPage === 0 ? 'bg-richblack-700 text-richblack-400' : 'bg-richblack-700 text-white hover:bg-richblack-600'}`}
                >
                  <FaArrowLeft className='text-sm' />
                </button>
                <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mx-4'>
                 {visibleResults.map((item, index) => (
  <div
    key={index}
    className="bg-gradient-to-br from-richblack-800 to-richblack-700 border border-yellow-500/30 rounded-2xl p-6 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-[1.02]"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-yellow-400">
          {item.movie.title}
        </h3>
        <p className="text-richblack-300 text-sm">
          {item.theatre.locationName}
        </p>
      </div>

      <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
        {item.tickets.Status || "Available"}
      </span>
    </div>

    <div className="space-y-2 text-sm text-richblack-200">
      <p>
        🎭 <span className="text-richblack-400">Theatre:</span>{" "}
        {item.theatre.Theatrename}
      </p>

      <p>
        📅 <span className="text-richblack-400">Date:</span>{" "}
        {item.tickets.Date}
      </p>

      <p>
        🎟 <span className="text-richblack-400">Tickets Remaining:</span>{" "}
        {item.tickets.TicketsRemaining}
      </p>

      <p>
        💰 <span className="text-richblack-400">Starting Price:</span>{" "}
        ₹{item.tickets.pricefromtheorg}
      </p>
    </div>

    <button className="mt-5 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-xl transition-all">
      Book Now
    </button>
  </div>
))}

                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${currentPage >= totalPages - 1 ? 'bg-richblack-700 text-richblack-400' : 'bg-richblack-700 text-white hover:bg-richblack-600'}`}
                >
                  <FaArrowRight className='text-sm' />
                </button>
              </div>
              <p className='text-center text-richblack-400 text-sm'>
                Page {currentPage + 1} of {totalPages}
              </p>
            </div>
          ) : (
            <p className='text-center text-richblack-300 text-lg py-6'>{locationMsg}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Finder
