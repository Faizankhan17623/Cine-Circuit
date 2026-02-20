import {CreateTheatrere,theatreinfos,AllTheatres,TheatreCreationRequest,DistributeTickets,UpdateTicketTime,TicketsCreated,TheatreDetails,totalsale,GetShowAllotedDetailss,GetAllTicketsDetails,GetSingleShowDetailss} from '../Apis/TheatreApi'
import {setTheatre,setLoading,setImage,setUser} from '../../Slices/TheatreSlice'
import { toast } from 'react-hot-toast'
import {apiConnector} from '../apiConnector'

const {CreateTheatre} = CreateTheatrere
const {tt} = theatreinfos
const {Alltheatres} = AllTheatres
const {theatrecreationrequest} = TheatreCreationRequest

const {distributetickets} = DistributeTickets
const {updatetickettime} = UpdateTicketTime
const {ticketscreated} = TicketsCreated
const {theatredetails} = TheatreDetails
const {TotalSale} = totalsale
const {getshowalloteddetails} = GetShowAllotedDetailss
const {getallticketsdetails} = GetAllTicketsDetails
const {getsingleshowdetails} = GetSingleShowDetailss
// const {TheatreInfo} = 

export function CreateTheatree(name,email,password,number){
    return async(dispatch)=>{
        const toastId = toast.loading("Creating Theatre")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", CreateTheatre, {
                userName:name,
                email:email,
                password:password,
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
            const response = await apiConnector("POST", tt, {
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


export function AllTheatresInfo(token){
    return async(dispatch)=>{
        const toastId = toast.loading("Getting All Theatre Info")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET", Alltheatres, null, {
                Authorization: `Bearer ${token}`
            })

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


export function TheatreCreationRequestInfo(token){
    return async(dispatch)=>{
        const toastId = toast.loading("Getting Theatre Creation Request Info")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET", theatrecreationrequest, null, {
                Authorization: `Bearer ${token}`
            })

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

export function DistributeTicketsInfo(ticketCreation, ReleaseDate, showId, token){
    return async(dispatch)=>{
        try {
            const response = await apiConnector("POST", distributetickets+`?ShowId=${showId}`, {
                ticketsCreation: ticketCreation,
                ReleaseDate: ReleaseDate
            },{
                Authorization: `Bearer ${token}`
            })

            console.log("Tickets distributed successfully", response)

            if(!response.data.success){
                return { success: false, message: response.data.message }
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.log(error)
            return { success: false, message: error?.response?.data?.message }
        }
    }
}


export function UpdateTicketTimeData(theatreId, showId, ticketId, time, token){
    return async (dispatch)=>{
        const toastId = toast.loading('Updating ticket time...')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector('PUT', updatetickettime+`?theatreId=${theatreId}&ShowId=${showId}`, {
                Ticketid: ticketId,
                time: time
            },{
                Authorization: `Bearer ${token}`
            })

            console.log("Tickets time updated successfully", response)

            if(!response.data.success){
                toast.error(response.data.message || "The time is not updated")
                return { success: false, message: response.data.message }
            }

            toast.success("Ticket time has been updated")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "Error in updating ticket time")
            return { success: false, message: error?.response?.data?.message }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}


export function GetTicketsCreatedData(token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",ticketscreated,null,{
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                toast.error("There is an error in fetching all tickeets created data")
                return { success: false }
            }

            toast.success("the data is been reterived")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error in the reteriving all the tickets data")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}



// This is the function that will fetch all the data of our own theatre
export function GetTheatreDetails(token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",theatredetails,null,{
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                toast.error("error in fetching the data of the theatre")
                return { success: false }
            }
            toast.success("Theatre details fetched succesfully")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error in fetching the theatre details")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}


export function CalculateTotalSale(token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",TotalSale,null,{
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                toast.error("There is an error while fetching the total sale")
                return { success: false }
            }
            toast.success("The total sale data is been reterived")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error while fetching the total sale")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function GetShowAllotedDetails(token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",getshowalloteddetails,null,{
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                toast.error("There is an error while reteriving all the show details")
                return { success: false }
            }
            toast.success("The show details are been succesfully fetched")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error while reteriving all the show details")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function FetchAllTicketsDetails(token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",getallticketsdetails,null,{
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                toast.error("There is an error while fetching all the ticket details")
                return { success: false }
            }
            toast.success("Ticket Details fetched succesfully")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error while fetching all the ticket details")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}


export function GetSingleShowDetails(showid, token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET",getsingleshowdetails,null,{
                Authorization: `Bearer ${token}`
            },{
                showAlloted:showid
            })

            if(!response.data.success){
                toast.error("There is an error while fetching the detils of single show")
                return { success: false }
            }
            toast.success("Single Show Details Fetched Sucesfully")
            return { success: true, data: response.data }
        }catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "There is an error while fetching the detils of single show")
            return { success: false }
        }finally{
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
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
                
                        const Response = await apiConnector("POST",tt,fd)
            
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