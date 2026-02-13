import { FaPaperPlane } from "react-icons/fa"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'

const InputBox = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const HandleSubmit = (data) => {
        toast.success('Subscribed successfully!')
        console.log(data)
        reset()
    }

    return (
        <div className='w-full bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-yellow-400/10 border-y border-richblack-700/60 shadow-inner'>
            <div className='max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6'>
                <div className='text-center md:text-left'>
                    <h3 className='text-xl font-bold text-white'>Stay in the Loop</h3>
                    <p className='text-richblack-300 text-sm mt-1'>Get the latest shows, deals, and updates straight to your inbox.</p>
                </div>
                <form className='w-full md:w-auto flex items-center gap-0' onSubmit={handleSubmit(HandleSubmit)}>
                    <div className='relative flex-1 md:w-[320px]'>
                        <input
                            type='email'
                            required
                            placeholder='Enter your email...'
                            className='w-full h-12 bg-richblack-700 border border-richblack-600 border-r-0 rounded-l-xl px-4 text-sm text-white placeholder-richblack-400 focus:border-yellow-400 focus:outline-none transition-colors'
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && (
                            <p className='absolute -bottom-5 left-0 text-red-400 text-xs'>{errors.email.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className='h-12 px-6 bg-yellow-400 text-black font-bold text-sm rounded-r-xl hover:bg-yellow-300 transition-colors flex items-center gap-2'
                    >
                        <FaPaperPlane className='text-xs' />
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    )
}

export default InputBox
