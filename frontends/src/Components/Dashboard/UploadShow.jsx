import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  FaUpload,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaLanguage,
  FaSearch,
  FaPlay,
  FaTimes,
  FaFilm,
  FaUsers,
  FaHashtag,
  FaExclamationTriangle,
  FaRocket,
  FaEye,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'
import { MdMovie, MdVerified, MdPending } from 'react-icons/md'
import { BiCategory } from 'react-icons/bi'
import { GetVerifiedNotUploadedShows, UploadShow as PublishShow, GetNotUploadedShows } from '../../Services/operations/Shows'

const UploadShow = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.show)

  const [verifiedShows, setVerifiedShows] = useState([])
  const [pendingShows, setPendingShows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [publishingId, setPublishingId] = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(null)
  const [activeTab, setActiveTab] = useState('verified') // 'verified' or 'pending'
  const [expandedCard, setExpandedCard] = useState(null)

  // Fetch shows
  const fetchShows = async () => {
    if (!token) return

    // Fetch verified but not uploaded shows
    const verifiedResult = await dispatch(GetVerifiedNotUploadedShows(token, navigate))
    if (verifiedResult?.success) {
      setVerifiedShows(verifiedResult.data || [])
    }

    // Fetch all not uploaded shows (including pending verification)
    const pendingResult = await dispatch(GetNotUploadedShows(token, navigate))
    if (pendingResult?.success) {
      // Filter out verified ones to show only pending verification
      const pendingOnly = (pendingResult.data || []).filter(show => !show.VerifiedByTheAdmin)
      setPendingShows(pendingOnly)
    }
  }

  useEffect(() => {
    fetchShows()
  }, [token])

  // Filter shows based on search
  const filterShows = (shows) => {
    return shows?.filter(show => {
      const matchesSearch = show.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            show.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }

  const filteredVerifiedShows = filterShows(verifiedShows)
  const filteredPendingShows = filterShows(pendingShows)

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
  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    const minutes = parseInt(duration)
    if (isNaN(minutes)) return duration
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  // Handle publish show
  const handlePublish = async (showId) => {
    setPublishingId(showId)
    const result = await dispatch(PublishShow(token, showId, navigate))
    if (result?.success) {
      // Remove from verified shows list
      setVerifiedShows(prev => prev.filter(show => show._id !== showId))
      setConfirmPublish(null)
    }
    setPublishingId(null)
  }

  // Preview Modal
  const PreviewModal = ({ show, onClose }) => {
    if (!show) return null

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative">
            {show.Posterurl ? (
              <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={show.Posterurl}
                  alt={show.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-t-2xl">
                <MdMovie className="text-8xl text-gray-600" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Verification Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-green-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                <MdVerified className="text-lg" />
                Verified by Admin
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title & Tagline */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{show.title}</h2>
            <p className="text-gray-400 mb-6">{show.tagline}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <FaCalendarAlt />
                  <span className="text-xs text-gray-400">Release Date</span>
                </div>
                <p className="text-white font-semibold">{formatDate(show.releasedate)}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <FaClock />
                  <span className="text-xs text-gray-400">Duration</span>
                </div>
                <p className="text-white font-semibold">{formatDuration(show.movieDuration || show.TotalDuration)}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <BiCategory />
                  <span className="text-xs text-gray-400">Genre</span>
                </div>
                <p className="text-white font-semibold">{show.genre?.name || 'N/A'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <FaLanguage />
                  <span className="text-xs text-gray-400">Language</span>
                </div>
                <p className="text-white font-semibold">
                  {show.language?.map(l => l.name).join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            {/* Crew Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {show.directorname && show.directorname.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Director</h4>
                  <p className="text-white">{show.directorname.join(', ')}</p>
                </div>
              )}
              {show.producername && show.producername.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Producer</h4>
                  <p className="text-white">{show.producername.join(', ')}</p>
                </div>
              )}
              {show.writersname && show.writersname.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Writers</h4>
                  <p className="text-white">{show.writersname.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Cast */}
            {show.castName && show.castName.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                  <FaUsers className="text-yellow-500" />
                  Cast ({show.castName.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {show.castName.map((cast, index) => (
                    <div key={cast._id || index} className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1.5">
                      {cast.castimage ? (
                        <img src={cast.castimage} alt={cast.castname} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                          {cast.castname?.charAt(0)}
                        </div>
                      )}
                      <span className="text-white text-sm">{cast.castname}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {show.hashtags && show.hashtags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                  <FaHashtag className="text-yellow-500" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {show.hashtags.map((tag, index) => (
                    <span key={tag._id || index} className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-sm">
                      #{tag.Tagname || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {show.trailerurl && (
              <div className="mb-6">
                <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                  <FaPlay className="text-yellow-500" />
                  Trailer
                </h4>
                <video
                  src={show.trailerurl}
                  controls
                  className="w-full rounded-lg max-h-64"
                  poster={show.Posterurl}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose()
                  setConfirmPublish(show)
                }}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaRocket />
                Publish Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Confirm Publish Modal
  const ConfirmPublishModal = ({ show, onConfirm, onCancel, isPublishing }) => {
    if (!show) return null

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRocket className="text-4xl text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Publish Show</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to publish <span className="text-yellow-400 font-semibold">"{show.title}"</span>?
              This will make the show visible to all users on the platform.
            </p>

            {/* Show Preview Card */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 flex items-center gap-4">
              {show.Posterurl ? (
                <img src={show.Posterurl} alt={show.title} className="w-16 h-24 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-24 rounded-lg bg-gray-700 flex items-center justify-center">
                  <MdMovie className="text-2xl text-gray-500" />
                </div>
              )}
              <div className="text-left flex-1">
                <h4 className="text-white font-semibold line-clamp-1">{show.title}</h4>
                <p className="text-gray-400 text-sm">{show.genre?.name || 'N/A'}</p>
                <p className="text-gray-500 text-xs mt-1">{formatDate(show.releasedate)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isPublishing}
                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(show._id)}
                disabled={isPublishing}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show Card Component
  const ShowCard = ({ show, isVerified }) => {
    const isExpanded = expandedCard === show._id

    return (
      <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group">
        {/* Poster */}
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

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm text-gray-300 line-clamp-2">{show.tagline || 'No tagline'}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isVerified ? (
              <span className="bg-green-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <MdVerified />
                Verified
              </span>
            ) : (
              <span className="bg-orange-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <MdPending />
                Pending
              </span>
            )}
          </div>

          {/* Genre Badge */}
          {show.genre?.name && (
            <div className="absolute top-3 left-3">
              <span className="bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
                {show.genre.name}
              </span>
            </div>
          )}

          {/* Preview Button */}
          <button
            onClick={() => {
              setSelectedShow(show)
              setShowPreview(true)
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
              <FaEye className="text-2xl text-white" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{show.title}</h3>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-yellow-500" />
              <span>{formatDate(show.releasedate)}</span>
            </div>
            {show.movieDuration && (
              <div className="flex items-center gap-1">
                <FaClock className="text-yellow-500" />
                <span>{formatDuration(show.movieDuration)}</span>
              </div>
            )}
          </div>

          {/* Expandable Details */}
          <button
            onClick={() => setExpandedCard(isExpanded ? null : show._id)}
            className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 text-sm mt-3 transition-colors"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            {isExpanded ? 'Less details' : 'More details'}
          </button>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2 text-sm">
              {show.directorname && show.directorname.length > 0 && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Director:</span> {show.directorname.join(', ')}
                </p>
              )}
              {show.producername && show.producername.length > 0 && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Producer:</span> {show.producername.join(', ')}
                </p>
              )}
              {show.language && show.language.length > 0 && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Language:</span> {show.language.map(l => l.name).join(', ')}
                </p>
              )}
              {show.totalbudget && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Budget:</span> {show.totalbudget}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          {isVerified ? (
            <button
              onClick={() => setConfirmPublish(show)}
              disabled={publishingId === show._id}
              className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
            >
              {publishingId === show._id ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FaRocket />
                  Publish Show
                </>
              )}
            </button>
          ) : (
            <div className="mt-4 w-full bg-gray-700/50 text-gray-400 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
              <FaExclamationTriangle className="text-orange-400" />
              Awaiting Verification
            </div>
          )}
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
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
            <FaUpload className="text-2xl text-yellow-500" />
            <h1 className="text-2xl md:text-3xl font-bold">Upload Shows</h1>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
              <MdVerified className="text-green-400 text-xl" />
              <div>
                <p className="text-xs text-gray-400">Ready to Publish</p>
                <p className="text-lg font-bold text-green-400">{verifiedShows.length}</p>
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
              <MdPending className="text-orange-400 text-xl" />
              <div>
                <p className="text-xs text-gray-400">Pending Review</p>
                <p className="text-lg font-bold text-orange-400">{pendingShows.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('verified')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'verified'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <MdVerified />
          Ready to Publish ({filteredVerifiedShows?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'pending'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <MdPending />
          Pending Verification ({filteredPendingShows?.length || 0})
        </button>
      </div>

      {/* Info Banner */}
      {activeTab === 'verified' ? (
        <div className="mb-6 p-4 rounded-lg border bg-green-500/10 border-green-500/30">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-2xl text-green-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-300">Ready to Publish</h3>
              <p className="text-sm text-gray-400">
                These shows have been verified by the admin and are ready to be published.
                Once published, they will be visible to all users on the platform.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-lg border bg-orange-500/10 border-orange-500/30">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-2xl text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-300">Pending Admin Verification</h3>
              <p className="text-sm text-gray-400">
                These shows are waiting for admin verification. Once verified, they will appear
                in the "Ready to Publish" section and you can publish them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shows Grid */}
      {activeTab === 'verified' ? (
        filteredVerifiedShows && filteredVerifiedShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVerifiedShows.map((show) => (
              <ShowCard key={show._id} show={show} isVerified={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
              <FaCheckCircle className="text-8xl text-green-500/30 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">No Shows Ready</h2>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? 'No verified shows match your search.'
                  : 'There are no verified shows ready to publish. Wait for admin to verify your shows.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        filteredPendingShows && filteredPendingShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPendingShows.map((show) => (
              <ShowCard key={show._id} show={show} isVerified={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
              <MdPending className="text-8xl text-orange-500/30 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">No Pending Shows</h2>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? 'No pending shows match your search.'
                  : 'All your shows have been verified or there are no shows pending verification.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* Preview Modal */}
      {showPreview && selectedShow && (
        <PreviewModal
          show={selectedShow}
          onClose={() => {
            setShowPreview(false)
            setSelectedShow(null)
          }}
        />
      )}

      {/* Confirm Publish Modal */}
      {confirmPublish && (
        <ConfirmPublishModal
          show={confirmPublish}
          onConfirm={handlePublish}
          onCancel={() => setConfirmPublish(null)}
          isPublishing={publishingId === confirmPublish._id}
        />
      )}
    </div>
  )
}

export default UploadShow
