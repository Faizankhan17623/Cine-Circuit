import toast from "react-hot-toast";
import {apiConnector} from '../apiConnector.js'
import {setUser,setLoading,setToken,setLogin,setUserImage} from '../../Slices/authSlice.js'
import {setloading,setlikes,setdislikes,setuser,setverification} from '../../Slices/ProfileSlice.js'
import {setStatus,setAttempts,setEditUntil,setRejectedData} from '../../Slices/orgainezerSlice.js'
import {CreateUser,SendOtp,Login,ResetPassword,UpdatePersonalDetails,PersonalChoice,GetAllShows,SpecificShow,Comment,SendMessage,TicketData,Ratings,AllDetails,MovieStats,NavbarData} from '../Apis/UserApi.js'
import {setShow,setlaoding,setallShow} from '../../Slices/ShowSlice.js'
import Cookies from "js-cookie";
// import {setuser} from '../../Slices/ProfileSlice.js'

const {createuser} = CreateUser 
const {createotp} = SendOtp
const {login} = Login
const {LinkSend,Resetpassword} = ResetPassword
const {LikeBanner,DislikeBanner} = PersonalChoice
const {UpdateUsername,UpdatePassword,UpdateImage,UpdateNumber,CurrentUserDetails} = UpdatePersonalDetails
const {AllShows} = GetAllShows
const {specificshow} = SpecificShow
const {Comments,GetAllComment} = Comment
const {SendMessages,UpdateMessage,GetAllMessages} = SendMessage
const {TicketPurchase,TicketPurchasedFullDetail} = TicketData
const {CreateRating,GetAverageRating,GetAllRatingReview} = Ratings
const {GetAllDetails,FindUserNames,FindloginEmail,FinduserEmail,FindNumber} = AllDetails
const {MostLiked,HighlyRated,RecentlyReleased} = MovieStats
const {TheatreData,MovieData} = NavbarData

export function UserDetails (token){
    return async (dispatch) => {
        dispatch(setloading(true))
        const toastId = toast.loading("Loading...")
        try {
               if(!token){
                          navigate("/Login")
                          toast.error("Token is Expired Please Create a new One")
                      }

            const response = await apiConnector("GET", GetAllDetails,null, { Authorization: `Bearer ${token}` })
            // console.log("Current user details fetched successfully", response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setUser(response.data.user))
            // Sync organizer status from populated orgainezerdata
            const orgData = response.data.data?.orgainezerdata;
            if (orgData && typeof orgData === 'object') {
              const backendStatus = orgData.status;
              // Backend "pending" means form submitted, awaiting review
              if (backendStatus === "pending") {
                dispatch(setStatus("submitted"));
              } else if (backendStatus) {
                dispatch(setStatus(backendStatus));
              }
              dispatch(setAttempts(orgData.attempts ?? 0));
              dispatch(setEditUntil(orgData.editUntil ?? ""));
            } else if (orgData) {
              // orgainezerdata exists but wasn't populated (just an ID) — form was submitted
              dispatch(setStatus("submitted"));
            } else {
              // No orgainezerdata at all — new organizer, reset to pending
              dispatch(setStatus("pending"));
              dispatch(setAttempts(0));
              dispatch(setEditUntil(""));
              dispatch(setRejectedData(null));
            }
             return { success: true, data: response.data };
        } catch (error) {
            console.error("Error fetching current user details", error)
        }finally{
             dispatch(setloading(false))
        toast.dismiss(toastId)
        }
    }
}

export function FindUserName(First, Last) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading ...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", FindUserNames, {
                FirstName: First,
                LastName: Last
            })
            // console.log("Api response...", response)
            
              if (!response.data.success) {
            console.log("Api response...", response)
            return { success: false, message: response.data.message };

            }
            // dispatch(setUser(response.data.user))
             return { success: true, data: response.data.message };
        } catch (error) {
            console.error("Error fetching user details", error)
             return { success: false, message: "Error checking username" };
        }finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function findloginemail(email) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", FindloginEmail, {
                email: email
            })
            if (!response.data.success) {
                return { success: false, exists: false, message: response.data.message };
            }
            return { success: true, exists: response.data.exists, data: response.data.message };
        } catch (error) {
            console.error("Error checking email:", error);
            return { success: false, exists: false, message: "Error checking email availability" };
        } finally {
            dispatch(setLoading(false))
        }
    }
}


export function finduseremail(email) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", FinduserEmail, {
                email: email
            })
            if (!response.data.success) {
                return { success: false, exists: false, message: response.data.message };
            }
            return { success: true, exists: response.data.exists, data: response.data.message };
        } catch (error) {
            console.error("Error checking email:", error);
            return { success: false, exists: false, message: "Error checking email availability" };
        } finally {
            dispatch(setLoading(false))
        }
    }
}

export function sendOtp(email){
    return async(dispatch)=>{
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST",createotp,{
                email:email
            })
            // console.log("Api Response",response)
        
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success('otp Send SuccesFully')
            return { success: true, data: response };
        } catch (error) {
            console.log("Error in sending the otp",error)
            console.log("Error in sending the otp")
            return { success: false, error: error.message };
        }
        finally { 
            dispatch(setLoading(false))
        }
    }
}

export function NumberFinder(number) {
    return async (dispatch) => {    
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", FindNumber, {
                number: number
            })
           if (!response.data.success) {
                //    console.log("Api response...", response)
            return { success: false, message: response.data.message };
            }
            // dispatch(setUser(response.data.user))
              return { success: true, data: response.data.message };
        } catch (error) {
             console.error("Error checking email:", error);
      return { success: false, message: "Error checking email availability" };
        }finally {  
            dispatch(setLoading(false))
        }
    }
}


export function UserCreation(name,password,email,number,otp,code){
    return async (dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try {
             if (!name || !password || !email || !number || !otp ) {
                // console.log(name,password,email,number,otp)
        throw new Error('Missing required fields');
      }
            const response = await apiConnector("POST",createuser,{
                name:name,
                password:password,
                email:email,
                number:number,
                otp:String(otp),
                countrycode:code
            })

            //  console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            // toast.success("Signup Successful")
            return { success: true, data: response.data };
        } catch (error) {
           console.log("Sign up failed");
           console.log(error)
      console.error("Error in Creating the user", error.message);
      toast.error(error.message || 'Signup failed'); 
      return { success: false, error: error.message }; 
        }finally {  

        dispatch(setLoading(false))
        toast.dismiss(toastId)
        }
    }
}
         
export function UserLogin(email,pass,navigate){
    return async(dispatch)=>{
        // const toastId = toast.loading("..loading")
        dispatch(setLoading(true))
        try{

             if (!email || !pass) {
                throw new Error('Email and password are required');
            }
            const response = await apiConnector("POST",login,{
                email:email,
                password:pass
            })
            // console.log(response)

            console.log("User is been logged in ")
            toast.success('Congragulations you are logged in')


            dispatch(setToken(response.data.token))
            dispatch(setLogin(true))

            const userimage = response?.data?.user?.image
            // console.log("This is the user image",userimage)
            dispatch(setUserImage(userimage))
            localStorage.setItem("userImage", userimage)
            
            dispatch(setuser({...response.data.user, usertype:response.data.user.usertype, image: userimage}))
            dispatch(setUser(response.data.user))
            Cookies.set('token', response.data.token, { expires: 2 }); 
            localStorage.setItem('token', JSON.stringify(response.data.token))
            localStorage.setItem('Verified', JSON.stringify(response.data.user.verified))
            navigate('/Dashboard/My-Profile')

      if (!response.data.success) {
                throw new Error(response.data.message)
            }

            
        }catch(error){
            toast.error(error.response.data.message)
            console.log(error.response.data.message)
            console.log("There is an error in the login process",error)
            console.log("unable to log in")
        }

        dispatch(setLoading(false))
        // toast.dismiss(toastId)  

    }
}

// and if any thing extra is needed to add we wil add that in the code in future
export function UserLogout(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setLoading(true))
        try{
            dispatch(setToken(null))
            dispatch(setUser(null))
            localStorage.removeItem('token')
            Cookies.remove('token');
            localStorage.removeItem('userImage')
            localStorage.removeItem('user')
            localStorage.removeItem('Verified')
            localStorage.removeItem('Data_Submitted')

            dispatch(setLogin(false))
            dispatch(setStatus("pending"))
            dispatch(setAttempts(0))
            dispatch(setEditUntil(""))
            dispatch(setRejectedData(null))
        }catch(error){
            console.log("There is an error in the logout process",error)
            console.log("unable to log out")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function GetPasswordResettoken(email,emailsend){
    return async(dispatch)=>{
        // const toastId = toast.loading("..loading")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST",LinkSend,{
                email:email
            })
            console.log("This is the responsee data",response)
            console.log("Reset Password Token Send")

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Link Send Successfully")
            emailsend(true)
            return { success: true, data: response.data };
        } catch (error) {
            console.log("Error in updating the password",error)
            console.log("Error in updating the password")
        }
        dispatch(setloading(false))
        // toast.dismiss(toastId)
    }
}

export function Restpassword(password,ConfirmPassword,token,navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setLoading(true))
        try {
            if(!token){
                navigate("/Forgot-Password")
                toast.error("Token is Expired Please Create a new One")
            }
            const response = await apiConnector("PUT",Resetpassword,{
                password,
                ConfirmPassword,
                token
            })
            console.log("This Password Has Been Resetted")

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
        } catch (error) {
            console.log("Error in updating the password",error)
            console.log("Error in updating the password")
            toast.error(error.response.data.message || "Error in resetting the password")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


// From herewe will put all the code that is going to se to update the data user fields
export function Updateusername(name){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT",UpdateUsername,{
                userName:name
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setUser(response.data.user))
            toast.success("UserName Updated Successfully")
        } catch (error) {
            console.log("Error in updating the username",error)
            console.log(error.message)
            console.log("Error in updating the username")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function Updatepassword(newpass,oldpass){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {

            const response = await apiConnector("PUT",UpdatePassword,{
                password:newpass
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Password Updated Successfully")
        } catch (error) {
            console.log("Error in updating the password",error)
            console.log("Error in updating the password")
            console.log("The old password is not correct")
            console.log(oldpass)
            toast.error("The old password is not correct")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function Updateimage(image){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT",UpdateImage,{
                image:image
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Image Updated Successfully")
        } catch (error) {
            console.log("Error in updating the image",error)
            console.log("Error in updating the image")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function Updatenumber(newnumber){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT",UpdateNumber,{
                number:newnumber
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Number Updated Successfully")
        } catch (error) {
            console.log("Error in updating the number",error)
            console.log("Error in updating the number")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function GetCurrentUserDetails(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("GET",CurrentUserDetails)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            dispatch(setUser(response.data.user))
        } catch (error) {
            console.log("Error in getting the current user details",error)
            console.log("Error in getting the current user details")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}


// here w will put some data of the personal details and this are all the function that are like  using the peersonal details and the personal slice

export function bannerLike(id, token){
    return async(dispatch)=>{
        const toastId = toast.loading("Liking...")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT", `${LikeBanner}?id=${id}`, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Liked successfully")
            return { success: true, likes: response.data.likes, dislikes: response.data.dislikes }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error liking"
            toast.error(errorMessage)
            return { success: false }
        } finally {
            dispatch(setloading(false))
            toast.dismiss(toastId)
        }
    }
}

export function bannerDislike(id, token){
    return async(dispatch)=>{
        const toastId = toast.loading("Disliking...")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT", `${DislikeBanner}?id=${id}`, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Disliked successfully")
            return { success: true, likes: response.data.likes, dislikes: response.data.dislikes }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error disliking"
            toast.error(errorMessage)
            return { success: false }
        } finally {
            dispatch(setloading(false))
            toast.dismiss(toastId)
        }
    }
}

export function GetAllShowsData(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try {
            const response = await apiConnector("GET",AllShows)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setallShow(response.data.shows))
        } catch (error) {
            console.log("Error in getting the all shows data",error)
            console.log("Error in getting the all shows data")
        }
        dispatch(setlaoding(false))
        toast.dismiss(toastId)
    }
}

export function GetSpecificShowData(id){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try {
            const response = await apiConnector("GET",specificshow,{
                id
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setShow(response.data.show))
        } catch (error) {
            console.log("Error in getting the specific show data",error)
            console.log("Error in getting the specific show data")
        }
        dispatch(setlaoding(false))
        toast.dismiss(toastId)
    }
}

export function CommentOnBanner(id,comment){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT",Comments,{
                id,
                comment:comment
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Comment Added Successfully")
        } catch (error) {
            console.log("Error in commenting on the banner",error)
            console.log("Error in commenting on the banner")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function GetAllComments(id){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("GET",GetAllComment,{
                id
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setShow(response.data.show))
        } catch (error) {
            console.log("Error in getting the all comments data",error)
            console.log("Error in getting the all comments data")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function SendMessageFriends(to,message,type){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("POST",SendMessages,{
                to:to,
                message:message,
                typeOfmessage:type
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Message Send Successfully")
        } catch (error) {
            console.log("Error in sending the message",error)
            console.log("Error in sending the message")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function Updatemessage(id,message){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("PUT",UpdateMessage,{
                id,
                message:message
            })
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Message Updated Successfully")
        } catch (error) {
            console.log("Error in updating the message",error)
            console.log("Error in updating the message")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function GetallMessages(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("GET",GetAllMessages)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setShow(response.data.show))
        } catch (error) {
            console.log("Error in getting the all messages data",error)
            console.log("Error in getting the all messages data")
        }
        dispatch(setloading(false))
        toast.dismiss(toastId)
    }
}

export function ticketpurchased(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try{
            const response = await apiConnector("GET",TicketPurchase)
            dispatch(setuser(response.data.user))
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setShow(response.data.show))            
        }catch(error){
            console.log("Error in getting the ticket purchase data",error)
            console.log("Error in getting the ticket purchase data")
        }
        dispatch(setlaoding(false))
        toast.dismiss(toastId)
    }
}

export function ticketpurchasedfull(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try{
            const response = await apiConnector("GET",TicketPurchasedFullDetail)
            dispatch(setuser(response.data.user))
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setShow(response.data.show))            
        }catch(error){
            console.log("Error in getting the ticket purchase data",error)
            console.log("Error in getting the ticket purchase data")
        }
        dispatch(setlaoding(false))
        toast.dismiss(toastId)
    }
}

export function createRating(rating, showId, review, token){
    return async(dispatch)=>{
        const toastId = toast.loading("Submitting your review...")
        dispatch(setloading(true))
        try {
            const response = await apiConnector("POST", CreateRating, {
                rating,
                review,
                showId,
            }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Rating submitted successfully")
            return { success: true, data: response.data }
        } catch (error) {
            console.log("Error in creating the rating", error)
            const errorMessage = error?.response?.data?.message || "Error submitting rating"
            toast.error(errorMessage)
            return { success: false }
        } finally {
            dispatch(setloading(false))
            toast.dismiss(toastId)
        }
    }
}   

export function getAverageRating(Showid){
    return async(dispatch)=>{
        try {
            const response = await apiConnector("GET", `${GetAverageRating}?Showid=${Showid}`)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, averageRating: response.data.averageRating }
        } catch (error) {
            console.log("Error in getting the average rating", error)
            return { success: false, averageRating: 0 }
        }
    }
}

export function getAllRatingReview(){
    return async(dispatch)=>{
        try {
            const response = await apiConnector("GET", GetAllRatingReview)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the all rating and review", error)
            return { success: false, data: [] }
        }
    }
}

export function getMostLikedMovies(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try {
            const response = await apiConnector("GET",MostLiked)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the most liked movies",error)
            console.log("Error in getting the most liked movies")
            return { success: false, data: [] }
        }finally{
            dispatch(setlaoding(false))
            toast.dismiss(toastId)
        }
    }
}

export function getHighlyRatedMovies(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try {
            const response = await apiConnector("GET",HighlyRated)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the highly rated movies",error)
            console.log("Error in getting the highly rated movies")
            return { success: false, data: [] }
        }finally{
            dispatch(setlaoding(false))
            toast.dismiss(toastId)
        }
    }
}

export function getRecentlyReleasedMovies(){
    return async(dispatch)=>{
        const toastId = toast.loading("..loading")
        dispatch(setlaoding(true))
        try {
            const response = await apiConnector("GET",RecentlyReleased)
            console.log("This is the responsee data",response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the recently released movies",error)
            console.log("Error in getting the recently released movies")
            return { success: false, data: [] }
        }finally{
            dispatch(setlaoding(false))
            toast.dismiss(toastId)
        }
    }
}

export function getNavbarMovieData(){
    return async(dispatch)=>{
        try {
            const response = await apiConnector("GET",MovieData)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the navbar movie data",error)
            return { success: false, data: [] }
        }
    }
}

export function getNavbarTheatreData(){
    return async(dispatch)=>{
        try {
            const response = await apiConnector("GET",TheatreData)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log("Error in getting the navbar theatre data",error)
            return { success: false, data: [] }
        }
    }
}