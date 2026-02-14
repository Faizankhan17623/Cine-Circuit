import React, { useEffect, useState } from "react"
import Navbar from "../Home/Navbar"
import {
  FaTheaterMasks, FaMapMarkerAlt, FaFilm, FaParking, FaLanguage,
  FaChevronLeft, FaChevronRight, FaImage, FaArrowLeft, FaUser,
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock
} from "react-icons/fa"
import { MdEventSeat, MdLocationOn } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { SingleTheatreDetails } from "../../Services/operations/User"
import Loader from "../extra/Loading"

const TheatreFullDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [theatre, setTheatre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("outside")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const response = await dispatch(SingleTheatreDetails(id))
        if (response?.success) {
          setTheatre(response.data.data)
        }
      } catch (error) {
        console.log("Theatre details error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const images = activeTab === "inside"
    ? (theatre?.TheatreInsideimages || [])
    : (theatre?.Theatreoutsideimages || [])

  const allImages = [
    ...(theatre?.Theatreoutsideimages || []),
    ...(theatre?.TheatreInsideimages || [])
  ]

  const switchTab = (tab) => {
    setActiveTab(tab)
    setCurrentIndex(0)
  }

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-richblack-900">
        <Loader />
      </div>
    )
  }

  if (!theatre) {
    return (
      <div className="text-white min-h-screen bg-richblack-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <FaTheaterMasks className="text-5xl text-richblack-600 mb-4" />
          <h3 className="text-lg font-semibold text-white">Theatre not found</h3>
          <button onClick={() => navigate(-1)} className="mt-4 text-purple-400 text-sm hover:underline">
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen bg-richblack-900">
      <Navbar />

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setFullscreenImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl font-light z-10">&times;</button>
          <img
            src={fullscreenImage}
            alt="Theatre"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero Banner - Large Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentIndex]}
              alt={theatre.Theatrename}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setFullscreenImage(images[currentIndex])}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 via-richblack-900/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-richblack-900/50 to-transparent" />

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image Count */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
              <FaImage className="text-xs text-white/70" />
              <span className="text-sm text-white/80 font-medium">{currentIndex + 1}/{images.length}</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-richblack-800">
            <FaImage className="text-5xl text-richblack-600 mb-3" />
            <span className="text-richblack-500">No images available</span>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white/80 hover:text-white px-4 py-2 rounded-full text-sm transition-all"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>

        {/* Tab Switcher on Image */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-black/50 backdrop-blur-md rounded-full overflow-hidden">
          <button
            onClick={() => switchTab("outside")}
            className={`px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === "outside"
                ? "bg-purple-500 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Outside View
          </button>
          <button
            onClick={() => switchTab("inside")}
            className={`px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === "inside"
                ? "bg-purple-500 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Inside View
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  i === currentIndex
                    ? "border-purple-400 shadow-lg shadow-purple-400/20 scale-105"
                    : "border-richblack-700 opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Theatre Info */}
      <div className="max-w-5xl mx-auto px-4 mt-8 pb-16">
        {/* Name & Status */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <FaTheaterMasks className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {theatre.Theatrename}
                </h1>
                <div className="flex items-center gap-2 text-richblack-300 mt-1">
                  <FaMapMarkerAlt className="text-purple-400 text-sm" />
                  <span className="text-sm">{theatre.locationName}</span>
                </div>
              </div>
            </div>

            {theatre.TheatreOwner && (
              <div className="flex items-center gap-2 text-richblack-400 text-sm ml-[68px]">
                <FaUser className="text-xs text-indigo-400" />
                Managed by <span className="text-richblack-200 font-medium">{theatre.TheatreOwner}</span>
              </div>
            )}
          </div>

          {/* Status & Verified Badge */}
          <div className="flex items-center gap-3 ml-[68px] md:ml-0">
            {theatre.Verified ? (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                <FaCheckCircle className="text-green-400" />
                <div>
                  <span className="text-green-400 text-sm font-semibold block">Verified</span>
                  {theatre.VerifiedAt && (
                    <span className="text-green-400/60 text-[10px]">{theatre.VerifiedAt}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl">
                <FaTimesCircle className="text-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold">
                  {theatre.status || "Pending"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {theatre.showAlloted?.length || 0}
            </span>
            <p className="text-richblack-400 text-xs mt-1">Shows Alloted</p>
          </div>
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {allImages.length}
            </span>
            <p className="text-richblack-400 text-xs mt-1">Total Photos</p>
          </div>
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {theatre.languagesAvailable?.length || 0}
            </span>
            <p className="text-richblack-400 text-xs mt-1">Languages</p>
          </div>
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {theatre.typesofseatsAvailable?.length || 0}
            </span>
            <p className="text-richblack-400 text-xs mt-1">Seat Types</p>
          </div>
        </div>

        {/* Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Screening Types */}
          {theatre.movieScreeningType?.length > 0 && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaFilm className="text-indigo-400" />
                Screening Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {theatre.movieScreeningType.map((type, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {theatre.languagesAvailable?.length > 0 && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaLanguage className="text-blue-400" />
                Languages Available
              </h3>
              <div className="flex flex-wrap gap-2">
                {theatre.languagesAvailable.map((lang, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seat Types */}
          {theatre.typesofseatsAvailable?.length > 0 && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MdEventSeat className="text-yellow-400" />
                Seat Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {theatre.typesofseatsAvailable.map((seat, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-medium"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Parking */}
          {theatre.parking?.length > 0 && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaParking className="text-green-400" />
                Parking
              </h3>
              <div className="flex flex-wrap gap-2">
                {theatre.parking.map((p, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theatre Format */}
        {theatre.theatreformat?.length > 0 && (
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaTheaterMasks className="text-purple-400" />
              Theatre Format / Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {theatre.theatreformat.map((f, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location & Date Info */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MdLocationOn className="text-red-400" />
            Location & Info
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-purple-400 mt-1" />
              <div>
                <p className="text-richblack-200 text-sm font-medium">Location</p>
                <p className="text-richblack-400 text-sm">{theatre.locationName}</p>
              </div>
            </div>
            {theatre.locationurl && (
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-blue-400 mt-1" />
                <div>
                  <p className="text-richblack-200 text-sm font-medium">Map Link</p>
                  <a
                    href={theatre.locationurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline break-all"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}
            {theatre.CreationDate && (
              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-indigo-400 mt-1" />
                <div>
                  <p className="text-richblack-200 text-sm font-medium">Registered On</p>
                  <p className="text-richblack-400 text-sm">{theatre.CreationDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Issues */}
        {theatre.issues && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-2">
              Notes / Issues
            </h3>
            <p className="text-richblack-300 text-sm">{theatre.issues}</p>
          </div>
        )}

        {/* All Photos Gallery */}
        {allImages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-richblack-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaImage className="text-purple-400" />
              All Photos ({allImages.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setFullscreenImage(img)}
                  className="relative h-36 rounded-xl overflow-hidden group border border-richblack-700 hover:border-purple-500/30 transition-all"
                >
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shows Alloted Button */}
        {theatre.showAlloted?.length > 0 && (
          <button
            onClick={() => navigate(`/theatres/alloted-shows/${theatre._id}`)}
            className="w-full py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/15 transition-all flex items-center justify-center gap-3"
          >
            <FaTheaterMasks />
            View All {theatre.showAlloted.length} Alloted Shows
            <FaChevronRight className="text-sm" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TheatreFullDetails
