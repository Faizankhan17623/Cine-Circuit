import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { MdGavel, MdVerified, MdPending, MdList, MdCheckCircle, MdLocationOn, MdClose, MdImage, MdPerson, MdEmail, MdPhone, MdTheaters, MdLanguage, MdMovie } from 'react-icons/md'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import { BiRefresh } from 'react-icons/bi'
import { AiOutlineZoomIn } from 'react-icons/ai'
import { GetAllTheatreDetails,VerifyTheatres } from '../../Services/operations/Admin'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loader from '../extra/Loading'
import { MdLocalParking } from "react-icons/md";
import toast from 'react-hot-toast'

const VerifyTheatre = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [users, setUsers] = useState([])
  const [theatrer, setTheatrer] = useState([])
  const [verified, setVerified] = useState([])
  const [unverified, setUnverified] = useState([])
  const [activeTab, setActiveTab] = useState("unverified")
  const [selectedTheatre, setSelectedTheatre] = useState(null)
  const [zoomedImage, setZoomedImage] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Check if token exists before fetching
    if (!token) {
      setFetchError("You are not logged in. Please login to continue.")
      toast.error("Session expired. Please login again.")
      navigate("/Login")
      return
    }

    const fetchTheatres = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const response = await dispatch(GetAllTheatreDetails(token, navigate))

        if (response?.success) {
          setUsers(response.data.data.data || [])
          setTheatrer(response.data.data.users || [])
          setUnverified(response.data.data.unverified || [])
          setVerified(response.data.data.verified || [])

          // Check if there's a theatre ID in URL
          const theatreId = searchParams.get('theatre')
          if (theatreId) {
            const allTheatres = response.data.data.data || []
            const theatre = allTheatres.find(t => t._id === theatreId)
            if (theatre) {
              setSelectedTheatre(theatre)
            }
          }
        } else {
          setFetchError(response?.error || "Failed to fetch theatre data")
        }
      } catch (error) {
        console.error("Fetch error:", error)
        setFetchError(error?.message || "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTheatres()
  }, [dispatch, token, navigate])

  // Refresh handler
  const handleRefresh = async () => {
    if (!token) {
      toast.error("Session expired. Please login again.")
      navigate("/Login")
      return
    }

    setRefreshing(true)
    setFetchError(null)
    try {
      const response = await dispatch(GetAllTheatreDetails(token, navigate))
      if (response?.success) {
        setUsers(response.data.data.data || [])
        setTheatrer(response.data.data.users || [])
        setUnverified(response.data.data.unverified || [])
        setVerified(response.data.data.verified || [])
        toast.success("Data refreshed successfully")
      } else {
        toast.error(response?.error || "Failed to refresh data")
      }
    } catch (error) {
      console.error("Refresh error:", error)
      toast.error("Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  const handleViewDetails = (theatre) => {
    setSelectedTheatre(theatre)
    setSearchParams({ theatre: theatre._id })
  }

  const handleCloseModal = () => {
    setSelectedTheatre(null)
    setSearchParams({})
  }

const handleAccept = async (theatre, verification) => {
  // IMPORTANT: Backend expects User ID (Owner), not Theatre ID
  const ownerId = theatre.Owner

  if (!ownerId) {
    const errorMsg = "Owner information not found for this theatre"
    setError(errorMsg)
    toast.error(errorMsg)
    console.error("Missing Owner ID:", theatre)
    return
  }

  if (!token) {
    const errorMsg = "Authentication token not found. Please login again."
    setError(errorMsg)
    toast.error("Session expired. Please login again.")
    console.error("Token missing from Redux state")
    navigate("/Login")
    return
  }

  setActionLoading(true)
  setError(null)

  try {
    // console.log("Sending verification request:", { ownerId, verification, hasToken: !!token })

    const response = await dispatch(
      VerifyTheatres(token, navigate, ownerId, verification)
    )

    console.log("Verification response:", response)
// 
    if (response?.reason === "NO_TOKEN") {
      const errorMsg = "Authentication token expired or invalid"
      setError(errorMsg)
      toast.error("Session expired. Please login again.")
      navigate("/Login")
      return
    }

    if (!response?.success) {
      const errorMsg = response?.message || "Verification failed. Please try again."
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    toast.success("Theatre accepted successfully")

    // CLOSE MODAL
    setSelectedTheatre(null)
    setSearchParams({})

    // REFRESH LIST
    const refreshResponse = await dispatch(GetAllTheatreDetails(token, navigate))
    if (refreshResponse?.success) {
      setUsers(refreshResponse.data.data.data || [])
      setTheatrer(refreshResponse.data.data.users || [])
      setUnverified(refreshResponse.data.data.unverified || [])
      setVerified(refreshResponse.data.data.verified || [])
    }

  } catch (error) {
    console.error("Accept theatre error:", error)
    const errorMsg = error?.response?.data?.message || error.message || "Failed to verify theatre"
    setError(errorMsg)
    toast.error(errorMsg)
  } finally {
    setActionLoading(false)
  }
}

const handleReject = async (theatre, verification) => {
  // IMPORTANT: Backend expects User ID (Owner), not Theatre ID
  const ownerId = theatre.Owner

  if (!ownerId) {
    const errorMsg = "Owner information not found for this theatre"
    setError(errorMsg)
    toast.error(errorMsg)
    // console.error("Missing Owner ID:", theatre)
    return
  }

  if (!token) {
    const errorMsg = "Authentication token not found. Please login again."
    setError(errorMsg)
    toast.error("Session expired. Please login again.")
    // console.error("Token missing from Redux state")
    navigate("/Login")
    return
  }

  setActionLoading(true)
  setError(null)

  try {
    // console.log("Sending rejection request:", { ownerId, verification, hasToken: !!token })

    const response = await dispatch(
      VerifyTheatres(token, navigate, ownerId, Boolean(verification))
    )

    // console.log("Rejection response:", response)

    if (response?.reason === "NO_TOKEN") {
      const errorMsg = "Authentication token expired or invalid"
      setError(errorMsg)
      toast.error("Session expired. Please login again.")
      navigate("/Login")
      return
    }

    if (!response?.success) {
      const errorMsg = response?.message || "Rejection failed. Please try again."
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    toast.success("Theatre rejected successfully")

    // CLOSE MODAL
    setSelectedTheatre(null)
    setSearchParams({})

    // REFRESH LIST
    const refreshResponse = await dispatch(GetAllTheatreDetails(token, navigate))
    if (refreshResponse?.success) {
      setUsers(refreshResponse.data.data.data || [])
      setTheatrer(refreshResponse.data.data.users || [])
      setUnverified(refreshResponse.data.data.unverified || [])
      setVerified(refreshResponse.data.data.verified || [])
    }

  } catch (error) {
    console.error("Reject theatre error:", error)
    const errorMsg = error?.response?.data?.message || error.message || "Failed to reject theatre"
    setError(errorMsg)
    toast.error(errorMsg)
  } finally {
    setActionLoading(false)
  }
}


  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  // Show error state if fetch failed
  if (fetchError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-6">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">{fetchError}</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all flex items-center gap-2 mx-auto"
          >
            {refreshing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <BiRefresh className="text-xl" />
            )}
            {refreshing ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  const activeTabClass = "bg-orange-600/20 border-2 border-orange-600 text-orange-500"
  const inactiveTabClass = "bg-gray-800/30 border border-gray-700 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"

  // Image Zoom Modal
  const ImageZoomModal = ({ image, onClose }) => {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-gray-800/80 hover:bg-gray-700 rounded-full p-3 transition-all"
        >
          <MdClose className="text-2xl" />
        </button>
        <img 
          src={image} 
          alt="Zoomed" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  // Detail Modal
  const TheatreDetailModal = ({ theatre, details ,onClose }) => {
    if (!theatre) return null
    // console.log(theatre,"This isth etheatre details")
    // console.log("This isth euser details",details[2])

    const SamwDetails = details.filter((id)=>{
      return theatre.Owner === id._id || theatre._id === id.theatresCreated
    })

    // console.log(theatre)

    // console.log("This isth e dame details date",SamwDetails)
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-[80%] max-w-7xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl my-8">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MdTheaters className="text-5xl text-yellow-500" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{theatre.Theatrename}</h2>
                  <div className="flex items-center gap-4">
                    {theatre.Verified ? (
                      <span className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-900/30 px-3 py-1 rounded-full border border-green-700/50">
                        <MdVerified className="text-lg" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-orange-400 text-sm font-medium bg-orange-900/30 px-3 py-1 rounded-full border border-orange-700/50">
                        <MdPending className="text-lg" /> Unverified
                      </span>
                    )}
                    <span className="text-gray-400 text-sm">Created: {theatre.CreationDate}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition-all"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Owner Information */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MdPerson className="text-3xl text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Owner Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                      <img 
                        src={theatre.Owner?.image || "https://ui-avatars.com/api/?name=" + theatre.TheatreOwner} 
                        alt="Owner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      {/* SamwDetails */}
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white text-lg font-semibold">{theatre.TheatreOwner}</p>
                      <p className="text-gray-400 text-sm mt-1">@{SamwDetails[0]?.userName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <MdEmail /> Email Address
                    </p>
                    <p className="text-white font-medium">{SamwDetails[0]?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <MdPhone /> Contact Number
                    </p>
                    <p className="text-white font-medium">
                      {SamwDetails[0]?.countrycode || ''} {SamwDetails[0]?.number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Theatre Details */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MdTheaters className="text-3xl text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Theatre Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt /> Location Name
                  </p>
                  <p className="text-white font-medium mb-2">{theatre.locationName}</p>
                  <a 
                    href={theatre.locationurl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    View on Map →
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <MdMovie /> Theatre Formats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.theatreformat?.map((format, idx) => (
                      <span key={idx} className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm border border-purple-700/50">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Screening Types</p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.movieScreeningType?.map((type, idx) => (
                      <span key={idx} className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-700/50">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <MdLanguage /> Available Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.languagesAvailable?.map((lang, idx) => (
                      <span key={idx} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm border border-green-700/50">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Seat Types</p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.typesofseatsAvailable?.map((seat, idx) => (
                      <span key={idx} className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-700/50">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <MdLocalParking /> Parking Facilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.parking?.map((park, idx) => (
                      <span key={idx} className="bg-orange-900/30 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-700/50">
                        {park}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Theatre Outside Images */}
            {theatre.Theatreoutsideimages?.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MdImage className="text-3xl text-pink-400" />
                  <h3 className="text-2xl font-bold text-white">Theatre Outside Images</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {theatre.Theatreoutsideimages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative group cursor-pointer aspect-video rounded-lg overflow-hidden border-2 border-gray-700 hover:border-pink-500/50 transition-all"
                      onClick={() => setZoomedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`Outside ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <AiOutlineZoomIn className="text-white text-3xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theatre Inside Images */}
            {theatre.TheatreInsideimages?.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MdImage className="text-3xl text-cyan-400" />
                  <h3 className="text-2xl font-bold text-white">Theatre Inside Images</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {theatre.TheatreInsideimages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative group cursor-pointer aspect-video rounded-lg overflow-hidden border-2 border-gray-700 hover:border-cyan-500/50 transition-all"
                      onClick={() => setZoomedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`Inside ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <AiOutlineZoomIn className="text-white text-3xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Action Buttons */}
          {!theatre.Verified && (
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 px-8 py-6 rounded-b-2xl">
              {/* Error Display */}
              {error && (
                <div className="mb-4 bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-center gap-3">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <div className="flex-1">
                    <p className="text-red-400 font-medium">Action Failed</p>
                    <p className="text-red-300/80 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <MdClose />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleReject(theatre, false)}
                  disabled={actionLoading}
                  className={`px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {actionLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdClose className="text-xl" />
                  )}
                  {actionLoading ? 'Processing...' : 'Reject Theatre'}
                </button>
                <button
                  onClick={() => handleAccept(theatre, true)}
                  disabled={actionLoading}
                  className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {actionLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdCheckCircle className="text-xl" />
                  )}
                  {actionLoading ? 'Processing...' : 'Accept Theatre'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const TheatreCard = ({ theatre, isUnverified = false }) => {
    // console.log("This is the theatre date",theatre)
    return (
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-800/30 border border-gray-700 rounded-xl p-5 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {theatre.Theatrename}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <MdLocationOn className="text-yellow-500" />
              {theatre.locationName}
            </div>
          </div>

          {theatre.Verified ? (
            <span className="flex items-center gap-1 text-green-400 text-sm font-medium bg-green-900/30 px-2 py-1 rounded-md border border-green-700/50">
              <MdVerified /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-orange-400 text-sm font-medium bg-orange-900/30 px-2 py-1 rounded-md border border-orange-700/50">
              <MdPending /> Pending
            </span>
          )}
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 space-y-2 mb-4">
          <p className="flex items-start gap-2">
            <span className="text-gray-300 font-medium min-w-[70px]">Owner:</span> 
            <span>{theatre.TheatreOwner}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-gray-300 font-medium min-w-[70px]">Formats:</span> 
            <span>{theatre.theatreformat?.join(", ")}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-gray-300 font-medium min-w-[70px]">Screens:</span> 
            <span>{theatre.movieScreeningType?.join(", ")}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-gray-300 font-medium min-w-[70px]">Languages:</span> 
            <span>{theatre.languagesAvailable?.join(", ")}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
          <span className="text-xs text-gray-500">
            Created {theatre.CreationDate}
          </span>

          {(isUnverified || !theatre.Verified) && (
            <button 
              onClick={() => handleViewDetails(theatre)}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/50 rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
            >
              Know More →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      {/* Header with Stats */}
      <div className='flex items-start justify-between mb-8'>
        {/* Title */}
        <div className='flex items-center gap-3'>
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/50">
            <MdGavel className="text-4xl text-yellow-500" />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-white'>Theatre Verification</h1>
            <p className="text-gray-400 text-sm mt-1">Review and manage theatre registrations</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='flex gap-4'>
          {/* Pending Card */}
          <div className='bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-700/50 rounded-xl px-6 py-4 min-w-[140px] hover:border-orange-600 transition-all shadow-lg'>
            <div className='flex items-center gap-2 text-orange-400 text-sm font-medium mb-1'>
              <MdPending className="text-xl" />
              <span>Pending</span>
            </div>
            <div className='text-3xl font-bold text-orange-500'>{unverified.length || 0}</div>
          </div>

          {/* Verified Card */}
          <div className='bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-700/50 rounded-xl px-6 py-4 min-w-[140px] hover:border-green-600 transition-all shadow-lg'>
            <div className='flex items-center gap-2 text-green-400 text-sm font-medium mb-1'>
              <MdVerified className="text-xl" />
              <span>Verified</span>
            </div>
            <div className='text-3xl font-bold text-green-500'>{verified.length || 0}</div>
          </div>

          {/* Total Card */}
          <div className='bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700/50 rounded-xl px-6 py-4 min-w-[140px] hover:border-blue-600 transition-all shadow-lg'>
            <div className='flex items-center gap-2 text-blue-400 text-sm font-medium mb-1'>
              <MdList className="text-xl" />
              <span>Total</span>
            </div>
            <div className='text-3xl font-bold text-blue-500'>{users.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className='flex gap-4 mb-6'>
        <div className='flex-1 relative'>
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search theatres by name, owner, or location..."
            className='w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all'
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 bg-gray-800/50 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-white transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {refreshing ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <BiRefresh className="text-xl" />
          )}
          <span className='font-medium'>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className='flex gap-3 mb-6'>
        <button
          onClick={() => setActiveTab("unverified")}
          className={`flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-all
            ${activeTab === "unverified" ? activeTabClass : inactiveTabClass}`}
        >
          <MdPending className="text-xl" />
          <span>Unverified Theatres ({unverified.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("verified")}
          className={`flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-all
            ${activeTab === "verified" ? activeTabClass : inactiveTabClass}`}
        >
          <MdVerified className="text-xl" />
          <span>Verified Theatres ({verified.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-all
            ${activeTab === "all" ? activeTabClass : inactiveTabClass}`}
        >
          <MdList className="text-xl" />
          <span>All Theatres ({users.length || 0})</span>
        </button>
      </div>

      {/* Info Alerts - Only show when there's NO data */}
      {activeTab === "unverified" && unverified.length === 0 && (
        <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-700/50 rounded-xl p-5 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <MdCheckCircle className="text-3xl text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                All Clear!
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Great work! All theatres have been verified. No pending verifications at the moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "verified" && verified.length === 0 && (
        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-xl p-5 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <MdPending className="text-3xl text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                No Verified Theatres
              </h3>
              <p className="text-gray-400 leading-relaxed">
                No theatres have been verified yet. Start verifying pending theatres to see them here.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "all" && users.length === 0 && (
        <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-xl p-5 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <MdTheaters className="text-3xl text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                No Theatres Registered
              </h3>
              <p className="text-gray-400 leading-relaxed">
                No theatres have been registered yet. Theatres will appear here once they sign up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="w-full">
        {/* Unverified Tab */}
        {activeTab === "unverified" && (
          <>
            {unverified.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-900/40 to-green-800/20 border-4 border-green-700/50 rounded-full mb-6">
                    <MdCheckCircle className="text-6xl text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Pending Theatres
                  </h3>
                  <p className="text-gray-500">
                    All theatres have been verified
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {unverified.map((theatre) => (
                  <TheatreCard
                    key={theatre._id}
                    theatre={theatre}
                    isUnverified={true}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Verified Tab */}
        {activeTab === "verified" && (
          <>
            {verified.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-4 border-blue-700/50 rounded-full mb-6">
                    <MdVerified className="text-6xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Verified Theatres
                  </h3>
                  <p className="text-gray-500">
                    No theatres have been verified yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {verified.map((theatre) => (
                  <TheatreCard
                    key={theatre._id}
                    theatre={theatre}
                    isUnverified={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* All Tab */}
        {activeTab === "all" && (
          <>
            {users.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-4 border-purple-700/50 rounded-full mb-6">
                    <MdTheaters className="text-6xl text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Theatres
                  </h3>
                  <p className="text-gray-500">
                    No theatres have been created yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((theatre) => (
                  <TheatreCard
                    key={theatre._id}
                    theatre={theatre}
                    isUnverified={!theatre.Verified}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedTheatre && (
        <TheatreDetailModal 
          theatre={selectedTheatre} 
          details={theatrer}
          onClose={handleCloseModal}
        />
      )}

      {zoomedImage && (
        <ImageZoomModal 
          image={zoomedImage} 
          onClose={() => setZoomedImage(null)}
        />
      )}
    </div>
  )
}

export default VerifyTheatre