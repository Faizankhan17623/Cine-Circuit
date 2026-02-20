import toast from "react-hot-toast";
import {apiConnector} from '../apiConnector'
import {setuser,setloading,setCooldownDate } from '../../Slices/ProfileSlice'
import {setUser,setLoading,setToken,setLogin,setUserImage} from '../../Slices/authSlice.js'

import  {AllDetails,UpdatePersonalDetails,Ratings,Display,TicketData} from '../Apis/UserApi'
import {UserLogout} from './Auth'

const {GetAllDetails} = AllDetails
const {UpdateImage} = UpdatePersonalDetails

const {banner,finder} = Ratings

const {Movie,Theatre,Details,purchase,theatreshows,singletheatre} =  Display

const {TicketPurchase,TicketPurchasedFullDetail} = TicketData

export function GetAllUserDetails(token,navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const ToastId = toast.loading("Fetching user details, please wait...");
        try {

             if(!token){
                          navigate("/Login")
                          toast.error("Token is Expired Please Create a new One")
                      }
            const response = await apiConnector("GET", GetAllDetails,null,{
                Authorization: `Bearer ${token}`
            });

            console.log("User details fetched successfully");
            // console.log("User details fetched successfully", response);


            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch user details");
            }
               const userimage = response.data.image

            dispatch(setuser({...response.data.data, image: userimage}));

            return { success: true, data: response.data };
        } catch (error) {
            dispatch(UserLogout(navigate));
            console.error("Error fetching user details:", error);
            return { success: false, error: error.message };
        } 
        finally {
            toast.dismiss(ToastId);
            dispatch(setLoading(false));
        }
    };
}

export function Changeimage(token, newImage,navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const ToastId = toast.loading("Changing user image, please wait...");
        try {
             if(!token){
                          navigate("/Login")
                          toast.error("Token is Expired login")
                      }
            // Prepare FormData
            const formData = new FormData();
            formData.append("displayPicture", newImage);

            const response = await apiConnector("PUT", UpdateImage, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            });

            console.log("The image is been updated")
            if (!response.data.success) {
        if (response.data.nextChangeDate) { // ⬅️ CHANGED - Save cooldown
          dispatch(setCooldownDate(response.data.nextChangeDate));
        }
        throw new Error(response.data.message || "Image update failed");
      }
  if (response.data.nextChangeDate) {
        dispatch(setCooldownDate(response.data.nextChangeDate));
      }
         
            const userimage = response?.data?.data?.image
             dispatch(setUserImage(userimage))
            localStorage.setItem("userImage", userimage)
              dispatch(setuser({...response.data.data, image: userimage}));
                 toast.success("Profile image updated successfully");
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error changing user image:", error);
            console.error(error.response.data.message);
            toast.error(error.response.data.message)
            toast.error(error.message || "Error updating image");

            return { success: false, error: error.message };
        } finally {
            toast.dismiss(ToastId);
        dispatch(setLoading(false));
        }
    };
}

export function BannerImages (){
    return async(dispatch) =>{
         dispatch(setLoading(true));
        const ToastId = toast.loading("Changing user image, please wait...");
        try{

              const response = await apiConnector("GET", banner, null)

        if (response.data.success) {
            return { success: true, data: response.data };
        }

        }catch(error){
            console.log(error)
            console.log(error.message)
            toast.error("Errorin the banner Image")
        }finally{
             toast.dismiss(ToastId);
        dispatch(setLoading(false));
        }
    }    
}

export function Finders (locationname,moviename,theatrename,date){
    return async(dispatch)=>{
         dispatch(setLoading(true));
        const ToastId = toast.loading("Finding Movie Details, please wait...");
        try{

             const response = await apiConnector("POST", finder, {
                location:locationname,
                movie:moviename,
                theatre:theatrename,
                date:date
             })
// hello this is the for the tesing 
              if (response.data.success) {
            return { success: true, data: response.data };
        }

        
        }catch(error){
             console.log(error)
            console.log(error.message)
            toast.error("Errorin the Finders code")
        }finally{
             toast.dismiss(ToastId);
        dispatch(setLoading(false));
        }
    }
}


export function MovieFinding (movie){
    return async(dispatch)=>{
         dispatch(setLoading(true));
        const ToastId = toast.loading("Finding Movie Details, please wait...");
        try{
 const response = await apiConnector("POST", Movie, {
                movies:movie
             })
// hello this is the for the tesing 
                if (response.data.success) {
                return { success: true, data: response.data };
            }
    }catch(error){
        console.log(error)
            console.log(error.message)
            toast.error("Errorin the Finders code")
    }finally{
        toast.dismiss(ToastId);
        dispatch(setLoading(false));
    }
    }
}


export function TheatreFinding (theat){
    return async(dispatch)=>{
         dispatch(setLoading(true));
        const ToastId = toast.loading("Finding Movie Details, please wait...");
        try{
 const response = await apiConnector("POST", Theatre, {
                theatre:theat
             })

              if (response.data.success) {
            return { success: true, data: response.data };
        }
    }catch(error){
        console.log(error)
            console.log(error.message)
            toast.error("Errorin the Theatres code")
    }finally{
        toast.dismiss(ToastId);
        dispatch(setLoading(false));
    }
    }
}

export function MovieDetailsFinding(id) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    const ToastId = toast.loading("Fetching movie details...");

    try {
     const response = await apiConnector(
  "GET",
  `${Details}?id=${id}`
)

      if (response.data.success) {
        return {
          success: true,
          data: response.data
        };
      }

    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.error("Error fetching movie details");
    } finally {
      toast.dismiss(ToastId);
      dispatch(setLoading(false));
    }
  };
}


export function TheatreDetails (id){
     return async (dispatch) => {
    dispatch(setLoading(true));

    const ToastId = toast.loading("Fetching  details...");

    try {
     const response = await apiConnector(
  "GET",
  `${purchase}?id=${id}`
)

      if (response.data.success) {
        return {
          success: true,
          data: response.data
        };
      }

    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast.error("Error fetching  details");
    } finally {
      toast.dismiss(ToastId);
      dispatch(setLoading(false));
    }
  };
}

export function PurcahsedTickets (token, navigate){
    return async (dispatch)=>{
        dispatch(setLoading(true))
        const toastId = toast.loading("Fetching your tickets...")
        try{
            if(!token){
                navigate("/Login")
                toast.error("Token is expired, please login again")
                return
            }

            const response = await apiConnector("GET", TicketPurchase, null, {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            return { success: true, data: response.data }

        }catch(error){
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Error fetching tickets"
            toast.error(errorMessage)
            return { success: false, error: error.message }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function PurchasedTicketsFullDetails (token, navigate){
    return async (dispatch)=>{
        dispatch(setLoading(true))
        const toastId = toast.loading("Fetching ticket details...")
        try{
            if(!token){
                navigate("/Login")
                toast.error("Token is expired, please login again")
                return
            }

            const response = await apiConnector("GET", TicketPurchasedFullDetail, null, {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            return { success: true, data: response.data }

        }catch(error){
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Error fetching ticket details"
            toast.error(errorMessage)
            return { success: false, error: error.message }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function TheatreShowsFinding(theatreId) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        const toastId = toast.loading("Fetching shows...")
        try {
            const response = await apiConnector("GET",`${theatreshows}?Theatreid=${theatreId}`)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Error fetching shows"
            toast.error(errorMessage)
            return { success: false }
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}


export function SingleTheatreDetails(theatreId) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        const toastId = toast.loading("Fetching Details...")
        try {
            const response = await apiConnector("GET",`${singletheatre}?theatreid=${theatreId}`)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Error in theatre fetching shows"
            toast.error(errorMessage)
            return { success: false }
        } finally {
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

