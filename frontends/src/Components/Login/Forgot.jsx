import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import Navbar from '../Home/Navbar'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { GetPasswordResettoken } from '../../Services/operations/Auth'
import { useDispatch } from 'react-redux';
import Loader from '../extra/Loading'
import toast from 'react-hot-toast'
import Reset from './Reset'

const Forgot = () => {
  const dispatch = useDispatch()
  const [Send, setsend] = useState(false);
  const [Emails, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [token, seToken] = useState("")

  const Handler = async (e) => {
    try {
      setLoading(true)
      setEmail(e.Email)
      const Response = await dispatch(GetPasswordResettoken(e.Email, setsend))

      if (Response?.success) {
        const newToken = Response?.data?.token
        seToken(newToken)
        toast.success("Link Send To Your Email id")
      }
    } catch (error) {
      console.log(error)
      toast.error("Error in Sending The Reset Password Link")
    } finally {
      setLoading(false)
    }
  }

  const onsubmit = (data) => {
    Handler(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-richblack-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-richblack-800 border border-richblack-700 shadow-xl p-8 signup-form-animate">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-3">
            {Send ? "Check Your Email" : "Reset Your Password"}
          </h1>

          {/* Description */}
          <p className="text-richblack-200 text-sm leading-relaxed mb-6">
            {Send
              ? <>We have sent the reset link to <span className="text-yellow-100 font-medium">{Emails}</span></>
              : "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
            }
          </p>

          <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">
            {!Send && (
              <div>
                <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
                  Email Address <span className="text-red-500">*</span>
                  {errors.Email && <span className="text-red-400 text-xs ml-2">{errors.Email.message}</span>}
                </label>
                <input
                  type="email"
                  {...register("Email", { required: "Email is required" })}
                  className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Email ? "border-red-500" : "border-richblack-600"}`}
                  placeholder="you@example.com"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]"
            >
              {Send ? "Resend Email" : "Reset Password"}
            </button>

            {/* Back to Login */}
            <a
              href="/Login"
              className="inline-flex items-center gap-2 text-sm text-richblack-200 hover:text-yellow-200 transition-colors mt-2"
            >
              <FaLongArrowAltLeft className="text-lg" /> Back To Login
            </a>
          </form>
        </div>
      </div>
      {Send && <Reset Emails={Emails} name={Send} />}
    </div>
  )
}

export default Forgot
