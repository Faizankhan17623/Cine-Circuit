import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen || !trailerUrl) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <FaTimes />
        </button>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
          <video
            key={trailerUrl}
            controls
            playsInline
            className="w-full max-h-[80vh] bg-black"
          >
            <source src={trailerUrl} type="video/mp4" />
          </video>
        </div>

        <p className="text-center text-richblack-400 text-sm mt-4">
          {movieTitle} — Official Trailer &nbsp;·&nbsp; Press{' '}
          <kbd className="px-1.5 py-0.5 bg-richblack-700 rounded text-xs">Esc</kbd> to close
        </p>
      </div>
    </div>
  )
}

export default TrailerModal
