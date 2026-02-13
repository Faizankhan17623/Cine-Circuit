import toast from 'react-hot-toast'
import apiConnector from '../apiConnector'
import {MakePayment,Verifypayment,DownloadTicketdata} from '../Apis/PaymentApi'
import {setUser,setLoading} from '../../Slices/PaymentSlice'

const {makepayment} = MakePayment
const {downloadticketdata} = DownloadTicketdata
const {verifypayment} = Verifypayment
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
function loadScript(src){
    return new Promise((resolve,reject)=>{
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export function MakePayment(showid,theatreid,ticketid,categories,totaltickets,time,token){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const res  = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
            if (!res) {
                toast.error(
                  "Razorpay SDK failed to load. Check your Internet Connection."
                )
                return
              }

            const response = await apiConnector("POST",makepayment,{
                showid:showid,
                theatreid:theatreid,
                ticketid,
                ticketCategorey:categories,
                totalTicketpurchased:totaltickets,
                time:time
            },{
                Authorization: `Bearer ${token}`,
            })

            
            if(!response.data.success){
                toast.error("There is an error while creating the razorpay order")
                return
            }
            const options = {
                key: process.env.RAZORPAY_KEY,
                currency: response.data.data.currency,
                amount: `${response.data.data.amount}`,
                order_id: response.data.data.id,
                name: "Movie_Website",
                description: "Thank you for Purchasing the Course.",
                image: rzpLogo,
                prefill: {
                  name: `${user_details.firstName} ${user_details.lastName}`,
                  email: user_details.email,
                },
                handler: function (response) {
                  sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                  verifyPayment({ ...response, courses }, token, navigate, dispatch)
                },
              }
              const paymentObject = new window.Razorpay(options)
          
              paymentObject.open()
              paymentObject.on("payment.failed", function (response) {
                toast.error("Oops! Payment Failed.")
                console.log(response.error)
            })
            console.log("This is the response after creating the razorpay order",response)
            dispatch(setUser(response.data.id))

            toast.success("razorpay order created sucesfully")
        }catch(error){
            console.log(error)
            console.log("There is an error while creating the razorpay order")
            toast.error("There is an error while creating the razorpay order")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function VERIFYPAYMENT(){
    return async(dispatch)=>{
        const toastId = toast.loading('...loading')
        dispatch(setLoading(true))
        try{

            const response = await apiConnector("",{})
            console.log("",response)

            if(!response.data.success){
                toast.error("")
                return
            }
            dispatch(setUser(response.data.id))

            toast.success("")
        }catch(error){
            console.log(error)
            console.log("")
            toast.error("")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}




// export function (){
//     return async(dispatch)=>{
//         const toastId = toast.loading('...loading')
//         dispatch(setLoading(true))
//         try{

//             const response = await apiConnector("",{})
            // console.log("",response)

//             if(!response.data.success){
//                 toast.error("")
//                 return
//             }
            // dispatch(setUser(response.data.id))

//             toast.success("")
//         }catch(error){
//             console.log(error)
//             console.log("")
//             toast.error("")
//         }
//         toast.dismiss(toastId)
//         dispatch(setLoading(false))
//     }
// }