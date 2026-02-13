import React, { useEffect, useState } from 'react'
import Loader from '../extra/Loading'
import { IoSettings } from 'react-icons/io5'

const SiteSettings = () => {
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
        <IoSettings className="text-2xl text-yellow-200" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Site Settings</h2>
      <p className="text-richblack-300 text-sm max-w-sm">Site configuration and preferences will be available here soon.</p>
    </div>
  )
}

export default SiteSettings
