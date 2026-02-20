import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaClock,
     FaLanguage,
     FaSearch,
     FaPlay,
     FaTimes,
     FaFilm,
     FaUsers,
     FaHashtag,
     FaEye,
     FaChevronDown,
     FaChevronUp,
     FaMoneyBillWave,
     FaFilter,
     FaSync
   } from 'react-icons/fa'
   import { MdMovie, MdVerified, MdPending, MdGavel, MdList, MdCheckCircle, MdCancel } from 'react-icons/md'
   import { BiCategory } from 'react-icons/bi'
   import { HiShieldCheck } from 'react-icons/hi'
   import {
     GetUnverifiedShows,
     GetVerifiedShowsAdmin,
     GetAllShowsAdmin,
     VerifyShowAdmin
   } from '../../Services/operations/Admin'
    const VerifyShows = () => {
      const dispatch = useDispatch()
      const navigate = useNavigate()
      const { token } = useSelector((state) => state.auth)
      const { loading, verifiedShows, unverifiedShows, adminAllShows, verifyingShowId } = useSelector((state) => state.show)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null) // { show, action: 'verify' | 'reject' }
  const [activeTab, setActiveTab] = useState('unverified') // 'all', 'verified', 'unverified'
  const [expandedCard, setExpandedCard] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // For "All Shows" tab filtering

  // console.log(confirmAction)

  const fetchShows = async () => {
    if (!token) return

    if (activeTab === 'unverified') {
      await dispatch(GetUnverifiedShows(token, navigate))
    } else if (activeTab === 'verified') {
      await dispatch(GetVerifiedShowsAdmin(token, navigate))
    } else {
      await dispatch(GetAllShowsAdmin(token, navigate))
    }
  }

  useEffect(() => {
    fetchShows()
  }, [activeTab, token])

  // Get current shows based on tab
  const getCurrentShows = () => {
    switch (activeTab) {
      case 'verified':
        return verifiedShows
      case 'unverified':
        return unverifiedShows
      case 'all':
        if (filterStatus === 'verified') {
          return adminAllShows.filter(s => s.VerifiedByTheAdmin)
        } else if (filterStatus === 'unverified') {
          return adminAllShows.filter(s => !s.VerifiedByTheAdmin)
        }
           return adminAllShows
         default:
           return []
       }
     }
   
     // Filter shows based on search
     const filterShows = (shows) => {
       return shows?.filter(show => {
         const matchesSearch = show.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               show.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
         return matchesSearch
       })
     }
   
     const currentShows = getCurrentShows()
     const filteredShows = filterShows(currentShows)
   
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
  
    // Handle verify/reject show
    const handleVerification = async (showId, shouldVerify) => {
      const result = await dispatch(VerifyShowAdmin(token, showId, shouldVerify, navigate))
      if (result?.success) {
        setConfirmAction(null)
        // Refresh the current tab data
        fetchShows()
      }
    }
  
    // Preview Modal
    const PreviewModal = ({ show, onClose }) => {
      if (!show) return null

      const Shows =  Object.values(show);

const entriesArray = Object.entries(show);

// console.log(entriesArray);
      // console.log(Shows)
  
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative">
              {show.Posterurl ? (
                <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                  <img
                    src={Shows[8]}
                    alt={Shows[1]}
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
                {show.VerifiedByTheAdmin ? (
                  <span className="bg-green-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                    <MdVerified className="text-lg" />
                    Verified
                  </span>
                ) : (
                  <span className="bg-orange-500/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                    <MdPending className="text-lg" />
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
  
            {/* Content */}
            <div className="p-6">
              {/* Title & Tagline */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{Shows[1]}</h2>
              <p className="text-gray-400 mb-6">{Shows[2]}</p>
  
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <FaCalendarAlt />
                    <span className="text-xs text-gray-400">Release Date</span>
                  </div>
                  <p className="text-white font-semibold">{formatDate(Shows[3])}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <FaClock />
                    <span className="text-xs text-gray-400">Duration</span>
                  </div>
                  <p className="text-white font-semibold">{formatDuration(Shows[27] || Shows[7]
      )}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <BiCategory />
                    <span className="text-xs text-gray-400">Genre</span>
                  </div>
                  <p className="text-white font-semibold">{Shows[4].genreName || Shows[4].genreName || 'N/A'}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <FaLanguage />
                    <span className="text-xs text-gray-400">Language</span>
                  </div>
                  <p className="text-white font-semibold">
                    {Shows[6]?.map(l => l.name || l.langname).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
  
              {/* Budget & Show Type */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-500 mb-1">
                    <FaMoneyBillWave />
                    <span className="text-xs text-gray-400">Total Budget</span>
                  </div>
                  <p className="text-white font-semibold">{Shows[25] || 'N/A'}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-500 mb-1">
                    <FaFilm />
                    <span className="text-xs text-gray-400">Show Type</span>
                  </div>
                  <p className="text-white font-semibold">{Shows[10] || 'Theatre'}</p>
                </div>
              </div>
  
              {/* Crew Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Shows.directorname && Shows.directorname.length > 0 && (
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Director</h4>
                    <p className="text-white">{Shows.directorname.join(', ')}</p>
                  </div>
                )}
                {Shows.producername && Shows.producername.length > 0 && (
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Producer</h4>
                    <p className="text-white">{Shows.producername.join(', ')}</p>
                  </div>
                )}
                {Shows.writersname && Shows.writersname.length > 0 && (
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Writers</h4>
                    <p className="text-white">{Shows.writersname.join(', ')}</p>
                  </div>
                )}
              </div>
  
              {/* Cast */}
              {Shows.castName && Shows.castName.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                    <FaUsers className="text-yellow-500" />
                    Cast ({Shows.castName.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Shows.castName.map((cast, index) => (
                      <div key={cast._id || index} className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1.5">
                        {cast.castimage ? (                        <img src={cast.castimage} alt={cast.castname} className="w-6 h-6 rounded-full object-cover" />
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
              {Shows.hashtags && Shows.hashtags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                    <FaHashtag className="text-yellow-500" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Shows.hashtags.map((tag, index) => (
                      <span key={index} className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-sm">
                        #{tag.Tagname || tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Trailer */}
              {Shows.trailerurl && (
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                    <FaPlay className="text-yellow-500" />
                    Trailer
                  </h4>
                  <video
                    src={Shows.trailerurl}
                    controls
                    className="w-full rounded-lg max-h-64"
                    poster={Shows.Posterurl}
                  />
                </div>
              )}
  
              {/* Verification Info */}
              {Shows.VerificationTime && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400">
                    <MdVerified />
                    <span className="text-sm">Verified on: {formatDate(Shows.VerificationTime)}</span>
                  </div>
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
                {!show.VerifiedByTheAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onClose()
                        setConfirmAction({ Shows, action: 'reject' })
                      }}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        onClose()
                        setConfirmAction({ Shows, action: 'verify' })
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Verify
                  </button>
                </>
              )}
              {Shows.VerifiedByTheAdmin && (
                <button
                  onClick={() => {
                    onClose()
                    setConfirmAction({ Shows, action: 'reject' })
                  }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 fo-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MdCancel />
                  Revoke Verification
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
  
    // Confirm Action Modal
    const ConfirmActionModal = ({ show, action, onConfirm, onCancel, isProcessing }) => {
      if (!show) return null
  
      // console.log(show)
      const isVerify = action === 'verify'
  
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isVerify
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                  : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
              }`}>
                {isVerify ? (
                  <HiShieldCheck className="text-4xl text-green-500" />
                ) : (
                  <MdCancel className="text-4xl text-red-500" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isVerify ? 'Verify Show' : 'Reject Show'}
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to {isVerify ? 'verify' : 'reject'}{' '}
                <span className={`font-semibold ${isVerify ? 'text-green-400' : 'text-red-400'}`}>
                  "{show.title}"
                </span>?
                {isVerify
                  ? ' This will allow the organizer to publish the show.'
                  : ' This will require the organizer to make changes before resubmitting.'}
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
                  <p className="text-gray-400 text-sm">{show.genre?.genreName || show.genre?.name || 'N/A'}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatDate(show.releasedate)}</p>
                </div>
              </div>
  
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(show._id, isVerify)}
                  disabled={isProcessing}
                  className={`flex-1 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isVerify
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white'
                  } disabled:opacity-50`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isVerify ? <FaCheckCircle /> : <FaTimesCircle />}
                      {isVerify ? 'Verify' : 'Reject'}
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
    const ShowCard = ({ show }) => {
      const isExpanded = expandedCard === show._id
      const isVerified = show.VerifiedByTheAdmin
      const isProcessing = verifyingShowId === show._id
  
      return (
        <div className={`bg-[#1a1a2e] border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-l
      +g group ${
          isVerified
            ? 'border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/10'
            : 'border-orange-500/30 hover:border-orange-500/50 hover:shadow-orange-500/10'
        }`}>
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
            {(show.genre?.genreName || show.genre?.name) && (
              <div className="absolute top-3 left-3">
                <span className="bg-yellow-500/90 text-black px-2 py-1 rounded text-xs font-semibold">
                  {show.genre?.genreName || show.genre?.name}
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
              {(show.movieDuration || show.TotalDuration) && (
                <div className="flex items-center gap-1">
                  <FaClock className="text-yellow-500" />
                  <span>{formatDuration(show.movieDuration || show.TotalDuration)}</span>
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
                    <span className="text-gray-500">Language:</span> {show.language.map(l => l.name || l.langname).join(', ')}
                  </p>
                )}
                {show.totalbudget && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Budget:</span> {show.totalbudget}
                  </p>
                )}
                {show.showType && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Type:</span> {show.showType}
                  </p>
                )}
              </div>
            )}
  
            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              {!isVerified ? (
                <>
                  <button
                    onClick={() => setConfirmAction({ show, action: 'reject' })}
                    disabled={isProcessing}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                  >
                    <FaTimesCircle />
                    Reject
                  </button>
                  <button
                    onClick={() => setConfirmAction({ show, action: 'verify' })}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaCheckCircle />
                    )}
                    Verify
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmAction({ show, action: 'reject' })}
                  disabled={isProcessing}
                  className="w-full bg-gray-700/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-500/50 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <MdCancel />
                  Revoke Verification
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }
  
    // Tab configuration
    const tabs = [
      {
        id: 'unverified',
        label: 'Unverified Shows',
        icon: MdPending,
        color: 'orange',
        count: unverifiedShows?.length || 0
      },
      {
        id: 'verified',
        label: 'Verified Shows',
        icon: MdVerified,
        color: 'green',
        count: verifiedShows?.length || 0
      },
      {
        id: 'all',
        label: 'All Shows',
        icon: MdList,
        color: 'blue',
        count: adminAllShows?.length || 0
      }
    ]
  
    // Loading State
    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" /
  >
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
              <MdGavel className="text-2xl text-yellow-500" />
              <h1 className="text-2xl md:text-3xl font-bold">Show Verification</h1>
            </div>
  
            {/* Stats */}
            <div className="flex gap-3">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <MdPending className="text-orange-400 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="text-lg font-bold text-orange-400">{unverifiedShows?.length || 0}</p>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <MdVerified className="text-green-400 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Verified</p>
                  <p className="text-lg font-bold text-green-400">{verifiedShows?.length || 0}</p>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <MdList className="text-blue-400 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-blue-400">{adminAllShows?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Search and Refresh */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 w-full"
              />
            </div>
  
            {/* Filter for All Shows tab */}
            {activeTab === 'all' && (
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
              </select>
            </div>
          )}

          <button
            onClick={fetchShows}
            disabled={loading}
            className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg px-4 py-2 text-gray-400 hover:text-yeow-500 hover:border-yellow-500/50 transition-colors flex items-center gap-2"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespacnowrap ${
              activeTab === tab.id
                ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/50`
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? `rgba(var(--${tab.color}-rgb), 0.2)` : undefined,
              borderColor: activeTab === tab.id ? `rgba(var(--${tab.color}-rgb), 0.5)` : undefined
            }}
          >
            <tab.icon />
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Info Banner */}
      {activeTab === 'unverified' && (
        <div className="mb-6 p-4 rounded-lg border bg-orange-500/10 border-orange-500/30">
          <div className="flex items-start gap-3">
            <MdPending className="text-2xl text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-300">Pending Verification</h3>
              <p className="text-sm text-gray-400">
                These shows are waiting for your verification. Review them carefully and verify or reject bason content quality and guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verified' && (
        <div className="mb-6 p-4 rounded-lg border bg-green-500/10 border-green-500/30">
          <div className="flex items-start gap-3">
            <MdVerified className="text-2xl text-green-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-300">Verified Shows</h3>
              <p className="text-sm text-gray-400">
                These shows have been verified and organizers can now publish them. You can revoke verificatiif needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="mb-6 p-4 rounded-lg border bg-blue-500/10 border-blue-500/30">
          <div className="flex items-start gap-3">
            <MdList className="text-2xl text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-300">All Shows</h3>
              <p className="text-sm text-gray-400">
                Complete list of all shows in the system. Use the filter to view specific status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shows Grid */}
      {filteredShows && filteredShows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShows.map((show) => (
            <ShowCard key={show._id} show={show} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-12 text-center max-w-md">
            {activeTab === 'unverified' ? (
              <>
                <MdCheckCircle className="text-8xl text-green-500/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-3">All Caught Up!</h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? 'No unverified shows match your search.'
                    : 'There are no shows pending verification. Great job!'}
                </p>
              </>
            ) : activeTab === 'verified' ? (
              <>
                <MdVerified className="text-8xl text-green-500/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-3">No Verified Shows</h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? 'No verified shows match your search.'
                    : 'No shows have been verified yet.'}
                </p>
              </>
            ) : (
              <>
                <FaFilm className="text-8xl text-blue-500/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-3">No Shows Found</h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? 'No shows match your search criteria.'
                    : 'There are no shows in the system yet.'}
                </p>
              </>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg traition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
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
{/* console.log(confirmAction) */}
      {/* Confirm Action Modal */}
     {confirmAction && (
  <ConfirmActionModal
    show={confirmAction.show}
    action={confirmAction.action}
    onConfirm={(id, shouldVerify) =>
      handleVerification(id, shouldVerify)
    }
    onCancel={() => setConfirmAction(null)}
    isProcessing={verifyingShowId === confirmAction.show._id}
  />
)}

    </div>
  )
}

export default VerifyShows