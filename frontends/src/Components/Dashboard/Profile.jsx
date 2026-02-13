import React, { useEffect, useState } from 'react'
import Loader from '../extra/Loading'
import Iconbtn from '../extra/IconBtn'
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {GetAllUserDetails} from '../../Services/operations/User'
import {GetAllOrgDetails} from '../../Services/operations/Admin'

const Profile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const {isLoggedIn,image,user,token} = useSelector((state)=>state.auth)
  const [loading,setloading] = useState(false)
  const [data,setdata] = useState()

  useEffect(()=>{
    setloading(true)
    const Handler = setTimeout(() => {
      setloading(false)
    }, 2000);

    return ()=>clearTimeout(Handler)
  },[])

  useEffect(()=>{
    const Handlerr = async()=>{
      if (!token) return;
      try{
        const Repsonse = await dispatch(GetAllUserDetails(token,navigate))
        // console.log(Repsonse.data.data)
        setdata(Repsonse.data.data)

          if (Repsonse?.success) {
    setdata(Repsonse.data.data);
  }
      }catch(error){
        console.log(error)
      }
    }
    Handlerr()
  },[token,navigate,dispatch])

  //   useEffect(()=>{
  //   const Handlerr = async()=>{
  //     if (!token) return;
  //     try{
  //       const Repsonse = await dispatch(GetAllOrgDetails(token,navigate))
  //       console.log(Repsonse,"This ist he respons data")
  //     }catch(error){
  //       console.log(error)
  //     }
  //   }
  //   Handlerr()
  // },[token])

  if(loading){
    return (
            <div className='w-full h-full flex justify-center items-center'>
              <Loader/>
            </div>
    )
  }
  const handleSettingsClick = () => {navigate("/Dashboard/settings")};
  const name = data?.userName ? data?.userName.split(' ') : [];


  const FormatNumber = (number)=>{
    const Str = String(number)
    return  Str.slice(0,5) + ' ' + Str.slice(5)
  }
  
  return (
    <div className='w-full h-full flex flex-col justify-start items-center gap-5 overflow-hidden text-white'>
      <div className='w-full h-24 flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-start items-start w-full Profile gap-2'>
          <p className='text-richblack-300'>Home / Dashboard / <span className='text-yellow-100'>My Profile</span></p>
          <h1 className='text-white font-bold text-2xl'>My Profile</h1>
        </div>
      </div>

      <div className=' w-[800px] h-94 flex justify-around items-center flex-col'>
      <div className='w-full h-30 bg-richblack-800 flex flex-row justify-around items-center'>
        <div className='w-[600px] h-22  flex flex-row justify-center items-center gap-4'>

        <img src={isLoggedIn ? image : <Loader />} alt="Profile Image " loading='lazy' draggable="false" className="rounded-4xl w-20 h-20 rounded-full object-cover border-4 border-yellow-300"/>
          <span className='w-[526px]  h-15'>
          <h1 className='font-black text-2xl'>{data?.userName || "No Name"}</h1>
          <h1 className='font-italic text-richblack-300'>{data?.email || "No Email"}</h1>
          </span>

        </div>

        <Iconbtn text={<FaRegEdit/>} children={"Edit"} onclick={handleSettingsClick} disabled={false} customClasses={'h-[40px] w-[96px] flex justify-center items-center'}/>
      </div>

      <div className='w-full h-60  bg-richblack-800 flex flex-col justify-around items-center'>
        <div className='h-[40px] w-[744px]  flex justify-around items-center'>
          <h2 className='text-white w-[650px] font-mono text-xl'>Personal Details</h2>
        <Iconbtn text={<FaRegEdit/>} children={"Edit"} onclick={handleSettingsClick} disabled={false} customClasses={'h-[40px] w-[96px] flex justify-center items-center'}/>

        </div>
        <div className='h-[46px] w-[744px]  flex justify-between items-center'>
          <div className='w-1/2 flex flex-col gap-2'>
            <span className='text-richblack-600'>First Name</span>
            <span className='text-richblack-5'>{name[0]}</span>
          </div>

          <div className='w-1/2 flex flex-col gap-2'>
            <span className='text-richblack-600'>Last Name</span>
            <span className='text-richblack-5'>{name[1]}</span>
          </div>
        </div>
        <div className='h-[46px] w-[744px]  flex justify-between items-center'>
          <div className='w-1/2 flex flex-col gap-2'>
            <span className='text-richblack-600'>Email</span>
            <span className='text-richblack-300'>{data?.email}</span>
          </div>

          <div className='w-1/2 flex flex-col gap-2'>
            <span className='text-richblack-600'>Phone Number</span>
            {/* countrycode */}
            <span className='text-richblack-5'> ({data?.countrycode}) {data?.number ? FormatNumber(data.number):""}</span>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}

export default Profile