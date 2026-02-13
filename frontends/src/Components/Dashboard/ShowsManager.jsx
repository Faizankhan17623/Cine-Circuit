import React, { useEffect, useState, useRef } from 'react'
import { FaPlus, FaTrash, FaEdit, FaFilm, FaImage, FaVideo, FaPlay, FaTimes, FaUpload, FaLock, FaArrowLeft } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdBlock } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CreateNewShow,
  UpdateShowTitle,
  UpdateShowTagline,
  UpdateShowImage,
  UpdateShowTrailer,
  DeleteSingleShow,
  UploadShow,
  GetAllLanguagesForShow,
  GetAllGenresForShow,
  GetAllSubgenresForShow,
  GetNotUploadedShows,
  GetAllShows
} from '../../Services/operations/Shows'
import { GetAllTags } from '../../Services/operations/Tags'
import { GetAllCast } from '../../Services/operations/Cast'
import { setallShow } from '../../Slices/ShowSlice'
import Loader from '../extra/Loading'

const ShowsManager = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { token } = useSelector((state) => state.auth)
  const { allshows } = useSelector((state) => state.show)

  const imageInputRef = useRef(null)
  const trailerInputRef = useRef(null)
  const updateImageRef = useRef(null)
  const updateTrailerRef = useRef(null)

  // Data states
  const [shows, setShows] = useState([])
  const [genres, setGenres] = useState([])
  const [subgenres, setSubgenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [castList, setCastList] = useState([])
  const [tags, setTags] = useState([])

  // UI states
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedShow, setSelectedShow] = useState(null)
  const [editMode, setEditMode] = useState(null) // 'title', 'tagline', 'image', 'trailer'
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Image Zoom
  const [imageopen,setImageOpen] = useState(false)

  // Update loading state (separate from main loading)
  const [updating, setUpdating] = useState(false)

  // Form states for create
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    releasedate: '',
    genreid: '',
    subgenereid: '',
    languagename: '',
    directorname: '',
    producername: '',
    writersname: '',
    totalbudget: '',
    Duration: '',
    castid: [],
    hashid: ''
  })

  const [posterFile, setPosterFile] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [trailerFile, setTrailerFile] = useState(null)
  const [trailerPreview, setTrailerPreview] = useState(null)

  // Edit states
  const [editTitle, setEditTitle] = useState('')
  const [editTagline, setEditTagline] = useState('')
  const [updateShowId, setUpdateShowId] = useState(null)

  // Get show ID from URL params
  const showIdFromUrl = searchParams.get('showId')

  // Fetch all shows for organizer
  const fetchShows = async () => {
    setLoading(true)
    try {
      const response = await dispatch(GetNotUploadedShows(token, navigate))
      if (response?.success) {
        setShows(response.data || [])
        dispatch(setallShow(response.data || []))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all required data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [genreRes, subgenreRes, langRes, castRes, tagRes] = await Promise.all([
        dispatch(GetAllGenresForShow(token, navigate)),
        dispatch(GetAllSubgenresForShow(token, navigate)),
        dispatch(GetAllLanguagesForShow(token, navigate)),
        dispatch(GetAllCast(token, navigate)),
        dispatch(GetAllTags(token, navigate))
      ])

      if (genreRes?.success) setGenres(genreRes.data || [])
      if (subgenreRes?.success) setSubgenres(subgenreRes.data || [])
      if (langRes?.success) setLanguages(langRes.data || [])
      if (castRes?.success) setCastList(castRes.data || [])
      if (tagRes?.success) setTags(tagRes.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchAllData()
      fetchShows()
    }
  }, [token])

  useEffect(() => {
    if (allshows) setShows(allshows)
  }, [allshows])

  // Handle URL show ID change - select show when URL changes
  useEffect(() => {
    if (showIdFromUrl && shows.length > 0) {
      const show = shows.find(s => s._id === showIdFromUrl)
      if (show) {
        setSelectedShow(show)
      }
    } else if (!showIdFromUrl) {
      setSelectedShow(null)
    }
  }, [showIdFromUrl, shows])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle cast selection (multi-select)
  const handleCastSelect = (castId) => {
    setFormData(prev => ({
      ...prev,
      castid: prev.castid.includes(castId)
        ? prev.castid.filter(id => id !== castId)
        : [...prev.castid, castId]
    }))
  }

  // Handle poster change
  const handlePosterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)')
        return
      }
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  // Handle trailer change
  const handleTrailerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/mpeg'].includes(file.type)) {
        toast.error('Please select a valid video file (MP4, MOV, MKV, or MPEG)')
        return
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file must be less than 100MB')
        return
      }
      setTrailerFile(file)
      setTrailerPreview(URL.createObjectURL(file))
    }
  }

  // Create new show
  const handleCreateShow = async () => {
    if (!formData.title.trim()) return toast.error('Title is required')
    if (!formData.tagline.trim()) return toast.error('Tagline is required')
    if (!formData.releasedate) return toast.error('Release date is required')
    if (!formData.genreid) return toast.error('Genre is required')
    if (!formData.languagename) return toast.error('Language is required')
    if (!formData.castid) return toast.error('cast id  is required')
    if (!posterFile) return toast.error('Poster image is required')
    if (!formData.totalbudget) return toast.error('total budget is required')

    // Format date from YYYY-MM-DD (HTML date input format) to DD/MM/YYYY (backend expected format)
    const [year, month, day] = formData.releasedate.split('-')
    const formattedDate = `${day}/${month}/${year}`

    const dataToSend = { ...formData, releasedate: formattedDate }
    const response = await dispatch(CreateNewShow(token, dataToSend, posterFile, trailerFile, navigate))
    if (response?.success) {
      // Add new show to the list
      setShows(prev => [response.data, ...prev])
      dispatch(setallShow([response.data, ...shows]))
      resetForm()
      setShowCreateForm(false)
      toast.success('Show created successfully!')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      tagline: '',
      releasedate: '',
      genreid: '',
      subgenereid: '',
      languagename: '',
      directorname: '',
      producername: '',
      writersname: '',
      totalbudget: '',
      Duration: '',
      castid: [],
      hashid: ''
    })
    setPosterFile(null)
    setPosterPreview(null)
    setTrailerFile(null)
    setTrailerPreview(null)
  }

  // Handle show card click - open detail view with URL params
  const handleShowClick = (show) => {
    setSearchParams({ showId: show._id })
  }

  // Close detail view
  const closeDetailView = () => {
    setSearchParams({})
    setSelectedShow(null)
  }

  // Check if show is editable (not verified and not uploaded)
  const isShowEditable = (show) => {
    return show && !show.VerifiedByTheAdmin && !show.uploaded
  }

  // Update show title
  const handleUpdateTitle = async () => {
    if (!editTitle.trim()) return toast.error('Title cannot be empty')
    setUpdating(true)
    const response = await dispatch(UpdateShowTitle(token, updateShowId, editTitle, navigate))
    if (response?.success) {
      // Update local state
      const newTitle = editTitle
      setShows(prev => prev.map(s => s._id === updateShowId ? { ...s, title: newTitle } : s))
      if (selectedShow?._id === updateShowId) {
        setSelectedShow(prev => ({ ...prev, title: newTitle }))
      }
      // Also update Redux store
      dispatch(setallShow(shows.map(s => s._id === updateShowId ? { ...s, title: newTitle } : s)))
      setEditMode(null)
      setUpdateShowId(null)
      setEditTitle('')
    }
    setUpdating(false)
  }

  // Update show tagline
  const handleUpdateTagline = async () => {
    if (!editTagline.trim()) return toast.error('Tagline cannot be empty')
    setUpdating(true)
    const response = await dispatch(UpdateShowTagline(token, updateShowId, editTagline, navigate))
    if (response?.success) {
      // Update local state
      const newTagline = editTagline
      setShows(prev => prev.map(s => s._id === updateShowId ? { ...s, tagline: newTagline } : s))
      if (selectedShow?._id === updateShowId) {
        setSelectedShow(prev => ({ ...prev, tagline: newTagline }))
      }
      // Also update Redux store
      dispatch(setallShow(shows.map(s => s._id === updateShowId ? { ...s, tagline: newTagline } : s)))
      setEditMode(null)
      setUpdateShowId(null)
      setEditTagline('')
    }
    setUpdating(false)
  }

  // Update show image
  const handleUpdateImage = async (file) => {
    if (!file) return
    setUpdating(true)
    const showId = updateShowId
    const response = await dispatch(UpdateShowImage(token, showId, file, navigate))
    if (response?.success) {
      // Refresh shows to get updated image URL
      try {
        const refreshResponse = await dispatch(GetNotUploadedShows(token, navigate))
        if (refreshResponse?.success) {
          setShows(refreshResponse.data || [])
          dispatch(setallShow(refreshResponse.data || []))
          // Update selectedShow with new data
          if (selectedShow?._id === showId) {
            const updatedShow = refreshResponse.data.find(s => s._id === showId)
            if (updatedShow) {
              setSelectedShow(updatedShow)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
      setUpdateShowId(null)
    }
    setUpdating(false)
  }

  // Update show trailer
  const handleUpdateTrailer = async (file) => {
    if (!file) return
    setUpdating(true)
    const showId = updateShowId
    const response = await dispatch(UpdateShowTrailer(token, showId, file, navigate))
    if (response?.success) {
      // Refresh shows to get updated trailer URL
      try {
        const refreshResponse = await dispatch(GetNotUploadedShows(token, navigate))
        if (refreshResponse?.success) {
          setShows(refreshResponse.data || [])
          dispatch(setallShow(refreshResponse.data || []))
          // Update selectedShow with new data
          if (selectedShow?._id === showId) {
            const updatedShow = refreshResponse.data.find(s => s._id === showId)
            if (updatedShow) {
              setSelectedShow(updatedShow)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
      setUpdateShowId(null)
    }
    setUpdating(false)
  }

  // Delete show
  const handleDeleteShow = async () => {
    const response = await dispatch(DeleteSingleShow(token, deleteConfirm, navigate))
    if (response?.success) {
      setShows(prev => prev.filter(s => s._id !== deleteConfirm))
      if (selectedShow?._id === deleteConfirm) {
        closeDetailView()
      }
      setDeleteConfirm(null)
    }
  }

  // Upload/Publish show
  const handleUploadShow = async (showId) => {
    const response = await dispatch(UploadShow(token, showId, navigate))
    if (response?.success) {
      // Update local state
      setShows(prev => prev.map(s => s._id === showId ? { ...s, uploaded: true } : s))
      if (selectedShow?._id === showId) {
        setSelectedShow(prev => ({ ...prev, uploaded: true }))
      }
      toast.success('Show published successfully!')
    }
  }

  // Get selected genre's subgenres - filter from the separately fetched subgenres
  const selectedGenre = genres.find(g => g._id === formData.genreid)
  // Filter subgenres that belong to the selected genre (genre stores subgenre IDs in subgeneres array)
  const filteredSubgenres = formData.genreid && selectedGenre
    ? subgenres.filter(sub => selectedGenre.subgeneres?.includes(sub._id))
    : []

  // Get genre name by ID
  const getGenreName = (genreId) => {
    const genre = genres.find(g => g._id === genreId)
    return genre?.genreName || 'Unknown'
  }

  // Get language name by ID
  const getLanguageName = (langId) => {
    const lang = languages.find(l => l._id === langId)
    return lang?.name || 'Unknown'
  }

  // Disabled field wrapper component
  const DisabledFieldWrapper = ({ children, label, value }) => (
    <div className="relative group">
      <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
        {label}
        <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs">
          <FaLock size={10} /> Cannot be changed
        </span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={value || 'N/A'}
          disabled
          className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed opacity-60"
        />
        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 rounded-lg transition-colors pointer-events-none border-2 border-transparent group-hover:border-red-500/30" />
        <MdBlock className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  // Show Detail View
  if (selectedShow) {
    const editable = isShowEditable(selectedShow)

    // Debug: Log to see what's happening
    console.log('Selected Show:', selectedShow)
    console.log('Is Editable:', editable)
    console.log('VerifiedByTheAdmin:', selectedShow.VerifiedByTheAdmin)
    console.log('uploaded:', selectedShow.uploaded)

    return (
      <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={closeDetailView}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft /> Back to Shows
        </button>

        {/* Show Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Poster */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
              {selectedShow.Posterurl ? (
                <img
                  src={selectedShow.Posterurl}
                  alt={selectedShow.title}
                  className="w-full h-full object-cover hover:opacity-90 transition cursor-zoom-in"
                  onClick={() => setImageOpen(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <FaFilm className="text-4xl text-gray-600" />
                </div>
              )}

              {/* Updating Overlay */}
              {updating && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-yellow-500 text-sm">Updating...</p>
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedShow.uploaded ? 'bg-green-500/80 text-white' : 'bg-orange-500/80 text-white'
                }`}>
                  {selectedShow.uploaded ? 'Published' : 'Draft'}
                </span>
                {selectedShow.VerifiedByTheAdmin && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/80 text-white">
                    Verified
                  </span>
                )}
              </div>
            </div>
            {/* Edit Image Button - always visible */}
            <button
              onClick={() => {
                console.log('Update Poster clicked!')
                if (!editable) {
                  toast.error('This show cannot be edited')
                  return
                }
                setUpdateShowId(selectedShow._id)
                updateImageRef.current?.click()
              }}
              disabled={updating}
              className={`w-full mt-3 py-2 rounded-lg transition text-sm flex items-center justify-center gap-2 ${
                !editable
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : updating
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500/20 hover:bg-green-500/40 text-green-400'
              }`}
            >
              <FaImage size={12} /> {updating ? 'Updating...' : editable ? 'Update Poster' : 'Poster (Locked)'}
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{selectedShow.title}</h1>
                <p className="text-gray-400 mt-1">{selectedShow.tagline}</p>
              </div>
              {/* Edit buttons - show always but disable if not editable */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('Edit Title clicked!')
                    console.log('editable:', editable)
                    if (!editable) {
                      console.log('NOT EDITABLE - showing toast')
                      toast.error('This show cannot be edited')
                      return
                    }
                    console.log('Setting editMode to title...')
                    setUpdateShowId(selectedShow._id)
                    setEditTitle(selectedShow.title)
                    setEditMode('title')
                    console.log('editMode set to title')
                  }}
                  disabled={updating}
                  className={`p-2 rounded-lg transition ${
                    !editable
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : updating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-400'
                  }`}
                  title={editable ? "Edit Title" : "Cannot edit - show is verified/uploaded"}
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => {
                    console.log('Edit Tagline clicked!')
                    console.log('editable:', editable)
                    if (!editable) {
                      console.log('NOT EDITABLE - showing toast')
                      toast.error('This show cannot be edited')
                      return
                    }
                    console.log('Setting editMode to tagline...')
                    setUpdateShowId(selectedShow._id)
                    setEditTagline(selectedShow.tagline || '')
                    setEditMode('tagline')
                    console.log('editMode set to tagline')
                  }}
                  disabled={updating}
                  className={`p-2 rounded-lg transition ${
                    !editable
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : updating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-400'
                  }`}
                  title={editable ? "Edit Tagline" : "Cannot edit - show is verified/uploaded"}
                >
                  <FaEdit size={14} />
                </button>
              </div>
            </div>

            {/* Editable vs Non-editable notice */}
            {!editable && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <FaLock /> This show is {selectedShow.VerifiedByTheAdmin ? 'verified' : 'uploaded'} and cannot be edited.
                </p>
              </div>
            )}
            {editable && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <p className="text-green-400 text-sm">
                  You can edit: <strong>Title, Tagline, Poster, and Trailer</strong>. Other fields are locked after creation.
                </p>
              </div>
            )}

            {/* Show Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DisabledFieldWrapper label="Release Date" value={selectedShow.releasedate} />
              <DisabledFieldWrapper label="Genre" value={getGenreName(selectedShow.genre)} />
              <DisabledFieldWrapper label="Duration" value={selectedShow.movieDuration ? `${selectedShow.movieDuration} min` : 'N/A'} />
              <DisabledFieldWrapper label="Budget" value={selectedShow.totalbudget ? `₹${selectedShow.totalbudget}` : 'N/A'} />
              <DisabledFieldWrapper label="Director" value={Array.isArray(selectedShow.directorname) ? selectedShow.directorname.join(', ') : selectedShow.directorname} />
              <DisabledFieldWrapper label="Producer" value={Array.isArray(selectedShow.producername) ? selectedShow.producername.join(', ') : selectedShow.producername} />
              <DisabledFieldWrapper label="Writers" value={Array.isArray(selectedShow.writersname) ? selectedShow.writersname.join(', ') : selectedShow.writersname} />
              <DisabledFieldWrapper label="Status" value={selectedShow.movieStatus} />
              <DisabledFieldWrapper label="Created At" value={selectedShow.createdAt} />
              <DisabledFieldWrapper label="Trailer Duration" value={selectedShow.TotalDuration} />
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Trailer</h2>
          <div className="relative rounded-xl overflow-hidden bg-black max-w-3xl">
            {selectedShow.trailerurl ? (
              <video
                src={selectedShow.trailerurl}
                controls
                className="w-full aspect-video"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                <FaVideo className="text-4xl text-gray-600" />
              </div>
            )}
            {/* Updating Overlay for Trailer */}
            {updating && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-yellow-500 text-sm">Updating trailer...</p>
                </div>
              </div>
            )}
          </div>
          {/* Update Trailer Button - always visible */}
          <button
            onClick={() => {
              console.log('Update Trailer clicked!')
              if (!editable) {
                toast.error('This show cannot be edited')
                return
              }
              setUpdateShowId(selectedShow._id)
              updateTrailerRef.current?.click()
            }}
            disabled={updating}
            className={`mt-3 py-2 px-4 rounded-lg transition text-sm flex items-center gap-2 ${
              !editable
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : updating
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400'
            }`}
          >
            <FaVideo size={12} /> {updating ? 'Updating...' : editable ? 'Update Trailer' : 'Trailer (Locked)'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {editable && !selectedShow.uploaded && (
            <button
              onClick={() => handleUploadShow(selectedShow._id)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg text-sm font-medium transition"
            >
              <FaUpload /> Publish Show
            </button>
          )}
          <button
            onClick={() => setDeleteConfirm(selectedShow._id)}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 px-6 py-3 rounded-lg text-sm font-medium transition"
          >
            <FaTrash /> Delete Show
          </button>
        </div>

        {/* Image Zoom Modal */}
        {imageopen && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setImageOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setImageOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 transition z-10"
            >
              <IoClose size={32} />
            </button>

            {/* Zoomed Image */}
            <img
              src={selectedShow.Posterurl}
              alt={selectedShow.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Hidden inputs for update - MUST be inside detail view */}
        <input
          ref={updateImageRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => {
            if (updateShowId && e.target.files[0]) {
              handleUpdateImage(e.target.files[0])
            }
          }}
          className="hidden"
        />
        <input
          ref={updateTrailerRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-matroska,video/mpeg"
          onChange={(e) => {
            if (updateShowId && e.target.files[0]) {
              handleUpdateTrailer(e.target.files[0])
            }
          }}
          className="hidden"
        />

        {/* Edit Title Modal */}
        {editMode === 'title' && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!updating) { setEditMode(null); setUpdateShowId(null) } }}
          >
            <div
              className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Show Title</h2>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter new title"
                autoFocus
                disabled={updating}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition mb-4 disabled:opacity-50"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTitle}
                  disabled={updating}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                    updating
                      ? 'bg-yellow-600 text-black/70 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {updating && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                  {updating ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => { setEditMode(null); setUpdateShowId(null) }}
                  disabled={updating}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Tagline Modal */}
        {editMode === 'tagline' && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!updating) { setEditMode(null); setUpdateShowId(null) } }}
          >
            <div
              className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Show Tagline</h2>
              <textarea
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                placeholder="Enter new tagline"
                autoFocus
                rows={3}
                disabled={updating}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition mb-4 resize-none disabled:opacity-50"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTagline}
                  disabled={updating}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                    updating
                      ? 'bg-yellow-600 text-black/70 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  }`}
                >
                  {updating && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                  {updating ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => { setEditMode(null); setUpdateShowId(null) }}
                  disabled={updating}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Delete Show</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this show? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteShow}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaFilm className="text-2xl text-yellow-500" />
          <h1 className="text-2xl md:text-3xl font-bold">Shows Manager</h1>
          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-medium">
            {shows.length}
          </span>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Create Show
        </button>
      </div>

      {/* Create Show Form */}
      {showCreateForm && (
        <div className="mb-6 bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Create New Show</h2>
            <button
              onClick={() => { setShowCreateForm(false); resetForm() }}
              className="text-gray-400 hover:text-white"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Title */}
            <div className="col-span-1">
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter show title"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Tagline */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Tagline *</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="Enter show tagline"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Release Date *</label>
              <input
                type="date"
                name="releasedate"
                value={formData.releasedate}
                onChange={handleInputChange}
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Genre *</label>
              {genres.length === 0 ? (
                <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">
                  No genres available. Please contact admin to create genres.
                </div>
              ) : (
                <select
                  name="genreid"
                  value={formData.genreid}
                  onChange={handleInputChange}
                  className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre._id} value={genre._id}>{genre.genreName}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Subgenre */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Subgenre</label>
              {subgenres.length === 0 ? (
                <div className="w-full bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2.5 text-sm text-orange-400">
                  No subgenres available. Please contact admin to create subgenres.
                </div>
              ) : !formData.genreid ? (
                <select
                  disabled
                  className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition disabled:opacity-50"
                >
                  <option value="">Select a genre first</option>
                </select>
              ) : filteredSubgenres.length === 0 ? (
                <div className="w-full bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2.5 text-sm text-orange-400">
                  No subgenres for this genre. Contact admin to add subgenres.
                </div>
              ) : (
                <select
                  name="subgenereid"
                  value={formData.subgenereid}
                  onChange={handleInputChange}
                  className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                >
                  <option value="">Select Subgenre</option>
                  {filteredSubgenres.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Language *</label>
              {languages.length === 0 ? (
                <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">
                  No languages available. Please contact admin to create languages.
                </div>
              ) : (
                <select
                  name="languagename"
                  value={formData.languagename}
                  onChange={handleInputChange}
                  className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                >
                  <option value="">Select Language</option>
                  {languages.map(lang => (
                    <option key={lang._id} value={lang.name}>{lang.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Director */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Director</label>
              <input
                type="text"
                name="directorname"
                value={formData.directorname}
                onChange={handleInputChange}
                placeholder="Director name"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Producer */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Producer</label>
              <input
                type="text"
                name="producername"
                value={formData.producername}
                onChange={handleInputChange}
                placeholder="Producer name"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Writers */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Writers</label>
              <input
                type="text"
                name="writersname"
                value={formData.writersname}
                onChange={handleInputChange}
                placeholder="Writers name"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Budget</label>
              <input
                type="number"
                name="totalbudget"
                value={formData.totalbudget}
                onChange={handleInputChange}
                placeholder="Total budget"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="Duration"
                value={formData.Duration}
                onChange={handleInputChange}
                placeholder="Duration in minutes"
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tag/Hashtag</label>
              {tags.length === 0 ? (
                <div className="w-full bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2.5 text-sm text-orange-400">
                  No tags available. Create tags in Tags Manager first.
                </div>
              ) : (
                <select
                  name="hashid"
                  value={formData.hashid}
                  onChange={handleInputChange}
                  className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                >
                  <option value="">Select Tag</option>
                  {tags.map(tag => (
                    <option key={tag._id} value={tag._id}>#{tag.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Cast Selection */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm text-gray-400 mb-2">Cast Members</label>
              <div className="flex flex-wrap gap-2 p-3 bg-[#12122a] border border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                {castList.length === 0 ? (
                  <p className="text-gray-500 text-sm">No cast members available</p>
                ) : (
                  castList.map(cast => (
                    <button
                      key={cast._id}
                      type="button"
                      onClick={() => handleCastSelect(cast._id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${
                        formData.castid.includes(cast._id)
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {cast.images && (
                        <img src={cast.images} alt={cast.name} className="w-5 h-5 rounded-full object-cover" />
                      )}
                      {cast.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Poster Upload */}
            <div className="col-span-1">
              <label className="block text-sm text-gray-400 mb-2">Poster Image *</label>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="h-48 border-2 border-dashed border-gray-600 hover:border-yellow-500 rounded-lg flex items-center justify-center cursor-pointer transition overflow-hidden"
              >
                {posterPreview ? (
                  <img src={posterPreview} alt="Poster Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <FaImage className="text-3xl mx-auto mb-2" />
                    <span className="text-sm">Click to upload poster</span>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePosterChange}
                className="hidden"
              />
            </div>

            {/* Trailer Upload */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Trailer Video</label>
              <div
                onClick={() => trailerInputRef.current?.click()}
                className="h-48 border-2 border-dashed border-gray-600 hover:border-yellow-500 rounded-lg flex items-center justify-center cursor-pointer transition overflow-hidden"
              >
                {trailerPreview ? (
                  <video src={trailerPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <FaVideo className="text-3xl mx-auto mb-2" />
                    <span className="text-sm">Click to upload trailer (max 100MB)</span>
                  </div>
                )}
              </div>
              <input
                ref={trailerInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-matroska,video/mpeg"
                onChange={handleTrailerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateShow}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg text-sm font-medium transition"
            >
              Create Show
            </button>
            <button
              onClick={() => { setShowCreateForm(false); resetForm() }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Shows Grid */}
      {shows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FaFilm className="text-6xl mb-4 opacity-30" />
          <p className="text-lg">No shows yet</p>
          <p className="text-sm mt-1">Click "Create Show" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {shows.map((show) => (
            <div
              key={show._id}
              onClick={() => handleShowClick(show)}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden hover:border-yellow-500/50 transition group cursor-pointer"
            >
              {/* Show Poster */}
              <div className="relative aspect-[2/3]">
                {show.Posterurl ? (
                  <img
                    src={show.Posterurl}
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <FaFilm className="text-4xl text-gray-600" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    show.uploaded ? 'bg-green-500/80 text-white' : 'bg-orange-500/80 text-white'
                  }`}>
                    {show.uploaded ? 'Published' : 'Draft'}
                  </span>
                  {show.VerifiedByTheAdmin && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/80 text-white">
                      Verified
                    </span>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium">
                    View Details
                  </span>
                </div>
              </div>

              {/* Show Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{show.title}</h3>
                <p className="text-gray-500 text-xs truncate mt-1">{show.tagline}</p>
                <p className="text-gray-600 text-xs mt-2">{show.releasedate}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden inputs for update */}
      <input
        ref={updateImageRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => {
          if (updateShowId && e.target.files[0]) {
            handleUpdateImage(e.target.files[0])
          }
        }}
        className="hidden"
      />
      <input
        ref={updateTrailerRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-matroska,video/mpeg"
        onChange={(e) => {
          if (updateShowId && e.target.files[0]) {
            handleUpdateTrailer(e.target.files[0])
          }
        }}
        className="hidden"
      />

      {/* Edit Title Modal */}
      {editMode === 'title' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { if (!updating) { setEditMode(null); setUpdateShowId(null) } }}
        >
          <div
            className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Edit Show Title</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter new title"
              autoFocus
              disabled={updating}
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition mb-4 disabled:opacity-50"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateTitle}
                disabled={updating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                  updating
                    ? 'bg-yellow-600 text-black/70 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
              >
                {updating && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                {updating ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={() => { setEditMode(null); setUpdateShowId(null) }}
                disabled={updating}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tagline Modal */}
      {editMode === 'tagline' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { if (!updating) { setEditMode(null); setUpdateShowId(null) } }}
        >
          <div
            className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Edit Show Tagline</h2>
            <textarea
              value={editTagline}
              onChange={(e) => setEditTagline(e.target.value)}
              placeholder="Enter new tagline"
              autoFocus
              rows={3}
              disabled={updating}
              className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition mb-4 resize-none disabled:opacity-50"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateTagline}
                disabled={updating}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                  updating
                    ? 'bg-yellow-600 text-black/70 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
              >
                {updating && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                {updating ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={() => { setEditMode(null); setUpdateShowId(null) }}
                disabled={updating}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Delete Show</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this show? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteShow}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowsManager
