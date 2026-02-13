import React, { useEffect, useState } from 'react'
// Calculate the difference in seconds and minutes and hours between two dates date 7 
const Banner = () => {
  const [days, setdays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(()=>{
      const timer = setInterval(() => {
        const Datenow = new Date()

    const Expirydate = new Date('2025-05-07T23:59:59')
    const difference = Expirydate - Datenow

    // we have to calcuate the total days minutes and second usin the differenece and convert it to the format 
    const Days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const Hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const Minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const Seconds = Math.floor((difference % (1000 * 60)) / 1000)
    setdays(Days)
    setHours(Hours)
    setMinutes(Minutes)
    setSeconds(Seconds)
      }, 1000)
      return () => clearInterval(timer)
    },[])

  return (
    <div className='text-white flex flex-col justify-center items-center  w-full h-full overflow-x-hidden '>
      <h2 className='text-xl'>Some Thing Big Is Coming Sooon</h2>
      <div className='flex  justify-center items-center gap-10 mt-4'>
      <p className='text-red-700'>Days : {days}</p>
      <p className='text-red-700'>Hours :{hours}</p>
      <p className='text-red-700'>Minutes : {minutes}</p>
      <p className='text-red-700'>Seconds : {seconds}</p>
      </div>
    </div>
  )
}

export default Banner







// Keep This data of banner for a few days


// const Banner = () => {
//   const [days, setdays] = useState(0)
//     const [hours, setHours] = useState(0)
//     const [minutes, setMinutes] = useState(0)
//     const [seconds, setSeconds] = useState(0)

//     useEffect(()=>{
//       const timer = setInterval(() => {
//         const Datenow = new Date()

//     const Expirydate = new Date('2025-05-07T23:59:59')
//     const difference = Expirydate - Datenow

//     // we have to calcuate the total days minutes and second usin the differenece and convert it to the format 
//     const Days = Math.floor(difference / (1000 * 60 * 60 * 24))
//     const Hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//     const Minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
//     const Seconds = Math.floor((difference % (1000 * 60)) / 1000)
//     setdays(Days)
//     setHours(Hours)
//     setMinutes(Minutes)
//     setSeconds(Seconds)
//       }, 1000)
//       return () => clearInterval(timer)
//     },[])
    
//   return (
//     <div className='text-white flex flex-col justify-center items-center  w-full h-full overflow-x-hidden '>
//       <h2 className='text-xl'>Some Thing Big Is Coming Sooon</h2>
//       <div className='flex  justify-center items-center gap-10 mt-4'>
//       <p className='text-red-700'>Days : {days}</p>
//       <p className='text-red-700'>Hours :{hours}</p>
//       <p className='text-red-700'>Minutes : {minutes}</p>
//       <p className='text-red-700'>Seconds : {seconds}</p>
//       </div>
//     </div>
//   )
// }
