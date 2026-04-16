import { useState } from 'react'

const FALLBACK = 'https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976754/2_phppq2.png'

/**
 * LazyImage — drops in anywhere an <img> is used.
 * Shows an animated shimmer while loading, fades in the real image,
 * falls back to a placeholder on error.
 *
 * Usage:  <LazyImage src={url} alt="title" className="w-full h-full object-cover" />
 */
const LazyImage = ({ src, alt, className = '', fallback = FALLBACK, style, onClick }) => {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`} style={style} onClick={onClick}>
      {/* Shimmer skeleton shown until image finishes loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-richblack-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]" />
        </div>
      )}

      <img
        src={errored ? fallback : (src || fallback)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setErrored(true); setLoaded(true) }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

export default LazyImage
