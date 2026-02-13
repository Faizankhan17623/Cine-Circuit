import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from '../../data/CountryCode.json'
import toast from 'react-hot-toast'
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa'

const FeedbackForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm()

  const Submitdata = (data) => {
    toast.success('Message sent successfully!')
    console.log("Form Data - ", data)
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        Email: "",
        countrycode: "",
        number: "",
        Message: ""
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <div className='w-full max-w-6xl mx-auto py-20 lg:py-24 px-6'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='w-14 h-14 mx-auto bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-yellow-400/5'>
            <FaEnvelope className='text-yellow-400 text-xl' />
          </div>
          <h2 className='text-3xl lg:text-5xl font-bold text-white'>
            Get in <span className='bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent'>Touch</span>
          </h2>
          <p className='text-richblack-300 mt-4 text-lg max-w-lg mx-auto'>
            We'd love to hear from you. Fill out the form and we'll get back to you shortly.
          </p>
          <div className='mt-4 w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto' />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(Submitdata)} className='relative border border-richblack-700/50 bg-gradient-to-b from-richblack-800 to-richblack-800/80 rounded-3xl p-7 lg:p-10 shadow-2xl shadow-black/20 overflow-hidden'>
          <div className='absolute top-0 right-0 w-60 h-60 bg-yellow-400/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none' />
          <div className='absolute bottom-0 left-0 w-40 h-40 bg-yellow-400/[0.03] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none' />
          <div className='relative flex flex-col gap-6'>

            {/* Name Row */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <label className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-richblack-5'>
                  First Name
                  {errors.firstName && <span className='text-red-400 text-xs ml-2'>({errors.firstName.message})</span>}
                </span>
                <input
                  type="text"
                  placeholder='Enter your first name'
                  {...register("firstName", { required: "Required" })}
                  className='h-12 bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-4 text-sm text-white placeholder-richblack-400 focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 form-style'
                />
              </label>
              <label className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-richblack-5'>
                  Last Name
                  {errors.lastName && <span className='text-red-400 text-xs ml-2'>({errors.lastName.message})</span>}
                </span>
                <input
                  type="text"
                  placeholder='Enter your last name'
                  {...register("lastName", { required: "Required" })}
                  className='h-12 bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-4 text-sm text-white placeholder-richblack-400 focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 form-style'
                />
              </label>
            </div>

            {/* Email */}
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-medium text-richblack-5'>
                Email Address
                {errors.Email && <span className='text-red-400 text-xs ml-2'>({errors.Email.message})</span>}
              </span>
              <input
                type="email"
                placeholder='Enter your email'
                {...register("Email", { required: "Required" })}
                className='h-12 bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-4 text-sm text-white placeholder-richblack-400 focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 form-style'
              />
            </label>

            {/* Phone */}
            <div className='grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4'>
              <label className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-richblack-5'>Country Code</span>
                <select
                  {...register("countrycode", { required: "Required" })}
                  className='h-12 bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-2 text-sm text-white focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 form-style'
                >
                  {CountryCode.map((data, index) => (
                    <option value={data.code} key={index}>
                      {data.code} - {data.country}
                    </option>
                  ))}
                </select>
              </label>
              <label className='flex flex-col gap-2'>
                <span className='text-sm font-medium text-richblack-5'>
                  Phone Number
                  {errors.number && <span className='text-red-400 text-xs ml-2'>({errors.number.message})</span>}
                </span>
                <input
                  type="tel"
                  placeholder='12345 67890'
                  {...register("number", {
                    required: "Required",
                    minLength: { value: 10, message: "10 digits required" },
                    maxLength: { value: 10, message: "10 digits required" }
                  })}
                  className='h-12 bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-4 text-sm text-white placeholder-richblack-400 focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 form-style'
                />
              </label>
            </div>

            {/* Message */}
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-medium text-richblack-5'>
                Message
                {errors.Message && <span className='text-red-400 text-xs ml-2'>({errors.Message.message})</span>}
              </span>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                {...register("Message", { required: "Required" })}
                className='bg-richblack-700/50 border border-richblack-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-richblack-400 focus:border-yellow-400/60 focus:bg-richblack-700/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/10 transition-all duration-300 resize-none form-style'
              />
            </label>

            {/* Submit */}
            <button
              type='submit'
              className='group w-full flex items-center justify-center gap-3 h-13 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 text-sm mt-2 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-[1.02]'
            >
              <FaPaperPlane className='text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm
