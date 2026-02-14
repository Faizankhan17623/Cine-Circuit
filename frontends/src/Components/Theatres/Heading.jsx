import React, { useEffect, useState } from "react"
import Navbar from "../Home/Navbar"
import { FaTheaterMasks, FaSearch, FaMapMarkerAlt, FaFilm, FaParking, FaLanguage, FaChevronRight, FaChevronLeft, FaImage } from "react-icons/fa"
import { MdEventSeat } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { TheatreFinding } from "../../Services/operations/User"
import Loader from "../extra/Loading"

const Heading = () => {
  const currentUrl = window.location.href
  const token = currentUrl.split("/")
  const MainToken = decodeURIComponent(token[4])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [theatres, setTheatres] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeImageTab, setActiveImageTab] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const filteredTheatres = theatres.filter(theatre =>
    theatre.Theatrename?.toLowerCase().includes(search.toLowerCase()) ||
    theatre.locationName?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      try {
        const Response = await dispatch(TheatreFinding(MainToken))
        if (Response?.success) {
          setTheatres(Response.data.data || [])
        }
      } catch (error) {
        console.log("Theatre fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    handler()
  }, [MainToken])

  const getImageTab = (theatreId) => activeImageTab[theatreId] || "outside"
  const getImageIndex = (theatreId) => currentImageIndex[theatreId] || 0

  const getImages = (theatre, tab) => {
    if (tab === "inside") return theatre.TheatreInsideimages || []
    return theatre.Theatreoutsideimages || []
  }

  const nextImage = (e, theatreId, images) => {
    e.stopPropagation()
    const current = getImageIndex(theatreId)
    setCurrentImageIndex(prev => ({
      ...prev,
      [theatreId]: (current + 1) % images.length
    }))
  }

  const prevImage = (e, theatreId, images) => {
    e.stopPropagation()
    const current = getImageIndex(theatreId)
    setCurrentImageIndex(prev => ({
      ...prev,
      [theatreId]: current === 0 ? images.length - 1 : current - 1
    }))
  }

  const switchTab = (theatreId, tab) => {
    setActiveImageTab(prev => ({ ...prev, [theatreId]: tab }))
    setCurrentImageIndex(prev => ({ ...prev, [theatreId]: 0 }))
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-richblack-900">
        <Loader />
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen bg-richblack-900">
      <Navbar />

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setFullscreenImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl font-light">&times;</button>
          <img
            src={fullscreenImage}
            alt="Theatre"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header */}
      <div className="w-full pt-12 pb-8 flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-5 shadow-xl shadow-purple-500/20">
          <FaTheaterMasks className="text-3xl text-white" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            {MainToken}
          </span>
        </h1>

        <p className="text-richblack-300 text-sm md:text-base">
          Explore {MainToken} theatres near you
        </p>

        <div className="mt-5 w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full" />

        <div className="mt-4 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full">
          <span className="text-purple-400 text-sm font-medium">
            {theatres.length} {theatres.length === 1 ? "theatre" : "theatres"} found
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" />
          <input
            type="text"
            placeholder="Search by theatre name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-richblack-800 border border-richblack-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-richblack-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-white text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Theatre List */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filteredTheatres.length > 0 ? (
          <div className="space-y-8">
            {filteredTheatres.map((theatre) => {
              const tab = getImageTab(theatre._id)
              const images = getImages(theatre, tab)
              const imgIndex = getImageIndex(theatre._id)

              return (
                <div
                  key={theatre._id}
                  className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden hover:border-richblack-600 transition-all duration-300"
                >
                  {/* Theatre Card - Image + Info Layout */}
                  <div className="flex flex-col lg:flex-row">

                    {/* Image Section */}
                    <div className="lg:w-[420px] flex-shrink-0">
                      {/* Image Tab Switcher */}
                      <div className="flex bg-richblack-900/80">
                        <button
                          onClick={() => switchTab(theatre._id, "outside")}
                          className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                            tab === "outside"
                              ? "bg-purple-500/20 text-purple-300 border-b-2 border-purple-400"
                              : "text-richblack-400 hover:text-richblack-200"
                          }`}
                        >
                          Outside View
                        </button>
                        <button
                          onClick={() => switchTab(theatre._id, "inside")}
                          className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                            tab === "inside"
                              ? "bg-purple-500/20 text-purple-300 border-b-2 border-purple-400"
                              : "text-richblack-400 hover:text-richblack-200"
                          }`}
                        >
                          Inside View
                        </button>
                      </div>

                      {/* Image Carousel */}
                      <div className="relative h-56 lg:h-64 bg-richblack-900 overflow-hidden group">
                        {images.length > 0 ? (
                          <>
                            <img
                              src={images[imgIndex]}
                              alt={`${theatre.Theatrename} ${tab}`}
                              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                              onClick={() => navigate(`/theatre/full-details/${theatre._id}`)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/60 via-transparent to-richblack-900/30 pointer-events-none" />

                            {/* Image Navigation */}
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => prevImage(e, theatre._id, images)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <FaChevronLeft className="text-xs" />
                                </button>
                                <button
                                  onClick={(e) => nextImage(e, theatre._id, images)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <FaChevronRight className="text-xs" />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {images.map((_, i) => (
                                    <button
                                      key={i}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentImageIndex(prev => ({ ...prev, [theatre._id]: i }))
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        i === imgIndex
                                          ? "bg-purple-400 w-5"
                                          : "bg-white/40 hover:bg-white/60"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Image Count Badge */}
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                              <FaImage className="text-[10px] text-white/70" />
                              <span className="text-[11px] text-white/80 font-medium">
                                {imgIndex + 1}/{images.length}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-richblack-800">
                            <FaImage className="text-3xl text-richblack-600 mb-2" />
                            <span className="text-richblack-500 text-xs">No {tab} images</span>
                          </div>
                        )}
                      </div>

                      {/* Image Thumbnails */}
                      {images.length > 1 && (
                        <div className="flex gap-1.5 p-2 bg-richblack-900/50 overflow-x-auto scrollbar-hide">
                          {images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [theatre._id]: i }))}
                              className={`w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                i === imgIndex
                                  ? "border-purple-400 shadow-md shadow-purple-400/20"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {/* Theatre Name */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/15">
                            <FaTheaterMasks className="text-lg text-white" />
                          </div>
                          <div>
                            <h3
                              className="text-xl font-bold text-white leading-tight cursor-pointer hover:text-purple-300 transition-colors"
                              onClick={() => navigate(`/theatre/full-details/${theatre._id}`)}
                            >
                              {theatre.Theatrename}
                            </h3>
                            <div className="flex items-center gap-1.5 text-richblack-400 text-sm mt-1">
                              <FaMapMarkerAlt className="text-purple-400 text-xs" />
                              {theatre.locationName}
                            </div>
                          </div>
                        </div>

                        {/* Owner */}
                        {theatre.TheatreOwner && (
                          <p className="text-richblack-400 text-xs mb-4 ml-14">
                            Managed by <span className="text-richblack-200">{theatre.TheatreOwner}</span>
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {theatre.movieScreeningType?.map((type, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium"
                            >
                              <FaFilm className="inline mr-1 text-[9px]" />
                              {type}
                            </span>
                          ))}
                          {theatre.parking?.length > 0 && (
                            <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                              <FaParking className="inline mr-1 text-[9px]" />
                              Parking
                            </span>
                          )}
                          {theatre.languagesAvailable?.map((lang, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium"
                            >
                              <FaLanguage className="inline mr-1 text-[9px]" />
                              {lang}
                            </span>
                          ))}
                          {theatre.typesofseatsAvailable?.map((seat, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium"
                            >
                              <MdEventSeat className="inline mr-1 text-[10px]" />
                              {seat}
                            </span>
                          ))}
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-4">
                          {theatre.showAlloted?.length > 0 && (
                            <div className="bg-richblack-700/50 px-3 py-1.5 rounded-lg">
                              <span className="text-purple-400 font-bold text-sm">{theatre.showAlloted.length}</span>
                              <span className="text-richblack-400 text-xs ml-1.5">Shows</span>
                            </div>
                          )}
                          {(theatre.TheatreInsideimages?.length > 0 || theatre.Theatreoutsideimages?.length > 0) && (
                            <div className="bg-richblack-700/50 px-3 py-1.5 rounded-lg">
                              <span className="text-indigo-400 font-bold text-sm">
                                {(theatre.TheatreInsideimages?.length || 0) + (theatre.Theatreoutsideimages?.length || 0)}
                              </span>
                              <span className="text-richblack-400 text-xs ml-1.5">Photos</span>
                            </div>
                          )}
                          {theatre.Verified && (
                            <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-green-400 text-xs font-semibold">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shows Alloted Button - Navigates to new page */}
                      <button
                        onClick={() => navigate(`/theatres/alloted-shows/${theatre._id}`)}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-300 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/15"
                      >
                        Shows Alloted
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <FaTheaterMasks className="text-5xl text-richblack-600 mb-4" />
            <h3 className="text-lg font-semibold text-white">
              No theatres found
            </h3>
            <p className="text-richblack-400 text-sm mt-2">
              {search
                ? "Try searching with a different name or location."
                : "No theatres available for this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Heading
