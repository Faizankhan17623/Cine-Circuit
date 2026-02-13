import {CreateTheatrere,Theatreinfo,AllTheatres,TheatreCreationRequest,DistributeTickets,UpdateTicketTime,TicketsCreated,TheatreDetails,totalsale,GetShowAllotedDetails,GetAllTicketsDetails,GetSingleShowDetails} from '../Apis/TheatreApi'
import {setTheatre,setLoading,setImage,setUser} from '../../Slices/TheatreSlice'
import { toast } from 'react-hot-toast'
import {apiConnector} from '../apiConnector'

const {CreateTheatre} = CreateTheatrere
const {tt} = Theatreinfo
const {Alltheatres} = AllTheatres
const {theatrecreationrequest} = TheatreCreationRequest

const {distributetickets} = DistributeTickets
const {updatetickettime} = UpdateTicketTime
const {ticketscreated} = TicketsCreated
const {theatredetails} = TheatreDetails
const {TotalSale} = totalsale
const {getshowalloteddetails} = GetShowAllotedDetails
const {getallticketsdetails} = GetAllTicketsDetails
const {getsingleshowdetails} = GetSingleShowDetails
// const {TheatreInfo} = 

export function CreateTheatree(name,email,pasword,number){
    return async(dispatch)=>{
        const toastId = toast.loading("Creating Theatre")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", CreateTheatre, {
                userName:name,
                email:email,
                password:pasword,
                number:number
            })

            console.log("Theatre created successfully", response)

            if(!response.data.success){
                toast.error("The Theatre is not been created")
                return
            }
            dispatch(setTheatre(response.data.theatre))
            dispatch(setImage(response.data.image))
            toast.success("The Theatre is been created")
        } catch (error) {
            console.log(error)
            toast.error("Error in creating theatre")
            console.log("error whle creating the theatre")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function theatreinfo(email,name,locationname,locationurl,typesofseats,Screentypes,languageAvailable,parking,image){
    return async(dispatch)=>{
        const toastId = toast.loading("Getting Theatre Info")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", TheatreInfo, {
                email:email,
                username:name,
                locationName:locationname,
                locationurl:locationurl,
                typesofseatsAvailable:typesofseats,
                movieScreeningType:Screentypes,
                languagesAvailable:languageAvailable,
                parkingAvailable:parking,
                Theatreimages:image
            })

            console.log("Theatre info fetched successfully", response)

            if(!response.data.success){
                toast.error("The Theatre info is not fetched")
                return
            }
            dispatch(setUser(response.data.theatre))
            
            toast.success("The Theatre info is fetched")
        } catch (error) {
            console.log(error)
            toast.error("Error in getting theatre info")
            console.log("error whle getting the theatre info")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function AllTheatresInfo(){
    return async(dispatch)=>{
        const toastId = toast.loading("Getting All Theatre Info")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET", Alltheatres)

            console.log("All Theatre info fetched successfully", response)

            if(!response.data.success){
                toast.error("The All Theatre info is not fetched")
                return
            }
            dispatch(setUser(response.data.theatre))
            
            toast.success("The All Theatre info is fetched")
        } catch (error) {
            console.log(error)
            toast.error("Error in getting all theatre info")
            console.log("error whle getting the all theatre info")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function TheatreCreationRequestInfo(){
    return async(dispatch)=>{
        const toastId = toast.loading("Getting Theatre Creation Request Info")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET", theatrecreationrequest)

            console.log("Theatre Creation Request info fetched successfully", response)

            if(!response.data.success){
                toast.error("The Theatre Creation Request info is not fetched")
                return
            }
            dispatch(setUser(response.data.theatre))
            
            toast.success("The Theatre Creation Request info is fetched")
        } catch (error) {
            console.log(error)
            toast.error("Error in getting theatre creation request info")
            console.log("error whle getting the theatre creation request info")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


// query main show id and body main see user id

export function DistributeTicketsInfo(ticketCreation,releasedate,showid){
    return async(dispatch)=>{
        const toastId = toast.loading("Distributing Tickets")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", distributetickets, {
                showId:showid,
               Date:releasedate,
               ticketsCategory:ticketCreation
            })

            console.log("Tickets distributed successfully", response)

            if(!response.data.success){
                toast.error("The Tickets are not distributed")
                return
            }
            dispatch(setUser(response.data.theatre))
            
            toast.success("The Tickets are distributed")
        } catch (error) {
            console.log(error)
            toast.error("Error in distributing tickets")
            console.log("error whle distributing the tickets")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function updateticketTime(theatreid,showid,tickeetid,time){
    return async (dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector('PUT',updatetickettime,{
                showId:showid,
                theatreId:theatreid,
                _id:tickeetid,
                timings:time
            })

             console.log("Tickets time updated succesfully", response)

            if(!response.data.success){
                toast.error("The time is not updated")
                return
            }
            dispatch(setUser(response.data.id))
            
            toast.success("Ticket time is been updated")
        }catch(error){
            console.log(error)
            console.log("there is an error in the update tickeet time code")
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function GetTicketsCreatedData(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("GET",ticketscreated)
            
            if(!response.data.success){
                toast.error("There is an error in fetching all tickeets created data")
                return
            }

            dispatch(setUser(response.data.id))
            toast.success("the data is been reterived")
        }catch(error){
            console.log(error)
            console.log("There is an error in the reteriving all he tickets data")
            toast.error("There is an error in the reteriving all he tickets data")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}



// This is the function that will fetch all the data of our own theatre
export function GetTheatreDetails(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("GET",theatredetails)
            
            if(!response.data.success){
                toast.error("error in fetching the data of the theatre")
                return
            }
            dispatch(setUser(response.data.id))
            toast.success("Theatre details fetched succesfully")
        }catch(error){
            console.log(error)
            console.log("There is an error in fetching the theatre details")
            toast.error("There is an error in fetching the theatre details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function CalculatTotalSale(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("GET",TotalSale)
            console.log("This is the total sale response",response)
            if(!response.data.success){
                toast.error("Therre is an error while fetching the total sale")
                return
            }
            dispatch(setUser(response.data.id))
            toast.success("The total sale data is been reterived")
        }catch(error){
            console.log(error)
            console.log("There is an error while fetching the total sale")
            toast.error("There is an error while fetching the total sale")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function GetShowAllotdDetailes(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("GET",getshowalloteddetails)
            
            if(!response.data.success){
                toast.error("There is an error while reteriving all the show details")
                return
            }
            dispatch(setUser(response.data.id))
            toast.success("The show details are been succesfully fetched")
        }catch(error){
            console.log(error)
            console.log("There is an error while reteriving all the show details")
            toast.error("There is an error while reteriving all the show details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function FetchAllTicketsDetails(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("GET",getallticketsdetails)
            console.log("data Fetched Succesfully",response)

            if(!response.data.success){
                toast.error("There is an error while fetching all the ticket details")
                return
            }

            dispatch(setUser(response.data.id))
            toast.success("Ticket Details fetched succesfully")
        }catch(error){
            console.log(error)
            console.log("There is an error while fetching all the ticket details")
            toast.error("There is an error while fetching all the ticket details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function GetSingleShowDetailss(showid){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("",getsingleshowdetails,{
                showAlloted:showid
            })
            console.log("Single Show Detils Fetched Sucesfully",response)

            if(!response.data.success){
                toast.error("There is an error while fetching the detils of single show")
                return
            }
            dispatch(setUser(response.data.id))

            toast.success("Single Show Details Fetched Sucesfully")
        }catch(error){
            console.log(error)
            console.log("There is an error while fetching the detils of single show")
            toast.error("There is an error while fetching the detils of single show")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function SendTheatreDetails (data){
    return async (dispatch)=>{
        dispatch(setLoading(true))

                try{
      
    const fd = new FormData()

   fd.append('email', data.email)
            fd.append('Username', data.Username)
            fd.append('theatrename', data.theatrename)
            fd.append('password', data.password)
            fd.append('countrycode', data.countrycode)
            fd.append('mobilenumber', data.mobilenumber)
            fd.append('locationname', data.locationname)
            fd.append('locationurl', data.locationurl)
            fd.append('TheatreOwner', data.TheatreOwner || data.Username)
fd.append('typesofseats', JSON.stringify(data.typesofseats || []))
fd.append('Screentypes', JSON.stringify(data.Screentypes || []))
fd.append('languageAvailable', JSON.stringify(data.languageAvailable || []))
fd.append('theatreformat', JSON.stringify(data.theatreformat || []))
fd.append('parking', JSON.stringify(data.parking || []))


//   console.log("📸 Adding outside images:", data.outsideImages?.length)
    if (data.outsideImages && data.outsideImages.length > 0) {
                data.outsideImages.forEach(file => {
                    fd.append('TheareOutsideImages', file)
                })
            }
            // console.log("📸 Adding inside images:", data.insideImages?.length)
   if (data.insideImages && data.insideImages.length > 0) {
                data.insideImages.forEach(file => {
                    fd.append('TheatreInsideImages', file)
                })
            }


  console.log("📦 FormData contents:")
            // for (let pair of fd.entries()) {
            //     console.log(pair[0], ':', pair[1])
            // }

// console.log("🚀 Sending request to:", TheatreInfo)
                
                        const Response = await apiConnector("POST","http://localhost:4000/api/v1/Theatre/Theatre-info",fd)
            
                   console.log("✅ Response received:", Response)
            // console.log("Response data:", Response.data)
            
     
            return Response && Response.data ? Response.data : Response
                }catch(error){
                    console.log("Error sending theatre details:", error)
            console.log("Error message:", error.message)
            
            toast.error(error?.response?.data?.message || "Failed to create theatre")
            
            return { success: false, message: error.message }
                }finally{
dispatch(setLoading(false))
                }
    }
}