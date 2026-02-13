import { useState } from 'react'
import Navbar from '../Home/Navbar'
import Users from './User'
import Org from './Org'
import Loading from '../extra/Loading'
import Review from '../../assests/20250722_1919_Website Welcome Screen_remix_01k0s5zpfafgwtb2917cgvb6tk.png'
import review2 from '../../assests/20250722_1851_Grid Pattern Demo_remix_01k0s4hx3be05r0srqw6mksj47.png'

const Join = () => {
  const [User, setUser] = useState('User')
  const [loading, setLoading] = useState(false)

  const handleSelect = (type) => {
    setUser(type)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const loader = (
    <div className="w-full min-h-[300px] flex justify-center items-center">
      <Loading data="relative" />
    </div>
  )

  let content = null
  if (User === 'User') {
    content = loading ? loader : <Users />
  } else if (User === 'Organizer') {
    content = loading ? loader : <Org />
  }

  return (
    <div className="min-h-screen w-full bg-richblack-900">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row items-start justify-between gap-10 animate-fadeIn">

        {/* Left Side - Form Area */}
        <div className="w-full lg:w-[50%] flex flex-col items-center">

          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              WELCOME <span className="bg-gradient-to-r from-yellow-200 to-yellow-50 bg-clip-text text-transparent">BACK</span>
            </h1>
            <p className="mt-2 text-richblack-200 text-base">
              Discover Your Passion &mdash; <span className="text-blue-300 font-medium">Be Unstoppable</span>
            </p>
          </div>

          {/* Toggle Pill */}
          <div className="relative flex w-72 h-12 rounded-full bg-richblack-700 border border-richblack-600 p-1 mb-8 shadow-lg">
            <div
              className={`absolute top-1 h-10 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-yellow-200 to-yellow-100 shadow-md transition-all duration-300 ease-in-out ${
                User === 'Organizer' ? 'left-[calc(50%+2px)]' : 'left-1'
              }`}
            />
            <button
              onClick={() => handleSelect('User')}
              className={`relative z-10 flex-1 rounded-full text-sm font-bold transition-colors duration-300 ${
                User === 'User' ? 'text-richblack-900' : 'text-richblack-200 hover:text-white'
              }`}
            >
              User
            </button>
            <button
              onClick={() => handleSelect('Organizer')}
              className={`relative z-10 flex-1 rounded-full text-sm font-bold transition-colors duration-300 ${
                User === 'Organizer' ? 'text-richblack-900' : 'text-richblack-200 hover:text-white'
              }`}
            >
              Organizer
            </button>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md signup-form-animate">
            {content}
          </div>
        </div>

        {/* Right Side - Image Area */}
        <div className="hidden lg:flex w-[45%] justify-center items-start pt-12 sticky top-28">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-yellow-200/20 via-blue-300/10 to-transparent rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src={User === 'User' ? Review : review2}
              alt="Welcome illustration"
              draggable="false"
              className="relative w-[440px] rounded-2xl shadow-2xl border border-richblack-700/50 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Join
