import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaList, FaFilm, FaCalendarAlt, FaClock, FaLanguage, FaSearch, FaChevronDown, FaCloudUploadAlt, FaCloudDownloadAlt } from 'react-icons/fa'
import { MdMovie } from 'react-icons/md'
import { GetAllShows, GetNotUploadedShows } from '../../Services/operations/Shows'

const AllShows = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.show)

  const [shows, setShows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenre, setFilterGenre] = useState('all')
  const [showType, setShowType] = useState('uploaded') // 'uploaded' or 'not-uploaded'
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Fetch shows based on selected type
  const fetchShows = async () => {
    if (!token) return

    let result
    if (showType === 'uploaded') {
      result = await dispatch(GetAllShows(token, navigate))
    } else {
      result = await dispatch(GetNotUploadedShows(token, navigate))
    }

    if (result?.success) {
      setShows(result.data || [])
    } else {
      setShows([])
    }
  }

  useEffect(() => {
    fetchShows()
  }, [showType, token])

  // Get unique genres for filter
  const genres = [...new Set(shows?.map(show => show.genreid?.name).filter(Boolean))]

  // Filter shows based on search and genre
  const filteredShows = shows?.filter(show => {
    const matchesSearch = show.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          show.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = filterGenre === 'all' || show.genreid?.name === filterGenre
    return matchesSearch && matchesGenre
  })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  const showTypeOptions = [
    { value: 'uploaded', label: 'Uploaded Shows', icon: FaCloudUploadAlt, color: 'text-green-400' },
    { value: 'not-uploaded', label: 'Not Uploaded Shows', icon: FaCloudDownloadAlt, color: 'text-orange-400' }
  ]

  const currentOption = showTypeOptions.find(opt => opt.value === showType)

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaList className="text-2xl text-yellow-500" />
            <h1 className="text-2xl md:text-3xl font-bold">All Shows</h1>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
              {filteredShows?.length || 0} Shows
            </span>
          </div>

          {/* Show Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-[#1a1a2e] border border-gray-700/50 rounded-lg px-4 py-2.5 hover:border-yellow-500/50 transition-colors min-w-[220px]"
            >
              <currentOption.icon className={`text-xl ${currentOption.color}`} />
              <span className="flex-1 text-left">{currentOption.label}</span>
              <FaChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-gray-700/50 rounded-lg overflow-hidden z-50 shadow-xl">
                {showTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setShowType(option.value)
                      setDropdownOpen(false)
                      setFilterGenre('all')
                      setSearchTerm('')
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                      showType === option.value ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : ''
                    }`}
                  >
                    <option.icon className={`text-xl ${option.color}`} />
                    <span>{option.label}</span>
                    {showType === option.value && (
                      <span className="ml-auto text-yellow-500">&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 w-full"
            />
          </div>

          {/* Genre Filter */}
          {genres.length > 0 && (
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50 cursor-pointer"
            >
              <option value="all">All Genres</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Status Info Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${
        showType === 'uploaded'
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-orange-500/10 border-orange-500/30'
      }`}>
        <div className="flex items-center gap-3">
          {showType === 'uploaded' ? (
            <>
              <FaCloudUploadAlt className="text-2xl text-green-400" />
              <div>
                <h3 className="font-semibold text-green-300">Uploaded Shows</h3>
                <p className="text-sm text-gray-400">These shows are uploaded and verified by admin. They are visible to the public.</p>
              </div>
            </>
          ) : (
            <>
              <FaCloudDownloadAlt className="text-2xl text-orange-400" />
              <div>
                <h3 className="font-semibold text-orange-300">Not Uploaded Shows</h3>
                <p className="text-sm text-gray-400">These shows are still in draft or pending upload. Complete them to make them public.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shows Grid */}
      {filteredShows && filteredShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShows.map((show) => (
            <div
              key={show._id}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                {show.TitleImage ? (
                  <img
                    src={show.TitleImage}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <MdMovie className="text-6xl text-gray-600" />
                  </div>
                )}

                {/* Overlay with quick info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm text-gray-300 line-clamp-3">{show.tagline || 'No tagline available'}</p>
                  </div>
                </div>

                {/* Genre Badge */}
                {show.genreid?.name && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
                      {show.genreid.name}
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {showType === 'uploaded' ? (
                    <span className="bg-green-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <FaCloudUploadAlt />
                      Published
                    </span>
                  ) : (
                    <span className="bg-orange-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <FaCloudDownloadAlt />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{show.title}</h3>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  {/* Release Date */}
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-yellow-500" />
                    <span>{formatDate(show.releasedate)}</span>
                  </div>

                  {/* Duration */}
                  {show.Duration && (
                    <div className="flex items-center gap-1">
                      <FaClock className="text-yellow-500" />
                      <span>{formatDuration(show.Duration)}</span>
                    </div>
                  )}

                  {/* Language */}
                  {show.languagename && (
                    <div className="flex items-center gap-1">
                      <FaLanguage className="text-yellow-500" />
                      <span>{show.languagename}</span>
                    </div>
                  )}
                </div>

                {/* Director & Producer */}
                <div className="mt-3 pt-3 border-t border-gray-700/50 text-sm">
                  {show.directorname && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Director:</span> {show.directorname}
                    </p>
                  )}
                  {show.producername && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Producer:</span> {show.producername}
                    </p>
                  )}
                </div>

                {/* Cast Preview */}
                {show.castid && show.castid.length > 0 && (
                  <div className="mt-3 flex -space-x-2">
                    {show.castid.slice(0, 4).map((cast, index) => (
                      <div key={cast._id || index} className="relative">
                        {cast.castimage ? (
                          <img
                            src={cast.castimage}
                            alt={cast.castname}
                            className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] object-cover"
                            title={cast.castname}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] bg-gray-700 flex items-center justify-center text-xs"
                            title={cast.castname}
                          >
                            {cast.castname?.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                    {show.castid.length > 4 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] bg-yellow-500/20 flex items-center justify-center text-xs text-yellow-300">
                        +{show.castid.length - 4}
                      </div>
                    )}
                  </div>
                )}

                {/* Action for not uploaded shows */}
                {showType === 'not-uploaded' && (
                  <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <FaCloudUploadAlt />
                    Upload Show
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
            <FaFilm className="text-8xl text-yellow-500/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No Shows Found</h2>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterGenre !== 'all'
                ? 'No shows match your search criteria. Try adjusting your filters.'
                : showType === 'uploaded'
                  ? 'There are no uploaded shows yet. Upload your shows to see them here!'
                  : 'All your shows have been uploaded. Great job!'}
            </p>
            {(searchTerm || filterGenre !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterGenre('all')
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default AllShows
