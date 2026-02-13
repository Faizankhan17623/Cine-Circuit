import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from '../../data/CountryCode.json'
import Loading from './Loading'
import toast from 'react-hot-toast'
import { FaUpload, FaTrash, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { Theatreinfo } from '../../Services/Apis/TheatreApi'
import {SendTheatreDetails} from '../../Services/operations/Theatre'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SEAT_TYPES = [
  "Regular", "Premium", "Recliner", "Couple Seat", "Executive",
  "Royal/VIP", "D-BOX Motion", "Wheelchair Accessible",
  "Gold Class", "Silver Class", "Bronze Class"
]

const SCREEN_TYPES = [
  "2D", "3D", "IMAX 2D", "IMAX 3D", "4DX 2D", "4DX 3D",
  "ScreenX", "Dolby Cinema", "MX4D", "ICE", "Standard Screen",
  "Premium Large Format", "Laser Projection"
]

const LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Malayalam", "Kannada",
  "Bengali", "Marathi", "Gujarati", "Punjabi", "Spanish", "French",
  "German", "Japanese", "Korean", "Chinese", "Arabic", "Dubbed", "Subtitled"
]

const THEATRE_FORMATS = [
  "Dolby Atmos", "Dolby Digital 7.1", "DTS:X", "Dolby Digital 5.1",
  "Auro 3D", "4K Digital", "2K Digital", "Laser Projection",
  "Standard Cinema", "Premium Cinema", "Luxury Cinema", "Dine-in Cinema",
  "IMAX", "4DX", "Drive-in"
]

const PARKING_OPTIONS = [
  "Available - Free", "Available - Paid", "Valet Parking Available",
  "Street Parking Only", "No Parking Available", "Two-Wheeler Parking",
  "Four-Wheeler Parking", "Multi-level Parking"
]

const TheatrerForm = () => {
  const { register, handleSubmit, reset,trigger, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {token} = useSelector((state)=>state.auth)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Multi-select states
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedScreens, setSelectedScreens] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedParking, setSelectedParking] = useState([])

  // Image states
  const [outsideImages, setOutsideImages] = useState([])
  const [insideImages, setInsideImages] = useState([])
  const [outsidePreviews, setOutsidePreviews] = useState([])
  const [insidePreviews, setInsidePreviews] = useState([])

  const totalSteps = 3

  const toggleSelection = (item, selected, setSelected, max) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item))
    } else {
      if (max && selected.length >= max) {
        toast.error(`You can select a maximum of ${max} options`)
        return
      }
      setSelected([...selected, item])
    }
  }

  const handleImageUpload = (e, setImages, setPreviews) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index, images, setImages, previews, setPreviews) => {
    URL.revokeObjectURL(previews[index])
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleNext = async () => {
    let fieldsToValidate = []

    if (step === 1) {
      fieldsToValidate = ['email', 'Username', 'password', 'countrycode', 'mobilenumber']
    }

    if (step === 2) {
      fieldsToValidate = ['theatrename', 'locationname', 'locationurl']
    }

    const isValid = await trigger(fieldsToValidate)

    if (!isValid) {
      toast.error('Please fill all required fields')
      return
    }

    if (step === 2) {
      if (selectedSeats.length < 1) { toast.error('Select at least 1 seat type'); return }
      if (selectedSeats.length > 6) { toast.error('You can select a maximum of 6 seat types'); return }
      if (selectedScreens.length < 1) { toast.error('Select at least 1 screen type'); return }
      if (selectedScreens.length > 9) { toast.error('You can select a maximum of 9 screen types'); return }
      if (selectedLanguages.length < 1) { toast.error('Select at least 1 language'); return }
      if (selectedLanguages.length > 10) { toast.error('You can select a maximum of 10 languages'); return }
      if (selectedFormats.length < 1) { toast.error('Select at least 1 theatre format'); return }
      if (selectedFormats.length > 10) { toast.error('You can select a maximum of 10 theatre formats'); return }
      if (selectedParking.length < 1) { toast.error('Select at least 1 parking option'); return }
      if (selectedParking.length > 5) { toast.error('You can select a maximum of 5 parking options'); return }
    }

    setLoading(true)
    setTimeout(() => {
      setStep(prev => prev + 1)
      setLoading(false)
    }, 1000)
  }

  const handlePrev = () => {
    setLoading(true)
    setTimeout(() => {
      setStep(prev => prev - 1)
      setLoading(false)
    }, 1000)
  }


  const onSubmit = async (data) => {
    // console.log("This is the date on the submit",data)
    if (outsideImages.length === 0) {
      toast.error('Please upload at least one outside image of the theatre')
      return
    }
    if (insideImages.length === 0) {
      toast.error('Please upload at least one inside image of the theatre')
      return
    }


    setLoading(true)

    try {
  const completeData = {
            // Form fields
            ...data,
            
            // Arrays (selections)
            typesofseats: selectedSeats,
            Screentypes: selectedScreens,
            languageAvailable: selectedLanguages,
            theatreformat: selectedFormats,
            parking: selectedParking,
            
            // Images
            outsideImages: outsideImages,
            insideImages: insideImages,
            
            // Theatre owner (if needed)
            TheatreOwner: data.TheatreOwner || data.Username || ''
        }

        //  console.log("📤 Sending complete data:", completeData)
       const response = await dispatch(SendTheatreDetails(completeData))
      //  console.log("📥 Response received:", response)
        toast.success('Theatre request submitted successfully!')
           if (response?.success) {
  toast.success(response.message)

  // RESET FORM
  
reset({ terms: false })
  setStep(1)

  // RESET STATES
  setSelectedSeats([])
  setSelectedScreens([])
  setSelectedLanguages([])
  setSelectedFormats([])
  setSelectedParking([])

  setOutsideImages([])
  setInsideImages([])
  setOutsidePreviews([])
  setInsidePreviews([])

window.location.reload()
  // navigate('/Contact')
}

            // Reset form or navigate
    } catch (error) {
        console.error('❌ Submit error:', error)
        console.error('Error details:', error.message)
        toast.error(error?.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
       console.log("✅ Loading set to false")
    }
  }

  const StepIndicator = () => (
    <div className="flex justify-center items-center gap-3 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div className={`h-9 w-9 flex justify-center items-center text-sm font-bold rounded-full transition-all duration-300
            ${s <= step ? 'bg-yellow-400 text-black scale-110' : 'bg-richblack-600 text-richblack-200'}`}>
            {s}
          </div>
          {s < totalSteps && (
            <div className={`w-16 h-1 rounded-full transition-all duration-500
              ${s < step ? 'bg-yellow-400' : 'bg-richblack-600'}`} />
          )}
        </div>
      ))}
    </div>
  )

  const StepTitle = ({ title, subtitle }) => (
    <div className="text-center mb-5">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-richblack-200 mt-1">{subtitle}</p>
    </div>
  )

  const ChipSelector = ({ label, options, selected, setSelected, min = 1, max }) => {
    const isUnderMin = selected.length < min
    const isAtMax = max && selected.length >= max
    return (
      <div className="w-full mb-4">
        <label className="block text-sm font-semibold text-richblack-5 mb-1">
          {label} <span className={`text-xs font-medium ${isUnderMin ? 'text-red-400' : isAtMax ? 'text-orange-400' : 'text-yellow-100'}`}>({selected.length}{max ? `/${max}` : ''} selected)</span>
        </label>
        <p className="text-xs text-richblack-300 mb-2">
          Min: {min} {max ? `| Max: ${max}` : ''}
          {isAtMax && <span className="text-orange-400 ml-2">— Max limit reached</span>}
        </p>
        <div className={`flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-richblack-700 rounded-lg border ${isUnderMin ? 'border-red-500/50' : isAtMax ? 'border-orange-400/50' : 'border-richblack-600'}`}>
          {options.map((item) => {
            const isSelected = selected.includes(item)
            const isDisabled = !isSelected && isAtMax
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleSelection(item, selected, setSelected, max)}
                disabled={isDisabled}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                  ${isSelected
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : isDisabled
                      ? 'bg-richblack-800 text-richblack-400 border-richblack-700 cursor-not-allowed opacity-50'
                      : 'bg-richblack-600 text-richblack-100 border-richblack-500 hover:border-richblack-300'
                  }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const ImageUploader = ({ label, images, setImages, previews, setPreviews, id }) => (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-richblack-5 mb-2">{label}</label>
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center border-2 border-dashed border-richblack-400 rounded-xl p-6 bg-richblack-700 hover:bg-richblack-600 transition-colors cursor-pointer"
      >
        <FaUpload className="w-8 h-8 text-yellow-400 mb-2" />
        <span className="text-yellow-100 font-medium text-sm">Click to upload images</span>
        <span className="text-xs text-richblack-300 mt-1">(JPG, PNG, WEBP supported)</span>
        <input
          type="file"
          id={id}
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleImageUpload(e, setImages, setPreviews)}
        />
      </label>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group">
              <img src={preview} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-lg border border-richblack-500" />
              <button
                type="button"
                onClick={() => removeImage(idx, images, setImages, previews, setPreviews)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash className="text-[8px]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full flex flex-col items-center px-4 py-3 overflow-y-auto">
      <StepIndicator />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading data="relative" />
        </div>
      ) : (
        <>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="w-full max-w-lg flex flex-col gap-4 animate-fadeIn">
              <StepTitle title="Personal Information" subtitle="Enter your account details to get started" />

              <div className="flex gap-3">
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-sm text-richblack-5 font-medium">
                    Email {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                    })}
                    className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-sm text-richblack-5 font-medium">
                    Username {errors.Username && <span className="text-red-500 text-xs ml-1">{errors.Username.message}</span>}
                  </span>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    {...register('Username', { required: 'Required' })}
                    className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-richblack-5 font-medium">
                  Password {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
                </span>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                />
              </label>

              <div className="flex gap-3">
                <label className="flex flex-col gap-1 w-36">
                  <span className="text-sm text-richblack-5 font-medium">Country Code</span>
                  <select
                    {...register('countrycode', { required: 'Required' })}
                    className="h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-2 text-sm form-style"
                  >
                    <option value="" disabled>Code</option>
                    {CountryCode.map((data, index) => (
                      <option value={data.code} key={index}>{data.code} - {data.country}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-sm text-richblack-5 font-medium">
                    Mobile Number {errors.mobilenumber && <span className="text-red-500 text-xs ml-1">{errors.mobilenumber.message}</span>}
                  </span>
                  <input
                    type="number"
                    placeholder="Enter mobile number"
                    {...register('mobilenumber', {
                      required: 'Required',
                      minLength: { value: 10, message: '10 digits required' },
                      maxLength: { value: 10, message: '10 digits required' }
                    })}
                    className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                  />
                </label>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                >
                  Next <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Theatre Details & Configuration */}
          {step === 2 && (
            <div className="w-full max-w-lg flex flex-col gap-4 animate-fadeIn">
              <StepTitle title="Theatre Configuration" subtitle="Tell us about your theatre setup" />

              <label className="flex flex-col gap-1">
                <span className="text-sm text-richblack-5 font-medium">
                  Theatre Name {errors.theatrename && <span className="text-red-500 text-xs ml-1">{errors.theatrename.message}</span>}
                </span>
                <input
                  type="text"
                  placeholder="Enter theatre name"
                  {...register('theatrename', { required: 'Required' })}
                  className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                />
              </label>

              <div className="flex gap-3">
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-sm text-richblack-5 font-medium">
                    Location Name {errors.locationname && <span className="text-red-500 text-xs ml-1">{errors.locationname.message}</span>}
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    {...register('locationname', { required: 'Required' })}
                    className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-sm text-richblack-5 font-medium">
                    Location URL {errors.locationurl && <span className="text-red-500 text-xs ml-1">{errors.locationurl.message}</span>}
                  </span>
                  <input
                    type="url"
                    placeholder="Google Maps link"
                    {...register('locationurl', {
                      required: 'Required',
                      pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL' }
                    })}
                    className="form-style h-10 bg-richblack-700 rounded-lg border border-richblack-600 px-3 text-sm"
                  />
                </label>
              </div>

              <ChipSelector label="Types of Seats" options={SEAT_TYPES} selected={selectedSeats} setSelected={setSelectedSeats} min={1} max={6} />
              <ChipSelector label="Screen Types" options={SCREEN_TYPES} selected={selectedScreens} setSelected={setSelectedScreens} min={1} max={9} />
              <ChipSelector label="Languages Available" options={LANGUAGES} selected={selectedLanguages} setSelected={setSelectedLanguages} min={1} max={10} />
              <ChipSelector label="Theatre Formats" options={THEATRE_FORMATS} selected={selectedFormats} setSelected={setSelectedFormats} min={1} max={10} />
              <ChipSelector label="Parking Options" options={PARKING_OPTIONS} selected={selectedParking} setSelected={setSelectedParking} min={1} max={5} />

              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-2.5 bg-richblack-600 text-white font-semibold rounded-lg hover:bg-richblack-500 transition-colors text-sm"
                >
                  <FaChevronLeft className="text-xs" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                >
                  Next <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Image Uploads & Submit */}
          {step === 3 && (
            <div className="w-full max-w-lg flex flex-col gap-4 animate-fadeIn">
              <StepTitle title="Upload Theatre Images" subtitle="Show us your theatre from inside and outside" />

              <ImageUploader
                label="Outside Theatre Images"
                images={outsideImages}
                setImages={setOutsideImages}
                previews={outsidePreviews}
                setPreviews={setOutsidePreviews}
                id="outsideImages"
              />

              <ImageUploader
                label="Inside Theatre Images"
                images={insideImages}
                setImages={setInsideImages}
                previews={insidePreviews}
                setPreviews={setInsidePreviews}
                id="insideImages"
              />

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="terms" required className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="terms" className="text-sm text-richblack-100">
                  I agree to the <span className="text-yellow-100 underline cursor-pointer">Terms & Conditions</span> and <span className="text-yellow-100 underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-2.5 bg-richblack-600 text-white font-semibold rounded-lg hover:bg-richblack-500 transition-colors text-sm"
                >
                  <FaChevronLeft className="text-xs" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </form>
  )
}

export default TheatrerForm
