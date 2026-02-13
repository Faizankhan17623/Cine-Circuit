import React, { useEffect } from 'react'
import {UserLogout} from '../../Services/operations/Auth'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
const Logout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        const Handler = async()=>{
            const Response = await dispatch(UserLogout(navigate('/')))
            if(!Response.data.success){
                throw new Error("Error in the logout code")
                
            }
            toast.success("user is been Logout")
        }
    },[])
}

export default Logout