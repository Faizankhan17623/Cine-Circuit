import { useState } from "react"
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaFilm, FaTheaterMasks, FaChevronLeft, FaChevronRight, FaTicketAlt } from "react-icons/fa"
import { ClipLoader } from "react-spinners"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import {Finders} from '../../Services/operations/User'
import { useDispatch } from "react-redux"
import { MdEventSeat, MdLocationOn } from "react-icons/md"

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
     if (Response.data.success) {
             setMatches(Response.data.data)
        }
     setIsLoading(false)
      setSearched(true)
  }

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
    <div className='w-full py-10 animate-fadeIn'>
      {/* Section Header */}
      <div className='text-center mb-8'>
        <div className='inline-flex items-center gap-3 mb-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20'>
            <FaSearch className='text-white text-sm' />
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-white'>
            Find Your <span className='bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>Show</span>
          </h2>
        </div>
        <p className='text-richblack-300 text-sm mt-1'>Search for movies playing at theatres near you</p>
        <div className='mt-3 w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto' />

        {/* Tab Buttons */}
        <div className='flex items-center justify-center gap-1 mt-6'>
          <button className='px-5 py-2 text-sm font-semibold rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 transition-colors'>
            Movies
          </button>
          <button
            className='px-5 py-2 text-sm font-medium rounded-full text-richblack-300 hover:text-richblack-100 hover:bg-richblack-700/50 transition-all duration-200'
            onClick={() => toast.error('Coming soon!')}
          >
            Web Series
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-5xl mx-auto bg-richblack-800/80 backdrop-blur-sm border border-richblack-600/60 rounded-2xl p-2 shadow-xl shadow-black/20'>
          <div className='flex flex-col lg:flex-row items-stretch'>

            {/* Location */}
            <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-700/50 group'>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${errors.location ? 'bg-red-500/15 text-red-400' : 'bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400/20'}`}>
                <FaMapMarkerAlt className='text-sm' />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] font-semibold text-richblack-400 uppercase tracking-wider block'>Location</label>
                <input
                  type="text"
                  placeholder="Which city?"
                  {...register("location", { required: true })}
                  className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-500 mt-0.5'
                />
              </div>
            </div>

            {/* Date */}
            <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-700/50 group'>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${errors.date ? 'bg-red-500/15 text-red-400' : 'bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400/20'}`}>
                <FaCalendarAlt className='text-sm' />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] font-semibold text-richblack-400 uppercase tracking-wider block'>Date</label>
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
            <div className='flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-richblack-700/50 group'>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${errors.movieName ? 'bg-red-500/15 text-red-400' : 'bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400/20'}`}>
                <FaFilm className='text-sm' />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] font-semibold text-richblack-400 uppercase tracking-wider block'>Movie</label>
                <input
                  type="text"
                  placeholder="Movie name"
                  {...register("movieName", { required: true })}
                  className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-500 mt-0.5'
                />
              </div>
            </div>

            {/* Theatre Name */}
            <div className='flex-1 flex items-center gap-3 px-4 py-3 group'>
              <div className='w-9 h-9 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400/20 transition-colors'>
                <FaTheaterMasks className='text-sm' />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] font-semibold text-richblack-400 uppercase tracking-wider block'>Theatre</label>
                <input
                  type="text"
                  placeholder="Theatre name"
                  {...register("theatreName")}
                  className='w-full bg-transparent text-white text-sm outline-none placeholder-richblack-500 mt-0.5'
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className='w-full lg:w-14 h-12 lg:h-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-2 lg:mt-0 lg:ml-1 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 active:scale-[0.97]'
            >
              <FaSearch className='text-lg' />
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className='max-w-5xl mx-auto mt-10'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <ClipLoader color="#facc15" size={40} />
              <p className='text-richblack-400 text-sm mt-4'>Searching shows...</p>
            </div>
          ) : matches.length > 0 ? (
            <div>
              {/* Results Header */}
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h3 className='text-lg font-semibold text-white'>
                    Found <span className='text-yellow-400'>{matches.length}</span> {matches.length === 1 ? 'show' : 'shows'}
                  </h3>
                  <p className='text-richblack-400 text-xs mt-0.5'>Showing page {currentPage + 1} of {totalPages}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${currentPage === 0 ? 'bg-richblack-800 text-richblack-600 cursor-not-allowed' : 'bg-richblack-700 text-white hover:bg-richblack-600 border border-richblack-600'}`}
                  >
                    <FaChevronLeft className='text-xs' />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${currentPage >= totalPages - 1 ? 'bg-richblack-800 text-richblack-600 cursor-not-allowed' : 'bg-richblack-700 text-white hover:bg-richblack-600 border border-richblack-600'}`}
                  >
                    <FaChevronRight className='text-xs' />
                  </button>
                </div>
              </div>

              {/* Result Cards */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {visibleResults.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-richblack-800 border border-richblack-700/60 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5"
                  >
                    {/* Card Header */}
                    <div className='bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-transparent px-5 pt-5 pb-4 border-b border-richblack-700/50'>
                      <div className="flex justify-between items-start gap-3">
                        <div className='flex-1 min-w-0'>
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-yellow-200 transition-colors">
                            {item.movie.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 text-richblack-300 text-xs">
                            <MdLocationOn className='text-yellow-500 flex-shrink-0' />
                            <span className='truncate'>{item.theatre.locationName}</span>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          item.tickets.Status === 'Available' || !item.tickets.Status
                            ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/20'
                            : 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20'
                        }`}>
                          {item.tickets.Status || "Available"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4 space-y-3">
                      <div className='flex items-center gap-3 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-richblack-700 flex items-center justify-center flex-shrink-0'>
                          <FaTheaterMasks className='text-xs text-purple-400' />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-[10px] text-richblack-500 uppercase tracking-wider'>Theatre</p>
                          <p className='text-richblack-100 text-sm truncate'>{item.theatre.Theatrename}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3 text-sm'>
                        <div className='w-8 h-8 rounded-lg bg-richblack-700 flex items-center justify-center flex-shrink-0'>
                          <FaCalendarAlt className='text-xs text-blue-400' />
                        </div>
                        <div>
                          <p className='text-[10px] text-richblack-500 uppercase tracking-wider'>Show Date</p>
                          <p className='text-richblack-100 text-sm'>{item.tickets.Date}</p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-lg bg-richblack-700 flex items-center justify-center flex-shrink-0'>
                            <MdEventSeat className='text-xs text-orange-400' />
                          </div>
                          <div>
                            <p className='text-[10px] text-richblack-500 uppercase tracking-wider'>Seats Left</p>
                            <p className='text-richblack-100 text-sm font-medium'>{item.tickets.TicketsRemaining}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-[10px] text-richblack-500 uppercase tracking-wider'>From</p>
                          <p className='text-yellow-400 text-lg font-bold'>&#8377;{item.tickets.pricefromtheorg}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className='px-5 pb-5'>
                      <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-yellow-400/10 active:scale-[0.97]">
                        <FaTicketAlt className='inline mr-2 text-xs' />
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* No Results */
            <div className='flex flex-col items-center justify-center py-14'>
              <div className='w-16 h-16 rounded-2xl bg-richblack-800 border border-richblack-700 flex items-center justify-center mb-4'>
                <FaSearch className='text-2xl text-richblack-500' />
              </div>
              <h3 className='text-white font-semibold text-lg mb-1'>No shows found</h3>
              <p className='text-richblack-400 text-sm max-w-sm text-center'>Try adjusting your search — check the city name, movie title, or pick a different date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Finder
