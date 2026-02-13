import { useEffect, useState } from 'react'
import Navbar from '../Home/Navbar'
import Loader from '../extra/Loading'
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia"
import { useForm } from 'react-hook-form'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Restpassword } from '../../Services/operations/Auth'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Reset = ({ Emails, name }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const Password = watch('NewPass')
  const [hasLower, setHasLower] = useState(false)
  const [hasUpper, setHasUpper] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [lengthValid, setLengthValid] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [emailSend, setEmailSend] = useState(false)
  const [loading, setLoading] = useState(false)

  const MIN_LENGTH = 6

  const Handler = async (e) => {
    try {
      setLoading(true)
      const currentUrl = window.location.href
      const token = currentUrl.split('/')
      const MainToken = token[4]

      const Response = await dispatch(Restpassword(e.NewPass, e.ConfirmPass, MainToken, navigate))
      if (Response?.success) {
        toast.success("Password Reset Successfully")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error in Resetting Password")
    } finally {
      setLoading(false)
    }
  }

  const onChange = (data) => {
    Handler(data)
    setEmailSend(true)
  }

  useEffect(() => {
    setHasLower(/[a-z]/.test(Password))
    setHasUpper(/[A-Z]/.test(Password))
    setHasNumber(/[0-9]/.test(Password))
    setHasSpecial(/[!@#$%^&*(),.?":{}|<>]/.test(Password))
    setLengthValid((Password?.length || 0) >= MIN_LENGTH)
  }, [Password])

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
    <div className={name ? "hidden" : "min-h-screen w-full bg-richblack-900 flex flex-col overflow-x-hidden"}>
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-richblack-800 border border-richblack-700 shadow-xl p-8 signup-form-animate">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-3">
            {emailSend ? "Reset Complete!" : "Choose New Password"}
          </h1>
          <p className="text-richblack-200 text-sm leading-relaxed mb-6">
            {emailSend
              ? "All done! Your password has been reset successfully."
              : "Almost done. Enter your new password and you're all set."
            }
          </p>
          {emailSend && Emails && (
            <p className="text-richblack-300 text-sm mb-4">{Emails} confirmed</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onChange)}>

            {!emailSend && (
              <>
                {/* New Password */}
                <div>
                  <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
                    New Password <span className="text-red-500">*</span>
                    {errors.NewPass && <span className="text-red-400 text-xs ml-2">{errors.NewPass.message}</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter your new password"
                      className={`w-full px-4 py-2.5 pr-11 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.NewPass ? "border-red-500" : "border-richblack-600"}`}
                      {...register("NewPass", {
                        required: "Password is required",
                        minLength: { value: 6, message: "At least 6 characters" },
                        maxLength: { value: 10, message: "At most 10 characters" }
                      })}
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-richblack-50 mb-1.5 font-medium">
                    Confirm New Password <span className="text-red-500">*</span>
                    {errors.ConfirmPass && <span className="text-red-400 text-xs ml-2">{errors.ConfirmPass.message}</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className={`w-full px-4 py-2.5 pr-11 bg-richblack-700 border rounded-lg text-white text-sm placeholder:text-richblack-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 ${errors.ConfirmPass ? "border-red-500" : "border-richblack-600"}`}
                      autoComplete="new-password"
                      {...register("ConfirmPass", {
                        required: "Password is required",
                        minLength: { value: 6, message: "At least 6 characters" },
                        maxLength: { value: 10, message: "At most 10 characters" },
                        validate: (val) => val === Password || "Passwords do not match"
                      })}
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

                {/* Password Strength Checklist */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { check: hasLower, label: "One lowercase character" },
                    { check: hasSpecial, label: "One special character" },
                    { check: hasUpper, label: "One uppercase character" },
                    { check: lengthValid, label: "6 characters minimum" },
                    { check: hasNumber, label: "One number" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${item.check ? "bg-caribgreen-200 text-richblack-900" : "bg-richblack-600 text-richblack-300"}`}>
                        {item.check ? '\u2713' : '\u2717'}
                      </span>
                      <span className={item.check ? "text-caribgreen-200" : "text-richblack-300"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Submit / Return Button */}
            {emailSend ? (
              <button
                className="w-full py-3 rounded-lg text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]"
                onClick={() => navigate("/Login")}
                type="button"
              >
                Return to Login
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]"
              >
                Reset Password
              </button>
            )}

            {/* Back to Login */}
            <a
              href="/Login"
              className="inline-flex items-center gap-2 text-sm text-richblack-200 hover:text-yellow-200 transition-colors"
            >
              <FaLongArrowAltLeft className="text-lg" /> Back To Login
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset
