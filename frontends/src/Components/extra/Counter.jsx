import { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import { FaHeart, FaFilm, FaTheaterMasks, FaTicketAlt, FaUsers } from "react-icons/fa"

const STATS = [
  { end: 500, suffix: '+', label: 'Organizers', icon: FaFilm, color: 'text-yellow-400' },
  { end: 200, suffix: '+', label: 'Theatres', icon: FaTheaterMasks, color: 'text-orange-400' },
  { end: 300, suffix: '+', label: 'Shows Done', icon: FaTicketAlt, color: 'text-blue-400' },
  { end: 10, suffix: 'k+', label: 'Happy Family', icon: FaUsers, color: 'text-pink-400', heart: true },
]

const Counter = () => {
  const counterRef = useRef(null)
  const [startCounter, setStartCounter] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounter(true)
        }
      },
      { threshold: 0.5 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [])

  return (
    <div ref={counterRef} className='w-full bg-richblack-800 border-y border-richblack-700'>
      <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 py-12 lg:py-16 px-6'>
        {STATS.map((stat, i) => (
          <div key={i} className='group flex flex-col items-center gap-3 text-center'>
            <div className={`w-14 h-14 rounded-2xl bg-richblack-700 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className='text-2xl' />
            </div>
            <div>
              <div className='flex items-center justify-center'>
                <CountUp start={0} end={stat.end} duration={2.5} redraw={true}>
                  {({ countUpRef, start }) => {
                    if (startCounter) start()
                    return (
                      <span
                        ref={countUpRef}
                        className='text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-richblack-100 bg-clip-text text-transparent'
                      />
                    )
                  }}
                </CountUp>
                <span className='text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-richblack-100 bg-clip-text text-transparent'>
                  {stat.suffix}
                </span>
              </div>
              <p className='text-richblack-300 text-sm font-medium mt-1 flex items-center justify-center gap-2'>
                {stat.label}
                {stat.heart && <FaHeart className='text-red-500 text-sm' />}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Counter
