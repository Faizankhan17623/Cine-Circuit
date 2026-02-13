import {  useState,useEffect } from 'react'
import CountryCodee from '../../data/CountryCode.json'
import { useForm } from 'react-hook-form'
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import { useNavigate } from 'react-router-dom'
import Loader from '../extra/Loading'
import { FindUserName, NumberFinder, finduseremail,sendOtp } from '../../Services/operations/Auth';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const Org = () => {
  const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [Pass,setpass] = useState("")
    const [ConfirmPass,setConfirmPass] = useState("")
    const [samePass, setSamePass] = useState(false);
    const [names, setNames] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [numbers, setNumbers] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [Loading,setloading] = useState(false)
    const [Data,setData] = useState(null)
    const [mail, setMail] = useState("");

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
    } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const password = watch('Password');
    const confirmPass2 = watch('ConfirmPass');

     useEffect(() => {
        setSamePass(confirmPass2 === password && password > 0);
      }, [password, confirmPass2]);

       useEffect(() => {
          if (!firstName || !lastName) {
            setNames("");
            return;
          }
          const handler = setTimeout(async () => {
            const toastId = toast.loading("Checking username...");
            try {
              const response = await dispatch(FindUserName(firstName, lastName));
              if (response?.success) {
                setNames("available");
              } else {
                setNames("taken");
              }
            } catch (error) {
              console.error("Error in username check:", error);
              setNames("");
            } finally {
              toast.dismiss(toastId);
            }
          }, 500);
          return () => clearTimeout(handler);
        }, [firstName, lastName]);

        useEffect(() => {
            if (!email) {
              setEmails("");
              return;
            }
            const handler = setTimeout(async () => {
              const toastId = toast.loading("Checking email...");
              try {
                const response = await dispatch(finduseremail(email));
                if (response?.success && !response?.exists) {
                  setEmails("available");
                } else {
                  setEmails("taken");
                }
              } catch (error) {
                console.error("Error in email check:", error);
                setEmails("");
              } finally {
                toast.dismiss(toastId);
              }
            }, 500);
            return () => clearTimeout(handler);
          }, [email]);

           useEffect(() => {
    if (!phoneNumber) {
      setNumbers("");
      return;
    }
    const handler = setTimeout(async () => {
      const toastId = toast.loading("Checking number...");
      try {
        const response = await dispatch(NumberFinder(phoneNumber));
        if (response?.success) {
          setNumbers("available");
        } else {
          setNumbers("taken");
        }
      } catch (error) {
        console.error("Error in number check:", error);
        setNumbers("");
      } finally {
        toast.dismiss(toastId);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [phoneNumber]);

    const sendOTP = async ()=>{
        if (!email) return;

      const toastId = toast.loading('Loading... ')
      try {
        setloading(true)
        const Response = await dispatch(sendOtp(email))
        if (Response?.success) {
          toast.success('OTP sent successfully');
        return Response.data.data.data;
        } else {
           toast.error(Response.error || 'OTP send failed');
        return null;
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error('Something went wrong');;
      } finally {
        setloading(false)
        toast.dismiss(toastId);
      }
    }

    const onsubmit = async (data) => {
         if (names === "taken" || emails === "taken" || numbers === "taken") {
      let errorMsg = "Please fix the following issues: ";
      if (names === "taken") errorMsg += "Username is taken. ";
      if (emails === "taken") errorMsg += "Email is taken. ";
      if (numbers === "taken") errorMsg += "Number is taken. ";
      setErrorMessage(errorMsg);
      return;
    }

      try{
        const finalData = {
      firstName: data.First,
      lastName: data.Last,
      email: data.Email,
      countryCode: data.CountryCode,
      phoneNumber: data.Number,
      password: data.Password,
      confirmPassword: data.ConfirmPass,
       usertype:"Organizer"
    };
       setData(finalData)
       setMail(data.Email)
         const otp = await sendOTP(data.Email);
      if (!otp) return;

       navigate("/OTP",{
        state: {
            otp,
            mail: data.Email,
            data: finalData,
  },
})
      }catch(error){
        console.error("User creation error:", error);
      setErrorMessage(error.message || "An error occurred during signup.");
      }
    }

  if(Loading){
    return (
      <div className='w-full h-full flex flex-col'>
        <div className='flex-1 flex justify-center items-center text-white'>
          <Loader data="text-4xl border left-100  top-50 h-80"/>
        </div>
      </div>
    )
  }

     const nameAsteriskColor = names === "available" ? "text-caribgreen-500" : "text-red-500";
  const emailAsteriskColor = emails === "available" ? "text-caribgreen-500" : "text-red-500";
  const numberAsteriskColor = numbers === "available" ? "text-caribgreen-500" : "text-red-500";

   return (
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full rounded-2xl bg-richblack-800 border border-richblack-700 shadow-xl p-6 sm:p-8 space-y-5"
      >
        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Username Availability Badge */}
        {names && (
          <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full ${
            names === "available"
              ? "bg-caribgreen-500/10 text-caribgreen-500 border border-caribgreen-500/30"
              : "bg-red-500/10 text-red-500 border border-red-500/30"
          }`}>
            <span className={`w-2 h-2 rounded-full ${names === "available" ? "bg-caribgreen-500" : "bg-red-500"}`} />
            Username is {names}
          </div>
        )}

        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
              First Name <span className={nameAsteriskColor}>*</span>
              {errors.First && <span className="text-red-400 text-xs ml-2">{errors.First.message}</span>}
            </label>
            <input
              type="text"
              {...register("First", { required: "Required"})}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.First ? "border-red-500" : "border-richblack-600"}`}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
              Last Name <span className={nameAsteriskColor}>*</span>
              {errors.Last && <span className="text-red-400 text-xs ml-2">{errors.Last.message}</span>}
            </label>
            <input
              type="text"
              {...register("Last", { required: "Required"})}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Last ? "border-red-500" : "border-richblack-600"}`}
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-richblack-50 mb-1.5 font-medium">
            Email Address <span className={emailAsteriskColor}>*</span>
            {errors.Email && <span className="text-red-400 text-xs">{errors.Email.message}</span>}
            {emails && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                emails === "available"
                  ? "bg-caribgreen-500/10 text-caribgreen-500"
                  : "bg-red-500/10 text-red-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${emails === "available" ? "bg-caribgreen-500" : "bg-red-500"}`} />
                {emails}
              </span>
            )}
          </label>
          <input
            type="email"
            {...register("Email", { required: "Required" })}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Email ? "border-red-500" : "border-richblack-600"}`}
            placeholder="you@example.com"
          />
        </div>

        {/* Phone */}
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <div>
            <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
              Code <span className="text-caribgreen-500">*</span>
            </label>
            <select
              {...register("CountryCode")}
              className={`w-full px-2 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.CountryCode ? "border-red-500" : "border-richblack-600"}`}
              defaultValue=""
            >
              <option value="" disabled>Code</option>
              {CountryCodee.map((data, i) => (
                <option key={i} value={data.code}>{data.code} - {data.country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-richblack-50 mb-1.5 font-medium">
              Mobile Number <span className={numberAsteriskColor}>*</span>
              {errors.Number && <span className="text-red-400 text-xs">{errors.Number.message}</span>}
              {numbers && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  numbers === "available"
                    ? "bg-caribgreen-500/10 text-caribgreen-500"
                    : "bg-red-500/10 text-red-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${numbers === "available" ? "bg-caribgreen-500" : "bg-red-500"}`} />
                  {numbers}
                </span>
              )}
            </label>
            <input
              type="tel"
              maxLength={10}
              {...register("Number", {
                required: "Required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Must be 10 digits"
                }
              })}
              onChange={(e) =>setPhoneNumber(e.target.value)}
              className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Number ? "border-red-500" : "border-richblack-600"}`}
              placeholder="10-digit mobile number"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
              Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
              {errors.Password && <span className="text-red-400 text-xs ml-2">{errors.Password.message}</span>}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                {...register("Password", {
                  required: "Required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters"
                  },
                  maxLength: {
                    value: 10,
                    message: "At most 10 characters"
                  }
                })}
                className={`w-full px-4 py-2.5 pr-11 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Password ? "border-red-500" : "border-richblack-600"}`}
                placeholder="Enter password"
                onChange={(e)=>setpass(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-richblack-300 hover:text-white transition-colors"
                tabIndex={-1}
                onClick={() => setShowPass(s => !s)}
              >
                {showPass ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
              Confirm Password <span className={`${samePass ? "text-caribgreen-500" : "text-red-500"}`}>*</span>
              {errors.ConfirmPass && <span className="text-red-400 text-xs ml-2">{errors.ConfirmPass.message}</span>}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("ConfirmPass", {
                  required: "Required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters"
                  },
                  maxLength: {
                    value: 10,
                    message: "At most 10 characters"
                  },
                  validate: (val) =>
                    val === password || "Passwords do not match"
                })}
                className={`w-full px-4 py-2.5 pr-11 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.ConfirmPass ? "border-red-500" : "border-richblack-600"}`}
                placeholder="Confirm password"
                onChange={(e)=>setConfirmPass(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-richblack-300 hover:text-white transition-colors"
                tabIndex={-1}
                onClick={() => setShowConfirm(s => !s)}
              >
                {showConfirm ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center mt-2 ${
            Loading || names === "taken" || emails === "taken" || numbers === "taken"
              ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]'
          }`}
          disabled={Loading || names === "taken" || emails === "taken" || numbers === "taken"}
        >
          {Loading ? (
            <>
              <Loader />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Already an organizer */}
        <p className="text-center text-sm text-richblack-300">
          Already an organizer?{' '}
          <span onClick={() => navigate('/Login')} className="text-yellow-100 font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </form>
    )
  }
export default Org
