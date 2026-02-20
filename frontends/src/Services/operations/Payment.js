import toast from 'react-hot-toast'
import {apiConnector, axiosinstance} from '../apiConnector'
import {CreatePayment,paymentVerification,TicketDetails} from '../Apis/PaymentApi'
import {setUser,setLoading} from '../../Slices/PaymentSlice'

const {makepayment} = CreatePayment
const {downloadticketdata} = TicketDetails
const {verifypayment} = paymentVerification

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

export function MakePayment(
  ShowId,
  Theatreid,
  Ticketid,
  Categories,
  totalTickets,
  time,
  userId,
  token,
  navigate,
  setPaymentLoading
) {
  return async (dispatch) => {
    const toastId = toast.loading("Processing Payment...");
    dispatch(setLoading(true));
    if (setPaymentLoading) setPaymentLoading(true);

    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Razorpay SDK failed to load");
        if (setPaymentLoading) setPaymentLoading(false);
        return;
      }

      const response = await apiConnector(
        "POST",
        makepayment,
        {
          ShowId,
          Theatreid,
          Ticketid,
          userId,
          Categories,
          totalTickets,
          time,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Order creation failed");
        if (setPaymentLoading) setPaymentLoading(false);
        return;
      }

      const order = response.data.order;
      const paymentData = response.data.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Movie Website",
        description: "Ticket Purchase",

        handler: async function (razorpayResponse) {
          await dispatch(
            PaymentVerify(
              razorpayResponse.razorpay_order_id,
              razorpayResponse.razorpay_payment_id,
              razorpayResponse.razorpay_signature,
              userId,
              paymentData._id,
              token,
              navigate,
              setPaymentLoading
            )
          );
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        toast.error("Payment Failed");
        if (setPaymentLoading) setPaymentLoading(false);
      });

    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Payment Error";
      toast.error(errorMessage);
      if (setPaymentLoading) setPaymentLoading(false);
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, paymentId
export function PaymentVerify(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  paymentId,
  token,
  navigate,
  setPaymentLoading
) {
  return async (dispatch) => {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        verifypayment,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          userId,
          paymentId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Payment Verification Failed");
        return;
      }

      toast.success("Payment Successful! Please check your dashboard for ticket details");

      if (navigate) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }

    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Verification Error";
      toast.error(errorMessage);
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
    if (setPaymentLoading) setPaymentLoading(false);
  };
}

export function MakePdf(ticketId, token) {
  return async () => {
    try {
      const response = await axiosinstance({
        method: "GET",
        url: `${downloadticketdata}/${ticketId}`,
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket-${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.log(error);
      toast.error("Failed to download PDF");
    }
  };
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