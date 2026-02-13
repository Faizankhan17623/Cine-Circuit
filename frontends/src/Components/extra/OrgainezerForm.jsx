import  { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Line from '../extra/Line'
import CountryCode from '../../data/CountryCode.json'
import Levels from '../../data/Levels.json'
import Loader from './Loading'
import toast from 'react-hot-toast';
import TheatrerForm from './TheatrerForm';
import AllCountries from '../../data/AllCountries.json'
import Genre from '../../data/Genre.json'
import Projects from '../../data/Projects.json'
import { FaCaretDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { FaUpload } from "react-icons/fa6";

const OrgainezerForm = () => {

      const { register, handleSubmit,reset,setValue,trigger, formState: { errors,isSubmitSuccessful } } = useForm()

      const [loading,setLoading] = useState(false)
      const [part,setPart] = useState(1)
      const [selectedType, setSelectedType] = useState('');

      const [changes,SetChnages] = useState(false)
      const [phoneNumber, setPhoneNumber] = useState('')
      const [sameAsPhone, setSameAsPhone] = useState(true)
      const [whatsAppNumber, setWhatsAppNumber] = useState('')

      const [selectedCountry, setSelectedCountry] = useState('');
      const [selectedState, setSelectedState] = useState('');
      const [sameAddress, setSameAddress] = useState(true);
      const [localAddress, setLocalAddress] = useState('');
      const [permanentAddress, setPermanentAddress] = useState('');
      const [Switch, setSwitch] = useState('');
      const [notabelFilms,setnotabelFilms] = useState('No')
      


      // This states are for the more films that you have done for that
      // const [Serialno,setSerialno] = useState(1)
      
const [filmError, setFilmError] = useState("");

const [filmEntries, setFilmEntries] = useState([{ name: '', url: '' }]);
const [ready,setReady] = useState('')
const [budget,setBudget] = useState('')
const [StartDate,setStartDate] = useState('')
const [Years,SetYears] = useState('')
const [Close,setClose] = useState(false)
const[Promotions,setPromotions] = useState('')
 const [text, setText] = useState("");
 const [films,setfilms] = useState('')
 const [selectedGenre,setSelectedGenre] = useState('')
 const [selectedProjects,setSelectedProjects] = useState('')
 const [ProductionStage,setProductionStage] = useState('')
 const [Screens,setScreens] = useState('')
// console.log("This is the data fro mthe remove",Remove)
      // console.log(notabelFilms)
      // console.log(Serialno)
        const Submitdata = (data) => {
          localStorage.setItem('formdata', JSON.stringify(data));
          console.log("Form Data -",data);
      }


      const storedData = JSON.parse(localStorage.getItem('formdata') || '{}');

  useEffect(() => {
    if (sameAsPhone) {
      setWhatsAppNumber(phoneNumber)
      setValue('whatsAppNumber',phoneNumber)
    }
  }, [sameAsPhone, phoneNumber,setValue])
const handleChangeAndNext = async (type) => {
  let fieldsToValidate = [];

  if (part === 1) {
    fieldsToValidate = [
      "first",
      "last",
      "email",
      "countryCode",
      "phonenumber",
      "whatsAppNumber",
    ];
  }

  if (part === 2) {
    fieldsToValidate = [
      "CountryName",
      "State",
      "City",
      "SameAddress",
      "LocalAddress",
      "PermanentAddress",
    ];
  }

  if (part === 3) {
    fieldsToValidate = ["Date", "Genre", "Connection", "portfolio", "Projects", "Production"];
    if (notabelFilms === "yes") {
      filmEntries.forEach((_, idx) => {
        fieldsToValidate.push(`films.${idx}.name`, `films.${idx}.url`);
      });
    }
    if (ready === "yes") {
      fieldsToValidate.push("Stage.name", "Stage.stage");
    }
  }
const isStepValid = await trigger(fieldsToValidate);

  if (!isStepValid) {
    toast.error("Please fill all required fields");
    return;
  }

  setSelectedType(type);
  setLoading(true);
  setTimeout(() => {
    setPart((prev) => prev + 1);
    setLoading(false);
  }, 2000);
};
const handleStepChange = (step) => {
    if (step === 2  || !selectedType) {
    toast.error("Please select if you're a New Comer or Experienced first.");
    return;
  }

  // Prevent jump to Step 3+ without choosing Director/Producer
  if (step === 3 || !selectedType) {
    toast.error("Please select a role (Director or Producer) before continuing.");
    return;
  }

  setLoading(true);
  setTimeout(() => {
    setPart(step);
    setLoading(false);
  }, 2000);
};


  const wordLimit = 100;

  const getWordCount = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      setText(e.target.value);
      setfilms(e.target.value)
    }
  };

const today  = new Date(Date.now() - 1)
const maxDate = today.toISOString().split('T')[0];
const minDate = '1940-01-01'

const TotalExperienceCalculate = ()=>{
   const TodayDate = new Date();
  const StartDateObj = new Date(StartDate);
  const diffTime = TodayDate - StartDateObj; // difference in milliseconds
  // const diffDays = Math.floor(diffTime/(24*60*60*1000))
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
SetYears(diffYears)
}

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <form onSubmit={handleSubmit(Submitdata)} className=' w-full h-full'>
      <Line changes={changes} part={part} setPart={handleStepChange}/>

      <div className={`w-full Form_data_one h-9/12  ${part === 1 ? "flex" : "hidden"}  gap-5 items-center flex-col`}>
        <div className='Name flex justify-around items-center w-full '>

          <label htmlFor="first" className='flex flex-col gap-2 lable-style'>
            <span className='flex flex-col relative top-1'>{errors.first && (
  <span className="text-red-500 text-base">{errors.first.message}</span>
)}First Name</span>  
            <input type="text" name='first'  placeholder='Enter First name' {...register('first',{ required: "*",pattern: {
                  value: nameRegex,
                  message: "First name should not contain numbers"
                }})} className='form-style  w-3xs h-9 bg-richblack-600 rounded-2xl'/>
          </label>

          <label htmlFor="last" className='flex flex-col lable-style gap-2'>
            <span className='flex flex-col relative top-1'>{errors.last && (
  <span className="text-red-500 text-base">{errors.last.message}</span>
)}Last Name</span>
            <input type="text" name='last'   placeholder='Enter last name' {...register('last',{ required: "*",pattern: {
                  value: nameRegex,
                  message: "Last name should not contain numbers"
                }})} className='form-style w-3xs h-9 bg-richblack-600 rounded-2xl'/>
            
          </label>        
        </div>

        <div>
          <label htmlFor="email" className='flex flex-col  lable-style gap-3'>
            <span className='flex flex-col relative top-1'> {errors.email && (
  <span className="text-red-500 text-base">{errors.email.message}</span>
)}Email </span>
            <input type="email" name="email"  placeholder='Enter Your Email' className='form-style w-[580px]' {...register('email',{ required: "*",pattern: {
                  value: emailRegex,
                  message: "Please enter a valid email address"
                } })}/>
          </label>
        </div>

<div className='w-full flex justify-evenly items-center'>
        <label  htmlFor="countryCode" className='flex flex-col justify-center gap-2'>
          <span className='flex flex-col relative top-1'>{errors.countryCode && (
  <span className="text-red-500 text-base">{errors.countryCode.message}</span>
)}Phone Number</span>
          <select name="countryCode" className='w-40 bg-richblack-600 h-11 form-style' {...register('countryCode')}>
                    <option value="" disabled className='text-white cursor-not-allowed'>Select Country Code</option>

            {CountryCode.map((data, index) => (
              <option  value={data.code} key={index} >
                {data.code} - {data.country}
              </option>
              
            ))}
          </select>
        </label>

        <label htmlFor="phonenumber" className='flex flex-col gap-2 '>
          <input
            type='number'
            {...register('phonenumber',{
              minLength: {
                  value: 10,
                  message: "Phone number must be 10 digits"
                },
                maxLength: {
                  value: 10,
                  message: "Phone number must be 10 digits"
                }
            })}
            placeholder='Enter Your Number'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className='form-style rounded-md w-[380px] phoneNubers'
          />
          {errors.phonenumber && (
  <span className="text-red-500 text-sm">{errors.phonenumber.message}</span>
)}
        </label>
      </div>



<div className={`flex flex-col items-center gap-2 ${!sameAsPhone?"flex-col-reverse":"flex-col-reverse"}`}>
        <label className='flex gap-2 items-center'>
          <input
            type="checkbox"
            checked={sameAsPhone}
            {...register('same')}
            onChange={() => {setSameAsPhone(!sameAsPhone);
              if (!sameAsPhone) {
          setWhatsAppNumber(phoneNumber);
          setValue('whatsAppNumber', phoneNumber);
        }
            }}
          />
           <span>Same as Phone Number for WhatsApp</span>
        </label>
      </div>

      {/* ✅ Conditionally show WhatsApp input */}
      {!sameAsPhone && (
        <div className='w-full flex justify-evenly items-center'>
          <label htmlFor="whatsAppCode" className='flex flex-col justify-center gap-2'>
            <span>{errors.whatsAppCode && (
  <span className="text-red-500 text-base">{errors.whatsAppCode.message}</span>
)}WhatsApp Country Code</span>
            
            <select  name="whatsAppCode" className='w-40 bg-richblack-600 h-11 form-style' {...register('whatsAppCode',{required:"*"})}>
                  <option value="" disabled className='text-white cursor-not-allowed'>Select Country</option>

              {CountryCode.map((data, index) => (
                <option  value={data.code} key={index} >
                  {data.code} - {data.country}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="whatsAppNumber" className='flex flex-col gap-2'>
            <input
            
              type='tel'
              {...register('whatsAppNumber',{required:"Number is required",minLength: { value: 10, message: "WhatsApp number must be 10 digits" },
          maxLength: { value: 10, message: "WhatsApp number must be 10 digits" }})}
              placeholder='Enter WhatsApp Number'
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              disabled={sameAsPhone}
              className='form-style rounded-md w-[380px] phoneNubers'
            />
          </label>
        </div>
      )}
        
        <div className='w-fit h-14 flex justify-around items-center gap-1 rounded-3xl bg-richblack-400 '>
        <button
        type='button'
  className={`rounded-3xl w-44 h-14 ${
    selectedType === 'New Comer' ? 'bg-richblack-900 border-richblack-900' : 'bg-richblack-400'
  }`}
  onClick={() => {handleChangeAndNext('New Comer')}}
>
  New Comer
</button>
<button
type='button'
  className={`rounded-3xl w-44 h-14 ${
    selectedType === 'Experienced' ? 'bg-richblack-900 border-richblack-900'  : 'bg-richblack-400'
  }`}
  onClick={() =>{handleChangeAndNext('Experienced') } }
>
  Experienced
</button>

{/* <button type='submit'>sub</button> */}

      </div>
      </div>

      {/* THis is the part 2 section in the form like the number 2  */}
      {part === 2 && loading ? (
  <Loader data="top-50 left-70" />
) : (

  <div className={`${part === 2 ? "flex" : "hidden"} w-full  h-[80%] `}>
    {selectedType === 'New Comer' && (
      <div className="flex flex-col w-full">
      <div className="w-full h-[90px]  flex justify-around items-center">

  <label htmlFor="countryName" className="flex flex-col justify-center  gap-2">
             <span>{errors.countryName && (
  <span className="text-red-500 text-base">{errors.countryName.message}</span>
)}Country Name</span>
          <select
           {...register("countryName", { required: "*" })}
  className="w-40 bg-richblack-600 h-11 form-style"
  value={selectedCountry}
  onChange={e => {
    setSelectedCountry(e.target.value);
    setSelectedState(''); // Reset state when country changes
  }}
>
  <option value="" disabled className='text-white cursor-not-allowed'>Select Country</option>
  {AllCountries.data.map((data, index) => (
    <option key={index} value={data.name}>{data.name}</option>
  ))}
</select>
        </label>

<label htmlFor="State" className="flex flex-col justify-center gap-2">
  <span>{errors.State && (
    <span className="text-red-500 text-base">{errors.State.message}</span>
  )} State</span>

  <select
    name="State"
    className={`w-40 bg-richblack-600 h-11 form-style ${!selectedCountry ? "cursor-not-allowed" : "cursor-pointer"}`}
    value={selectedState}
     {...register("State", { required: "*" })}
    onChange={e => {
      setSelectedState(e.target.value);
      setValue("State", e.target.value); // ✅ manually update form value
    }}
    disabled={!selectedCountry}
  >
    <option value="" disabled className='text-white cursor-not-allowed'>Enter Your State Name</option>
    {(AllCountries.data.find(c => c.name === selectedCountry)?.states || []).map((state, idx) => (
      <option key={idx} value={state.name}>{state.name}</option>
    ))}
  </select>
</label>

        <label htmlFor="City" className="flex flex-col gap-2">
          <span>{errors.City && (
  <span className="text-red-500 text-base">{errors.City.message}</span>
)} City name</span>
          <input type="text" placeholder="Enter Your City Name" name="City" className="form-style rounded-md w-[180px]" {...register("City",{required:"*"})}/>
        </label>
        </div>

        <div className=" w-full h-[190px] flex justify-around items-center flex-col"> 
          <label htmlFor="SameAddress" className="flex flex-row justify-center items-center gap-2">
  <input
    type="checkbox"
    name='SameAddress'
    checked={sameAddress}
    {...register('SameAddress',{required:"*"})}
    onChange={e => {
      setSameAddress(e.target.checked);
      if (e.target.checked) {
        setPermanentAddress(localAddress);
      } else {
        setPermanentAddress('');
      }
    }}
  />
  <span>Local and Permanent Address are same</span>
</label>

<label htmlFor="LocalAddress" className="flex flex-col gap-2">
  <span>{errors.LocalAddress && (
  <span className="text-red-500 text-base">{errors.LocalAddress.message}</span>
)} Local Address</span>
  <input
    type="text"
    name='LocalAddress'
    {...register('LocalAddress',{ required: "*" })}
    value={localAddress}
    onChange={e => {
      setLocalAddress(e.target.value);
      if (sameAddress) setPermanentAddress(e.target.value);
    }}
    className='form-style h-9 bg-richblack-600 rounded-2xl form-style w-[580px]'
  />
</label>
<label htmlFor="PermanentAddress" className="flex flex-col gap-2">
  <span>{errors.PermanentAddress && (
  <span className="text-red-500 text-base">{errors.PermanentAddress.message}</span>
)} Permanent Address</span>

  <input
    type="text"
    name='PermanentAddress'
    {...register('PermanentAddress',{ required: !sameAddress ? "*" : false })}
    value={permanentAddress}
    onChange={e => setPermanentAddress(e.target.value)}
    className={`form-style h-9 bg-richblack-600 rounded-2xl form-style w-[580px] ${sameAddress?"cursor-not-allowed":"cursor-auto"}`}
    disabled={sameAddress}
  />
</label>
        </div>

  <div className='w-full flex flex-col justify-center items-center gap-5'>
    <span className='font-mono'>Are You a Producer Or Director</span>
    <p className='font-mono'>How Would you Like To Register on our Platform As <span className='text-richblue-25'>{Switch}</span></p>
      <div className='w-fit h-14 flex justify-around items-center gap-1 rounded-3xl bg-richblack-400 Level2Btns'>

        <button disabled={loading} className={`rounded-3xl w-44 h-14 ${
    selectedType === 'Director' ? 'bg-richblack-900 border-richblack-900' : 'bg-richblack-400'
  }`}
  onClick={() => {handleChangeAndNext('Director')}}
        >
          Director
        </button>
        <button
          disabled={loading}
          className={`rounded-3xl w-44 h-14 ${
    selectedType === 'Producer' ? 'bg-richblack-900 border-richblack-900' : 'bg-richblack-400'
  }`}
  onClick={() => {handleChangeAndNext('Producer')}}
        >
          Producer
        </button> 
      </div>
  </div>
      
      </div>
      // This is for the adress local and permanent
    )}
    {selectedType === 'Experienced' && (
      <div>
        This is for the Experienced section
      </div>
    )}
  </div>
)}


  {part === 3 && loading ? (
  <Loader data="top-50 left-70" />
) : (
  <div className={`${part === 3 ? "flex" : "hidden"}`}>
    {selectedType === "Director" && (
      <div className="w-full h-full">
        <div className="flex flex-col w-full h-full Career">
          <label htmlFor="Career" className="flex justify-around items-center">
            <span>
              {errors.Date && (
                <span className="text-red-500 text-base">{errors.Date.message}</span>
              )}
              When Did You Begin your Career
            </span>
            <input
              type="date"
              name="Date"
              value={StartDate}
              className="form-style h-9 bg-richblack-600 rounded-2xl form-style w-[180px]"
              max={maxDate}
              min={minDate}
              {...register("Date", {
                required: "*",
                onChange: (e) => {
                  setStartDate(e.target.value);
                  TotalExperienceCalculate();
                },
              })}
            />
          </label>
          <span
            className={`${
              Years ? "flex justify-center mt-5 font-semibold text-2xl" : "hidden"
            }`}
          >
            Total Experience {Years}+ years
          </span>

  <label htmlFor="Genre" className="flex justify-around items-center Genre_height">
             <span>{errors.Genre && (
  <span className="text-red-500 text-base">{errors.Genre.message}</span>
)}What type of Genre Suits you</span>
          <select
           {...register("Genre", { required: "*" })}
  className="w-40 bg-richblack-600 h-11 form-style"
  value={selectedGenre}
  onChange={e => {
    setSelectedGenre(e.target.value);
  }}
>
  <option value="" disabled className='text-white cursor-not-allowed'>Select Genre</option>
  {Genre.genres.map((data, index) => (
    <option key={index} value={data.name}>{data.name}</option>
  ))}
</select>
        </label>
        </div>
{/* 
        <label  className="flex flex-col justify-center items-center Connections">
          <span>
            {errors.Connection && (
              <span className="text-red-500 text-base">{errors.Connection.message}</span>
            )}  
            Have you directed any notable films or web series
          </span>
          <div className="flex justify-around items-center w-32">
            <span className="flex justify-center items-center">
              <input type="checkbox"  id=""  value="Yes" onChange={(e) => {
                  setnotabelFilms(e.target.value);
                  setValue("Connection", e.target.value);
                }}
                checked={notabelFilms === "Yes"}
                {...register("Connection", { required: "*" })}/>
              <span className="font-mono">Yes</span>
            </span>
            <span className="flex justify-center items-center">
              <input type="checkbox"  id="" value="No"
                onChange={(e) => {
                  setnotabelFilms(e.target.value);
                  setValue("Connection", e.target.value);
                }}
                checked={notabelFilms === "No"}
                {...register("Connection", { required: "*" })}/>

              <span>No</span>
            </span>
          </div>
        </label> */}
          <label htmlFor="Connection" className="flex flex-col justify-center items-center Con" >
          <span>
            {errors.Connection && (
              <span className="text-red-500 text-base">{errors.Connection.message}</span>
            )}  
            Have you directed any notable films or web series
          </span>
          <div className="flex justify-around items-center w-32">
            <span className="flex justify-center items-center">
              <input type="checkbox" name="Connection" value="yes"  onChange={(e)=>setnotabelFilms(e.target.value)}  checked={notabelFilms === "yes"} />
              <span>yes</span>
            </span>
            <span className="flex justify-center items-center">
              <input type="checkbox" name="Connection" value="No" onChange={(e)=>setnotabelFilms(e.target.value)} checked={notabelFilms === "No"} />
              <span>No</span>
            </span>
          </div>
        </label>



        {notabelFilms === "yes" && Close && (
          <div className="flex flex-row">
            <FaCaretDown
              className="text-2xl cursor-pointer fill-red-600"
              onClick={() => setClose(false)}
            />
            <span>Show Entries</span>
          </div>
        )}

        {notabelFilms === "yes" && (
          <div className={`${Close ? "hidden" : "flex flex-col justify-around gap-2"}`}>
            <div className="flex flex-row">
              <FaCaretDown className="text-2xl cursor-pointer" onClick={() => setClose(true)} />
              <span>Hide Entries</span>
            </div>

            {filmEntries.map((entry, idx) => (
              <span key={idx} className="flex gap-2 justify-evenly">
                <span>{idx + 1}</span>
                <label className="flex flex-col justify-center gap-2" htmlFor={`films.${idx}.name`}>
                  <span>
                    {errors.films?.[idx]?.name && (
                      <span className="text-red-500 text-base">
                        {errors.films[idx].name.message}
                      </span>
                    )}
                    Name
                  </span>
                  <input
                    className="form-style h-9 bg-richblack-600 rounded-2xl form-style w-[280px]"
                    type="text"
                    placeholder={`Enter the ${idx + 1} film name`}
                    {...register(`films.${idx}.name`, {
                      required: "Film name is required",
                    })}
                    value={entry.name}
                    onChange={(e) => {
                      const updated = [...filmEntries];
                      updated[idx].name = e.target.value;
                      setFilmEntries(updated);
                    }}
                  />
                </label>
                <label className="flex flex-col gap-2" htmlFor={`films.${idx}.url`}>
                  <span>
                    {errors.films?.[idx]?.url && (
                      <span className="text-red-500 text-base">
                        {errors.films[idx].url.message}
                      </span>
                    )}
                    URL
                  </span>
                  <input
                    className="form-style h-9 bg-richblack-600 rounded-2xl form-style w-[280px]"
                    type="url"
                    placeholder="Enter the link of that film"
                    {...register(`films.${idx}.url`, {
                      required: "Film URL is required",
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Enter a valid URL",
                      },
                    })}
                    value={entry.url}
                    onChange={(e) => {
                      const updated = [...filmEntries];
                      updated[idx].url = e.target.value;
                      setFilmEntries(updated);
                    }}
                  />
                </label>
                <div
                  className="flex justify-center items-center w-10 h-8 rounded-full hover:bg-red-600"
                  onClick={() => {
                    if (filmEntries.length === 1) {
                      setFilmError("You need to keep at least one field or set The Notable films to No");
                    } else {
                      const updated = filmEntries.filter((_, i) => i !== idx);
                      setFilmEntries(updated);
                      setFilmError("");
                    }
                  }}
                >
                  <RxCross1 />
                </div>
              </span>
            ))}

            {filmError && (
              <span className="text-red-500 text-sm flex justify-center items-center">
                {filmError}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                if (filmEntries.length >= 4) {
                  setFilmError("You can create 4 fields only");
                } else {
                  setFilmEntries([...filmEntries, { name: "", url: "" }]);
                  setFilmError("");
                }
              }}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            >
              Add more
            </button>
          </div>
        )}

        <div className="w-full h-[300px]">
          <label
            htmlFor="portfolio"
            className={`${
              Close === true || notabelFilms === "No"
                ? "flex justify-around items-center Port_upper"
                : "hidden"
            }`}
          >
            <span>
              {errors.portfolio && (
                <span className="text-red-500 text-base">{errors.portfolio.message}</span>
              )}
              Resume / Portfolio Link
            </span>
            <input
              type="url"
              name="portfolio"
              {...register("portfolio", {
                required: "*",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Enter a valid URL",
                },
              })}
              placeholder="Enter your Portfolio Link"
              className="w-[300px] bg-richblack-600 h-11 form-style"
            />
          </label>
          <label htmlFor="Projects" className={`${
              Close === true || notabelFilms === "No"
                ? "flex justify-around items-center Number"
                : "hidden"
            }`}>
             <span>{errors.Projects && (
  <span className="text-red-500 text-base">{errors.Projects.message}</span>
)}Number of Projects you have done</span>
          <select
           {...register("Projects", { required: "*" })}
  className="w-[200px] bg-richblack-600 h-11 form-style"
  value={selectedProjects}
  onChange={e => {
    setSelectedProjects(e.target.value);
  }}
>
  <option value="" disabled className='text-white cursor-not-allowed'>Number of Projects</option>
  {Projects.ProjectNumber.map((data, index) => (
    <option key={index} value={data} className="flex justify-center items-center flex-col"> {data}</option>
  ))}
</select>
        </label>

          <label
            htmlFor="Production"
            className={`${
              Close === true || notabelFilms === "No"
                ? "flex justify-around items-center Prod"
                : "hidden"
            }`} 
          >
            <span>
              {errors.Production && (
                <span className="text-red-500 text-base">{errors.Production.message}</span>
              )}
              Are There any projects ready to upload or in production
            </span>
            <span>
              <input
                type="checkbox"
                name="Production"
                value="yes"
                onChange={(e) => {
                  setReady(e.target.value);
                  setValue("Production", e.target.value);
                }}
                checked={ready === "yes"}
                
              />
              <span>Yes</span>
            </span>
            <span>
              <input
                type="checkbox"
                name="Production"
                value="No"
                onChange={(e) => {
                  setReady(e.target.value);
                  setValue("Production", e.target.value);
                }}
                checked={ready === "No"}
                
              />
              <span>No</span>
            </span>
          </label>

          {ready === "yes" && (
            <label htmlFor="Stage" className="flex flex-col">
              <span className="flex justify-center items-center font-mono">
                {errors.Stage && (
                  <span className="text-red-500 text-base">{errors.Stage.message}</span>
                )}
                Can you give me some names of them and in what stage are they
              </span>
              <div className="flex justify-around items-center">
                <span className="flex flex-col gap-2">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Enter The name"
                    className="w-[240px] bg-richblack-600 h-11 form-style"
                    {...register("Stage.name", { required: "Project name is required" })}
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <span>Stage of Production</span>
                  <select
                    name="Stage.stage"
                    className="w-[200px] bg-richblack-600 h-11 form-style"
                    {...register("Stage.stage", { required: "Stage of production is required" })}
                    onChange={(e)=>setProductionStage(e.target.value)}
                  >
                    <option value="" disabled className="text-white cursor-not-allowed">
                      Stage Of Production
                    </option>
                    {Projects.Stages.map((data, index) => (
                      <option
                        key={index}
                        value={data}
                        className="flex justify-center items-center flex-col"
                      >
                        {data}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
            </label>
          )}

          <label htmlFor="Projects" className={`${
              Close === true || notabelFilms === "No"
                ? "flex justify-around items-center Number"
                : "hidden"
            }`}>
             <span>{errors.Projects && (
  <span className="text-red-500 text-base">{errors.Projects.message}</span>
)}Number of Projects you have done</span>
          <select
           {...register("Projects", { required: "*" })}
  className="w-[200px] bg-richblack-600 h-11 form-style"
  value={selectedProjects}
  onChange={e => {
    setSelectedProjects(e.target.value);
  }}
>
  <option value="" disabled className='text-white cursor-not-allowed'>Number of Projects</option>
  {Projects.ProjectNumber.map((data, index) => (
    <option key={index} value={data} className="flex justify-center items-center flex-col"> {data}</option>
  ))}
</select>
        </label>


          <div className="w-full h-24 flex justify-around items-center Btns">
            <button
              type="button"
              disabled={loading}
              className={`rounded-3xl w-44 h-14 ${
                selectedType === "Prev" ? "bg-richblack-900 border-richblack-900" : "bg-richblack-400"
              }`}
              onClick={() => handleChangeAndNext("Prev")}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={loading}
              className={`rounded-3xl w-44 h-14 ${
                selectedType === "Next" ? "bg-richblack-900 border-richblack-900" : "bg-richblack-400"
              }`}
              onClick={() => handleChangeAndNext("Next")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )}
    {selectedType === "Producer" && (
      <div>
        This is for the producer section
      </div>
    )}
  </div>
)}


       {part === 4 && loading? <Loader data="top-40 left-80"/>:(
        <div className={`${part === 4 ? "flex w-full " : "hidden"}`}>
          <div className='w-full h-full'>
          <label htmlFor="Budget" className={`${Close === true || notabelFilms === 'No' ? "flex w-full flex-col justify-around items-center Exp" : "hidden"}`}>
          Can You Describe What is The Total Expenditure That you Have Spend Till now <br />
          <span className='w-80  flex justify-around items-center'>
            <span >
            <input type="checkbox" name="Budget" value="yes"  onChange={(e)=>setBudget(e.target.value)}  checked={budget === "yes"}/>
            <span>yes</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="No" onChange={(e)=>setBudget(e.target.value)} checked ={budget === "No"}/>
            <span>No</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="Rather Not to Disclose" onChange={(e)=>setBudget(e.target.value)} checked={budget === "Rather Not to Disclose"}/>
            <span>Rather Not to Disclose</span>
          </span>
          </span>
        </label>
        <label htmlFor="Money" className={`${budget === "yes" ? "flex w-full justify-around items-center Exp" : "hidden"}`}> 
          Total Money Spend Till Now
          <select name="Money" id="" className="w-[200px] bg-richblack-600 h-11 form-style">
  <option value="" disabled className='text-white cursor-not-allowed'>Total Money Spend</option>
  
            {Projects.Money.map((data,index)=>(
              <option key={index}  value={data} className='flex justify-center items-center flex-col'>{data}</option>
            ))}
            </select>
        </label> 
        <label htmlFor="Screens" className="flex w-full justify-around items-center Exp"> 
          which screens do you need
          <select name="Screens" id="" className="w-[200px] bg-richblack-600 h-11 form-style">
  <option value="" disabled className='text-white cursor-not-allowed'>Types of Screens</option>
  
            {Projects.Screens.map((data,index)=>(
              <option key={index}  value={data} className='flex justify-center items-center flex-col'>{data}</option>
            ))}
            </select>
        </label> 
        <label htmlFor="Promotions" className='flex flex-col justify-center items-center Exp'>
          <span className='font-mono text-xl'>Do You handle Your Own /Promotions</span>
           <span className='w-80  flex justify-around items-center'>
            <span >
            <input type="checkbox" name="Budget" value="yes"  onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "yes"}/>
            <span>yes</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="No" onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "No"}/>
            <span>No</span>
          </span>
          </span>
        </label>

        <label htmlFor="Help" className='flex flex-col justify-center items-center Exp'>
          <span>Will you need help in sponsors Sales or Any Legal Activities</span>
           <span className='w-80  flex justify-around items-center'>
            <span >
            <input type="checkbox" name="Budget" value="yes"  onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "yes"}/>
            <span>Sure Why Not</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="No" onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "No"}/>
            <span>Nah I can manage</span>
          </span>
          </span>
        </label>
          <label className="  font-semibold flex flex-col justify-center items-center Exp" htmlFor='Joining'>
            why do you want to join Us
            <input type="text"  value={text}
        onChange={handleChange}
        className="w-[500px] border h-[80px] border-gray-300 rounded-lg  focus:outline-none  focus:ring-blue-500 "
        placeholder="Write your description..."/>
      <p className="text-right text-sm mt-1  -top-6 relative left-56">
        {getWordCount(text)} / {wordLimit} 
      </p>
      </label>

      <label className=" font-semibold flex flex-col justify-center items-center " htmlFor='Unique'>
            what makes your fims unique
        <input type="text"  value={films}
        onChange={handleChange}
        className="w-[500px] border h-[80px] border-gray-300 rounded-lg focus:outline-none  focus:ring-blue-500 "
        placeholder="Write your description..."/>
      <p className="text-right text-sm mt-1  -top-6 relative left-56">
        {getWordCount(films)} / {wordLimit} 
      </p>
      </label>

      <div className='w-full  flex  justify-around items-center h-13'>
        <button className='w-[240px] bg-richblack-600 h-11 form-style font-bold' onClick={()=>setPart(part - 1)}>Previous</button>
        <button className='w-[240px] bg-richblack-600 h-11 form-style font-bold' onClick={()=>setPart(part + 1)}>Next</button>
      </div>
          </div>
    
        </div>
       ) }

       {part === 5 && loading? <Loader data="top-40 left-80"/>:(
        <div className={`${part === 5 ? "flex" : "hidden"}`}>
          <div className='w-full h-full'>
            <label htmlFor="Promotions" className='flex flex-col justify-center items-center Exp'>
          <span className='font-mono text-xl'>Do you have full rights of your film</span>
           <span className='w-80  flex justify-around items-center'>
            <span >
            <input type="checkbox" name="Budget" value="yes"  onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "yes"}/>
            <span>yes</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="No" onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "No"}/>
            <span>No</span>
          </span>
          </span>
        </label>
        <label htmlFor="Promotions" className='flex flex-col justify-center items-center Exp'>
          <span className='font-mono text-xl'>Do you have Any Censorship certificate</span>
           <span className='w-80  flex justify-around items-center'>
            <span >
            <input type="checkbox" name="Budget" value="yes"  onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "yes"}/>
            <span>yes</span>
          </span>
          <span>
            <input type="checkbox" name="Budget" value="No" onChange={(e)=>setPromotions(e.target.value)} checked={Promotions === "No"}/>
            <span>No</span>
          </span>
          </span>
        </label>
        <label
  htmlFor="Image"
  className="flex flex-col items-center justify-center w-full my-8"
>
  <span className="mb-2 text-lg font-semibold ">
    Proof of Identity
  </span>
  <label
    htmlFor="Image"
    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-8 bg-white hover:bg-blue-50 transition-colors cursor-pointer w-full max-w-md shadow"
  >
    <FaUpload className="w-10 h-10 text-blue-400 mb-2" />
    <span className="text-blue-600 font-medium">
      Click to upload images
    </span>
    <span className="text-xs text-gray-400 mt-1">
      (You can select multiple images)
    </span>
    <input
      type="file"
      name="Image"
      id="Image"
      multiple
      accept="image/*"
      className="hidden"
      // onChange={handleImageChange}
    />
  </label>
</label>
<label htmlFor="Terms" className='w-full h-10  flex  justify-center items-center flex-row-reverse'>
  Terms And Condition
  <input type="checkbox" name="Terms" id="" required />
</label>

<label htmlFor="Policy" className='w-full h-10  flex  justify-center items-center flex-row-reverse'>
  Privacy  And Policy
  <input type="checkbox" name="Policy" id="" required />
</label>
<div className='w-full h-15  flex  justify-center items-center flex-row-reverse Final'>
          <button type='Submit' className='h-10 w-2/6  rounded-2xl bg-richblack-400'>Submit</button>
</div>
          </div>
        </div>
       ) }
    </form>
  )
}
export default OrgainezerForm