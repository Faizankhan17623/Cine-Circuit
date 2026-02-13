import {setlaoding,setVerifiedShows} from '../../Slices/ShowSlice'
import toast from "react-hot-toast";
import { apiConnector } from '../apiConnector';
import {Bothdate} from '../Apis/CreateShowApi'
const {VerifiedDateBoth} = Bothdate

export function AllVerifiedData(token,navigate){
    return async (dispatch)=>{
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }
        
         dispatch(setlaoding(true));
        const ToastId = toast.loading("Fetching user details, please wait...");
        try{

            const response = await apiConnector("GET", VerifiedDateBoth, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch verified shows")
            }

            dispatch(setVerifiedShows(response.data.data))
            toast.success("Verified shows fetched successfully")
            return { success: true, data: response.data.data }

        }catch(error){
             console.error("Error fetching verified shows:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch verified shows")
            return { success: false, error: error.message }
        }finally{ 
            toast.dismiss(ToastId)
         dispatch(setlaoding(false));
        }
    }
}