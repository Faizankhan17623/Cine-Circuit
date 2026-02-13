import React from 'react'
import Navbar from '../Home/Navbar'

const Heading = () => {
    const currentUrl = window.location.href
        const token = currentUrl.split('/')
        // const MainToken = token[4]
        let textToRemove = "%20";
        let replacementChar = " ";
        let newArray = token.map(s => s.replaceAll(textToRemove, replacementChar));
// console.log(newArray);

    //   console.log(token)

  return (
     <div className='text-white w-screen h-screen overflow-hidden'>
           <Navbar/>
           <div className='w-full h-full flex justify-center items-center'>
               This is the Theatre that you have Selected Is {newArray[4]}
           </div>
       </div>
  )
}

export default Heading