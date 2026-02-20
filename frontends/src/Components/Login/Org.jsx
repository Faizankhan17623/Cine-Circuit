import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import { useNavigate } from 'react-router-dom'
import Loader from '../extra/Loading'
import { OrgainezerLogin } from '../../Services/operations/orgainezer'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { finduseremail } from '../../Services/operations/Auth'

const Org = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [names, setNames] = useState("")
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (!username) {
      setNames("")
      return
    }
    const handler = setTimeout(async () => {
      const toastId = toast.loading("Checking email...")
      try {
        const response = await dispatch(finduseremail(username))
        if (response?.exists) {
          // Email found in DB — organizer exists, good for login
          setNames("")
        } else {
          // Email NOT found — no account
          setNames("not_found")
        }
      } catch (error) {
        console.error("Error in email check:", error)
        setNames("")
      } finally {
        toast.dismiss(toastId)
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [username])

  const onsubmit = async (data) => {
    if (names === "not_found") {
      setErrorMessage("No account found with this email.")
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await dispatch(OrgainezerLogin(data.Email, data.Password, navigate))
      if (response?.success) {
        toast.success("Logged in successfully")
        navigate("/Dashboard/my-profile")
      }
    } catch (error) {
      toast.error(error.message || "Login failed")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex justify-center items-center">
        <Loader />
      </div>
    )
  }

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

      {/* Email not found badge */}
      {names === "not_found" && (
        <div className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          No account found with this email
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
          Email Address <span className="text-red-500">*</span>
          {errors.Email && <span className="text-red-400 text-xs ml-2">{errors.Email.message}</span>}
        </label>
        <input
          type="email"
          {...register("Email", { required: "Email is required" })}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-2.5 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Email ? "border-red-500" : "border-richblack-600"}`}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
          Password <span className="text-red-500">*</span>
          {errors.Password && <span className="text-red-400 text-xs ml-2">{errors.Password.message}</span>}
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            {...register("Password", {
              required: "Password is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 10, message: "At most 10 characters" }
            })}
            className={`w-full px-4 py-2.5 pr-11 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.Password ? "border-red-500" : "border-richblack-600"}`}
            placeholder="Enter your password"
            autoComplete="current-password"
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

      {/* Forgot Password */}
      <div className="flex justify-end">
        <a href="/Forgot-Password" className="text-sm text-blue-300 hover:text-yellow-200 transition-colors">
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]"
      >
        Login
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-richblack-300">
        Don't have an account?{' '}
        <span onClick={() => navigate('/SignUp')} className="text-yellow-100 font-semibold cursor-pointer hover:underline">
          Sign Up
        </span>
      </p>
    </form>
  )
}

export default Org
