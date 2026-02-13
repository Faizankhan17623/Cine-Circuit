import React from 'react'

const AboutUs = () => {
  return (
    <div className='w-full min-h-screen bg-[#0a0e1a] flex flex-col lg:flex-row justify-center items-center px-8 lg:px-16 py-16 gap-12'>
      
      {/* Left Content Section */}
      <div className='w-full lg:w-[50%] flex flex-col justify-center items-start gap-8'>
        
        {/* Heading */}
        <h1 className='text-5xl md:text-6xl lg:text-7xl font-mono font-bold text-white leading-tight'>
          Discover More About Us
        </h1>
        
        {/* Line Decoration */}
        <div className='flex items-center gap-2'>
          <span className="h-[3px] w-20 bg-white rounded-full"></span>
          <span className="h-[3px] w-12 bg-gray-400 rounded-full"></span>
        </div>

        {/* Description */}
        <p className='font-mono text-gray-400 text-base md:text-lg leading-relaxed text-justify'>
          Welcome To the Cine Circuit Website we are an Movie Ticket Booking Companey that helps the Creater of the movies to distribute the ticket's to the right People So that they can help you to reach a massive amount of audience and help you to get more views using our right ways and help the Orgainezer and the Theatrer To Register with us and take their platform online and get more customer that will be helpfull for the succesfull running off Your own business Do love our platform and if you like it please Refer us to the other peoples Thank You
        </p>

        {/* Links */}
        <div className='font-mono flex flex-wrap gap-6 items-center'>
          <a 
            href="/" 
            className='group text-lg md:text-xl text-gray-400 hover:text-white transition-all duration-300 border-b-2 border-transparent hover:border-white pb-1'
          >
            Ask A Question
            <svg className='inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
          
          <a 
            href="/" 
            className='group text-lg md:text-xl text-gray-400 hover:text-white transition-all duration-300 border-b-2 border-transparent hover:border-white pb-1'
          >
            Know More
            <svg className='inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </div>

        {/* Button */}
        <button className='group relative px-8 py-4 bg-white text-[#0a0e1a] text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-gray-200 font-mono'>
          Discover More
        </button>
      </div>

      {/* Right Image Section */}
      <div className='w-full lg:w-[40%] flex justify-center items-center'>
        <div className='relative'>
          {/* Image */}
          <img 
            src='https://res.cloudinary.com/dit2bnxnd/image/upload/v1767976712/Know_more_krxlwz.png' 
            alt="This is the know More" 
            className='h-[300px] md:h-[400px] lg:h-[500px] w-full object-cover rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105 border border-gray-700'
            loading='lazy'
          />
        </div>
      </div>

    </div>
  )
}

export default AboutUs