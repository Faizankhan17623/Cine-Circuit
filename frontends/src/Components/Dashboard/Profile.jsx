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
    <div className='w-full h-full flex flex-col justify-start items-center gap-6 overflow-y-auto text-white animate-fadeIn'>
      <div className='w-full max-w-4xl px-6 pt-8'>
        <div className='flex flex-col justify-start items-start gap-2'>
          <p className='text-richblack-300 text-sm'>Home / Dashboard / <span className='text-yellow-100'>My Profile</span></p>
          <h1 className='text-white font-bold text-2xl'>My Profile</h1>
        </div>
      </div>

      <div className='max-w-4xl w-full px-6 flex flex-col gap-6 pb-8'>
      <div className='w-full bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-row justify-between items-center'>
        <div className='flex flex-row items-center gap-4'>

        <img src={isLoggedIn ? image : <Loader />} alt="Profile Image " loading='lazy' draggable="false" className="w-20 h-20 rounded-full object-cover border-4 border-yellow-300"/>
          <div>
          <h1 className='font-black text-2xl'>{data?.userName || "No Name"}</h1>
          <h1 className='text-richblack-300 text-sm'>{data?.email || "No Email"}</h1>
          </div>

        </div>

        <Iconbtn text={<FaRegEdit/>} children={"Edit"} onclick={handleSettingsClick} disabled={false} customClasses={'h-[40px] w-[96px] flex justify-center items-center'}/>
      </div>

      <div className='w-full bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-white font-semibold text-lg'>Personal Details</h2>
        <Iconbtn text={<FaRegEdit/>} children={"Edit"} onclick={handleSettingsClick} disabled={false} customClasses={'h-[40px] w-[96px] flex justify-center items-center'}/>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs uppercase tracking-wider text-richblack-400'>First Name</span>
            <span className='text-richblack-5'>{name[0]}</span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs uppercase tracking-wider text-richblack-400'>Last Name</span>
            <span className='text-richblack-5'>{name[1]}</span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs uppercase tracking-wider text-richblack-400'>Email</span>
            <span className='text-richblack-300'>{data?.email}</span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs uppercase tracking-wider text-richblack-400'>Phone Number</span>
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
