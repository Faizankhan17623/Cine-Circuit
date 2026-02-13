import React, { useEffect, useState } from 'react'
import Loader from '../extra/Loading'

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
    <div>SiteSettings</div>
  )
}

export default SiteSettings