import InputBox from '../extra/InputBox'
import { FaGooglePlay, FaAppStore, FaLinkedin, FaInstagram, FaTwitter, FaGithub, FaRegCopyright, FaHeart, FaFilm } from "react-icons/fa"

const Footer = () => {
  return (
    <div className='w-full'>
      <InputBox />

      <footer className='w-full bg-richblack-800 border-t border-richblack-700'>
        {/* Main Footer Content */}
        <div className='max-w-6xl mx-auto px-6 py-12 lg:py-16'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8'>

            {/* Brand Column */}
            <div className='sm:col-span-2 lg:col-span-1 flex flex-col gap-5'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center'>
                  <FaFilm className='text-black text-lg' />
                </div>
                <span className='text-xl font-bold text-white'>Cine Circuit</span>
              </div>
              <p className='text-richblack-300 text-sm leading-relaxed'>
                A Ticket Booking platform built by Faizan Khan. Discover the best shows, book effortlessly, and enjoy the cinema experience.
              </p>
              <div className='flex items-center gap-3'>
                <button className='flex items-center gap-2 px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-xl text-sm text-white hover:border-richblack-400 transition-colors'>
                  <FaGooglePlay className='text-base' />
                  <div className='text-left'>
                    <span className='block text-[10px] text-richblack-400 leading-none'>GET IT ON</span>
                    <span className='block text-xs font-semibold leading-tight'>Google Play</span>
                  </div>
                </button>
                <button className='flex items-center gap-2 px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-xl text-sm text-white hover:border-richblack-400 transition-colors'>
                  <FaAppStore className='text-base' />
                  <div className='text-left'>
                    <span className='block text-[10px] text-richblack-400 leading-none'>DOWNLOAD ON</span>
                    <span className='block text-xs font-semibold leading-tight'>App Store</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Company Links */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-sm font-bold text-white uppercase tracking-wider'>Company</h3>
              <div className='flex flex-col gap-2.5'>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>About Us</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Legal Information</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Contact Us</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Blogs</a>
              </div>
            </div>

            {/* Help Center Links */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-sm font-bold text-white uppercase tracking-wider'>Help Center</h3>
              <div className='flex flex-col gap-2.5'>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Become an Organizer</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Become a Theatre Partner</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Complaints</a>
                <a href="/" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Careers</a>
                <a href="mailto:Faizankhan901152@gmail.com" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Report a Bug</a>
              </div>
            </div>

            {/* Contact Info */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-sm font-bold text-white uppercase tracking-wider'>Contact Info</h3>
              <div className='flex flex-col gap-2.5'>
                <a href="tel:+0000000000" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>+91 000 000 0</a>
                <a href="mailto:Faizankhan901152@gmail.com" className='text-richblack-300 text-sm hover:text-yellow-400 transition-colors'>Faizankhan901152@gmail.com</a>
                <p className='text-richblack-400 text-sm'>Made by Cine Circuit</p>
              </div>

              {/* Social Icons */}
              <div className='flex items-center gap-3 mt-1'>
                <a href="/" className='w-9 h-9 bg-richblack-700 border border-richblack-600 rounded-lg flex items-center justify-center text-richblack-300 hover:text-blue-400 hover:border-blue-400/40 transition-all'>
                  <FaLinkedin className='text-sm' />
                </a>
                <a href="/" className='w-9 h-9 bg-richblack-700 border border-richblack-600 rounded-lg flex items-center justify-center text-richblack-300 hover:text-pink-400 hover:border-pink-400/40 transition-all'>
                  <FaInstagram className='text-sm' />
                </a>
                <a href="/" className='w-9 h-9 bg-richblack-700 border border-richblack-600 rounded-lg flex items-center justify-center text-richblack-300 hover:text-blue-500 hover:border-blue-500/40 transition-all'>
                  <FaTwitter className='text-sm' />
                </a>
                <a href="" className='w-9 h-9 bg-richblack-700 border border-richblack-600 rounded-lg flex items-center justify-center text-richblack-300 hover:text-white hover:border-richblack-400 transition-all'>
                  <FaGithub className='text-sm' />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-richblack-700'>
          <div className='max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3'>
            <div className='flex items-center gap-2 text-richblack-400 text-sm'>
              <FaRegCopyright className='text-xs' />
              <span>2026 Cine Circuit</span>
              <span className='text-richblack-600'>|</span>
              <span>All Rights Reserved</span>
            </div>
            <div className='flex items-center gap-1.5 text-richblack-400 text-sm'>
              Made with <FaHeart className='text-red-500 text-xs' /> by Faizan Khan
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
