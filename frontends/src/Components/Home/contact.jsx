import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { IoIosChatboxes } from "react-icons/io"
import { FaGlobeAmericas, FaPhoneAlt, FaTheaterMasks, FaChartLine, FaUsers, FaTicketAlt, FaCogs, FaShieldAlt, FaHandshake, FaStar, FaCheckCircle, FaArrowRight } from "react-icons/fa"
import Loading from '../extra/Loading'
import TheatrerForm from '../extra/TheatrerForm'
import Footer from './Footer'

const BENEFITS = [
  {
    icon: FaChartLine,
    title: 'Boost Revenue',
    desc: 'Maximize your occupancy rates and earn more with our data-driven ticketing platform.',
  },
  {
    icon: FaUsers,
    title: 'Reach Millions',
    desc: 'Get instant exposure to our massive user base actively looking for shows near them.',
  },
  {
    icon: FaTicketAlt,
    title: 'Smart Ticketing',
    desc: 'Automated seat management, dynamic pricing, and real-time booking — all handled for you.',
  },
  {
    icon: FaCogs,
    title: 'Easy Management',
    desc: 'A powerful dashboard to manage screens, shows, schedules, and revenue in one place.',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure Payments',
    desc: 'Hassle-free, secure payment processing with fast settlements directly to your account.',
  },
  {
    icon: FaHandshake,
    title: 'Dedicated Support',
    desc: 'A dedicated partner manager to help you onboard, grow, and resolve issues quickly.',
  },
]

const STATS = [
  { value: '500+', label: 'Theatre Partners' },
  { value: '10M+', label: 'Tickets Sold' },
  { value: '120+', label: 'Cities Covered' },
  { value: '98%', label: 'Partner Satisfaction' },
]

const STEPS_INFO = [
  { step: '01', title: 'Register', desc: 'Fill out the simple registration form with your theatre details.' },
  { step: '02', title: 'Verify', desc: 'Our team reviews and verifies your theatre information.' },
  { step: '03', title: 'Go Live', desc: 'Start listing shows and selling tickets to millions of users.' },
]

const Contact = () => {
  const [showForm, setShowForm] = useState(false)
  const [delayedShow, setDelayedShow] = useState(false)

  useEffect(() => {
    if (showForm) {
      setDelayedShow(false)
      const timer = setTimeout(() => {
        setDelayedShow(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setDelayedShow(false)
    }
  }, [showForm])

  return (
    <div className='w-full min-h-screen text-white bg-richblack-900'>
      <Navbar />

      {/* Hero Section */}
      <div className='relative w-full overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none' />
        <div className='w-full max-w-6xl mx-auto text-center py-16 lg:py-24 px-6 relative'>
          <div className='inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6'>
            <FaStar className='text-yellow-400 text-xs' />
            Trusted by 500+ Theatre Partners Across India
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight'>
            <span className='text-white'>Bring Your Theatre to </span>
            <span className='bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent'>
              Millions of Moviegoers
            </span>
          </h1>
          <p className='text-richblack-200 text-lg lg:text-xl mt-5 max-w-3xl mx-auto leading-relaxed'>
            Partner with Cine Circuit and transform your theatre business. Get access to smart ticketing,
            powerful analytics, and a massive audience — all with zero hassle.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-8'>
            <button
              onClick={() => {
                setShowForm(true)
                setTimeout(() => {
                  document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
              className='flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20'
            >
              <FaTheaterMasks className='text-xl' />
              Register Your Theatre
              <FaArrowRight className='text-sm' />
            </button>
            <a
              href="#why-partner"
              className='flex items-center gap-2 px-6 py-4 border-2 border-richblack-500 text-richblack-100 font-semibold rounded-xl hover:border-richblack-300 hover:text-white transition-all duration-300'
            >
              Why Partner With Us?
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className='w-full bg-richblack-800 border-y border-richblack-700'>
        <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6'>
          {STATS.map((stat, i) => (
            <div key={i} className='text-center'>
              <p className='text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>
                {stat.value}
              </p>
              <p className='text-richblack-300 text-sm mt-1 font-medium'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div id="why-partner" className='w-full max-w-6xl mx-auto py-16 lg:py-20 px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-bold text-white'>
            Why Theatres <span className='text-yellow-400'>Love</span> Cine Circuit
          </h2>
          <p className='text-richblack-300 mt-3 max-w-2xl mx-auto text-lg'>
            Everything you need to fill every seat, every show, every day.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className='group border border-richblack-700 bg-richblack-800 rounded-2xl p-6 hover:border-yellow-400/40 hover:bg-richblack-800/80 transition-all duration-300'
            >
              <div className='w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors'>
                <benefit.icon className='text-yellow-400 text-xl' />
              </div>
              <h3 className='text-lg font-bold text-white mb-2'>{benefit.title}</h3>
              <p className='text-richblack-300 text-sm leading-relaxed'>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className='w-full bg-richblack-800 border-y border-richblack-700'>
        <div className='max-w-6xl mx-auto py-16 lg:py-20 px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-white'>
              Get Started in <span className='text-yellow-400'>3 Simple Steps</span>
            </h2>
            <p className='text-richblack-300 mt-3 text-lg'>From registration to your first booking — it's quick and easy.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {STEPS_INFO.map((item, i) => (
              <div key={i} className='relative text-center'>
                <div className='w-16 h-16 mx-auto bg-yellow-400 text-black rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg shadow-yellow-400/20'>
                  {item.step}
                </div>
                <h3 className='text-xl font-bold text-white mb-2'>{item.title}</h3>
                <p className='text-richblack-300 text-sm'>{item.desc}</p>
                {i < STEPS_INFO.length - 1 && (
                  <div className='hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-richblack-600' />
                )}
              </div>
            ))}
          </div>
          <div className='text-center mt-10'>
            <button
              onClick={() => {
                setShowForm(true)
                setTimeout(() => {
                  document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
              className='inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20'
            >
              Start Your Journey Today
              <FaArrowRight className='text-sm' />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonial / Trust Banner */}
      <div className='w-full max-w-6xl mx-auto py-16 px-6'>
        <div className='bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-yellow-400/10 border border-yellow-400/20 rounded-2xl p-8 lg:p-12 text-center'>
          <FaTheaterMasks className='text-yellow-400 text-5xl mx-auto mb-4' />
          <blockquote className='text-xl lg:text-2xl font-semibold text-white italic max-w-3xl mx-auto leading-relaxed'>
            "Since partnering with Cine Circuit, our occupancy rates have increased by 40%.
            The platform is incredibly easy to use and the support team is outstanding."
          </blockquote>
          <p className='text-yellow-400 font-semibold mt-4'>— Theatre Partner, Mumbai</p>
          <div className='flex items-center justify-center gap-1 mt-2'>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className='text-yellow-400 text-sm' />
            ))}
          </div>
        </div>
      </div>

      {/* Registration Section */}
      <div id="register-section" className='w-full max-w-6xl mx-auto px-6 pb-16'>
        <div className='flex flex-col lg:flex-row gap-8'>

          {/* Left Side - CTA + Contact Info */}
          <div className='w-full lg:w-[400px] flex flex-col gap-6'>

            {/* CTA Card */}
            <div className='border border-yellow-400/30 bg-gradient-to-b from-richblack-800 to-richblack-900 rounded-2xl p-6'>
              <div className='w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-4'>
                <FaTheaterMasks className='text-black text-2xl' />
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                Ready to Grow Your Theatre Business?
              </h2>
              <p className='text-richblack-300 text-sm leading-relaxed mb-4'>
                Join hundreds of theatre owners who have already transformed their business with Cine Circuit.
                Register now and start selling tickets to millions.
              </p>
              <ul className='flex flex-col gap-3 mb-6'>
                {['No setup fees', 'Go live within 48 hours', 'Free marketing support', 'Real-time analytics dashboard'].map((item, i) => (
                  <li key={i} className='flex items-center gap-3 text-sm text-richblack-100'>
                    <FaCheckCircle className='text-yellow-400 text-sm flex-shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className='w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-colors'
                >
                  <FaTheaterMasks />
                  Register Your Theatre
                </button>
              )}
            </div>

            {/* Contact Info Card */}
            <div className='border border-richblack-600 bg-richblack-800 rounded-2xl p-6 flex flex-col gap-5'>
              <h2 className='text-lg font-bold text-white border-b border-richblack-600 pb-3'>Need Help? Contact Us</h2>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-richblack-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <IoIosChatboxes className='text-yellow-400 text-xl' />
                </div>
                <div>
                  <h3 className='font-semibold text-white text-sm'>Chat With Us</h3>
                  <p className='text-richblack-300 text-xs mt-0.5'>Our team is here to help.</p>
                  <a href="mailto:faizankhan901152@gmail.com" className='text-yellow-100 text-sm hover:underline'>faizankhan901152@gmail.com</a>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-richblack-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaGlobeAmericas className='text-yellow-400 text-lg' />
                </div>
                <div>
                  <h3 className='font-semibold text-white text-sm'>Visit Us</h3>
                  <p className='text-richblack-300 text-xs mt-0.5'>Come say hello at our office.</p>
                  <p className='text-richblack-400 text-sm'>Address coming soon</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-richblack-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaPhoneAlt className='text-yellow-400 text-lg' />
                </div>
                <div>
                  <h3 className='font-semibold text-white text-sm'>Call Us</h3>
                  <p className='text-richblack-300 text-xs mt-0.5'>Mon - Fri, 8 AM to 5 PM</p>
                  <a href="" className='text-yellow-100 text-sm hover:underline'>+91 000 000 0000</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Area */}
          <div className='flex-1 min-h-[600px] border border-richblack-600 bg-richblack-800 rounded-2xl flex flex-col'>
            <div className='px-6 py-4 border-b border-richblack-600'>
              <h2 className='text-lg font-bold text-white'>Theatre Registration</h2>
              <p className='text-sm text-richblack-300 mt-1'>
                {showForm
                  ? 'Fill in your theatre details below to get started with Cine Circuit.'
                  : 'Click the button on the left to start your registration.'}
              </p>
            </div>

            <div className='flex-1 flex justify-center items-center p-4'>
              {showForm ? (
                delayedShow ? <TheatrerForm /> : <Loading data="relative" />
              ) : (
                <div className='flex flex-col items-center gap-5 text-center px-8'>
                  <div className='w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-full flex items-center justify-center border-2 border-dashed border-yellow-400/30'>
                    <FaTheaterMasks className='text-4xl text-yellow-400' />
                  </div>
                  <h3 className='text-2xl font-bold text-white'>Your Theatre Deserves a Bigger Audience</h3>
                  <p className='text-richblack-300 max-w-md'>
                    Register your theatre with Cine Circuit and unlock access to millions of moviegoers.
                    Fill every seat, every show — starting today.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className='flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300'
                  >
                    <FaTheaterMasks />
                    Get Started Now
                    <FaArrowRight className='text-sm' />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact
