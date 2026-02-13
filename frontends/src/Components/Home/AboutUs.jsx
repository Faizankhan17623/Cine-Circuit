import { FaHeart, FaEye, FaRocket, FaFilm, FaUsers, FaTicketAlt, FaStar, FaArrowRight, FaQuoteLeft } from "react-icons/fa"
import Navbar from './Navbar'
import Image1 from '../../assests/review.png'
import Counter from '../extra/Counter'
import Slider from "../extra/Slider"
import Footer from "./Footer"
import FeedbackForm from "./FeedbackForm"

const AboutUs = () => {
  return (
    <div className='w-full min-h-screen text-white bg-richblack-900 overflow-x-hidden'>
      <Navbar />

      {/* Hero Section */}
      <div className='relative w-full overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-richblack-800 via-richblack-900 to-richblack-900 pointer-events-none' />
        <div className='absolute top-10 left-1/4 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none animate-pulse' />
        <div className='absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-orange-400/5 rounded-full blur-[100px] pointer-events-none animate-pulse' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/[0.02] rounded-full blur-3xl pointer-events-none' />
        <div className='relative w-full max-w-6xl mx-auto text-center py-24 lg:py-32 px-6'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 border border-yellow-400/30 text-yellow-300 text-sm font-medium px-5 py-2 rounded-full mb-8 backdrop-blur-sm shadow-lg shadow-yellow-400/5'>
            <FaHeart className='text-yellow-400 text-xs animate-pulse' />
            Hated By None, Loved By Millions
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight'>
            <span className='text-white drop-shadow-lg'>A New Concept for </span>
            <br className='hidden lg:block' />
            <span className='bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg'>
              Future Generations
            </span>
          </h1>
          <p className='text-richblack-200 text-lg lg:text-xl mt-8 max-w-3xl mx-auto leading-relaxed'>
            Cine Circuit is a revolutionary platform built to simplify the movie industry. We empower organizers
            to track every ticket, gather real audience reviews, and grow their craft — while helping moviegoers
            discover the best shows at the best prices, effortlessly.
          </p>
          <div className='flex items-center justify-center gap-4 mt-10'>
            <a href="#our-story" className='group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 text-sm shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 hover:scale-105'>
              Our Story
              <FaArrowRight className='text-xs group-hover:translate-x-1 transition-transform' />
            </a>
            <a href="#what-we-offer" className='flex items-center gap-2 px-7 py-3.5 border border-richblack-500 text-richblack-100 font-semibold rounded-xl hover:border-yellow-400/50 hover:text-white hover:bg-yellow-400/5 transition-all duration-300 text-sm backdrop-blur-sm'>
              What We Offer
            </a>
          </div>
        </div>
      </div>

      {/* Partners Logos */}
      <div className='w-full bg-gradient-to-r from-richblack-800/80 via-richblack-800/50 to-richblack-800/80 border-y border-richblack-700/50 py-12 px-6 backdrop-blur-sm'>
        <p className='text-center text-richblack-400 text-xs font-semibold uppercase tracking-[0.25em] mb-8'>Trusted By Industry Leaders</p>
        <div className='flex justify-center items-center gap-10 md:gap-20 flex-wrap max-w-5xl mx-auto'>
          <img src={Image1} alt="Partner 1" loading='lazy' className='h-12 md:h-16 object-contain opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-500 grayscale hover:grayscale-0' />
          <img src={Image1} alt="Partner 2" loading='lazy' className='h-12 md:h-16 object-contain opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-500 grayscale hover:grayscale-0' />
          <img src={Image1} alt="Partner 3" loading='lazy' className='h-12 md:h-16 object-contain opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-500 grayscale hover:grayscale-0' />
        </div>
      </div>

      {/* Quote Section */}
      <div className='w-full max-w-5xl mx-auto py-20 lg:py-24 px-6'>
        <div className='relative bg-gradient-to-br from-yellow-400/[0.08] via-richblack-800/50 to-orange-400/[0.08] border border-richblack-700/50 rounded-3xl p-10 lg:p-14 text-center shadow-2xl shadow-black/20 backdrop-blur-sm'>
          <div className='absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/30'>
            <FaQuoteLeft className='text-yellow-400 text-sm' />
          </div>
          <p className='text-xl lg:text-2xl font-medium leading-relaxed text-richblack-50 mt-2'>
            We are passionate about how things work and we want to bring
            <span className='text-yellow-400 font-semibold'> a change </span>
            in this industry. We are working on innovation-driven solutions that can help us make a difference
            and create an
            <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-bold'> Unparalleled Experience</span>.
          </p>
          <div className='mt-6 w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto' />
        </div>
      </div>

      {/* Founding Story */}
      <div id="our-story" className='w-full bg-gradient-to-b from-richblack-800 to-richblack-800/80 border-y border-richblack-700/50'>
        <div className='max-w-6xl mx-auto py-20 lg:py-24 px-6'>
          <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20'>
            <div className='flex-1 flex flex-col gap-6'>
              <div className='inline-flex items-center gap-2 text-orange-400'>
                <div className='w-8 h-8 bg-orange-400/10 rounded-lg flex items-center justify-center'>
                  <FaFilm className='text-sm' />
                </div>
                <span className='text-sm font-semibold uppercase tracking-wider'>Our Story</span>
              </div>
              <h2 className='text-3xl lg:text-5xl font-bold text-white leading-tight'>
                Our Founding <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>Story</span>
              </h2>
              <p className='text-richblack-200 leading-relaxed text-base'>
                Our platform was started with a shared vision and passion for transforming the local movie
                ticket selling business. We wanted to create a very structured pipeline that helps makers
                track all their tickets and reviews coming from audiences, and use them as an opportunity
                to rapidly evolve in the digital world.
              </p>
              <p className='text-richblack-300 leading-relaxed text-base'>
                As movie enthusiasts ourselves, we always found it difficult to get trending movies in the
                right budget and the right place. To eliminate that hustle, we launched a project that helps
                audiences find the perfect show, and helps creators monitor all their tickets — ensuring
                no overselling, no losses, and full creative potential.
              </p>
              <div className='flex items-center gap-4 mt-2'>
                <div className='w-12 h-[2px] bg-gradient-to-r from-orange-400 to-transparent rounded-full' />
                <span className='text-richblack-400 text-sm italic'>Started with a dream, building for the future.</span>
              </div>
            </div>
            <div className='w-full lg:w-[440px] flex-shrink-0'>
              <div className='relative group'>
                <div className='absolute -inset-4 bg-gradient-to-br from-orange-400/20 via-yellow-400/10 to-orange-400/20 rounded-3xl blur-2xl group-hover:from-orange-400/30 group-hover:to-yellow-400/30 transition-all duration-700 opacity-70 group-hover:opacity-100' />
                <div className='absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-yellow-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <img src={Image1} alt="Our Story" loading="lazy" className='relative w-full rounded-2xl border border-richblack-600 shadow-2xl group-hover:shadow-orange-400/10 transition-all duration-500' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className='w-full max-w-6xl mx-auto py-20 lg:py-24 px-6'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl lg:text-5xl font-bold text-white'>
            What <span className='bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>Drives</span> Us
          </h2>
          <p className='text-richblack-300 mt-4 text-lg max-w-xl mx-auto'>Our core beliefs that shape everything we build.</p>
          <div className='mt-4 w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mx-auto' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Vision */}
          <div className='group relative border border-richblack-700/50 bg-gradient-to-br from-richblack-800 to-richblack-800/50 rounded-3xl p-8 lg:p-10 hover:border-orange-400/40 transition-all duration-500 overflow-hidden'>
            <div className='absolute top-0 right-0 w-40 h-40 bg-orange-400/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-400/10 transition-colors duration-500' />
            <div className='relative'>
              <div className='w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-400/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-orange-400/30 group-hover:to-orange-400/10 transition-colors duration-500 shadow-lg shadow-orange-400/5'>
                <FaEye className='text-orange-400 text-2xl' />
              </div>
              <h3 className='text-2xl font-bold text-white mb-4'>Our Vision</h3>
              <p className='text-richblack-200 leading-relaxed'>
                With a clear vision in mind, we created this platform and set out on a journey to embrace
                what is next — revolutionizing how the entertainment world works. Our team is working
                tirelessly to build a platform that empowers movie investors, creators, and theatres
                to achieve outstanding results and grow together.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className='group relative border border-richblack-700/50 bg-gradient-to-br from-richblack-800 to-richblack-800/50 rounded-3xl p-8 lg:p-10 hover:border-blue-400/40 transition-all duration-500 overflow-hidden'>
            <div className='absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-400/10 transition-colors duration-500' />
            <div className='relative'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-400/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-400/30 group-hover:to-blue-400/10 transition-colors duration-500 shadow-lg shadow-blue-400/5'>
                <FaRocket className='text-blue-400 text-2xl' />
              </div>
              <h3 className='text-2xl font-bold text-white mb-4'>Our Mission</h3>
              <p className='text-richblack-200 leading-relaxed'>
                Our mission goes beyond just delivering tickets online. We wanted to create a vibrant
                community of organizers and theatres where they can connect, collaborate, and learn
                from one another. We foster collaboration through forums, live sessions, networking
                opportunities, and many more initiatives to grow together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div id="what-we-offer" className='w-full bg-gradient-to-b from-richblack-800 to-richblack-800/80 border-y border-richblack-700/50'>
        <div className='max-w-6xl mx-auto py-20 lg:py-24 px-6'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl lg:text-5xl font-bold text-white'>
              What Makes Us <span className='bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>Different</span>
            </h2>
            <p className='text-richblack-300 mt-4 max-w-2xl mx-auto text-lg'>
              Everything you need, all in one platform.
            </p>
            <div className='mt-4 w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mx-auto' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              {
                icon: FaTicketAlt,
                title: 'Smart Ticketing',
                desc: 'Real-time ticket tracking with zero overselling. Every sale monitored, every seat accounted for.',
                color: 'yellow',
                gradient: 'from-yellow-400/20 to-yellow-400/5',
              },
              {
                icon: FaStar,
                title: 'Real Reviews',
                desc: 'Authentic audience feedback that helps creators improve and audiences choose the best shows.',
                color: 'orange',
                gradient: 'from-orange-400/20 to-orange-400/5',
              },
              {
                icon: FaUsers,
                title: 'Growing Community',
                desc: 'A thriving network of organizers, theatres, and movie lovers collaborating and growing together.',
                color: 'blue',
                gradient: 'from-blue-400/20 to-blue-400/5',
              },
            ].map((item, i) => (
              <div key={i} className='group relative text-center border border-richblack-700/50 bg-gradient-to-b from-richblack-900 to-richblack-900/80 rounded-3xl p-8 lg:p-10 hover:border-richblack-500/50 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500 overflow-hidden hover:-translate-y-1'>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-100
                  ${item.color === 'yellow' ? 'bg-yellow-400/10' :
                    item.color === 'orange' ? 'bg-orange-400/10' :
                    'bg-blue-400/10'}`}
                />
                <div className='relative'>
                  <div className={`w-18 h-18 mx-auto w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-br ${item.gradient} group-hover:scale-110 shadow-lg
                    ${item.color === 'yellow' ? 'shadow-yellow-400/10' :
                      item.color === 'orange' ? 'shadow-orange-400/10' :
                      'shadow-blue-400/10'}`}
                  >
                    <item.icon className={`text-3xl
                      ${item.color === 'yellow' ? 'text-yellow-400' :
                        item.color === 'orange' ? 'text-orange-400' :
                        'text-blue-400'}`}
                    />
                  </div>
                  <h3 className='text-xl font-bold text-white mb-3'>{item.title}</h3>
                  <p className='text-richblack-300 text-sm leading-relaxed'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Counter */}
      <Counter />

      {/* Feedback Form */}
      <FeedbackForm />

      {/* Slider */}
      <div className='w-full'>
        <Slider />
      </div>

      <Footer />
    </div>
  )
}

export default AboutUs
