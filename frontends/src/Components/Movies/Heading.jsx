import React from 'react'
import Navbar from '../Home/Navbar'
const Heading = () => {
    const currentUrl = window.location.href
        const token = currentUrl.split('/')
        const MainToken = token[4]

    return (
    <div className='text-white w-screen h-screen overflow-hidden'>
        <Navbar/>
        <div className='w-full h-full flex justify-center items-center'>
            This is the Movie Genre that you have Selected {MainToken}
        </div>
    </div>
  )
}

export default Heading