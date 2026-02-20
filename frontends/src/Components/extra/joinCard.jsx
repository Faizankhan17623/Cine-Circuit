import React from 'react'

const JoinCard = ({ title, subttitle, btn, imaage, onClick }) => {
  
  return (
    <div className='group max-w-5xl w-full mx-auto rounded-2xl flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 bg-gradient-to-br from-richblack-800 to-richblack-800/80 border border-richblack-700/60 shadow-xl my-6'>

      <div className='w-full md:w-[40%] font-inter flex flex-col gap-4 p-2 md:p-4 justify-center items-start'>
        <h1 className='text-2xl md:text-3xl font-bold text-white'>{title}</h1>
        <p className='text-richblack-300 text-sm leading-relaxed'>{subttitle}</p>

        <button
          onClick={onClick}
          className='rounded-lg px-6 py-2.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-richblack-900 font-semibold text-sm hover:brightness-110 transition-all duration-200 shadow-md shadow-yellow-50/10 cursor-pointer'
        >
          {btn}
        </button>
      </div>

      <div className='w-full md:w-[60%] h-[200px] md:h-[260px] overflow-hidden rounded-xl'>
        <img
          src={imaage}
          alt="This is the banner image"
          className='w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105'
          draggable="false"
          loading='lazy'
        />
      </div>

    </div>
  )
}

export default JoinCard
