import React, { useEffect, useState } from 'react'
import Loader from '../extra/Loading'
import { CiBookmark } from 'react-icons/ci'

const Wishlist = () => {
   const [loading,setloading] = useState(false)
  useEffect(()=>{
    setloading(true)
    const Handler = setTimeout(() => {
      setloading(false)
    }, 2000);

    return ()=>clearTimeout(Handler)
  },[])


  if(loading){
    return (
            <div className='w-full h-full flex justify-center items-center'>
              <Loader/>
            </div>
    )
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-richblack-700 flex items-center justify-center mb-4">
        <CiBookmark className="text-3xl text-yellow-200" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Your Wishlist</h2>
      <p className="text-richblack-300 text-sm max-w-sm">Movies and shows you save will appear here. Start exploring and bookmark your favorites!</p>
    </div>
  )
}

export default Wishlist
