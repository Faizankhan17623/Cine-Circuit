import React from 'react'
import Navbar from '../Home/Navbar'
import { FaTheaterMasks } from 'react-icons/fa'

const Heading = () => {
    const currentUrl = window.location.href
        const token = currentUrl.split('/')
        let textToRemove = "%20";
        let replacementChar = " ";
        let newArray = token.map(s => s.replaceAll(textToRemove, replacementChar));

  return (
     <div className='text-white w-screen h-screen overflow-hidden bg-richblack-900'>
           <Navbar/>
           <div className='w-full h-full flex flex-col justify-center items-center animate-fadeIn'>
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-4 shadow-lg">
                   <FaTheaterMasks className="text-2xl text-white" />
               </div>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">
                   <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">{newArray[4]}</span>
               </h1>
               <p className="text-richblack-300 text-sm">Explore {newArray[4]} theatres near you</p>
               <div className="mt-4 w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full" />
           </div>
       </div>
  )
}

export default Heading
