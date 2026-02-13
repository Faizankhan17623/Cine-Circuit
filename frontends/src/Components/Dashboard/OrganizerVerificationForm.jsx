import React, { useState, useRef,useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import AllCountries from '../../data/AllCountries.json';
import Countries from '../../data/CountryCode.json';
import Projects from '../../data/Projects.json';
import Genre from '../../data/Genre.json';
import Tools from '../../data/Tools.json';
import Credits from '../../data/Credits.json';
import Profession from '../../data/Professsion.json';
import { FaCaretDown } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { FaLinkedin, FaYoutube, FaInstagram, FaImdb } from "react-icons/fa";
import Soc from '../../data/Social.json';
import { FaXTwitter } from "react-icons/fa6";
import Logout from '../extra/Logout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {GetAllUserDetails} from '../../Services/operations/User'
import Loader from '../extra/Loading'
import {Orgainezer_Data,DirectorFres,DirectorExperien,ProducerFreshe,ProducerExpe} from '../../Services/operations/orgainezer'
import {GetAllOrgDetails} from '../../Services/operations/Admin'

const formatDateForInput = (dateStr, type = "date") => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr; // already in correct format or unknown
  const [day, month, year] = parts;
  if (type === "month") return `${year}-${month}`;
  return `${year}-${month}-${day}`;
};

const OrganizerVerificationForm = () => {
  // console.log("This is the direction data",direction)
   const navigate = useNavigate()
    const dispatch = useDispatch()
    const {token} = useSelector((state)=>state.auth)    
    const {status,editUntil,attempts,rejectedData} = useSelector((state)=>state.orgainezer)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    defaultValues: {
      distributions: "No",
      promotions:"No",
      Work: "No",
      mediaChoice:"No",
      Ongoing: "No",
      Planned: "No",
      AssistanceRequired:"No",
      Certified: "No",
      Experience: "No",
      Collaboration: "No",
      ToolsChoice: "No",     
      tools: [],             
      software: [],     
    }
  });

  const iconMap = {
    FaLinkedin: FaLinkedin,
    FaYoutube: FaYoutube,
    FaInstagram: FaInstagram,
    FaImdb: FaImdb,
    FaXTwitter: FaXTwitter,
  };


const Proceed = async (data) => {

  try {
    setloading(true)
    const Response = await dispatch(Orgainezer_Data(data, token));
      // const userId = getState().Profile.user?._id;
      // console.log(Response)
       if (!Response?.success) {
      toast.error(Response?.message || "Organizer data failed");
      return;
    }
      if (Response?.success) {
      toast.success("Data send Succesfully")
    }

       if (data.selectedRole === "Director") {
      if (data.experiences === "Fresher") {
        const res = await dispatch(DirectorFres(data, token));
        if (!res?.success) throw new Error("Director Fresher failed");
      } else {
        const res = await dispatch(DirectorExperien(data, token));
        if (!res?.success) throw new Error("Director Experienced failed");
      }
    }


        if (data.selectedRole === "Producer") {
      if (data.experiences === "Fresher") {
        const res = await dispatch(ProducerFreshe(data, token));
        if (!res?.success) throw new Error("Producer Fresher failed");
      } else {
        const res = await dispatch(ProducerExpe(data, token));
        if (!res?.success) throw new Error("Producer Experienced failed");
      }
    }

    if (Response?.success) {
      toast.success("Data send Succesfully")
    }
     if (!Response?.success) {
      // main failed — show server message if available and stop
      toast.error(Response?.message || "Failed to submit main organizer data");
      return;
    }
     Swal.fire({
    title: "Success !",
    text: "Your Data is Been Submitted",
    icon: "success",
    showConfirmButton: true,
    timer: 5000
  });

  localStorage.setItem("Data_Submitted", true);

  setTimeout(() => {
    navigate("/Dashboard/My-Profile");
  }, 3000);
  
  } catch (error) {
    console.log(error)
    console.log(error, error.message);
  }finally{
    setloading(false)
  }
};


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState('');
  const [open, setOpen] = useState(true);
  const [add, setAdd] = useState(true);
  const [work, setWork] = useState("No");
  const [media, setMedia] = useState("No");
  const [socialError, setSocialError] = useState("");

  const [projects, setProjects] = useState(false);
  const [social, setSocial] = useState(false);
  const [filmError, setFilmError] = useState("");
  const [upload, setUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [ongoing, setOngoing] = useState("No");
  const [planned, setPlanned] = useState("No");
  const [on, setOn] = useState(false);
  const [pp, setPp] = useState(false);
  const [ongoingError, setOngoingError] = useState("");
  const [plannedError, setPlannedError] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showSubGenreDropdown, setShowSubGenreDropdown] = useState(false);
  const [genres, setGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);
  const [genreError, setGenreError] = useState("");
  const [subGenreError, setSubGenreError] = useState("");
  const [distribution, setDistribution] = useState("No");
  const [screen, setScreen] = useState(false);
  const [audience, setAudience] = useState(false);
  const [screenTypes, setScreenTypes] = useState([]);
  const [audienceTypes, setAudienceTypes] = useState([]);
  const [audienceError, setAudienceError] = useState('');
  const [screenError, setScreenError] = useState('');
  const [promotions, setPromotions] = useState("No");
  const [notable, setNotable] = useState(false);
  const [notableError, setNotableError] = useState("");
  const [support, setSupport] = useState("No");
  const [certified, setCertified] = useState("No");
  const [experience, setExperience] = useState("No");
  const [collabration, setCollabration] = useState("No");
  const [cert, setCert] = useState(false);
  const [certError, setCertError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [experiences, setExperiences] = useState("");
  const [roleError, setRoleError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [affiliationError, setAffiliationError] = useState("");
  const [internship, setInternship] = useState("No");
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [localAddress, setLocalAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
const [confirmationModal, setConfirmationModal] = useState(null);
const [openIntern, setOpenIntern] = useState(false);
const [internError, setInternError] = useState("");

  const [Awards, setAwards] = useState(true);
  const [awardError, setAwardError] = useState("");
const [hasAwards, setHasAwards] = useState("No");  
const [awardSectionOpen, setAwardSectionOpen] = useState(false);

const [selectedTools, setSelectedTools] = useState([]);
const [selectedSoftware, setSelectedSoftware] = useState([]);
const [toolError, setToolError] = useState("");
 const [softwareError, setSoftwareError] = useState("");
  const [Soft,setSoft] = useState("No")

  const [funding,setfunding] = useState(false)
  const [finance,setfinance] = useState([])
  const[financeError,setfinanceError] = useState("")
const [Funding,setFunding] = useState(false)

const [Duplication,setduplication] = useState(false)
const [urlDuplication,seturlduplication] = useState(false)
const [urlDuplicatio,seturlduplicatio] = useState(false)
const [urlDuplications,seturlduplications] = useState(false)
const [vie,setview] = useState(false)
const [follow,setfollow] = useState("")
const [Ongoingduplication,setOngoingduplication] = useState(false)

// Notable projects and the socail media links set 
const [duplicateNameIndices, setDuplicateNameIndices] = useState(new Set());
const [duplicateUrlIndices, setDuplicateUrlIndices] = useState(new Set());
const [duplicateSocialUrlIndices, setDuplicateSocialUrlIndices] = useState(new Set());

// Ongoing Projects and projects planned for this year
const [duplicateongoingproject, setduplicateongoingproject] = useState(new Set());
const [duplicateongoingscript, setduplicateongoingscriptcls] = useState(new Set());
const [duplicateProjectsplanned, setduplicateProjectsplanned] = useState(new Set());

// Distribution
const [duplicatedistributations, setduplicatedistributations] = useState(new Set());

// Certifications
const [duplicateCertifications, setduplicateCertifications] = useState(new Set());

// Producer Fresher
// Experience & Funding
const [duplicateinternship, setduplicateinternship] = useState(new Set());
// const [duplicatedocuments, setduplicatedocuments] = useState(new Set());

// Director Experienced
const [duplicateAwardFestival, setduplicateAwardFestival] = useState(new Set());
const [duplicateMovieName, setduplicateMovieName] = useState(new Set());
const [data,setdata] = useState()
  const [loading,setloading] = useState(false)
  const [budget,setbudget] = useState("")
  const [earned,setearned] = useState("")
  const [affilitions,setaffilition] = useState("No")
// const [editUntill,seteditUntill] = useState('')
const [OrgData,setOrgData] = useState()
const [prodFresh,setProdFresh] = useState()
const [prodExper,setProdExper] = useState()
const [direFresh,setDireFresh] = useState()
const [direExper,setDireExper] = useState()
// const [attempt,setAttempts] = useState()
// console.log(typeof OrgData)
const myJSON = JSON.stringify(OrgData);

// console.log(myJSON);
const [Days,setDays] = useState(0)
const [Hour,setHour] = useState(0)
const [Min,setMin] = useState(0)
const [Secs,setSecs] = useState(0)
const [expired, setExpired] = useState(false)


useEffect(() => {
  const endTime = new Date(editUntil);

  const timer = setInterval(() => {
    const now = new Date();
    const diffMs = endTime - now;

    if (diffMs <= 0) {
      clearInterval(timer);
       setDays(0);
       setHour(0);
       setMin(0);
       setSecs(0);
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);

    setDays(Math.floor(totalSeconds / 86400));
    setHour(Math.floor((totalSeconds % 86400) / 3600));
    setMin(Math.floor((totalSeconds % 3600) / 60));
    setSecs(totalSeconds % 60);

  }, 5);

  return () => clearInterval(timer);
}, [editUntil]);



const [fields,setFields] = useState({
  bio:"",
  JoiningReason:"",
  // Director Freshser 
  DirectorInspiration:"",
  EarlyChallengs:"",
  ProjectPlanning:"",
  ProjectPromotion:"",
  SceneVisualize:"",
  // Director Experience
  ProjectDescription:"",
  // Producer Fresher
  Inspiration:"",
  BudgetHandling:"",
  Networking:"",
  FundDelays:"",
  // Producer Experience 
  RiskManagement:""
})

  const { fields: Notable, append: appendprojects, remove: removeprojects } = useFieldArray({ control, name: "Notable" });
  const { fields: socials, append: appendSocial, remove: removeSocial } = useFieldArray({ control, name: "socials" });
  const { fields: ongoingProjects, append: appendOngoing, remove: removeOngoing } = useFieldArray({ control, name: "ongoingProjects" });
  const { fields: plannedProjects, append: appendPlanned, remove: removePlanned } = useFieldArray({ control, name: "plannedProjects" });
  const { fields: distributionsEntries, append: appendDistribution, remove: removeDistribution } = useFieldArray({ control, name: "distributionsEntries" });
  const { fields: certifications, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });
  const { fields: internships, append: appendIntern, remove: removeIntern } = useFieldArray({ control, name: "internships" });
  const { fields: awards, append: appendAward, remove: removeAward, replace: replaceAwards } = useFieldArray({ control, name: "awards"});
  const { fields: tools, append: appendtools, remove: removetools } = useFieldArray({ control, name: "tools"});

      useEffect(()=>{
    const Handlerr = async()=>{
      if (!token) return;
      try{
    // setloading(true)

        const Repsonse = await dispatch(GetAllUserDetails(token,navigate))
        // console.log(Repsonse.data.data)
        setdata(Repsonse?.data?.data)

          if (Repsonse?.success) {
    setdata(Repsonse?.data?.data);
  }
      }catch(error){
        console.log(error)
      }
    }
    Handlerr()
  },[token,navigate,dispatch])

// console.log(data)
//   const localAddressValue = watch("LocalAddress");
// const permanentAddressValue = watch("PermanentAddress");
// console.log(data)
   useEffect(() => {
     if (data && !(status === "rejected" && rejectedData)) {
       const nameParts = data?.userName?.split(" ");
       setValue("First", nameParts?.[0] || "", { shouldValidate: true });
       setValue("Last", nameParts?.[1] || "", { shouldValidate: true });
       setValue("Email", data?.email || "", { shouldValidate: true });
       setValue("CountryCode", data?.countrycode || "", { shouldValidate: true });
       setValue("MobileNumber", data?.number || "", { shouldValidate: true });
     }
   }, [data, setValue, status, rejectedData])
// console.log(status)
     useEffect(() => {
     const handler = async () => {
    if (!token) return;

     try {
     setloading(true)

       const response = await dispatch(GetAllOrgDetails(token, navigate));
      //  console.log(response)
       // Safe access
       const data = response?.data;
       if (data) {
         setOrgData(data.organizersData[0] || "");
         setProdFresh(data.producerFresh[0] || "");
         setProdExper(data.producerExperience[0] || "");
         setDireFresh(data.directorFresh[0] || "");
         setDireExper(data.directorExperience[0] || "");
       }
     setloading(false)

     } catch (error) {
       console.error('Error:', error);
       setloading(false)
     }
   };

   handler();
}, [token, dispatch, navigate]);



//     // console.log("This is the org date fro mthe backend",OrgData)

//     // console.log(prodFresh)
//     // console.log(prodExper)
//     // console.log(direFresh)
//     // console.log(direExper)
//     const dird = JSON.stringify(direExper)
//     // console.log(dird)
    
// // Set gender value from OrgData when it loads
 useEffect(() => {
   if (OrgData?.gender) {
     setValue("Gender", OrgData.gender);
   }
   // Set professional background fields from OrgData
   if (OrgData?.website) {
     setValue("Portfolio", OrgData.website);
   }
   if (OrgData?.totalprojects) {
     setValue("TotalProjects", OrgData.totalprojects);
   }
   if (OrgData?.yearsexperience) {
     setValue("YearExperience", OrgData.yearsexperience);
   }
   if (OrgData?.Shortbio) {
     setValue("bio", OrgData.Shortbio);
     setFields(prev => ({ ...prev, bio: OrgData.Shortbio }));
   }
   if (OrgData?.MainReason) {
     setValue("JoiningReason", OrgData.MainReason);
     setFields(prev => ({ ...prev, JoiningReason: OrgData.MainReason }));
   }
   // Set role and experience level
   if (OrgData?.Role) {
     setSelectedRole(OrgData.Role);
     setValue("selectedRole", OrgData.Role);
   }
   if (OrgData?.ExperienceLevel) {
     setExperiences(OrgData.ExperienceLevel);
     setValue("experiences", OrgData.ExperienceLevel);
   }
 }, [OrgData]);

// // // Set image preview from OrgData when it loads
 useEffect(() => {
   if (OrgData?.image) {
     setImagePreview(OrgData.image);
   }
 }, [OrgData]);

// // Populate role-specific fields (motivation, inspiration, etc.) from backend data
useEffect(() => {
  let roleData = null;
  
  // Determine which role data to use based on OrgData role
  if (OrgData?.Role === "Director" && OrgData?.ExperienceLevel === "Fresher" && direFresh) {
    roleData = direFresh;
  } else if (OrgData?.Role === "Director" && OrgData?.ExperienceLevel === "Experienced" && direExper) {
    roleData = direExper;
  } else if (OrgData?.Role === "Producer" && OrgData?.ExperienceLevel === "Fresher" && prodFresh) {
    roleData = prodFresh;
  } else if (OrgData?.Role === "Producer" && OrgData?.ExperienceLevel === "Experienced" && prodExper) {
    roleData = prodExper;
  }
  
  if (roleData) {
    // Update all text area fields from role-specific data
    setFields(prev => ({
      ...prev,
      bio: prev.bio || OrgData?.Shortbio || "",
      JoiningReason: prev.JoiningReason || OrgData?.MainReason || "",
      DirectorInspiration: roleData?.Inspiration || roleData?.DirectorInspiration || "",
      EarlyChallengs: roleData?.EarlyChallenges || roleData?.EarlyChallengs || "",
      ProjectPlanning: roleData?.ProjectPlanning || "",
      ProjectPromotion: roleData?.ProjectPromotion || "",
      SceneVisualize: roleData?.SceneVisualize || "",
      ProjectDescription: roleData?.ProjectDescription || "",
      Inspiration: roleData?.Inspiration || "",
      BudgetHandling: roleData?.BudgetHandling || "",
      Networking: roleData?.Networking || "",
      FundDelays: roleData?.FundDelays || "",
      RiskManagement: roleData?.RiskManagement || ""
    }));
    
    // Populate form fields and state variables for Director/Producer Experienced/Fresher
    if (OrgData?.Role === "Director" && OrgData?.ExperienceLevel === "Experienced" && direExper) {
      // Director Experienced - Awards
      if (direExper?.Awards) {
        const awardsNeeded = direExper.Awards.needed === 'true' ? "Yes" : "No";
        setHasAwards(awardsNeeded);
        setValue("Awards", awardsNeeded);

        // Populate award items into the field array
        if (awardsNeeded === "Yes" && direExper.Awards.items && direExper.Awards.items.length > 0) {
          setAwardSectionOpen(true);
          // Create rows in the field array so .map() renders them
          const awardEntries = direExper.Awards.items.map((item) => ({
            category: item.AwardCategory || "",
            awardName: item.AwardFestival || "",
            movieName: item.MovieName || "",
            releaseDate: formatDateForInput(item.ReleaseDate, "date"),
            Currencey: item.Currency || "",
            budget: item.TotalBudget || "",
            earned: item.TotalEarned || "",
          }));
          replaceAwards(awardEntries);

          // Also set values at the uppercase "Awards" paths that the inputs register under
          direExper.Awards.items.forEach((item, index) => {
            setValue(`Awards.${index}.category`, item.AwardCategory || "");
            setValue(`Awards.${index}.awardName`, item.AwardFestival || "");
            setValue(`Awards.${index}.movieName`, item.MovieName || "");
            setValue(`Awards.${index}.releaseDate`, formatDateForInput(item.ReleaseDate, "date"));
            setValue(`Awards.${index}.Currencey`, item.Currency || "");
            setValue(`Awards.${index}.budget`, item.TotalBudget || "");
            setValue(`Awards.${index}.earned`, item.TotalEarned || "");
          });
        }
      }

      // Director Experienced - Team Size
      if (direExper?.TeamSize) {
        setValue("teamSize", direExper.TeamSize);
      }

      // Director Experienced - Tools & Software
      if (direExper?.ToolsSoftware) {
        const toolsNeeded = direExper.ToolsSoftware.needed === 'true' ? "Yes" : "No";
        setValue("ToolsChoice", toolsNeeded);
        setSoft(toolsNeeded);

        if (toolsNeeded === "Yes") {
          // Populate selected tools
          if (direExper.ToolsSoftware.Tools && direExper.ToolsSoftware.Tools.length > 0) {
            setSelectedTools(direExper.ToolsSoftware.Tools);
            setValue("tools", direExper.ToolsSoftware.Tools);
          }
          // Populate selected software
          if (direExper.ToolsSoftware.Software && direExper.ToolsSoftware.Software.length > 0) {
            setSelectedSoftware(direExper.ToolsSoftware.Software);
            setValue("software", direExper.ToolsSoftware.Software);
          }
        }
      }
    } else if (OrgData?.Role === "Director" && OrgData?.ExperienceLevel === "Fresher" && direFresh) {
      // Director Fresher
      if (direFresh?.Awards) {
        setHasAwards(direFresh.Awards.needed === 'true' ? "Yes" : "No");
        setValue("Awards", direFresh.Awards.needed === 'true' ? "Yes" : "No");
      }
    }
  }
}, [OrgData, direFresh, direExper, prodFresh, prodExper]);

// // Populate form fields with rejected data when status is rejected
useEffect(() => {
  if (status === "rejected" && rejectedData) {
    // Personal Information
    const firstName = rejectedData?.username?.split(" ")?.[0] || "";
    const lastName = rejectedData?.username?.split(" ")?.[1] || "";
    
    // Use reset to update the form with all values at once
    reset({
      First: firstName,
      Last: lastName,
      Email: rejectedData?.email || "",
      CountryCode: rejectedData?.CountryCode || "",
      MobileNumber: rejectedData?.number || "",
      WhatsAppNumber: rejectedData?.number || "",
      CountryName: rejectedData?.Country || "",
      StateName: rejectedData?.state || "",
      CityName: rejectedData?.City || "",
      Gender: rejectedData?.gender || "",
      LocalAddress: rejectedData?.localaddress || "",
      PermanentAddress: rejectedData?.permanentaddress || "",
      Portfolio: rejectedData?.website || "",
      selectedRole: rejectedData?.Role || "",
      experiences: rejectedData?.ExperienceLevel || "",
      TotalProjects: rejectedData?.totalprojects || 0,
      YearExperience: rejectedData?.yearsexperience || "",
      bio: rejectedData?.Shortbio || "",
      JoiningReason: rejectedData?.MainReason || "",
      Work: rejectedData?.NotableProjects?.needed || "No",
      mediaChoice: rejectedData?.SocialMedia?.active || "No",
      Ongoing: rejectedData?.ongoing?.active || "No",
      Planned: rejectedData?.planned?.active || "No",
      distributions: rejectedData?.Distribution?.needed || "No",
      promotions: rejectedData?.Promotions || "No",
      AssistanceRequired: rejectedData?.Support?.needed || "No",
      Certified: rejectedData?.Certifications?.active || "No",
      Experience: rejectedData?.Experience || "No",
      Collaboration: rejectedData?.Collaboration || "No",
      Comfortable: rejectedData?.Comfortable || "No",
    });

    // Update state variables as well
    setMobileNumber(rejectedData?.number || "");
    setWhatsAppNumber(rejectedData?.number || "");
    setCountryName(rejectedData?.Country || "");
    setStateName(rejectedData?.state || "");
    setCityName(rejectedData?.City || "");
    setLocalAddress(rejectedData?.localaddress || "");
    setPermanentAddress(rejectedData?.permanentaddress || "");
    setSelectedRole(rejectedData?.Role || "");
    setExperiences(rejectedData?.ExperienceLevel || "");
    if (rejectedData?.NotableProjects?.needed) setWork(rejectedData.NotableProjects.needed);
    if (rejectedData?.SocialMedia?.active) setMedia(rejectedData.SocialMedia.active);
    if (rejectedData?.ongoing?.active) setOngoing(rejectedData.ongoing.active);
    if (rejectedData?.planned?.active) setPlanned(rejectedData.planned.active);
    if (rejectedData?.Distribution?.needed) setDistribution(rejectedData.Distribution.needed);
    if (rejectedData?.Promotions) setPromotions(rejectedData.Promotions);
    if (rejectedData?.Support?.needed) setSupport(rejectedData.Support.needed);
    if (rejectedData?.Certifications?.active) setCertified(rejectedData.Certifications.active);
    if (rejectedData?.Experience) setExperience(rejectedData.Experience);
    if (rejectedData?.Collaboration) setCollabration(rejectedData.Collaboration);

    // Preferences - set both state AND RHF values
    if (rejectedData?.Genre && rejectedData.Genre.length > 0) {
      setGenres(rejectedData.Genre);
      setValue("genres", rejectedData.Genre.join(","), { shouldValidate: true });
    }

    if (rejectedData?.SubGenre && rejectedData.SubGenre.length > 0) {
      setSubGenres(rejectedData.SubGenre);
      setValue("subgenres", rejectedData.SubGenre.join(","), { shouldValidate: true });
    }

    if (rejectedData?.Screening && rejectedData.Screening.length > 0) {
      setScreenTypes(rejectedData.Screening);
      setValue("screenFormats", rejectedData.Screening.join(","), { shouldValidate: true });
    }

    if (rejectedData?.Audience && rejectedData.Audience.length > 0) {
      setAudienceTypes(rejectedData.Audience);
      setValue("audienceTypes", rejectedData.Audience.join(","), { shouldValidate: true });
    }

    // Set image preview
    if (rejectedData?.image) {
      setImagePreview(rejectedData.image);
    }

    // Populate Notable Projects items
    if (rejectedData?.NotableProjects?.needed === "Yes" && rejectedData.NotableProjects.items?.length > 0) {
      const notableItems = rejectedData.NotableProjects.items.map((item) => ({
        name: item.Name || "",
        budget: item.Budget || "",
        role: item.Role || "",
        url: item.link || "",
      }));
      setValue("Notable", notableItems);
    }

    // Populate Social Media profiles
    if (rejectedData?.SocialMedia?.active === "Yes" && rejectedData.SocialMedia.profiles?.length > 0) {
      const socialItems = rejectedData.SocialMedia.profiles.map((item) => ({
        mediaName: item.Platform || "",
        follwers: item.followers || "",
        urls: item.link || "",
      }));
      setValue("socials", socialItems);
    }

    // Populate Ongoing Projects
    if (rejectedData?.ongoing?.active === "Yes" && rejectedData.ongoing.items?.length > 0) {
      const ongoingItems = rejectedData.ongoing.items.map((item) => ({
        ProName: item.ProjectName || "",
        ProFile: null,
        Start_Date: formatDateForInput(item.StartDate, "month"),
        Start_End: formatDateForInput(item.EndDate, "month"),
        Release: item.Released || "",
      }));
      setValue("ongoingProjects", ongoingItems);
    }

    // Populate Planned Projects
    if (rejectedData?.planned?.active === "Yes" && rejectedData.planned.items?.length > 0) {
      const plannedItems = rejectedData.planned.items.map((item) => ({
        Proname: item.ProjectName || "",
        PStatus: item.ProjectStatus || "",
        PStart: formatDateForInput(item.StartDate, "month"),
        PEnd: formatDateForInput(item.EndDate, "month"),
        PRelease: item.Released || "",
      }));
      setValue("plannedProjects", plannedItems);
    }

    // Populate Distribution entries
    if (rejectedData?.Distribution?.needed === "Yes" && rejectedData.Distribution.projects?.length > 0) {
      const distItems = rejectedData.Distribution.projects.map((item) => ({
        projectname: item.ProjectName || "",
        Budget: item.Budget || "",
        Role: item.Role || "",
        ReleaseDate: formatDateForInput(item.ReleaseDate, "date"),
      }));
      setValue("distributionsEntries", distItems);
    }

    // Populate Certifications
    if (rejectedData?.Certifications?.active === "Yes" && rejectedData.Certifications.items?.length > 0) {
      const certItems = rejectedData.Certifications.items.map((item) => ({
        CertificateName: item.Name || "",
        Certificatealink: null,
        CertDate: formatDateForInput(item.Date, "date"),
      }));
      setValue("certifications", certItems);
    }

    // Set text area fields from rejectedData
    setFields(prev => ({
      ...prev,
      bio: rejectedData?.Shortbio || "",
      JoiningReason: rejectedData?.MainReason || "",
    }));
  }
}, [status, rejectedData, reset, setValue]);

// // Populate additional fields from role-specific rejected data
useEffect(() => {
  if (status === "rejected" && rejectedData) {
    // Update text area fields from rejectedData if available
    setFields(prev => ({
      ...prev,
      bio: rejectedData?.Shortbio || prev.bio || "",
      JoiningReason: rejectedData?.MainReason || prev.JoiningReason || "",
      DirectorInspiration: rejectedData?.Inspiration || prev.DirectorInspiration || "",
      EarlyChallengs: rejectedData?.EarlyChallenges || prev.EarlyChallengs || "",
      ProjectPlanning: rejectedData?.ProjectPlanning || prev.ProjectPlanning || "",
      ProjectPromotion: rejectedData?.ProjectPromotion || prev.ProjectPromotion || "",
      SceneVisualize: rejectedData?.SceneVisualize || prev.SceneVisualize || "",
      ProjectDescription: rejectedData?.ProjectDescription || prev.ProjectDescription || "",
      Inspiration: rejectedData?.Inspiration || prev.Inspiration || "",
      BudgetHandling: rejectedData?.BudgetHandling || prev.BudgetHandling || "",
      Networking: rejectedData?.Networking || prev.Networking || "",
      FundDelays: rejectedData?.FundDelays || prev.FundDelays || "",
      RiskManagement: rejectedData?.RiskManagement || prev.RiskManagement || ""
    }));
    
    // Also set in form values
    setValue("JoiningReason", rejectedData?.MainReason || "");
    setValue("DirectorInspiration", rejectedData?.Inspiration || "");
    setValue("EarlyChallengs", rejectedData?.EarlyChallenges || "");
    setValue("ProjectPlanning", rejectedData?.ProjectPlanning || "");
    setValue("ProjectPromotion", rejectedData?.ProjectPromotion || "");
    setValue("SceneVisualize", rejectedData?.SceneVisualize || "");
    setValue("ProjectDescription", rejectedData?.ProjectDescription || "");
    setValue("Inspiration", rejectedData?.Inspiration || "");
    setValue("BudgetHandling", rejectedData?.BudgetHandling || "");
    setValue("Networking", rejectedData?.Networking || "");
    setValue("FundDelays", rejectedData?.FundDelays || "");
    setValue("RiskManagement", rejectedData?.RiskManagement || "");
  }
}, [status, rejectedData]);

useEffect(() => {
  if (Awards === "Yes" && awards.length === 0) {
    appendAward({
      awardCategory: "",
      awardName: "",
      projectName: "",
      releaseDate: "",
      currency: "",
      totalBudget: "",
      totalIncome: "",
    });
  }

  if (Awards === false && awards.length > 0) {
    awards.forEach((_, i) => removeAward(i));
  }
}, [Awards, awards, appendAward, removeAward]);

// console.log(ongoingProjects)

  useEffect(() => {
  if (work === "Yes" && Notable.length === 0) {
    appendprojects({ name: '', url: '', role: '', budget: '' });
  }
}, [work, Notable, appendprojects]);

useEffect(() => {
  if (media === "Yes" && socials.length === 0) {
    // pick the first platform as default
    appendSocial({ mediaName: Soc[0].name, follwers: '', urls: '' });
  }

  if (media === "No" && socials.length > 0) {
    // clear socials when user selects No
    socials.forEach((_, i) => removeSocial(i));
  }
}, [media, socials, appendSocial, removeSocial]);

useEffect(() => {
  if (ongoing === "Yes" && ongoingProjects.length === 0) {
    appendOngoing({
      ProName: "",
      ProFile: null,
      Start_Date: "",
      Start_End: "",
      Release: ""
    });
  }

  if (ongoing === "No" && ongoingProjects.length > 0) {
    ongoingProjects.forEach((_, i) => removeOngoing(i));
  }
}, [ongoing, ongoingProjects, appendOngoing, removeOngoing]);

// Register file fields manually since they use onChange + setValue instead of register on DOM
useEffect(() => {
  ongoingProjects.forEach((_, index) => {
    register(`ongoingProjects.${index}.ProFile`, {
      required: ongoing === "Yes" ? "File upload is required" : false,
    });
  });
}, [ongoingProjects, ongoing, register]);

useEffect(() => {
  certifications.forEach((_, index) => {
    register(`certifications.${index}.Certificatealink`, {
      required: certified === "Yes" ? "File upload is required" : false,
    });
  });
}, [certifications, certified, register]);

useEffect(() => {
  if (planned === "Yes" && plannedProjects.length === 0) {
    appendPlanned({
      Proname: "",
      PType: "",
      PStatus: "",
      PStart: "",
      PEnd: "",
      PReles: ""
    });
  }

  if (planned === "No" && plannedProjects.length > 0) {
    plannedProjects.forEach((_, i) => removePlanned(i));
  }
}, [planned, plannedProjects, appendPlanned, removePlanned]);

useEffect(() => {
  if (distribution === "Yes" && distributionsEntries.length === 0) {
    appendDistribution({
      projectname: "",
      Budget: "",
      Role: "",
      ReleaseDate: ""
    });
  }

  if (distribution === "No" && distributionsEntries.length > 0) {
    distributionsEntries.forEach((_, i) => removeDistribution(i));
  }
}, [distribution, distributionsEntries, appendDistribution, removeDistribution]);


useEffect(() => {
  if (certified === "Yes" && certifications.length === 0) {
    appendCert({
      CertificateName: "",
      Certificatealink: null,
      CertDate: ""
    });
  }

  if (certified === "No" && certifications.length > 0) {
    certifications.forEach((_, i) => removeCert(i));
  }
}, [certified, certifications, appendCert, removeCert]);

useEffect(() => {
  if (internship === "Yes" && internships.length === 0) {
    appendIntern({
      InternshipName: "",
      InternshipDocs: [],
      InternshipStartDate: "",
      InternshipCompletionDate: ""
    });
  }

  if (internship === "No" && internships.length > 0) {
    internships.forEach((_, i) => removeIntern(i));
  }
}, [internship, internships, appendIntern, removeIntern]);

useEffect(() => {
  if (hasAwards === "Yes" && awards.length === 0) {
    appendAward({
      category: "",
      awardName: "",
      movieName: "",
      releaseDate: "",
      Currencey: "",
      budget: "",
      earned: "",
    });
  }

  if (hasAwards === "No" && awards.length > 0) {
    awards.forEach((_, i) => removeAward(i));
  }
}, [hasAwards, awards, appendAward, removeAward]);

useEffect(() => {
  if (hasAwards === "Yes") {
    setAwardSectionOpen(true);
  } else {
    setAwardSectionOpen(false);
  }
}, [hasAwards]);

const notableValue = watch("Notable");
const socialsValue = watch("socials");
const ongoingValue = watch("ongoingProjects");
const plannedValue = watch("plannedProjects");
const distributionsValue = watch("distributionsEntries");
const certifiedValue = watch("Certified");

// Watch form field values to display them in real-time
const firstNameValue = watch("First");
const lastNameValue = watch("Last");
const emailValue = watch("Email");
const countryCodeValue = watch("CountryCode");
const mobileNumberValue = watch("MobileNumber");
const whatsAppNumberValue = watch("WhatsAppNumber");
const countryValue = watch("Country");
const stateValue = watch("State");
const cityValue = watch("CityName");
const genderValue = watch("Gender");
const localAddressValue = watch("LocalAddress");
const permanentAddressValue = watch("PermanentAddress");
const websiteValue = watch("Website");
const yearsExperienceValue = watch("yearsexperience");

// Film Entries
useEffect(() => {
  if (notableValue === "No") {
    setValue("Notable", []); // remove key from form
    while (filmEntries.length > 0) removeprojects(0);
  }
}, [notableValue, Notable.length, removeprojects, setValue]);

// Socials
useEffect(() => {
  if (socialsValue === "No") {
    setValue("socials", []);
    while (socials.length > 0) removeSocial(0);
  }
}, [socialsValue, socials.length, removeSocial, setValue]);

// Ongoing Projects
useEffect(() => {
  if (ongoingValue === "No") {
    setValue("ongoingProjects", []);
    while (ongoingProjects.length > 0) removeOngoing(0);
  }
}, [ongoingValue, ongoingProjects.length, removeOngoing, setValue]);

// Planned Projects
useEffect(() => {
  if (plannedValue === "No") {
    setValue("plannedProjects", []);
    while (plannedProjects.length > 0) removePlanned(0);
  }
}, [plannedValue, plannedProjects.length, removePlanned, setValue]);

// Distributions
useEffect(() => {
  if (distributionsValue === "No") {
    setValue("distributionsEntries", []);
    while (distributionsEntries.length > 0) removeDistribution(0);
  }
}, [distributionsValue, distributionsEntries.length, removeDistribution, setValue]);

// Certifications (already shown before)
useEffect(() => {
  if (certifiedValue === "No") {
    setValue("certifications", []);
    while (certifications.length > 0) removeCert(0);
  }
}, [certifiedValue, certifications.length, removeCert, setValue]);

 
const onSubmit = async (data) => {
     await setConfirmationModal({
               text1: 'Are you sure?',
                            text2: "I take full responsibility for my data. If the data is false, my account may be suspended.",
                            btn1Text: 'Submit Data',
                            btn2Text: 'Review my Details',
                            btn1Handler: () => Proceed(data),
                            btn2Handler: () => setConfirmationModal(null),
            })
            // This are some of the extra things do not delete them keep them they are needed for some work that is going to be done 
    // console.log("Form submitted", data);
    // console.log("Form errors", errors);
    // console.log("This is the film entries",filmEntries)
    // console.log(typeof filmEntries)
    // console.log(data.CountryCode)
    // console.log(typeof data.CountryCode)
    // Notables(filmEntries)

    setSubmittedData(data);
    setIsSubmitted(true);
    try {
      // Future API call here
    } catch (error) {
      console.log(error.message);
    }
  };
  
 const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e) => {
    let {name,value} = e.target;
    let words = countWords(value);
    if (words > 250) {
       toast.error(`${name} cannot exceed 250 words`);
      return;
    }
   setFields((prev) => ({ ...prev, [name]: value }));
  };

useEffect(() => {
  if (data?.number && !(status === "rejected" && rejectedData)) {
    setMobileNumber(data.number);
    if (open) {
      setWhatsAppNumber("");
    } else {
      setWhatsAppNumber(data.number);
    }
  }
}, [data, open, status, rejectedData]);

// console.log("This is the timing ",timer)

const Name = data?.userName.split(" ")

if(loading){
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Loader/>
    </div>
  )
}
// console.log(attempts,typeof attempts)

  return (
    <div className="flex justify-center h-fit w-full min-h-screen bg-richblack-900 overflow-y-scroll overflow-x-hidden">
      <div className="w-full max-w-[63rem] bg-richblack-900 rounded-xl shadow-lg p-8 Secondss text-white">
       <div className= {`${attempts === 0 ?"text-center":"flex justify-between items-center px-8 py-4 mb-6 w-full"}`}>
  {/* Left side - Attempt counter */}
  <div className={`${attempts === 0 ? "hidden":"flex items-center gap-2 bg-gray-800 px-6 py-2 rounded-lg border border-yellow-400"}`} >
    <span className='text-lg font-semibold text-gray-300'>Attempt :</span>
    <span  className={`text-2xl font-bold ${
    attempts > 1 ? "text-red-400" : "text-yellow-400"
  }`}>{attempts}</span>
  </div>
  
  {/* Middle - Organizer Data heading */}
  <h2 className="text-3xl font-bold text-yellow-400">Organizer Data</h2>
 
  <div className= {`${attempts === 0 ?"hidden":'flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600'}`}>
    <div className='flex flex-col items-center'>
      <p className={`text-xl font-bold ${ Days <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>{Days}</p>
      <span className='text-xs text-gray-400'>Days</span>
    </div>
    <span className='text-xl font-bold text-gray-500'>:</span>

    <div className='flex flex-col items-center'>  
      <p className= {`text-xl font-bold ${Hour <= 0 ? "text-red-400" : "text-yellow-400"}`}>{Hour}</p>
      <span className='text-xs text-gray-400'>Hours</span>
    </div>
    <span className='text-xl font-bold text-gray-500'>:</span>
    
    <div className='flex flex-col items-center'>
      <p className={`text-xl font-bold ${Min <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>{Min}</p>
      <span className='text-xs text-gray-400'>Minutes</span>
    </div>
    <span className='text-xl font-bold text-gray-500'>:</span>
    
    <div className='flex flex-col items-center'>
      <p className={`text-xl font-bold ${Secs <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>{Secs}</p>
      <span className='text-xs text-gray-400'>Seconds</span>
    </div>
  </div>

</div>
        <p className="text-gray-400 font-italic text-center Verificationss">
          {isSubmitted  
            ? 'Your verification data has been submitted and is under review. You can only view it now.'
            : 'Fill in your details below to request verification as an Organizer. These details can only be submitted once and cannot be changed later. The Administrator Will Review Your Application and Reach back to You Via E-mail'}
        </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white" autoComplete="off">
            {/* Personal Information */}
            <div className="w-full Form bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Personal Information</p>
                <p className="text-sm text-gray-400 mt-1">Basic details for your organizer profile</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label htmlFor="First" className={`flex flex-col gap-2 ${status === "rejected" && rejectedData && Name ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <span className={`text-sm font-semibold text-gray-300 flex items-center gap-1 ${status === "rejected" && rejectedData && Name ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      <span className="text-red-500">*</span><span>First Name</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Your First name"
                      value={watch("First") || ''}
                      disabled
                      className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${Name ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      {...register("First", { required: "First Name is required" })}
                    />
                    {errors.First && <span className="text-red-500 text-xs mt-1">{errors.First.message}</span>}
                  </label>

                  <label htmlFor="Last" className={`flex flex-col gap-2 ${Name ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Last Name</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Your Last name"
                      value={watch("Last") || ''}
                      disabled
                      className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${Name ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      {...register("Last", { required: "Last Name is required" })}
                    />
                    {errors.Last && <span className="text-red-500 text-xs mt-1">{errors.Last.message}</span>}
                  </label>
                </div>

                {/* Row 2: Email, Country Code & Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 Emails">
                  <label htmlFor="Email" className={`flex flex-col gap-2 lg:col-span-5 ${data ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Email Address</span>
                    </span>
                    <input
                      type="email"
                      name="Email"
                      value={watch("Email") || ''}
                      id="Email"
                      disabled
                      placeholder="Enter Your Email id"
                      className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${data ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      {...register("Email", { required: "Email is required" })}
                    />
                    {errors.Email && <span className="text-red-500 text-xs mt-1">{errors.Email.message}</span>}
                  </label>

                  <div className={`flex flex-col gap-2 lg:col-span-3 ${data ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <label className={`flex flex-col gap-2 font-semibold ${data ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="CountryCode">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Country Code</span>
                      </span>
                    </label>
                    <select
                      {...register("CountryCode", { required: "Country code is required" })}
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white ${errors.CountryCode ? "border-red-500" : ""} ${data ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      value={data?.countrycode || ''}
                    >
                      <option value="" disabled>Select Code</option>
                      {Countries.map((data, i) => (
                        <option key={i} value={data.code} className={data ? "cursor-not-allowed" : "cursor-pointer"} disabled>
                          {data.code}-{data.country}
                        </option>
                      ))}
                    </select>
                    {errors.CountryCode && <span className="text-red-500 text-xs mt-1">{errors.CountryCode.message}</span>}
                  </div>

                  <div className="flex flex-col gap-2 lg:col-span-4">
                    <label htmlFor="MobileNumber" className={`flex flex-col gap-2 ${data ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Mobile Number</span>
                      </span>
                      <input
                        type="tel"
                        name="MobileNumber"
                        id="MobileNumber"
                        placeholder="Enter Your Mobile Number"
                        className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${data ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        defaultValue={mobileNumber}
                        disabled
                        maxLength={10}
                        {...register("MobileNumber", {
                          required: "*Mobile Number is required",
                          minLength: {
                            value: 10,
                            message: "*Mobile number must be exactly 10 digits"
                          },
                          maxLength: {
                            value: 10,
                            message: "*Mobile number must be exactly 10 digits"
                          },
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "*Please enter a valid 10-digit mobile number"
                          }
                        })}
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                          setValue("MobileNumber", e.target.value);
                          if (open) {
                            setWhatsAppNumber(e.target.value);
                            setValue("WhatsAppNumber", e.target.value);
                          }
                        }}
                      />
                      {errors.MobileNumber && <span className="text-red-500 text-xs mt-1">{errors.MobileNumber.message}</span>}
                    </label>
                  </div>
                </div>

                {/* Row 3: Country, State, City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 Location">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300" htmlFor="CountryName">
                      <span className="flex items-center gap-1"><span className="text-red-500">*</span><span>Country Name</span></span>
                    </label>
                    <select
                      {...register("CountryName", { required: "Country Name is required" })}
                      name="CountryName"
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white ${errors.CountryName ? "border-red-500" : ""}`}
                      value={countryName}
                      onChange={(e) => {
                        setCountryName(e.target.value);
                        setStateName("");
                        setValue('CountryName', e.target.value);
                      }}
                    >
                      <option value="" disabled>Select Your Country</option>
                      {AllCountries.data.map((data, i) => (
                        <option key={i} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                    {errors.CountryName && <span className="text-red-500 text-xs mt-1">{errors.CountryName.message}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300" htmlFor="StateName">
                      <span className="flex items-center gap-1"><span className="text-red-500">*</span><span>State Name</span></span>
                    </label>
                    <select
                      {...register("StateName", { required: "State Name is required" })}
                      name="StateName"
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white ${errors.StateName ? "border-red-500" : ""} ${!countryName ? "opacity-50 cursor-not-allowed" : ""}`}
                      value={stateName}
                      onChange={(e) => {
                        setStateName(e.target.value);
                        setValue('StateName', e.target.value);
                      }}
                      disabled={!countryName}
                    >
                      <option value="" disabled>Select Your State</option>
                      {AllCountries.data
                        .filter((country) => country.name === countryName)
                        .map((country) =>
                          country.states.map((state, index) => (
                            <option key={index} value={state.name}>
                              {state.name}
                            </option>
                          ))
                        )}
                    </select>
                    {errors.StateName && <span className="text-red-500 text-xs mt-1">{errors.StateName.message}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300" htmlFor="CityName">
                      <span className="flex items-center gap-1"><span className="text-red-500">*</span><span>City Name</span></span>
                    </label>
                    <input
                      type="text"
                      name='CityName'
                      placeholder='Enter The City Name'
                      className='w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500'
                      value={cityName}
                      {...register("CityName", { required: "City Name is required" })}
                      onChange={(e) => {
                        setCityName(e.target.value);
                        setValue('CityName', e.target.value);
                      }}
                    />
                    {errors.CityName && <span className="text-red-500 text-xs mt-1">{errors.CityName.message}</span>}
                  </div>
                </div>

                {/* Row 4: Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-richblack-700/50 rounded-lg px-4 py-3 border border-richblack-600">
                    <input
                      type="checkbox"
                      name="SameAddress"
                      id="SameAddress"
                      {...register("SameAddress")}
                      className="Addres w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                      checked={add}
                      onChange={(e) => {
                        setAdd(e.target.checked);
                        setValue('SameAddress', e.target.checked);
                      }}
                    />
                    <label htmlFor="SameAddress" className="text-sm text-gray-300 cursor-pointer select-none">Same Address for local and permanent</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label htmlFor="LocalAddress" className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Local Address</span>
                        {errors.LocalAddress && <span className="text-red-500 text-xs ml-2">{errors.LocalAddress.message}</span>}
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Your local Address"
                        className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                        value={localAddress}
                        {...register("LocalAddress", { required: "Local Address is Required" })}
                        onChange={(e) => {
                          setLocalAddress(e.target.value);
                          setValue('LocalAddress', e.target.value)
                          if (add) {
                            setPermanentAddress(e.target.value);
                            setValue('PermanentAddress', e.target.value);
                          }
                        }}
                      />
                    </label>

                    <label htmlFor="PermanentAddress" className="flex flex-col gap-2 Perm">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Permanent Address</span>
                        {errors.PermanentAddress && <span className="text-red-500 text-xs ml-2">{errors.PermanentAddress.message}</span>}
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Your permanent Address"
                        className={`w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${add ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={permanentAddress}
                        {...register("PermanentAddress", { required: "Permanent Address is required" })}
                        onChange={(e) => {
                          setPermanentAddress(e.target.value);
                          setValue('PermanentAddress', e.target.value)
                          if (add) {
                            setLocalAddress(e.target.value);
                            setValue('LocalAddress', e.target.value);
                          }
                        }}
                        disabled={add}
                      />
                    </label>
                  </div>
                </div>

                {/* Row 5: Gender & Image Upload */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 Genderrres">
                  {/* Gender Selection */}
                  <div className="flex flex-col gap-3">
                    <label htmlFor="Gender">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Choose Your Gender</span>
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <label htmlFor="Male" className={`flex items-center gap-2 px-5 py-3 rounded-lg border cursor-pointer transition-all ${watch("Gender") === "Male" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Gender"
                          id="Male"
                          value="Male"
                          {...register("Gender", { required: "*Gender is required" })}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Male</span>
                      </label>
                      <label htmlFor="Female" className={`flex items-center gap-2 px-5 py-3 rounded-lg border cursor-pointer transition-all ${watch("Gender") === "Female" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Gender"
                          id="Female"
                          value="Female"
                          {...register("Gender", { required: "Gender is required" })}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Female</span>
                      </label>
                      <label htmlFor="Other" className={`flex items-center gap-2 px-5 py-3 rounded-lg border cursor-pointer transition-all ${watch("Gender") === "Other" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Gender"
                          id="Other"
                          value="Other"
                          {...register("Gender", { required: "Gender is required" })}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Rather Not To Disclose</span>
                      </label>
                    </div>
                    {errors.Gender && <span className="text-red-500 text-xs mt-1">{errors.Gender.message}</span>}
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-3">
                    <label htmlFor="posterImage">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Upload Image</span>
                      </span>
                    </label>

                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-xl border-2 border-dashed border-richblack-600 bg-richblack-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-yellow-400 transition-colors flex-shrink-0"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span className="text-[10px]">Photo</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        {/* Hidden actual file input */}
                        <input
                          type="file"
                          id="posterImage"
                          accept="image/*"
                          {...register("posterImage", {
                            required: "Image is required",
                            validate: {
                              fileType: (files) => {
                                const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
                                return (
                                  (files && files[0] && allowedTypes.includes(files[0].type))
                                );
                              },
                              fileSize: (files) => {
                                if (files && files[0]) {
                                  if (files[0].size <= 5 * 1024 * 1024) {
                                    return true;
                                  } else {
                                    setSelectedFile("");
                                    setUpload(false);
                                    return "File size must be less than 5MB";
                                  }
                                }
                              },
                            },
                          })}
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setSelectedFile(file);
                            setUpload(!!file);
                            setValue("posterImage", file || null, { shouldValidate: true });

                            // Show new image preview when user selects a file
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        {/* Custom styled file input display */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-richblack-700 rounded-lg border border-richblack-600 form-style cursor-pointer hover:border-yellow-400/50 transition overflow-hidden"
                        >
                          <p className="text-gray-400 text-sm truncate">
                            {selectedFile
                              ? selectedFile.name
                              : imagePreview
                              ? "Image uploaded"
                              : "Choose file No file chosen"}
                          </p>
                        </div>

                        <input
                          type="file"
                          id="posterImage2"
                          accept="image/*"
                          className="hidden"
                        />
                        {errors.posterImage && (
                          <span className="text-red-500 text-xs">{errors.posterImage.message}</span>
                        )}

                        <div className="flex gap-2 Uploadeser">
                          <button
                            type="button"
                            className="px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors Buttonss"
                            onClick={() => fileInputRef.current.click()}
                          >
                            Select Image
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 bg-richblack-600 text-gray-300 text-sm font-medium rounded-lg border border-richblack-500 hover:bg-richblack-500 transition-colors Buttonss"
                            onClick={() => {
                              setSelectedFile(null);
                              setUpload(false);
                              setValue("posterImage", null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                              setValue("posterImage", null, { shouldValidate: true });
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Professional Background */}
            <div className="w-full Backgroundss bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Professional Background</p>
                <p className="text-sm text-gray-400 mt-1">Your professional details and portfolio information</p>
              </div>
              <div className='p-8 space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <label htmlFor="Portfolio" className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span>Website / Portfolio Link</span>
                    </span>
                    <input type="url" name="Portfolio" id="Portfolio" placeholder='Enter Your Link Here' className='w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500' {...register("Portfolio", {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Enter a valid URL",
                      },
                    })} />
                    {errors.Portfolio && <span className="text-red-500 text-xs mt-1">{errors.Portfolio.message}</span>}
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="TotalProjects">
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span className="text-red-500">*</span><span>Total Completed Projects</span>
                    </span>
                    <select
                      {...register("TotalProjects", { required: "Projects are required" })}
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white ${errors.TotalProjects ? "border-red-500" : ""}`}
                      defaultValue=""
                    >
                      <option value="" disabled>Number of Projects</option>
                      {Projects.ProjectNumber.map((data, i) => (
                        <option key={i} value={data}>
                          {data}
                        </option>
                      ))}
                    </select>
                    {errors.TotalProjects && <span className="text-red-500 text-xs mt-1">{errors.TotalProjects.message}</span>}
                  </label>
                  <label className="flex flex-col gap-2" htmlFor="YearExperience">
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span className="text-red-500">*</span><span>Years of Experience</span>
                    </span>
                    <select
                      {...register("YearExperience", { required: "Experience is required" })}
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white ${errors.YearExperience ? "border-red-500" : ""}`}
                      defaultValue=""
                    >
                      <option value="" disabled>Experience</option>
                      {Projects.years.map((data, i) => (
                        <option key={i} value={data}>
                          {data}
                        </option>
                      ))}
                    </select>
                    {errors.YearExperience && <span className="text-red-500 text-xs mt-1">{errors.YearExperience.message}</span>}
                  </label>
                </div>
                <div className='BIO'>
                  <label htmlFor="bio" className="flex flex-col gap-2 OIB">
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span className="text-red-500">*</span><span>Short Bio About Yourself</span>
                    </span>
                    <textarea
                      id="bio"
                      name="bio"
                      placeholder="Write a short bio (max 250 characters)"
                      maxLength={250}
                      rows={4}
                      value={fields.bio}
                      className="w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 resize-none"
                      {...register("bio", { required: "Bio is Required" })}
                      onChange={handleChange}
                    />
                    <div className="flex justify-between items-center">
                      {errors.bio && <span className="text-red-500 text-xs">{errors.bio.message}</span>}
                      <p className="text-sm text-gray-400 ml-auto">
                        {countWords(fields.bio)} / Max 250 words
                      </p>
                    </div>
                  </label>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Work Section */}
                  <div className='flex flex-col gap-3 bg-richblack-700 rounded-xl p-5 border border-richblack-600'>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span> <span className='Work'>Have you Worked on any Notable Projects</span>
                    </span>
                    <div className='flex gap-4'>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Work "
                          value="Yes"
                          checked={work === "Yes"}
                          className="accent-yellow-400 w-4 h-4"
                          onChange={() => {
                            setWork("Yes");
                            setValue("Work", "Yes");
                          }}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Work"
                          value="No"
                          checked={work === "No"}
                          className="accent-yellow-400 w-4 h-4"
                          onChange={() => {
                            setWork("No");
                            setValue("Work","No");
                          }}
                        />
                        No
                      </label>
                    </div>
                    <input type="hidden" {...register("Work")} value={work} />
                  </div>
                  {/* Media Section */}
                  <div className='flex flex-col gap-3 bg-richblack-700 rounded-xl p-5 border border-richblack-600'>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span> <span className='Work'>Would You Like to Share Your Social Media</span>
                    </span>
                    <div className='flex gap-4'>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="mediaChoice"
                          value="Yes"
                          checked={media === "Yes"}
                          className="accent-yellow-400 w-4 h-4"
                          onChange={() => {
                            setMedia("Yes");
                            setValue("mediaChoice", "Yes");
                          }}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="mediaChoice"
                          value="No"
                          checked={media === "No"}
                          className="accent-yellow-400 w-4 h-4"
                          onChange={() => {
                            setMedia("No");
                            setValue("mediaChoice", "No");
                          }}
                        />
                        No
                      </label>
                    </div>
                    <input type="hidden" {...register("mediaChoice")} value={media} />
                  </div>
                </div>

               {work === "Yes" && projects && (
  <div className='flex items-center gap-2 Projectsss cursor-pointer text-yellow-400 hover:text-yellow-300 transition'>
    <FaCaretDown
      className="text-xl cursor-pointer -rotate-90 transition-transform"
      onClick={() => setProjects(false)}
    />
    <span className="text-sm font-semibold">Show Projects</span>
  </div>
)}

{work === "Yes" && (
  <div className={`${projects ? "hidden" : "w-full Projectsss flex flex-col gap-4 bg-richblack-700/50 rounded-xl p-6 border border-richblack-600"}`}>
    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition">
      <FaCaretDown className="text-xl cursor-pointer transition-transform" onClick={() => setProjects(true)} />
      <span className="text-sm font-semibold">Hide Projects</span>
    </div>

    {Notable.map((field, index) => (
      <div className='grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-end gap-4 bg-richblack-800 rounded-lg p-4 border border-richblack-600' key={field.id}>
        <span className="text-yellow-400 font-bold text-lg flex items-center justify-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600">{index + 1}</span>
       <label className="flex flex-col gap-2">
  {duplicateNameIndices.has(index) && (
    <span className="text-red-500 text-xs">Duplicate project name detected!</span>
  )}
  <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
    <span className="text-red-500">*</span><span>Project Name</span>
    {errors.Notable?.[index]?.name && (
      <span className="text-red-500 text-xs">
        {errors.Notable[index].name.message}
      </span>
    )}
  </span>
  <input
    type="text"
    placeholder="Enter the name of the Project"
    autoComplete="off"
    className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
      duplicateNameIndices.has(index) ? "border-2 border-red-500" : ""
    }`}
    {...register(`Notable.${index}.name`, {
    required: work === "Yes" ? "Project name is required" : false,
    validate: (val) => {
      // Get the latest values directly from RHF
      const allNames = getValues("Notable").map((entry, i) =>
        (i === index ? val : (entry?.name || ""))
          .toLowerCase().replace(/\s+/g, " ").trim()
      );
      const normalized = val.toLowerCase().replace(/\s+/g, " ").trim();
      // Count duplicates
      return (
        allNames.filter((name) => name && name === normalized).length > 1
          ? "Duplicate project name detected!"
          : true
      );
    }
  })}
  onChange={e => {
    const value = e.target.value;
    setValue(`Notable.${index}.name`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
// getValues
    // Re-calculate duplicates with the absolute latest form values
    const allNames = getValues("Notable").map((entry, i) =>
      (i === index ? value : (entry?.name || ""))
        .toLowerCase().replace(/\s+/g, " ").trim()
    );
    const counts = {};
    allNames.forEach((n) => {
      if (!n) return;
      counts[n] = (counts[n] || 0) + 1;
    });
    const newDuplicates = new Set();
    allNames.forEach((n, i) => {
      if (n && counts[n] > 1) newDuplicates.add(i);
    });
    setDuplicateNameIndices(newDuplicates);
  }}
  />
</label>


        <label className='flex flex-col gap-2'>
          <span className="text-sm font-semibold text-gray-300">Total Budget</span>
          <select
            className='w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white'
            {...register(`Notable.${index}.budget`)}
          >
            <option value="" disabled>Select Budget Range</option>
            {Projects.Money.map((money, i) => (
              <option key={i} value={money}>{money}</option>
            ))}
          </select>
          {errors.Notable?.[index]?.budget && (
            <span className="text-red-500 text-xs mt-1">{errors.Notable[index].budget.message}</span>
          )}
        </label>

        <label className='flex flex-col gap-2'>
          <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
            <span className="text-red-500">*</span><span>Your Role</span>
          </span>
          <select
            className='w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white'
            {...register(`Notable.${index}.role`, { required: "Role is required" })}
          >
            <option value="" disabled>Role</option>
            {Projects.roles.map((role, i) => (
              <option key={i} value={role}>{role}</option>
            ))}
          </select>
          {errors.Notable?.[index]?.role && (
            <span className="text-red-500 text-xs mt-1">{errors.Notable[index].role.message}</span>
          )}
        </label>

      <label className="flex flex-col gap-2">
  {duplicateUrlIndices.has(index) && (
    <span className="text-red-500 text-xs">Duplicate URL detected!</span>
  )}
  <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
    <span className="text-red-500">*</span><span>Url</span>
    {errors.Notable?.[index]?.url && (
      <span className="text-red-500 text-xs">
        {errors.Notable[index].url.message}
      </span>
    )}
  </span>
  <input
    type="url"
    placeholder="Enter Your Url"
    className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
      duplicateUrlIndices.has(index) ? "border-2 border-red-500" : ""
    }`}
    {...register(`Notable.${index}.url`, {
      required: "Film URL is required",
      pattern: {
        value: /^https?:\/\/.+/,
        message: "Enter a valid URL",
      },
      validate: (val) => {
        const normalize = (url) => {
          try {
            const u = new URL(url);
            const firstSeg = u.pathname.split("/").filter(Boolean)[0];
            return (firstSeg ? `${u.origin}/${firstSeg}` : `${u.origin}`).toLowerCase();
          } catch {
            return "";
          }
        };
        const normalizedVal = normalize(val);
        if (!normalizedVal) return true;

        // get all urls normalized, replace current index with val normalized
        const allUrls = getValues("Notable").map((entry, i) =>
          i === index ? normalizedVal : normalize(entry?.url || "")
        );

        // count duplicates
        const counts = {};
        allUrls.forEach((url) => {
          if (!url) return;
          counts[url] = (counts[url] || 0) + 1;
        });

        return counts[normalizedVal] > 1 ? "Same base URL not allowed" : true;
      },
    })}
    onChange={(e) => {
      const value = e.target.value;

      setValue(`Notable.${index}.url`, value, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const normalize = (url) => {
        try {
          const u = new URL(url);
          const firstSeg = u.pathname.split("/").filter(Boolean)[0];
          return (firstSeg ? `${u.origin}/${firstSeg}` : `${u.origin}`).toLowerCase();
        } catch {
          return "";
        }
      };

      const urlsNormalized = getValues("Notable").map((entry, i) =>
        i === index ? value : entry?.url || ""
      ).map(normalize);

      const counts = {};
      urlsNormalized.forEach((url) => {
        if (!url) return;
        counts[url] = (counts[url] || 0) + 1;
      });

      const newDuplicates = new Set();
      urlsNormalized.forEach((url, i) => {
        if (url && counts[url] > 1) newDuplicates.add(i);
      });

      setDuplicateUrlIndices(newDuplicates);
    }}
  />
</label>


        <div
          className="flex justify-center items-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600 hover:bg-red-600 hover:border-red-500 cursor-pointer transition"
          onClick={() => {
            if (Notable.length === 1) {
              setFilmError("You need to keep at least one field");
            } else {
              removeprojects(index);
              setFilmError("");
            }
          }}
        >
          <RxCross1 className='text-richblack-100 text-sm' />
        </div>
      </div>
    ))}

    {filmError && (
      <span className="text-red-500 text-xs flex justify-center items-center">
        {filmError}
      </span>
    )}

    <button
      type="button"
      className="mt-2 px-5 py-2 bg-yellow-400 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-300 transition Adding"
      onClick={() => {
        if (Notable.length >= 4) {
          setFilmError("You can create 4 fields only");
        } else {
          appendprojects({ name: '', url: '', role: '', budget: '' });
          setFilmError("");
        }
      }}
    >
      Add more
    </button>
  </div>
)}
                {media === "Yes" && social && (
                  <div className='flex items-center gap-2 Socialss cursor-pointer text-yellow-400 hover:text-yellow-300 transition'>
                    <FaCaretDown
                      className="text-xl cursor-pointer -rotate-90 transition-transform"
                      onClick={() => setSocial(false)}
                    />
                    <span className="text-sm font-semibold">Show Media</span>
                  </div>
                )}

                {media === "Yes" && (
                  <div className={`${social ? "hidden" : "w-full Socialss flex flex-col gap-4 bg-richblack-700/50 rounded-xl p-6 border border-richblack-600"}`}>

                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition">
                      <FaCaretDown className="text-xl cursor-pointer transition-transform" onClick={() => setSocial(true)} />
                      <span className="text-sm font-semibold">Hide Media</span>
                    </div>

                 {socials.map((field, index) => {
  const currentMedia =
    (field[index] && field[index].mediaName) ??
    field.mediaName ??
    Soc[index % Soc.length].name;

  const socialItem = Soc.find((s) => s.name === currentMedia) || Soc[index % Soc.length];
  const IconComponent = iconMap[socialItem.icon];

  return (
    <div className="flex flex-col gap-1 mb-3 bg-richblack-800 rounded-lg p-4 border border-richblack-600" key={field.id}>
      {/* Top row: Icon + Platform + Followers + URL + Remove — all on one line */}
      <div className="flex items-end justify-evenly w-full gap-3" style={{ flexWrap: 'nowrap' }}>

        {/* Icon */}
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-richblack-700 border border-richblack-600 flex-shrink-0 mb-1">
          {IconComponent && <IconComponent className="text-2xl text-yellow-400" />}
        </div>

        {/* Platform */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Social Media</span>
          <select
            className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
            {...register(`socials.${index}.mediaName`, {
              required: media === "Yes" ? "Required" : false,
            })}
            defaultValue={field.mediaName ?? Soc[index % Soc.length].name}
          >
            <option value="" disabled>Select</option>
            {Soc.map((s, i) => (
              <option key={i} value={s.name}>{s.name}</option>
            ))}
          </select>
          {errors.socials?.[index]?.mediaName && (
            <span className="text-red-500 text-xs mt-1">{errors.socials[index].mediaName.message}</span>
          )}
        </label>

        {/* Followers */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Followers</span>
          <input
            type="tel"
            placeholder="Enter followers"
            className="w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
            {...register(`socials.${index}.follwers`, { required: "Required" })}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length > 13) {
                val = val.slice(0, 13);
                toast.error("Maximum limit reached");
              }
              if (val) {
                val = Number(val).toLocaleString("en-US");
              }
              setValue(`socials.${index}.follwers`, val, { shouldValidate: true, shouldDirty: true });
            }}
          />
          {errors.socials?.[index]?.follwers && (
            <span className="text-red-500 text-xs">{errors.socials[index].follwers.message}</span>
          )}
        </label>

        {/* URL */}
        <label className="flex flex-col gap-1 flex-[0.6] min-w-0">
          <p className='text-red-400 text-xs'>Please Copy Paste the Link</p>
          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
            <span className="text-red-500">*</span> URL
            {urlDuplications && (
              <span className="text-red-500 text-xs ml-1">Wrong link</span>
            )}
            {duplicateSocialUrlIndices.has(index) && (
              <span className="text-red-500 text-xs ml-1">Duplicate</span>
            )}
          </span>
          <input
            type="url"
            placeholder="Enter profile URL"
            className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
              duplicateSocialUrlIndices.has(index) || urlDuplications
                ? "border-2 border-red-500"
                : ""
            }`}
            {...register(`socials.${index}.urls`, {
              required: "URL is required",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Enter a valid URL",
              },
              validate: (value) => {
                const MediaMap = {
                  LinkedIn: "https://www.linkedin.com",
                  YouTube: "https://www.youtube.com/",
                  Instagram: "https://www.instagram.com/",
                  IMDB: "https://www.imdb.com/",
                  Twitter: "https://x.com/",
                };
                const currentPlatform = watch(`socials.${index}.mediaName`);
                const expectedBase = MediaMap[currentPlatform];
                if (!expectedBase) return true;
                return value.startsWith(expectedBase) || `URL must start with ${expectedBase}`;
              },
            })}
            onChange={(e) => {
              const enteredUrl = e.target.value.trim();
              const allUrls = socials.map((entry, i) =>
                i === index ? enteredUrl : (entry?.link || "").trim()
              );
              const counts = {};
              allUrls.forEach((url) => { if (!url) return; counts[url] = (counts[url] || 0) + 1; });
              const newDuplicates = new Set();
              allUrls.forEach((url, i) => { if (url && counts[url] > 1) newDuplicates.add(i); });
              setDuplicateSocialUrlIndices(newDuplicates);

              const MediaMap = {
                LinkedIn: "https://www.linkedin.com/",
                YouTube: "https://www.youtube.com/",
                Instagram: "https://www.instagram.com/",
                IMDB: "https://www.imdb.com/",
                Twitter: "https://x.com/",
              };
              const currentPlatform = watch(`socials.${index}.mediaName`);
              const expectedBase = MediaMap[currentPlatform];
              if (expectedBase && !enteredUrl.startsWith(expectedBase)) {
                seturlduplications(true);
              } else {
                seturlduplications(false);
              }
            }}
          />
          {errors.socials?.[index]?.urls && (
            <span className="text-red-500 text-xs">{errors.socials[index].urls.message}</span>
          )}
        </label>

        {/* Remove */}
        <div
          className="flex justify-center items-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600 hover:bg-red-600 hover:border-red-500 cursor-pointer flex-shrink-0 mb-1 transition"
          onClick={() => {
            if (socials.length === 1) {
              setSocialError("You need to keep at least one field");
            } else {
              removeSocial(index);
            }
          }}
        >
          <RxCross1 className="text-richblack-100 text-sm" />
        </div>
      </div>
    </div>
  );
})}


                    {socialError && (
                      <span className="text-red-500 text-xs flex justify-center items-center">
                        {socialError}
                      </span>
                    )}
                    <button
                      type="button"
                      className="mt-2 px-5 py-2 bg-yellow-400 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-300 transition Adding"
                      onClick={() => {
                        if (socials.length >= 5) {
                          setSocialError("You can create 5 fields only");
                        } else {
                          const nextIndex = socials.length % Soc.length;
                          appendSocial({ mediaName: Soc[nextIndex].name, followers: '', link: '' });
                          setSocialError("");
                        }
                      }}
                    >
                      Add more
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Projects */}
            <div className="w-full Project bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Projects</p>
                <p className="text-sm text-gray-400 mt-1">Ongoing and planned projects information</p>
              </div>
              <div className='p-8 space-y-8'>
                {/* Radio buttons row */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='flex flex-col gap-3 bg-richblack-700 rounded-xl p-5 border border-richblack-600'>
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span className="text-red-500">*</span> <span className='Work'>Any Ongoing Project</span>
                    </span>
                    <div className='flex items-center gap-4'>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Ongoing"
                          value="Yes"
                          checked={ongoing === "Yes"}
                          onChange={() => {
                            setOngoing("Yes");
                            setValue("Ongoing", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Ongoing"
                          value="No"
                          checked={ongoing === "No"}
                          onChange={() => {
                            setOngoing("No");
                            setValue("Ongoing", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("Ongoing")} value={ongoing} />
                  </div>
                  <div className='flex flex-col gap-3 bg-richblack-700 rounded-xl p-5 border border-richblack-600'>
                    <span className='text-sm font-semibold text-gray-300 flex items-center gap-1'>
                      <span className="text-red-500">*</span> <span className='Work'>Any Projects Planned For This Year</span>
                    </span>
                    <div className='flex items-center gap-4'>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Planned"
                          value="Yes"
                          checked={planned === "Yes"}
                          onChange={() => {
                            setPlanned("Yes");
                            setValue("Planned", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition">
                        <input
                          type="radio"
                          name="Planned"
                          value="No"
                          checked={planned === "No"}
                          onChange={() => {
                            setPlanned("No");
                            setValue("Planned", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("Planned")} value={planned} />
                  </div>
                </div>

                {/* Ongoing Projects Section */}
                {ongoing === "Yes" && on && (
                  <div className='flex items-center gap-2 Projectsss cursor-pointer text-yellow-400 hover:text-yellow-300 transition'>
                    <FaCaretDown
                      className="text-xl cursor-pointer -rotate-90 transition-transform"
                      onClick={() => setOn(false)}
                    />
                    <span className="text-sm font-semibold">Show Ongoing Projects</span>
                  </div>
                )}

                {ongoing === "Yes" && (
                  <div className={`${on ? "hidden" : "w-full Projectsss flex flex-col gap-4 bg-richblack-700/50 rounded-xl p-6 border border-richblack-600"}`}>
                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition">
                      <FaCaretDown className="text-xl cursor-pointer transition-transform" onClick={() => setOn(true)} />
                      <span className="text-sm font-semibold">Hide Ongoing Projects</span>
                    </div>

                    {ongoingProjects.map((field, index) => (
                      <div className='flex items-end gap-3 w-full flex-nowrap bg-richblack-800 rounded-lg p-4 border border-richblack-600' key={field.id} style={{ flexWrap: 'nowrap' }}>
                        <span className="text-yellow-400 font-bold text-lg flex items-center justify-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600 flex-shrink-0 mb-1">{index + 1}</span>

                        {/* Project Name */}
                        <label className="flex flex-col gap-1 min-w-0" style={{ flex: '1.5' }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Name</span>
                            {duplicateongoingproject.has(index) && (
                              <span className="text-red-500 text-xs">Duplicate!</span>
                            )}
                            {errors.ongoingProjects?.[index]?.ProName && (
                              <span className="text-red-500 text-xs">{errors.ongoingProjects[index].ProName.message}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="Project Name"
                            autoComplete="off"
                            className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
                              duplicateongoingproject.has(index) ? "border-2 border-red-500" : ""
                            }`}
                            {...register(`ongoingProjects.${index}.ProName`, {
                              required: ongoing === "Yes" ? "Required" : false,
                              validate:(val) => {
                                const allNames = getValues("ongoingProjects").map((entry,i) =>
                                  (i === index ? val : (entry?.ProName || "")
                                  ).toLowerCase().replace(/\s+/g," ").trim()
                                )
                                const normalized = val.toLowerCase().replace(/\s+/g," ").trim()
                                return (allNames.filter((name) => name && name === normalized).length > 1 ? "" : true)
                              }
                            })}
                            onChange={(e)=>{
                              const value = e.target.value
                              setValue(`ongoingProjects.${index}.ProName`,value,{ shouldValidate: true, shouldDirty: true})
                              const allNames = getValues("ongoingProjects").map((entry,i) =>
                                (i === index ? value : (entry?.ProName || "")
                                ).toLowerCase().replace(/\s+/g," ").trim()
                              )
                              const counts = {}
                              allNames.forEach((n) => {
                                if(!n) return
                                counts[n] = (counts[n] || 0) + 1
                              })
                              const newDuplicates = new Set()
                              allNames.forEach((n,i) => {
                                if(n && counts[n] > 1) newDuplicates.add(i)
                              })
                              setduplicateongoingproject(newDuplicates)
                            }}
                          />
                        </label>

                        {/* Script / File Upload */}
                        <label className='flex flex-col gap-1' style={{ flex: '1.5', minWidth: 0 }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Script</span>
                            {errors?.ongoingProjects?.[index]?.ProFile && (
                              <span className="text-red-500 text-xs">{errors.ongoingProjects[index].ProFile.message}</span>
                            )}
                          </span>
                          <input
                            type="file"
                            id={`ProFile-${index}`}
                            className={`w-full p-2 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 transition text-white text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-yellow-400 file:text-richblack-900 file:font-semibold file:cursor-pointer ${
                              errors?.ongoingProjects?.[index]?.ProFile ? "border border-red-500" : ""
                            }`}
                            accept="application/pdf"
                            onChange={(e) => {
                              const files = e.target.files;
                              const file = files?.[0];
                              if (file) {
                                const allowedTypes = ["application/pdf"];
                                if (!allowedTypes.includes(file.type)) {
                                  e.target.value = null;
                                  setValue(`ongoingProjects.${index}.ProFile`, null, { shouldValidate: true });
                                  return;
                                }
                                if (file.size > 5 * 1024 * 1024) {
                                  e.target.value = null;
                                  setValue(`ongoingProjects.${index}.ProFile`, null, { shouldValidate: true });
                                  alert("File size must be less than 5MB");
                                  return;
                                }
                              }
                              setValue(`ongoingProjects.${index}.ProFile`, files, { shouldValidate: true });
                            }}
                          />
                        </label>

                        {/* Start Date */}
                        <label className='flex flex-col gap-1' style={{ width: '142px', maxWidth: '142px', flexShrink: 0 }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Start Date</span>
                            {errors.ongoingProjects?.[index]?.Start_Date && (
                              <span className="text-red-500 text-xs">{errors.ongoingProjects[index].Start_Date.message}</span>
                            )}
                          </span>
                          <input
                            type="month"
                            style={{ width: '100%' }}
                            className="w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                            {...register(`ongoingProjects.${index}.Start_Date`, {
                              required: "Required",
                            })}
                          />
                        </label>

                        {/* End Date */}
                        <label className='flex flex-col gap-1' style={{ width: '142px', maxWidth: '142px', flexShrink: 0 }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>End Date</span>
                            {errors.ongoingProjects?.[index]?.Start_End && (
                              <span className="text-red-500 text-xs">{errors.ongoingProjects[index].Start_End.message}</span>
                            )}
                          </span>
                          <input
                            type="month"
                            style={{ width: '100%' }}
                            className="w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                            {...register(`ongoingProjects.${index}.Start_End`, {
                              required: "Required",
                            })}
                          />
                        </label>

                        {/* Release Dropdown */}
                        <label className='flex flex-col gap-1' style={{ minWidth: '120px' }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Release</span>
                            {errors.ongoingProjects?.[index]?.Release && (
                              <span className="text-red-500 text-xs">{errors.ongoingProjects[index].Release.message}</span>
                            )}
                          </span>
                          <select
                            className='w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white'
                            {...register(`ongoingProjects.${index}.Release`, {
                              required: "Required",
                            })}
                          >
                            <option value="" disabled>Select</option>
                            {Projects.Release.map((rel, idx) => (
                              <option key={idx}>{rel}</option>
                            ))}
                          </select>
                        </label>

                        {/* Remove Button */}
                        <div
                          className="flex justify-center items-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600 hover:bg-red-600 hover:border-red-500 cursor-pointer flex-shrink-0 mb-1 transition"
                          onClick={() => {
                            if (ongoingProjects.length === 1) {
                              setOngoingError("You need to keep at least one field");
                            } else {
                              removeOngoing(index);
                              setOngoingError("");
                            }
                          }}
                        >
                          <RxCross1 className='text-richblack-100 text-sm' />
                        </div>
                      </div>
                    ))}

                    {ongoingError && (
                      <span className="text-red-500 text-xs flex justify-center items-center">
                        {ongoingError}
                      </span>
                    )}

                    <button
                      type="button"
                      className="mt-2 px-5 py-2 bg-yellow-400 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-300 transition Adding"
                      onClick={() => {
                        if (ongoingProjects.length >= 4) {
                          setOngoingError("You can create 4 fields only");
                        } else {
                          appendOngoing({ ProName: "", ProFile: null, Start_Date: "", Start_End: "", Release: "" });
                          setOngoingError("");
                        }
                      }}
                    >
                      Add more
                    </button>
                  </div>
                )}

                {/* Planned Projects Section */}
                {planned === "Yes" && pp && (
                  <div className='flex items-center gap-2 Projectsss cursor-pointer text-yellow-400 hover:text-yellow-300 transition'>
                    <FaCaretDown
                      className="text-xl cursor-pointer -rotate-90 transition-transform"
                      onClick={() => setPp(false)}
                    />
                    <span className="text-sm font-semibold">Show Planned Projects</span>
                  </div>
                )}

                {planned === "Yes" && (
                  <div className={`${pp ? "hidden" : "w-full Projectsss flex flex-col gap-4 bg-richblack-700/50 rounded-xl p-6 border border-richblack-600"}`}>
                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition">
                      <FaCaretDown className="text-xl cursor-pointer transition-transform" onClick={() => setPp(true)} />
                      <span className="text-sm font-semibold">Hide Planned Projects</span>
                    </div>

                    {plannedProjects.map((field, index) => (
                      <div className='flex items-end gap-3 w-full flex-nowrap bg-richblack-800 rounded-lg p-4 border border-richblack-600' key={field.id} style={{ flexWrap: 'nowrap' }}>
                        <span className="text-yellow-400 font-bold text-lg flex items-center justify-center w-8 h-8 rounded-full bg-richblack-700 border border-richblack-600 flex-shrink-0 mb-1">{index + 1}</span>

                        {/* Project Name */}
                        <label className="flex flex-col gap-1 min-w-0" style={{ flex: '1' }}>
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Name</span>
                            {duplicateProjectsplanned.has(index) && (
                              <span className="text-red-500 text-xs">Duplicate!</span>
                            )}
                            {Ongoingduplication && (
                              <span className="text-red-500 text-xs">Same names</span>
                            )}
                            {errors.plannedProjects?.[index]?.Proname && (
                              <span className="text-red-500 text-xs">{errors.plannedProjects[index].Proname.message}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="Project Name"
                            autoComplete="off"
                            className={`w-full p-3 rounded-lg form-style bg-richblack-700 border border-richblack-600 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
                              duplicateProjectsplanned.has(index) ? "border-2 border-red-500" : ""
                            }`}
                            {...register(`plannedProjects.${index}.Proname`, {
                              required: planned === "Yes" ? "Required" : false,
                              validate: (val) => {
                                const allNames = getValues("plannedProjects").map((entry, i) =>
                                  (i === index ? val : entry?.Proname || "").toLowerCase().replace(/\s+/g, "").trim()
                                );
                                const normalized = val.toLowerCase().replace(/\s+/g, "").trim();
                                return allNames.filter((name) => name && name === normalized).length > 1 ? "" : true;
                              },
                            })}
                            onChange={(e) => {
                              const value = e.target.value;
                              setValue(`plannedProjects.${index}.Proname`, value, { shouldValidate: true, shouldDirty: true });
                              const allNames = getValues("plannedProjects").map((entry, i) =>
                                (i === index ? value : entry?.Proname || "").toLowerCase().replace(/\s+/g, "").trim()
                              );
                              const counts = {};
                              allNames.forEach((n) => { if (!n) return; counts[n] = (counts[n] || 0) + 1; });
                              const newDuplicates = new Set();
                              allNames.forEach((n, i) => { if (n && counts[n] > 1) newDuplicates.add(i); });
                              setduplicateProjectsplanned(newDuplicates);
                            }}
                          />
                        </label>

                        {/* Project Status */}
                        <label className='flex flex-col gap-1' style={{ width: '150px', maxWidth: '150px', flexShrink: 0 }}>
                          <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Status</span>
                            {errors.plannedProjects?.[index]?.PStatus && (
                              <span className="text-red-500 text-xs">{errors.plannedProjects[index].PStatus.message}</span>
                            )}
                          </span>
                          <select
                            className='bg-richblack-600 h-11 form-style rounded-lg px-2'
                            {...register(`plannedProjects.${index}.PStatus`, { required: "Required" })}
                          >
                            <option value="" disabled>Select</option>
                            {Projects.Stages.map((data, idx) => (
                              <option key={idx} value={data}>{data}</option>
                            ))}
                          </select>
                        </label>

                        {/* Start Date */}
                        <label className='flex flex-col gap-1' style={{ width: '142px', maxWidth: '142px', flexShrink: 0 }}>
                          <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Start Date</span>
                            {errors.plannedProjects?.[index]?.PStart && (
                              <span className="text-red-500 text-xs">{errors.plannedProjects[index].PStart.message}</span>
                            )}
                          </span>
                          <input
                            type="month"
                            style={{ width: '100%' }}
                            className="form-style h-9 bg-richblack-600 rounded-lg px-1"
                            {...register(`plannedProjects.${index}.PStart`, { required: "Required" })}
                          />
                        </label>

                        {/* End Date */}
                        <label className='flex flex-col gap-1' style={{ width: '142px', maxWidth: '142px', flexShrink: 0 }}>
                          <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <span className="text-red-500">*</span><span>End Date</span>
                            {errors.plannedProjects?.[index]?.PEnd && (
                              <span className="text-red-500 text-xs">{errors.plannedProjects[index].PEnd.message}</span>
                            )}
                          </span>
                          <input
                            type="month"
                            style={{ width: '100%' }}
                            className="form-style h-9 bg-richblack-600 rounded-lg px-1"
                            {...register(`plannedProjects.${index}.PEnd`, { required: "Required" })}
                          />
                        </label>

                        {/* Release Dropdown */}
                        <label className='flex flex-col gap-1' style={{ minWidth: '120px' }}>
                          <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <span className="text-red-500">*</span><span>Release</span>
                            {errors.plannedProjects?.[index]?.PReles && (
                              <span className="text-red-500 text-xs">{errors.plannedProjects[index].PReles.message}</span>
                            )}
                          </span>
                          <select
                            className='bg-richblack-600 h-11 form-style rounded-lg px-2'
                            {...register(`plannedProjects.${index}.PReles`, { required: "Required" })}
                          >
                            <option value="" disabled>Select</option>
                            {Projects.Release.map((rel, idx) => (
                              <option key={idx}>{rel}</option>
                            ))}
                          </select>
                        </label>

                        {/* Remove Button */}
                        <div
                          className="flex justify-center items-center rounded-full hover:bg-red-600 cursor-pointer p-1 mb-1"
                          onClick={() => {
                            if (plannedProjects.length === 1) {
                              setPlannedError("You need to keep at least one field");
                            } else {
                              removePlanned(index);
                              setPlannedError("");
                            }
                          }}
                        >
                          <RxCross1 className='text-richblack-100' />
                        </div>
                      </div>
                    ))}

                    {plannedError && (
                      <span className="text-red-500 text-sm flex justify-center items-center">
                        {plannedError}
                      </span>
                    )}

                    <button
                      type="button"
                      className="mt-2 px-4 py-1 bg-blue-600 text-white rounded Adding"
                      onClick={() => {
                        if (plannedProjects.length >= 4) {
                          setPlannedError("You can create 4 fields only");
                        } else {
                          appendPlanned({ Proname: "", PType: "", PStatus: "", PStart: "", PEnd: "", PReles: "" });
                          setPlannedError("");
                        }
                      }}
                    >
                      Add more
                    </button>
                  </div>
                )}

<div className="dGsss flex flex-col gap-2">
  {/* ✅ Label + Error */}
  <label className="flex justify-start items-center gap-2" htmlFor="genres">
    <span className="text-red-500">*</span>
    <span className="flex gap-6">
      What Type of Genre Suits You  
        {errors.genres && (
        <span className="text-red-500">{errors.genres.message}</span>
      )}
    </span>
  </label>
<div className="relative group w-full h-full">
  {/* 👇 Only a UI button, not registered */}
  <input
    type="button"
    id="genres"
    className={`p-3 w-full bg-richblack-600 h-11 form-style rounded-lg outline-none transition 
      ${errors.genres === 0  ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-blue-400"}`}
    value={showGenreDropdown ? "Genre" : "Select Genre"}
    onClick={() => setShowGenreDropdown((prev) => !prev)}
  />

  {/* 👇 Hidden input registered with RHF */}
  <input
    type="hidden"
    {...register("genres", {
      required: "Please select at least one genre",
       validate: () => genres.length > 0 ,
    })}
    value={genres.join(",")}
  />

  {/* ✅ Dropdown */}
  {showGenreDropdown && (
    <div className="absolute left-0 bg-richblack-800 -top-67 mt-2 p-2 rounded shadow w-full h-[255px] z-10">
      <div className="flex justify-around items-center gap-2 w-full h-full">
        {/* Genre options */}
        <div className="w-[80%] border-r-1 grid grid-cols-5 grid-rows-4 gap-2">
          {Genre.genres.map((data, index) => (
            <div
              key={index}
              className={`text-md font-edu-sa w-fit Datass rounded-lg px-4 py-2 cursor-pointer font-semibold
                ${genres.includes(data.name)
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-yellow-400 hover:text-black"}`}
              onClick={() => {
                if (genres.length >= 5) {
                  setGenreError("You cannot select more than 5 genres");
                  return;
                }
                setGenreError("");
                if (!genres.includes(data.name)) {
                  const updatedGenres = [...genres, data.name];
                  setGenres(updatedGenres);
                  setValue("genres", updatedGenres.join(","), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            >
              {data.name}
            </div>
          ))}
        </div>

        {/* Selected Genres */}
        <div className="h-full w-[18%] flex flex-col justify-between items-center py-2">
          <div className="w-full flex justify-center items-center mb-2">
            <h2 className="font-bold text-lg">Genres</h2>
          </div>
          <div className="flex flex-col justify-center items-center flex-1 gap-1">
            {genres.length === 0 ? (
              <div className="text-gray-400">Select Genre</div>
            ) : (
              genres.map((data, index) => (
                <div
                  key={index}
                  className="bg-yellow-400 text-black text-md font-edu-sa w-full border rounded-md flex justify-around items-center gap-2"
                >
                  {data}
                  <div
                    onClick={() => {
                      const updatedGenres = genres.filter((_, i) => i !== index);
                      setGenres(updatedGenres);
                      setValue("genres", updatedGenres.join(","), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      if (updatedGenres.length < 5) {
                        setGenreError("");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <RxCross1 />
                  </div>
                </div>
              ))
            )}

            {/* Errors */}
            {genreError && (
              <span className="text-red-500 text-sm flex justify-center items-center">
                {genreError}
              </span>
            )}
            {errors.genres && (
              <span className="text-red-500 text-sm">
                {errors.genres.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

</div>

                <label className='dGsss flex justify-start items-center gap-2' htmlFor='subgenres'>
                  <span className="text-red-500">*</span>
                  <span className="flex gap-6">
                    What Type of Sub Genre Suits You
                    {/* {subGenres.length === 0 && <span className="text-red-500">You Need to select Atleasat One Sub Genres</span>} */}
                          {errors.subgenres && (
        <span className="text-red-500">{errors.subgenres.message}</span>
      )}
                  </span>
                </label>
                <div className="relative group w-full h-full ">
                <input
  type="button"
  id="subgenres"
  className={`p-3 w-full bg-richblack-600 h-11 form-style rounded-lg outline-none transition 
    ${errors.subgenres ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-blue-400"}`}
  value={showSubGenreDropdown ? "Sub Genre" : "Select Sub Genre"}
  onClick={() => setShowSubGenreDropdown((prev) => !prev)}
/>

{/* ✅ Hidden input is the real registered field */}
<input
  type="hidden"
  {...register("subgenres", {
    required: "Please select at least one sub genre",
    validate: (value) => value.length > 0 ,
  })}
  value={subGenres.join(",")}
/>


                  {showSubGenreDropdown && (
                    <div className="absolute left-0 -top-88 mt-2 bg-richblack-700 p-4 rounded-xl shadow-lg w-full min-h-[240px] z-10 border border-richblack-700">
                      <div className="flex flex-col gap-2 w-full">
                        {genres.length === 0 ? (
                          <div className="text-gray-400">Select a genre first</div>
                        ) : (
                          genres.map((selectedGenre, idx) => {
                            const genreObj = Genre.genres.find(g => g.name === selectedGenre);
                            return (
                              <div key={idx} className="flex justify-center flex-row items-center gap-3 w-full mb-2 grid grid-cols-4 grid-row-5 gap-2">
                                {genreObj.subgenres.map((sub, subIdx) => {
                                  const subName = sub.name;
                                  const isSelected = subGenres.includes(subName);
                                  return (
                                    <div
                                      key={subIdx}
                                      className={`min-w-[140px] px-4 py-2 rounded-lg shadow-md font-semibold text-md cursor-pointer transition-all border border-richblack-700 flex gap-3 items-center justify-center
                                        ${isSelected
                                          ? "bg-yellow-400 text-black font-bold"
                                          : "bg-richblack-600 text-white hover:bg-yellow-400 hover:text-black"}`}
                                      onClick={() => {
                                        if (!isSelected) {
                                          if (subGenres.length >= 10) {
                                            setSubGenreError("You cannot select more than 10 sub genres");
                                            return;
                                          }
                                          const updated = [...subGenres, subName];
                                          setSubGenres(updated);
                                          setValue("subgenres", updated.join(","));
                                          setSubGenreError("");
                                        }
                                      }}
                                    >
                                      <span>{subName}</span>
                                      {isSelected && (
                                        <span
                                          className="ml-2 cursor-pointer hover:text-red-600"
                                          onClick={e => {
                                            e.stopPropagation();
                                            const updated = subGenres.filter(sg => sg !== subName);
                                            setSubGenres(updated);
                                            setValue("subgenres", updated.join(","));
                                            if (updated.length < 10) setSubGenreError("");
                                          }}
                                        >
                                          <RxCross1 />
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })
                        )}
                        <input
                          type="hidden"
                          {...register("subgenres", {
                            required: "Please select at least one sub genre",
                            validate: (value) => value.length > 0 || "Please select at least one sub genre",
                          })}
                          value={subGenres.join(",")}
                        />
                        <div className="w-full flex justify-center items-center mt-2">
                          {subGenreError && (
                            <div className="text-red-500 font-bold">{subGenreError}</div>
                          )}
                          {errors.subgenres && <span className="text-red-500 text-sm">{errors.subgenres.message}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Distribution */}
            <div className="w-full Distrubations bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Distribution</p>
                <p className="text-sm text-gray-400 mt-1">Screening preferences, audience targeting & distribution details</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Screening Formats & Audience Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preferred Screening Formats */}
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="Formats">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Preferred Screening Formats</span>
                      </span>
                    </label>

                    <input
                      type="button"
                      id="Formats"
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none cursor-pointer transition text-white text-left
                        ${errors.screenFormats ? "ring-2 ring-red-500 border-red-500" : "hover:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"}`}
                      value={screen ? "Screen Formats" : "Select Screen Formats"}
                      onClick={() => setScreen((prev) => !prev)}
                    />

                    {/* Hidden input for react-hook-form */}
                    <input
                      type="hidden"
                      {...register("screenFormats", {
                        required: "Please select at least one Screen Format",
                        validate: (value) =>
                          value.length > 0 || "Please select at least one Screen Format",
                      })}
                      value={screenTypes.join(",")}
                    />

                    {/* Selected tags */}
                    {screenTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {screenTypes.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium">
                            {item}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = screenTypes.filter((sg) => sg !== item);
                                setScreenTypes(updated);
                                setValue("screenFormats", updated.join(","));
                                if (updated.length < 2) {
                                  setScreenError("You need to select at least 2 Screen formats");
                                } else {
                                  setScreenError("");
                                }
                              }}
                              className="cursor-pointer hover:text-red-400 transition"
                            >
                              <RxCross1 size={10} />
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {screen && (
                      <div className="w-full absolute top-[76px] z-20">
                        <div className="bg-richblack-700 border border-richblack-600 grid grid-cols-2 sm:grid-cols-3 w-full p-4 rounded-lg shadow-xl gap-2 max-h-[220px] overflow-y-auto">
                          {Projects.Screens.map((data, index) => {
                            const isSelected = screenTypes.includes(data);
                            return (
                              <div
                                key={index}
                                className={`flex justify-center items-center gap-1 text-sm font-medium Datass rounded-lg outline-none transition px-3 py-2 cursor-pointer
                                  ${isSelected ? "bg-yellow-400 text-black shadow-md" : "bg-richblack-600 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400 border border-richblack-500"}`}
                                onClick={() => {
                                  if (!isSelected) {
                                    if (screenTypes.length >= 5) {
                                      setScreenError("You cannot select more than 5 formats");
                                      return;
                                    }
                                    const updated = [...screenTypes, data];
                                    setScreenTypes(updated);
                                    setValue("screenFormats", updated.join(","));
                                    setScreenError("");
                                  }
                                }}
                              >
                                {data}
                                {isSelected && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = screenTypes.filter((sg) => sg !== data);
                                      setScreenTypes(updated);
                                      setValue("screenFormats", updated.join(","));
                                      if (updated.length < 2) {
                                        setScreenError("You need to select at least 2 Screen formats");
                                      } else {
                                        setScreenError("");
                                      }
                                    }}
                                    className="ml-1 cursor-pointer hover:text-red-600"
                                  >
                                    <RxCross1 size={12} />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {screenError && <span className="text-red-500 text-xs mt-1">{screenError}</span>}
                    {errors.screenFormats && <span className="text-red-500 text-xs mt-1">{errors.screenFormats.message}</span>}
                  </div>

                  {/* Target Audience Types */}
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="audienceTypes">
                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <span className="text-red-500">*</span><span>Target Audience Types</span>
                      </span>
                    </label>

                    <input
                      type="button"
                      id="audienceTypes"
                      className={`w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none cursor-pointer transition text-white text-left
                        ${errors.audienceTypes ? "ring-2 ring-red-500 border-red-500" : "hover:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"}`}
                      value={audience ? "Audience Types" : "Select Audience Types"}
                      onClick={() => setAudience((prev) => !prev)}
                    />

                    {/* Hidden input for react-hook-form */}
                    <input
                      type="hidden"
                      {...register("audienceTypes", {
                        required: "Please select at least one audience type",
                        validate: (value) =>
                          value.length > 0 || "Please select at least one audience type",
                      })}
                      value={audienceTypes.join(",")}
                    />

                    {/* Selected tags */}
                    {audienceTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {audienceTypes.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium">
                            {item}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = audienceTypes.filter((sg) => sg !== item);
                                setAudienceTypes(updated);
                                setValue("audienceTypes", updated.join(","));
                                if (updated.length < 2) {
                                  setAudienceError("You need to select at least 2 audience types");
                                } else {
                                  setAudienceError("");
                                }
                              }}
                              className="cursor-pointer hover:text-red-400 transition"
                            >
                              <RxCross1 size={10} />
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {audience && (
                      <div className="w-full absolute top-[76px] z-20">
                        <div className="bg-richblack-700 border border-richblack-600 grid grid-cols-2 sm:grid-cols-3 w-full p-4 rounded-lg shadow-xl gap-2 max-h-[220px] overflow-y-auto">
                          {Projects.targetAudience.map((data, index) => {
                            const isSelected = audienceTypes.includes(data.label);
                            return (
                              <div
                                key={index}
                                className={`flex justify-center items-center gap-1 text-sm font-medium Datass rounded-lg outline-none transition px-3 py-2 cursor-pointer
                                  ${isSelected ? "bg-yellow-400 text-black shadow-md" : "bg-richblack-600 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400 border border-richblack-500"}`}
                                onClick={() => {
                                  if (!isSelected) {
                                    if (audienceTypes.length >= 5) {
                                      setAudienceError("You cannot select more than 5 audience types");
                                      return;
                                    }
                                    const updated = [...audienceTypes, data.label];
                                    setAudienceTypes(updated);
                                    setValue("audienceTypes", updated.join(","));
                                    setAudienceError("");
                                  }
                                }}
                              >
                                {data.label}
                                {isSelected && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = audienceTypes.filter((sg) => sg !== data.label);
                                      setAudienceTypes(updated);
                                      setValue("audienceTypes", updated.join(","));
                                      if (updated.length < 2) {
                                        setAudienceError("You need to select at least 2 audience types");
                                      } else {
                                        setAudienceError("");
                                      }
                                    }}
                                    className="ml-1 cursor-pointer hover:text-red-600"
                                  >
                                    <RxCross1 size={12} />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {audienceError && <span className="text-red-500 text-xs mt-1">{audienceError}</span>}
                    {errors.audienceTypes && <span className="text-red-500 text-xs mt-1">{errors.audienceTypes.message}</span>}
                  </div>
                </div>

                {/* Distribution & Promotions Radio Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dpp">
                  {/* Distribution Question */}
                  <div className="dGsss flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      <span className="Distrubationss">Are There Any Projects Ready For Distribution</span>
                    </span>
                    <div className="flex gap-3 mt-1">
                      <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${distribution === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="distributions"
                          value="Yes"
                          checked={distribution === "Yes"}
                          onChange={() => {
                            setDistribution("Yes");
                            setValue("distributions", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${distribution === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="distributions"
                          value="No"
                          checked={distribution === "No"}
                          onChange={() => {
                            setDistribution("No");
                            setValue("distributions", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("distributions")} value={distribution} />
                  </div>

                  {/* Promotions Question */}
                  <div className="dGsss flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300">
                      <span className="Promotiones">Would You like Us To Handle Your Promotions</span>
                    </span>
                    <div className="flex gap-3 mt-1">
                      <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${promotions === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="promotions"
                          value="Yes"
                          checked={promotions === "Yes"}
                          onChange={() => {
                            setPromotions("Yes");
                            setValue("promotions", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${promotions === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="promotions"
                          value="No"
                          checked={promotions === "No"}
                          onChange={() => {
                            setPromotions("No");
                            setValue("promotions", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("promotions")} value={promotions} />
                  </div>
                </div>

                {/* Show/Hide Toggle */}
                {distribution === "Yes" && notable && (
                  <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition Distribute" onClick={() => setNotable(false)}>
                    <FaCaretDown className="text-xl transform -rotate-90 transition-transform" />
                    <span className="text-sm font-semibold">Show Distribution Projects</span>
                  </div>
                )}

                {/* Distribution Entries */}
                {distribution === "Yes" && (
                  <div className={`${notable ? "hidden" : "w-full Projectsss flex flex-col gap-4"}`}>
                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition" onClick={() => setNotable(true)}>
                      <FaCaretDown className="text-xl transition-transform" />
                      <span className="text-sm font-semibold">Hide Distribution Projects</span>
                    </div>

                    {distributionsEntries.map((field, index) => (
                      <div className="relative bg-richblack-700/40 border border-richblack-600 rounded-xl p-5" key={field.id}>
                        {/* Entry number badge */}
                        <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                          Project {index + 1}
                        </div>

                        {/* Remove button */}
                        <div
                          className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-richblack-600 hover:bg-red-600 cursor-pointer transition-colors"
                          onClick={() => {
                            if (distributionsEntries.length === 1) {
                              setNotableError("You need to keep at least one field");
                            } else {
                              removeDistribution(index);
                              setNotableError("");
                            }
                          }}
                        >
                          <RxCross1 className="text-richblack-100 text-xs" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
                          {/* Project Name */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Project Name</span>
                            </span>
                            {duplicatedistributations.has(index) && (
                              <span className="text-red-500 text-xs">Duplicate project name detected!</span>
                            )}
                            {errors?.distributionsEntries?.[index]?.projectname && <span className="text-red-500 text-xs">{errors.distributionsEntries[index].projectname.message}</span>}
                            <input
                              type="text"
                              placeholder="Enter the name of the Project"
                              className={`w-full p-3 bg-richblack-700 border form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
                                duplicatedistributations.has(index) ? "border-2 border-red-500" : "border-richblack-600"
                              }`}
                              {...register(`distributionsEntries.${index}.projectname`, {
                                required: distribution === "Yes" ? "Project name is required" : false,
                                validate: (val) => {
                                  const allNames = getValues("distributionsEntries").map((entry, i) =>
                                    (i === index ? val : entry?.projectname || "")
                                      .toLowerCase()
                                      .replace(/\s+/g, "")
                                      .trim()
                                  );
                                  const normalized = val.toLowerCase().replace(/\s+/g, "").trim();
                                  return allNames.filter((name) => name && name === normalized).length > 1
                                    ? ""
                                    : true;
                                },
                              })}
                              onChange={(e) => {
                                const value = e.target.value;
                                setValue(`distributionsEntries.${index}.projectname`, value, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                const allNames = getValues("distributionsEntries").map((entry, i) =>
                                  (i === index ? value : entry?.projectname || "")
                                    .toLowerCase()
                                    .replace(/\s+/g, "")
                                    .trim()
                                );
                                const counts = {};
                                allNames.forEach((n) => {
                                  if (!n) return;
                                  counts[n] = (counts[n] || 0) + 1;
                                });
                                const newDuplicates = new Set();
                                allNames.forEach((n, i) => {
                                  if (n && counts[n] > 1) newDuplicates.add(i);
                                });
                                setduplicatedistributations(newDuplicates);
                                // duplicateProjectsplanned, setduplicateProjectsplanned
                                // duplicatedistributations, setduplicatedistributations
                              }}
                            />
                          </label>

                          {/* Total Budget */}
                          <label className="flex flex-col gap-2">
                            {/* {errors?.distributionsEntries?.[index]?.Budget && <span className='text-red-500 text-sm'>{errors.distributionsEntries[index].Budget.message}</span>} */}
                            <span className="text-sm font-semibold text-gray-300">Total Budget</span>
                            <select
                              className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                              {...register(`distributionsEntries.${index}.Budget`)}
                            >
                              <option value="" disabled>Select Budget Range</option>
                              {Projects.Money.map((money, i) => (
                                <option key={i} value={money}>
                                  {money}
                                </option>
                              ))}
                            </select>
                          </label>

                          {/* Your Role */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Your Role</span>
                            </span>
                            {errors?.distributionsEntries?.[index]?.Role && <span className="text-red-500 text-xs">{errors.distributionsEntries[index].Role.message}</span>}
                            <select
                              className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                              {...register(`distributionsEntries.${index}.Role`, {
                                required: "Role is required",
                              })}
                            >
                              <option value="" disabled>Your Role</option>
                              {Projects.roles.map((role, i) => (
                                <option key={i} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </label>

                          {/* Release Date */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Release Date</span>
                            </span>
                            {errors?.distributionsEntries?.[index]?.ReleaseDate && <span className="text-red-500 text-xs">{errors.distributionsEntries[index].ReleaseDate.message}</span>}
                            <input
                              type="month"
                              className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                              {...register(`distributionsEntries.${index}.ReleaseDate`, {
                                required: "Date is required",
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    {notableError && (
                      <span className="text-red-500 text-xs flex justify-center items-center">
                        {notableError}
                      </span>
                    )}

                    <button
                      type="button"
                      className="mt-2 self-start px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm"
                      onClick={() => {
                        if (distributionsEntries.length >= 4) {
                          setNotableError("You can create 4 fields only");
                        } else {
                          appendDistribution({ projectname: "", Budget: "", ReleaseDate: "", Role: "" });
                          setNotableError("");
                        }
                      }}
                    >
                      + Add More Projects
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Support & Motivation */}
            <div className="w-full Supports bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Support & Motivation</p>
                <p className="text-sm text-gray-400 mt-1">Your support needs, certifications & collaboration preferences</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Assistance Required */}
                <div className="dGsss flex flex-col gap-4 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                  <span className="text-sm font-semibold text-gray-300 AssistanceRequired">
                    Would You Require Any Type of Support Or Assistance
                  </span>
                  <div className="flex gap-3">
                    <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${support === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                      <input
                        type="radio"
                        name="AssistanceRequired"
                        value="Yes"
                        checked={support === "Yes"}
                        onChange={(e) => {
                          setSupport(e.target.value);
                          setValue("AssistanceRequired", "Yes");
                        }}
                        className="accent-yellow-400 w-4 h-4"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${support === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                      <input
                        type="radio"
                        name="AssistanceRequired"
                        value="No"
                        checked={support === "No"}
                        onChange={(e) => {
                          setSupport(e.target.value);
                          setValue("AssistanceRequired", "No");
                        }}
                        className="accent-yellow-400 w-4 h-4"
                      />
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>
                  <input type="hidden" {...register("AssistanceRequired")} value={support} />

                  {/* Support Type Dropdown */}
                  <div className={support === "Yes" ? "flex flex-col gap-2 mt-2" : "hidden"}>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Can You tell What type of Support You Need</span>
                    </span>
                    <select
                      defaultValue=""
                      id="AssistanceType"
                      className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                      {...register("AssistanceType", { required: support === "Yes" ? "Please select a support type" : false })}
                    >
                      <option value="" disabled>
                        Support Needed
                      </option>
                      {Projects.supportNeeds.map((data, index) => (
                        <option key={index} value={data.label}>
                          {data.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Joining Reason */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="JoiningReason" className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>What is Your main Reason for Joining</span>
                      {errors.JoiningReason && (
                        <span className="text-red-500 text-xs ml-2">{errors.JoiningReason.message}</span>
                      )}
                    </span>
                  </label>
                  <textarea
                    id="JoiningReason"
                    name="JoiningReason"
                    placeholder="Write a short bio (max 250 characters)"
                    maxLength={250}
                    rows={4}
                    value={fields.JoiningReason}
                    className="w-full p-3 bg-richblack-700 border border-richblack-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none placeholder-gray-500"
                    {...register("JoiningReason",{required:"Your reason for joining "})}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-400 flex justify-end">
                    {countWords(fields.JoiningReason)} / Max 250 words
                  </p>
                </div>

                {/* Certifications, Experience & Collaboration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 Last_Field">
                  {/* Certifications */}
                  <div className="flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Do You Have any Certifications in this field</span>
                    </span>
                    <div className="flex gap-3">
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${certified === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="checkbox"
                          name="Certified"
                          value="Yes"
                          checked={certified === "Yes"}
                          onChange={(e) => {
                            setCertified(e.target.value);
                            setValue("Certified", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${certified === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="checkbox"
                          name="Certified"
                          value="No"
                          checked={certified === "No"}
                          onChange={(e) => {
                            setCertified(e.target.value);
                            setValue("Certified", "No");
                            setValue("certifications",[])
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("Certified")} value={certified} />
                  </div>

                  {/* Experience Collaborating */}
                  <div className="flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Do You Have Any Experience Collaborating with Others</span>
                    </span>
                    <div className="flex gap-3">
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${experience === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Experience"
                          value="Yes"
                          checked={experience === "Yes"}
                          onChange={(e) => {
                            setExperience(e.target.value);
                            setValue("Experience", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${experience === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Experience"
                          value="No"
                          checked={experience === "No"}
                          onChange={(e) => {
                            setExperience(e.target.value);
                            setValue("Experience", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("Experience")} value={experience} />
                  </div>

                  {/* Comfortable With Collaboration */}
                  <div className="flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Are You Comfortable With Collaboration</span>
                    </span>
                    <div className="flex gap-3">
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${collabration === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Collaboration"
                          value="Yes"
                          checked={collabration === "Yes"}
                          onChange={(e) => {
                            setCollabration(e.target.value);
                            setValue("Collaboration", "Yes");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${collabration === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                        <input
                          type="radio"
                          name="Collaboration"
                          value="No"
                          checked={collabration === "No"}
                          onChange={(e) => {
                            setCollabration(e.target.value);
                            setValue("Collaboration", "No");
                          }}
                          className="accent-yellow-400 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>
                    <input type="hidden" {...register("Collaboration")} value={collabration} />
                  </div>
                </div>

                {/* Certifications Show/Hide Toggle */}
                {certified === "Yes" && cert && (
                  <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition One" onClick={() => setCert(false)}>
                    <FaCaretDown className="text-xl transform -rotate-90 transition-transform" />
                    <span className="text-sm font-semibold">Show Certifications</span>
                  </div>
                )}

                {/* Certifications Entries */}
                {certified === "Yes" && (
                  <div className={`${cert ? "hidden" : "w-full One flex flex-col gap-4"}`}>
                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition" onClick={() => setCert(true)}>
                      <FaCaretDown className="text-xl transition-transform" />
                      <span className="text-sm font-semibold">Hide Certifications</span>
                    </div>

                    {/* Fields Mapping */}
                    {certifications.map((field, index) => (
                      <div className="relative bg-richblack-700/40 border border-richblack-600 rounded-xl p-5" key={field.id}>
                        {/* Entry number badge */}
                        <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                          Certificate {index + 1}
                        </div>

                        {/* Remove Button */}
                        <div
                          className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-richblack-600 hover:bg-red-600 cursor-pointer transition-colors"
                          onClick={() => {
                            if (certifications.length === 1) {
                              setCertError("You need to keep at least one field");
                            } else {
                              removeCert(index);
                              setCertError("");
                            }
                          }}
                        >
                          <RxCross1 className="text-richblack-100 text-xs" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                          {/* Certificate Name */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Certificate Name</span>
                            </span>
                            {errors?.certifications?.[index]?.CertificateName && (
                              <span className="text-red-500 text-xs">{errors.certifications[index].CertificateName.message}</span>
                            )}
                            {duplicateCertifications.has(index) && (
                              <span className="text-red-500 text-xs">Duplicate Certificate name detected!</span>
                            )}
                            <input
                              type="text"
                              placeholder="Enter Your Certificate Name"
                              className={`w-full p-3 bg-richblack-700 border form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
                                duplicateCertifications.has(index) ? "border-2 border-red-500" : "border-richblack-600"
                              }`}
                              {...register(`certifications.${index}.CertificateName`, {
                                required: certified === "Yes" ? "Certificate name is required" : false,
                                validate: (val) => {
                                  const allNames = getValues("certifications").map((entry, i) =>
                                    (i === index ? val : entry?.CertificateName || "")
                                      .toLowerCase()
                                      .replace(/\s+/g, "")
                                      .trim()
                                  );
                                  const normalized = val.toLowerCase().replace(/\s+/g, "").trim();
                                  return allNames.filter((name) => name && name === normalized).length > 1
                                    ? ""
                                    : true;
                                },
                              })}
                              onChange={(e) => {
                                const value = e.target.value;
                                setValue(`certifications.${index}.CertificateName`, value, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                const allNames = getValues("certifications").map((entry, i) =>
                                  (i === index ? value : entry?.CertificateName || "")
                                    .toLowerCase()
                                    .replace(/\s+/g, "")
                                    .trim()
                                );
                                const counts = {};
                                allNames.forEach((n) => {
                                  if (!n) return;
                                  counts[n] = (counts[n] || 0) + 1;
                                });
                                const newDuplicates = new Set();
                                allNames.forEach((n, i) => {
                                  if (n && counts[n] > 1) newDuplicates.add(i);
                                });
                                setduplicateCertifications(newDuplicates);
                                {/* duplicateCertifications, setduplicateCertifications */}
                              }}
                            />
                          </label>

                          {/* File Upload */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Certificate</span>
                            </span>
                            {errors?.certifications?.[index]?.Certificatealink && (
                              <span className="text-red-500 text-xs">{errors.certifications[index].Certificatealink.message}</span>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.docx,.jpg,.jpeg,.png"
                              className="w-full p-2.5 bg-richblack-700 border border-richblack-600 form-style rounded-lg text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-400/10 file:text-yellow-400 hover:file:bg-yellow-400/20 file:cursor-pointer"
                              onChange={(e) => {
                                const files = e.target.files;
                                const file = files?.[0];
                                if (file) {
                                  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
                                  if (!allowedTypes.includes(file.type)) {
                                    e.target.value = null;
                                    setValue(`certifications.${index}.Certificatealink`, null, { shouldValidate: true });
                                    return;
                                  }
                                  if (file.size > 5 * 1024 * 1024) {
                                    e.target.value = null;
                                    setValue(`certifications.${index}.Certificatealink`, null, { shouldValidate: true });
                                    alert("File size must be less than 5MB");
                                    return;
                                  }
                                }
                                setValue(`certifications.${index}.Certificatealink`, files, { shouldValidate: true });
                              }}
                            />
                          </label>

                          {/* Completion Date */}
                          <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span><span>Certificate Completion Date</span>
                            </span>
                            {errors?.certifications?.[index]?.CertDate && (
                              <span className="text-red-500 text-xs">{errors.certifications[index].CertDate.message}</span>
                            )}
                            <input
                              type="month"
                              className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                              {...register(`certifications.${index}.CertDate`, {
                                required: "Date is required",
                              })}
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    {/* Error + Add More */}
                    {certError && (
                      <span className="text-red-500 text-xs flex justify-center items-center">
                        {certError}
                      </span>
                    )}
                    <button
                      type="button"
                      className="self-start px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm Adding"
                      onClick={() => {
                        if (certifications.length >= 4) {
                          setCertError("You can create 4 fields only");
                        } else {
                          appendCert({ CertificateName: "", Certificatealink: null, CertDate: "" });
                          setCertError("");
                        }
                      }}
                    >
                      + Add More Certifications
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Roles */}
            <div className="w-full Roles bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-richblack-700 px-8 py-5">
                <p className="text-2xl font-bold text-yellow-400 Verificationss">Role Specific Question</p>
                <p className="text-sm text-gray-400 mt-1">Select your role and experience level to unlock relevant questions</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Role & Experience Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 role">
                  {/* Role Selection */}
                  <div className="flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>What Role Suits You</span>
                    </span>
                    <div className="flex w-full bg-richblack-600 rounded-full overflow-hidden border border-richblack-500">
                      {["Director", "Producer"].map((role, idx) => (
                        <button
                          key={role}
                          type="button"
                          className={`flex-1 px-6 py-3 transition-all font-semibold Btnes text-sm
                            ${
                              selectedRole === role
                                ? "bg-yellow-400 text-black shadow-md"
                                : "bg-transparent text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-400"
                            }
                            ${idx === 0 ? "rounded-l-full" : "rounded-r-full"}
                          `}
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleError("");
                            setValue("selectedRole", role, { shouldValidate: true });
                          }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    {roleError && (
                      <span className="text-red-500 text-xs mt-1">{roleError}</span>
                    )}
                    {errors.selectedRole && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.selectedRole.message}
                      </span>
                    )}
                    <input
                      type="hidden"
                      {...register("selectedRole", { required: "Role is required" })}
                      value={selectedRole}
                    />
                  </div>

                  {/* Experience Section */}
                  <div className="flex flex-col gap-3 bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <span className="text-red-500">*</span><span>Do You have Any Experience in This field</span>
                    </span>
                    <div className="flex w-full bg-richblack-600 rounded-full overflow-hidden border border-richblack-500">
                      {["Fresher", "Experienced"].map((exp, idx) => (
                        <button
                          key={exp}
                          type="button"
                          className={`flex-1 px-6 py-3 transition-all font-semibold Btnes text-sm
                            ${
                              experiences === exp
                                ? "bg-yellow-400 text-black shadow-md"
                                : "bg-transparent text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-400"
                            }
                            ${idx === 0 ? "rounded-l-full" : "rounded-r-full"}
                          `}
                          onClick={() => {
                            setExperiences(exp);
                            setExperienceError("");
                            setValue("experiences", exp, { shouldValidate: true });
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                    {experienceError && (
                      <span className="text-red-500 text-xs mt-1">
                        {experienceError}
                      </span>
                    )}
                    <input
                      type="hidden"
                      {...register("experiences", {
                        required: "Experience level is required",
                      })}
                      value={experiences}
                    />
                    {errors.experiences && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.experiences.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* end one  */}

                <div className="relative w-full">
                  {(!selectedRole || !experiences) && (
                    <div className="bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                      <div className="bg-richblack-700/50 p-8 rounded-xl shadow-2xl border border-yellow-400/30 text-center">
                        <div className="text-5xl text-yellow-400 mb-4">
                          🔒
                        </div>
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">
                          Complete Your Selection
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Please choose a role and select your experience level to continue
                        </p>
                        <div className="flex flex-col gap-2 text-sm text-gray-500">
                          {!selectedRole && <span>• Select your role (Director/Producer)</span>}
                          {!experiences && <span>• Choose your experience level (Fresher/Experienced)</span>}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={`${(!selectedRole || !experiences) ? 'blur-sm pointer-events-none' : ''}`}>
                    {selectedRole === "Director" && experiences === "Experienced" && (
                      <div className="space-y-8 SelectionOne bg-richblack-700/30 rounded-xl border border-richblack-600 p-6">

                        {/* Awards & Recognition */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Awards & Recognition</h3>
                          <div className="space-y-4">
                            <div className="bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                              <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 mb-3">
                                <span className="text-red-500">*</span>
                                <span>Can you name some of the awards you have received for your previous projects?</span>
                              </span>

                              <div className="flex gap-3">
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${hasAwards === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    name="Awards"
                                    value="Yes"
                                    className="accent-yellow-400 w-4 h-4"
                                    {...register("Awards", { required: "Awards is reqired" })}
                                    checked={hasAwards === "Yes"}
                                    onChange={(e) => {
                                      setHasAwards(e.target.value);
                                      setValue("hasAwards", "Yes");
                                    }}
                                  />
                                  <span className="text-sm font-medium">Yes</span>
                                </label>

                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${hasAwards === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    name="Awards"
                                    value="No"
                                    className="accent-yellow-400 w-4 h-4"
                                    {...register("Awards", { required: "Awards is reqired" })}
                                    checked={hasAwards === "No"}
                                    onChange={(e) => {
                                      setHasAwards(e.target.value);
                                      setValue("hasAwards", "No");
                                    }}
                                  />
                                  <span className="text-sm font-medium">No</span>
                                </label>
                              </div>
                            </div>

                            {hasAwards === "Yes" && (
                              <div
                                className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition"
                                onClick={() => setAwardSectionOpen((prev) => !prev)}
                              >
                                <FaCaretDown
                                  className={`text-xl transition-transform ${
                                    awardSectionOpen ? "rotate-180" : ""
                                  }`}
                                />
                                <span className="text-sm font-semibold">{awardSectionOpen ? "Hide Awards" : "Show Awards"}</span>
                              </div>
                            )}

                            {hasAwards === "Yes" && awardSectionOpen && (
                              <div className="w-full flex flex-col gap-4">
                                {awards.map((field, index) => (
                                  <div
                                    key={field.id}
                                    className="relative bg-richblack-700/40 border border-richblack-600 rounded-xl p-5"
                                  >
                                    {/* Entry badge */}
                                    <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                      Award {index + 1}
                                    </div>

                                    {/* Delete */}
                                    <div
                                      className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-richblack-600 hover:bg-red-600 cursor-pointer transition-colors"
                                      onClick={() => {
                                        if (awards.length === 1) {
                                          setAwardError("You need to keep at least one award");
                                        } else {
                                          removeAward(index);
                                          setAwardError("");
                                        }
                                      }}
                                    >
                                      <RxCross1 className="text-richblack-100 text-xs" />
                                    </div>

                                    {/* ROW 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Award Category</span>
                                        <select
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                          {...register(`Awards.${index}.category`, {
                                            required: "Category is required",
                                          })}
                                        >
                                          <option value="">Select Award</option>
                                          {Projects.awardCategories.map((data, idx) => (
                                            <option key={idx}>{data}</option>
                                          ))}
                                        </select>
                                      </label>

                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Name of Award / Festival</span>
                                        <input
                                          type="text"
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                                          {...register(`Awards.${index}.awardName`, {
                                            required: hasAwards === "Yes",
                                          })}
                                        />
                                      </label>

                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Movie / Web Series Name</span>
                                        <input
                                          type="text"
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                                          {...register(`Awards.${index}.movieName`, {
                                            required: hasAwards === "Yes",
                                          })}
                                        />
                                      </label>
                                    </div>

                                    {/* ROW 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Release Date</span>
                                        <input
                                          type="date"
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                          {...register(`Awards.${index}.releaseDate`, {
                                            required: "Release Date is required",
                                          })}
                                        />
                                      </label>

                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Currency</span>
                                        <select
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                          {...register(`Awards.${index}.Currencey`, {
                                            required: "Currencey is required",
                                          })}
                                        >
                                          <option value="">Select Currencey</option>
                                          {Projects.currencies.map((data, idx) => (
                                            <option key={idx} value={data.code}>
                                              {data.name} - {data.symbol}
                                            </option>
                                          ))}
                                        </select>
                                      </label>

                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Total Budget</span>
                                        <input
                                          type="tel"
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                                          {...register(`Awards.${index}.budget`, {
                                            required: "Budget is required",
                                          })}
                                        />
                                      </label>

                                      <label className="flex flex-col gap-2 awar">
                                        <span className="text-sm font-semibold text-gray-300 flex items-center gap-1"><span className="text-red-500">*</span> Total Earned</span>
                                        <input
                                          type="tel"
                                          className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                                          {...register(`Awards.${index}.earned`, {
                                            required: "Total earned is required",
                                          })}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                ))}

                                {awardError && (
                                  <span className="text-red-500 text-xs flex justify-center">
                                    {awardError}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  className="self-start px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm Awards"
                                  onClick={() => {
                                    if (awards.length >= 4) {
                                      setAwardError("You can create 4 fields only");
                                    } else {
                                      appendAward({
                                        category: "",
                                        awardName: "",
                                        movieName: "",
                                        releaseDate: "",
                                        Currencey: "",
                                        budget: "",
                                        earned: "",
                                      });
                                      setAwardError("");
                                    }
                                  }}
                                >
                                  + Add More Awards
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tools & Software */}
                        <div className="space-y-4 TaS">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">Tools & Software</h3>
                          <div className="space-y-4">
                            <div className="bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                              <span className="text-sm font-semibold text-gray-300 block mb-3">
                                Can you Name Some of the Software or Tools that you have worked with?
                              </span>

                              <div className="flex gap-3">
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${Soft === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    value="Yes"
                                    {...register("ToolsChoice")}
                                    onChange={(e) => {
                                      setSoft("Yes");
                                      setValue("ToolsChoice", "Yes");
                                    }}
                                    checked={Soft === "Yes"}
                                    className="accent-yellow-400 w-4 h-4"
                                  />
                                  <span className="text-sm font-medium">Yes</span>
                                </label>
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${Soft === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    value="No"
                                    {...register("ToolsChoice")}
                                    onChange={(e) => {
                                      setSoft("No");
                                      setValue("ToolsChoice", "No");
                                      // reset selections if No
                                      setSelectedTools([]);
                                      setSelectedSoftware([]);
                                      setValue("tools", []);
                                      setValue("software", []);
                                    }}
                                    checked={Soft === "No"}
                                    className="accent-yellow-400 w-4 h-4"
                                  />
                                  <span className="text-sm font-medium">No</span>
                                </label>
                              </div>
                            </div>

                            {Soft === "Yes" && (selectedTools.length === 0 || selectedSoftware.length === 0) && (
                              <p className="text-red-500 text-xs S">
                                Please select at least one Tool and one Software
                              </p>
                            )}

                            {/* Selection section */}
                            <section
                              className={
                                Soft === "Yes"
                                  ? "grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-fit bg-richblack-700/30 border border-richblack-600 rounded-xl p-5 Softs"
                                  : "hidden"
                              }
                            >
                              {/* TOOLS SECTION */}
                              <div className="h-[300px] w-full flex flex-col gap-2">
                                <p className="text-yellow-400 font-semibold text-sm text-center bg-richblack-700/50 rounded-lg py-2 border border-richblack-600">Select Tools</p>

                                <div className="grid grid-cols-2 lg:grid-cols-3 w-full h-full overflow-y-auto gap-2 p-2">
                                  {Tools.tools.map((tool, index) => {
                                    const isSelected = selectedTools.includes(tool);

                                    return (
                                      <div
                                        key={index}
                                        className={`relative p-2.5 rounded-lg shadow-sm cursor-pointer w-full h-fit selectTool flex justify-center items-center gap-2 text-xs font-medium transition-all
                                          ${isSelected
                                            ? "bg-yellow-400 text-black shadow-md"
                                            : "bg-richblack-600 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400 border border-richblack-500"
                                          }`}
                                        onClick={() => {
                                          if (isSelected) {
                                            const updated = selectedTools.filter((t) => t !== tool);
                                            setSelectedTools(updated);
                                            setValue("tools", updated, { shouldValidate: true });
                                            if (updated.length <= 10) setToolError("");
                                          } else {
                                            if (selectedTools.length >= 10) {
                                              setToolError("You cannot select more than 10 tools");
                                              return;
                                            }
                                            const updated = [...selectedTools, tool];
                                            setSelectedTools(updated);
                                            setValue("tools", updated, { shouldValidate: true });
                                          }
                                        }}
                                      >
                                        {tool}

                                        {isSelected && (
                                          <span
                                            className="absolute top-1 right-1 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const updated = selectedTools.filter((t) => t !== tool);
                                              setSelectedTools(updated);
                                              setValue("tools", updated, { shouldValidate: true });
                                              if (updated.length <= 10) setToolError("");
                                            }}
                                          >
                                            <RxCross1 className="text-black hover:text-red-600" size={10} />
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                {toolError && <p className="text-red-500 text-xs mt-1">{toolError}</p>}
                              </div>

                              {/* SOFTWARE SECTION */}
                              <div className="h-[300px] w-full flex flex-col gap-2">
                                <p className="text-yellow-400 font-semibold text-sm text-center bg-richblack-700/50 rounded-lg py-2 border border-richblack-600">Select Software</p>

                                <div className="grid grid-cols-2 lg:grid-cols-3 w-full h-full overflow-y-auto gap-2 p-2">
                                  {Tools.software.map((tool, index) => {
                                    const isSelected = selectedSoftware.includes(tool);

                                    return (
                                      <div
                                        key={index}
                                        className={`relative p-2.5 rounded-lg shadow-sm cursor-pointer w-full h-fit selectTool flex justify-center items-center gap-2 text-xs font-medium transition-all
                                          ${isSelected
                                            ? "bg-yellow-400 text-black shadow-md"
                                            : "bg-richblack-600 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400 border border-richblack-500"
                                          }`}
                                        onClick={() => {
                                          if (isSelected) {
                                            const updated = selectedSoftware.filter((t) => t !== tool);
                                            setSelectedSoftware(updated);
                                            setValue("software", updated, { shouldValidate: true });
                                            if (updated.length <= 10) setSoftwareError("");
                                          } else {
                                            if (selectedSoftware.length >= 10) {
                                              setSoftwareError("You cannot select more than 10 software");
                                              return;
                                            }
                                            const updated = [...selectedSoftware, tool];
                                            setSelectedSoftware(updated);
                                            setValue("software", updated, { shouldValidate: true });
                                          }
                                        }}
                                      >
                                        {tool}
                                        {isSelected && (
                                          <span
                                            className="absolute top-1 right-1 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const updated = selectedSoftware.filter((t) => t !== tool);
                                              setSelectedSoftware(updated);
                                              setValue("software", updated, { shouldValidate: true });
                                              if (updated.length <= 10) setSoftwareError("");
                                            }}
                                          >
                                            <RxCross1 className="text-black hover:text-red-600" size={10} />
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                {softwareError && (
                                  <p className="text-red-500 text-xs mt-1">{softwareError}</p>
                                )}
                              </div>
                            </section>
                          </div>
                        </div>

                        {/* Team Management */}
                        <div className="space-y-4 TaS">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">Team Management</h3>
                          <div className="space-y-2 T flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>What Can be Your Typical Team Size For a Project ?</span>
                              {errors.teamSize && <span className="text-red-500 text-xs ml-2">{errors.teamSize.message}</span>}
                            </label>
                            <select defaultValue="" className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white" {...register("teamSize",{required:"Team Size is required"})}>
                              <option value="" disabled>Select Team Size</option>
                              {Projects.typicalTeamSizeRanges.map((data, index) => {
                                const value = data === "Depends On Project" ? "" :data.replace("+", "")
                                return (
                                  <option key={index} value={value}>{data}</option>
                                )
                              })}
                            </select>
                          </div>
                        </div>

                      </div>
                    )}

                    {selectedRole === "Producer" && experiences === "Experienced" && (
                      <div className="space-y-8 SelectionOne bg-richblack-700/30 rounded-xl border border-richblack-600 p-6">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-center">
                          <span className="text-red-400 text-sm font-medium">All The Fields are Required in this Section</span>
                        </div>

                        {/* Production Resume */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Production Resume</h3>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              Upload Your Production Resume <span className="text-red-500">*</span>
                              {errors.supportingDocs && <span className="text-red-500 text-xs ml-2">{errors.supportingDocs.message}</span>}
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="application/pdf"
                                className="w-full p-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-400/10 file:text-yellow-400 hover:file:bg-yellow-400/20 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                {...register("supportingDocs", {
                                  required: "Resume is required",
                                  validate: (files) => {
                                    if (files && files[0] && files[0].size > 10 * 1024 * 1024) {
                                      return "File size should be less than 10MB";
                                    }
                                    return true;
                                  },
                                })}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file && file.size > 10 * 1024 * 1024) {
                                    alert("File size should be less than 10MB");
                                    e.target.value = "";
                                  }
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1">PDF files only, max size 10MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Funding & Finance */}
                        <div className="space-y-4 Fundes">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">
                            Funding & Finance
                          </h3>
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              Can You Tell Us What are the various ways That you have Used to fund your
                              Projects? <span className="text-red-500">*</span>
                            </label>

                            {funding ? (
                              <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition One" onClick={() => setfunding(false)}>
                                <FaCaretDown className="text-xl transform -rotate-90 transition-transform" />
                                <span className="text-sm font-semibold">
                                  Show Funding Sources
                                  {errors.fundingSources && (
                                    <span className="text-red-500 text-xs ml-2">
                                      {errors.fundingSources.message}
                                    </span>
                                  )}
                                </span>
                              </div>
                            ) : (
                              <div className="w-full bg-richblack-700/40 border border-richblack-600 p-5 rounded-xl flex flex-col gap-4">
                                <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition One" onClick={() => setfunding(true)}>
                                  <FaCaretDown className="text-xl transition-transform" />
                                  <span className="text-sm font-semibold">
                                    Hide Funding Sources
                                    {errors.fundingSources && (
                                      <span className="text-red-500 text-xs ml-2">
                                        {errors.fundingSources.message}
                                      </span>
                                    )}
                                  </span>
                                </div>

                                <div
                                  className={`w-full grid grid-cols-2 md:grid-cols-3 gap-2 Fundings ${
                                    errors.fundingSources ? "border border-red-500 rounded-lg p-2" : ""
                                  } ${funding ? "hidden" : ""}`}
                                >
                                  {Profession.fundingSources.map((data, index) => {
                                    const selected = finance.includes(data);

                                    return (
                                      <span
                                        key={index}
                                        className={`p-2.5 rounded-lg text-xs font-medium f flex justify-center items-center gap-2 cursor-pointer transition-all ${
                                          selected
                                            ? "bg-yellow-400 text-black shadow-md"
                                            : "bg-richblack-600 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400 border border-richblack-500"
                                        }`}
                                        onClick={() => {
                                          if (selected) {
                                            const updated = finance.filter((f) => f !== data);
                                            setfinance(updated);
                                            setValue("fundingSources", updated, {
                                              shouldValidate: true,
                                            });
                                            if (updated.length <= 5) setfinanceError("");
                                          } else {
                                            if (finance.length >= 5) {
                                              setfinanceError(
                                                "You cannot select more than 5 Funding source"
                                              );
                                              return;
                                            }
                                            const updated = [...finance, data];
                                            setfinance(updated);
                                            setValue("fundingSources", updated, {
                                              shouldValidate: true,
                                            });
                                          }
                                        }}
                                      >
                                        {data}{" "}
                                        {selected && (
                                          <RxCross1
                                            size={10}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const updated = finance.filter((f) => f !== data);
                                              setfinance(updated);
                                              setValue("fundingSources", updated, {
                                                shouldValidate: true,
                                              });
                                              if (updated.length <= 5) setfinanceError("");
                                            }}
                                          />
                                        )}
                                      </span>
                                    );
                                  })}

                                  {/* Hidden input synced with RHF */}
                                  <input
                                    type="hidden"
                                    {...register("fundingSources", {
                                      required: "Please select at least one Funding Source",
                                      validate: (value) =>
                                        value && value.length > 0
                                          ? true
                                          : "Please select at least one Funding Source",
                                    })}
                                  />
                                </div>

                                {financeError && (
                                  <p className="text-red-500 text-xs mt-1">{financeError}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>


                        {/* Professional Affiliations */}
                        <div className="space-y-4 Fundes">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">
                            Professional Affiliations
                          </h3>
                          <div className="space-y-4">
                            <div className="bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                              <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 mb-3">
                                <span className="text-red-500">*</span>
                                <span>Are you affiliated with any union, guild, or professional film association?</span>
                              </span>

                              <div className="flex gap-3">
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${affilitions === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    value="Yes"
                                    className="accent-yellow-400 w-4 h-4"
                                    checked={affilitions === "Yes"}
                                    {...register("affiliation", { required: "Affiliation selection is required" })}
                                    onChange={(e)=>{
                                      setaffilition("Yes")
                                      setValue("affiliation",e.target.value)
                                    }}
                                  />
                                  <span className="text-sm font-medium">Yes</span>
                                </label>
                                <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${affilitions === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                  <input
                                    type="radio"
                                    value="No"
                                    className="accent-yellow-400 w-4 h-4"
                                    checked={affilitions === "No"}
                                    {...register("affiliation", { required: "Affiliation selection is required" })}
                                    onChange={(e)=>{
                                      setaffilition("No")
                                      setValue("affiliation",e.target.value)
                                    }}
                                  />
                                  <span className="text-sm font-medium">No</span>
                                </label>
                              </div>

                              {errors.affiliation && (
                                <p className="text-red-500 text-xs mt-2">{errors.affiliation.message}</p>
                              )}
                            </div>

                            {affilitions === "Yes" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-richblack-700/40 border border-richblack-600 rounded-xl p-5">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                    Select Guild/Union <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    defaultValue=""
                                    className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                    {...register("guildUnion", { required: "Guild/Union is required" })}
                                  >
                                    <option value="" disabled>
                                      Select Guild/Union
                                    </option>
                                    {Profession.unionsGuildsAffiliations.map((data, index) => (
                                      <option key={index} value={data}>
                                        {data}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.guildUnion && (
                                    <p className="text-red-500 text-xs">{errors.guildUnion.message}</p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                    Membership ID <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter Your Membership ID"
                                    className="w-full p-3 bg-richblack-700 border border-richblack-600 form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500"
                                    {...register("membershipId", { required: "Membership ID is required" })}
                                  />
                                  {errors.membershipId && (
                                    <p className="text-red-500 text-xs">{errors.membershipId.message}</p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                    Year Joined <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                    {...register("yearJoined", { required: "Year joined is required" })}
                                  />
                                  {errors.yearJoined && (
                                    <p className="text-red-500 text-xs">{errors.yearJoined.message}</p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                    Expiry Date <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                    {...register("expiryDate", { required: "Expiry date is required" })}
                                  />
                                  {errors.expiryDate && (
                                    <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team Management */}
                        <div className="space-y-4 Fundes">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">Team Management</h3>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              What Can be Your Typical Team Size For a Project? <span className="text-red-500">*</span>
                              {errors.teamSize && <span className="text-red-500 text-xs ml-2">{errors.teamSize.message}</span>}
                            </label>
                            <select defaultValue="" className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] any form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white" {...register("teamSize", { required: "Team size is required" })}>
                              <option value="" disabled>Select Team Size</option>
                              {Projects.typicalTeamSizeRanges.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Project Experience */}
                        <div className="space-y-4 Fundes">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">Project Experience</h3>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              Number of Projects you have completed Till now <span className="text-red-500">*</span>
                              {errors.projectCount && <span className="text-red-500 text-xs ml-2">{errors.projectCount.message}</span>}
                            </label>
                            <select defaultValue="" className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] any form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white" {...register("projectCount", { required: "Project count is required" })}>
                              <option value="" disabled>Select Project Count</option>
                              {Projects.ProjectNumber.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                              ))}
                            </select>
                            {/* {errors.projectCount && <span className="text-red-500">{errors.projectCount.message}</span>} */}
                          </div>
                        </div>

                        {/* Risk Management */}
                        <div className="space-y-4 Fundes">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3">Risk Management</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="RiskManagement" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>How do you handle Risk while working on a project (with example)</span>
                              {errors.RiskManagement && (
                                <span className="text-red-500 text-xs ml-2">{errors.RiskManagement.message}</span>
                              )}
                              {/* {errors.expiryDate && <span className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</span>} */}
                            </label>

                            <textarea
                              id="RiskManagement"
                              name="RiskManagement"
                              placeholder="Describe your risk management approach with specific examples..."
                              maxLength={250}
                              rows={4}
                              value={fields.RiskManagement}
                              className="w-full p-3 bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("RiskManagement", { required: "Risk management description is required" })}
                              onChange={handleChange}
                            />

                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.RiskManagement)} / Max 250 words
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === "Director" && experiences === "Fresher" && (
                      <div className="space-y-8 SelectionOne bg-richblack-700/30 rounded-xl border border-richblack-600 p-6">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-center">
                          <span className="text-red-400 text-sm font-medium">All The Fields are Required in this Section</span>
                        </div>

                        {/* Inspiration & Motivation */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Inspiration & Motivation</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="DirectorInspiration" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>What inspires you to become a director?</span>
                              {errors.DirectorInspiration && <span className="text-red-500 text-xs ml-2">{errors.DirectorInspiration.message}</span>}
                            </label>
                            <textarea
                              id="DirectorInspiration"
                              name="DirectorInspiration"
                              placeholder="Tell Me Your Inspiration (max 250 characters)"
                              maxLength={250}
                              rows={4}
                              value={fields.DirectorInspiration}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("DirectorInspiration",{required:"Inspiration is required"})}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.DirectorInspiration)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Project Experience */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Project Experience</h3>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>Projects done till now</span>
                              {errors.fresherProjects && <span className="text-red-500 text-xs ml-2">{errors.fresherProjects.message}</span>}
                            </label>
                            <select defaultValue="" className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white" {...register("fresherProjects",{required:"Project Count is required"})}>
                              <option value="" disabled>Select Project Count</option>
                              {Projects.typicalTeamSizeRanges.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Early Challenges */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Early Challenges</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="EarlyChallengs" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>What are the Early Challenges that you have Faced?</span>
                              {errors.EarlyChallengs && <span className="text-red-500 text-xs ml-2">{errors.EarlyChallengs.message}</span>}
                            </label>
                            <textarea
                              id="EarlyChallengs"
                              name="EarlyChallengs"
                              placeholder="What Earl Challenges You have faced (max 250 characters)"
                              maxLength={250}
                              rows={4}
                              value={fields.EarlyChallengs}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("EarlyChallengs",{required:"Early Challenges is required"})}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.EarlyChallengs)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Project Planning */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Project Planning</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="ProjectPlanning" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>How do you plan to PRopose the strateger Of Marketing For Your SHow</span>
                              {errors.ProjectPlanning && <span className="text-red-500 text-xs ml-2">{errors.ProjectPlanning.message}</span>}
                            </label>
                            <textarea
                              id="ProjectPlanning"
                              name="ProjectPlanning"
                              placeholder="Project Planning (max 250 characters)"
                              maxLength={250}
                              rows={4}
                              value={fields.ProjectPlanning}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("ProjectPlanning",{required:"Project Planning is required"})}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.ProjectPlanning)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Promotion & Marketing */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Promotion & Marketing</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="ProjectPromotion" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>What inspires you to become a director?</span>
                              {errors.ProjectPromotion && <span className="text-red-500 text-xs ml-2">{errors.ProjectPromotion.message}</span>}
                            </label>
                            <textarea
                              id="ProjectPromotion"
                              name="ProjectPromotion"
                              placeholder="How do you Handle The Promotion (max 250 characters)"
                              maxLength={250}
                              rows={4}
                              value={fields.ProjectPromotion}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("ProjectPromotion",{required:"Project Promotion is required"})}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.ProjectPromotion)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Scene Visualization */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Scene Visualization</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="SceneVisualize" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>Before Recording a scene, how do you visualize a scene that is going to happen?</span>
                              {errors.SceneVisualize && <span className="text-red-500 text-xs ml-2">{errors.SceneVisualize.message}</span>}
                            </label>
                            <textarea
                              id="SceneVisualize"
                              name="SceneVisualize"
                              placeholder="Scene Visualization (max 250 characters)"
                              maxLength={250}
                              rows={4}
                              value={fields.SceneVisualize}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("SceneVisualize",{required:"Scene Visualization is required"})}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.SceneVisualize)} / Max 250 words
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === "Producer" && experiences === "Fresher" && (
                      <div className="space-y-8 SelectionOne bg-richblack-700/30 rounded-xl border border-richblack-600 p-6">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-center">
                          <span className="text-red-400 text-sm font-medium">All The Fields are Required in this Section</span>
                        </div>

                        {/* Inspiration & Motivation */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Inspiration & Motivation</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="DirectorInspiration" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>What inspires you to become a Producer?</span>
                              {errors.DirectorInspiration && (
                                <span className="text-red-500 text-xs ml-2">{errors.DirectorInspiration.message}</span>
                              )}
                            </label>

                            <textarea
                              id="DirectorInspiration"
                              name="DirectorInspiration"
                              placeholder="Inspiration (max 250 words)"
                              rows={4}
                              value={fields.DirectorInspiration}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("DirectorInspiration", {
                                required: "Director Inspiration is required",
                              })}
                              onChange={handleChange}
                            />

                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.DirectorInspiration)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Project Experience */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Project Experience</h3>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>Projects done till now</span>
                              {errors.fresherProjects && (
                                <span className="text-red-500 text-xs ml-2">{errors.fresherProjects.message}</span>
                              )}
                            </label>
                            <select defaultValue="" className="w-full p-3 COUNTS bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white" {...register("fresherProjects",{required:"Project Count is required"})}>
                              <option value="" disabled>Select Project Count</option>
                              {Projects.typicalTeamSizeRanges.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Budget Planning */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness b">Budget Planning</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="BudgetHandling" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>How do you plan a budget for a film?</span>
                              {errors.BudgetHandling && (
                                <span className="text-red-500 text-xs ml-2">{errors.BudgetHandling.message}</span>
                              )}
                            </label>

                            <textarea
                              id="BudgetHandling"
                              name="BudgetHandling"
                              placeholder="Budget planning and financial management... (max 250 words)"
                              maxLength={250}
                              rows={4}
                              value={fields.BudgetHandling}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("BudgetHandling", { required: "Budget planning is required" })}
                              onChange={handleChange}
                            />

                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.BudgetHandling)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Experience & Funding */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Experience & Funding</h3>

                          {/* Internship Experience */}
                          <div className="bg-richblack-700/50 rounded-lg px-5 py-4 border border-richblack-600">
                            <span className="text-sm font-semibold text-gray-300 flex items-center gap-1 mb-3">
                              <span className="text-red-500">*</span>
                              <span>Do you have any Internship or Crowd Funding Experience?</span>
                            </span>
                            <div className="flex gap-3">
                              <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${internship === "Yes" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                <input
                                  type="radio"
                                  name="internshipExperience"
                                  value="Yes"
                                  checked={internship === "Yes"}
                                  onChange={() => {
                                    setInternship("Yes");
                                    setValue("internshipExperience", "Yes");
                                  }}
                                  className="accent-yellow-400 w-4 h-4"
                                />
                                <span className="text-sm font-medium">Yes</span>
                              </label>
                              <label className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer transition-all ${internship === "No" ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "bg-richblack-700 border-richblack-600 text-gray-300 hover:border-gray-500"}`}>
                                <input
                                  type="radio"
                                  name="internshipExperience"
                                  value="No"
                                  checked={internship === "No"}
                                  onChange={() => {
                                    setInternship("No");
                                    setValue("internshipExperience", "No");
                                  }}
                                  className="accent-yellow-400 w-4 h-4"
                                />
                                <span className="text-sm font-medium">No</span>
                              </label>
                            </div>
                            <input type="hidden" {...register("internshipExperience", { required: "Experience is required" })} value={internship} />
                          </div>

                          {/* Hide / Show toggle */}
                          {internship === "Yes" && openIntern && (
                            <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition One" onClick={() => setOpenIntern(false)}>
                              <FaCaretDown className="text-xl transform -rotate-90 transition-transform" />
                              <span className="text-sm font-semibold">Show Internship</span>
                            </div>
                          )}

                          {internship === "Yes" && (
                            <div className={`${openIntern ? "hidden" : "w-full One flex flex-col gap-4"}`}>
                              <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-yellow-300 transition" onClick={() => setOpenIntern(true)}>
                                <FaCaretDown className="text-xl transition-transform" />
                                <span className="text-sm font-semibold">Hide Internship</span>
                              </div>

                              {/* Dynamic Internship Fields */}
                              {internships.map((field, index) => (
                                <div
                                  className="relative bg-richblack-700/40 border border-richblack-600 rounded-xl p-5"
                                  key={field.id}
                                >
                                  {/* Entry badge */}
                                  <div className="absolute -top-3 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                    Internship {index + 1}
                                  </div>

                                  {/* Remove Button */}
                                  <div
                                    className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-richblack-600 hover:bg-red-600 cursor-pointer transition-colors"
                                    onClick={() => {
                                      if (internships.length === 1) {
                                        setInternError("You need to keep at least one field");
                                      } else {
                                        removeIntern(index);
                                        setInternError("");
                                      }
                                    }}
                                  >
                                    <RxCross1 className="text-richblack-100 text-xs" />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
                                    {/* Internship Name */}
                                    <label htmlFor={`internships.${index}.InternshipName`} className="flex flex-col gap-2">
                                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                        <span className="text-red-500">*</span><span>Internship Name</span>
                                      </span>
                                      {duplicateinternship.has(index) && (
                                        <span className="text-red-500 text-xs">Duplicate Internship Name Detected!</span>
                                      )}

                                      <input
                                        type="text"
                                        placeholder="Enter Internship Name"
                                        className={`w-full p-3 bg-richblack-700 border form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white placeholder-gray-500 ${
                                          duplicateinternship.has(index) ? "border-2 border-red-500" : "border-richblack-600"
                                        }`}
                                        {...register(`internships.${index}.InternshipName`, {
                                          required: internship === "Yes" ? "Internship name is required" : false,
                                          validate: (val) => {
                                            const allNames = getValues("internships").map((entry, i) =>
                                              (i === index ? val : entry?.InternshipName || "")
                                                .toLowerCase()
                                                .replace(/\s+/g, "")
                                                .trim()
                                            );

                                            const normalized = val.toLowerCase().replace(/\s+/g, "").trim();

                                            return allNames.filter((name) => name && name === normalized).length > 1
                                              ? ""
                                              : true;
                                          },
                                        })}
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          setValue(`internships.${index}.InternshipName`, value, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          });

                                          const allNames = getValues("internships").map((entry, i) =>
                                            (i === index ? value : entry?.InternshipName || "")
                                              .toLowerCase()
                                              .replace(/\s+/g, "")
                                              .trim()
                                          );

                                          const counts = {};
                                          allNames.forEach((n) => {
                                            if (!n) return;
                                            counts[n] = (counts[n] || 0) + 1;
                                          });

                                          const newDuplicates = new Set();
                                          allNames.forEach((n, idx) => {
                                            if (n && counts[n] > 1) newDuplicates.add(idx);
                                          });

                                          setduplicateinternship(newDuplicates);
                                        }}
                                      />

                                      {errors?.internships?.[index]?.InternshipName && (
                                        <span className="text-red-500 text-xs">
                                          {errors.internships[index].InternshipName.message}
                                        </span>
                                      )}
                                    </label>

                                    {/* Internship Documents */}
                                    <label htmlFor={`internships.${index}.InternshipDocs`} className="flex flex-col gap-2">
                                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                        <span className="text-red-500">*</span><span>Certificate / Documents</span>
                                      </span>
                                      <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full p-2.5 bg-richblack-700 border border-richblack-600 form-style rounded-lg text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-400/10 file:text-yellow-400 hover:file:bg-yellow-400/20 file:cursor-pointer"
                                        {...register(`internships.${index}.InternshipDocs`, {
                                          required: "Internship file is required",
                                          validate:{
                                              fileSize: (files) => {
                                              if (files && files[0]) {
                                                return (
                                                  files[0].size <= 5 * 1024 * 1024 ||
                                                  "File size must be less than 5MB"
                                                );
                                              }
                                              return true;
                                            },
                                          }
                                        }
                                        )}
                                      />
                                      {errors?.internships?.[index]?.InternshipDocs && (
                                        <span className="text-red-500 text-xs">
                                          {errors.internships[index].InternshipDocs.message}
                                        </span>
                                      )}
                                    </label>

                                    {/* Start Date */}
                                    <label htmlFor={`internships.${index}.StartDate`} className="flex flex-col gap-2">
                                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                        <span className="text-red-500">*</span><span>Start Date</span>
                                      </span>
                                      <input
                                        type="date"
                                        className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                        {...register(`internships.${index}.StartDate`, {
                                          required: "Start date is required",
                                        })}
                                      />
                                      {errors?.internships?.[index]?.StartDate && (
                                        <span className="text-red-500 text-xs">
                                          {errors.internships[index].StartDate.message}
                                        </span>
                                      )}
                                    </label>

                                    {/* Completion Date */}
                                    <label htmlFor={`internships.${index}.EndDate`} className="flex flex-col gap-2">
                                      <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                        <span className="text-red-500">*</span><span>Completion Date</span>
                                      </span>
                                      <input
                                        type="date"
                                        className="w-full p-3 bg-richblack-700 border border-richblack-600 h-[46px] form-style rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition text-white"
                                        {...register(`internships.${index}.EndDate`, {
                                          required: "Completion date is required",
                                        })}
                                      />
                                      {errors?.internships?.[index]?.EndDate && (
                                        <span className="text-red-500 text-xs">
                                          {errors.internships[index].EndDate.message}
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                </div>
                              ))}

                              {/* Error */}
                              {internError && (
                                <span className="text-red-500 text-xs flex justify-center items-center">
                                  {internError}
                                </span>
                              )}

                              {/* Add More */}
                              <button
                                type="button"
                                className="self-start px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm Adding"
                                onClick={() => {
                                  if (internships.length >= 4) {
                                    setInternError("You can create 4 fields only");
                                  } else {
                                    appendIntern({ InternshipName: "", InternshipDocs: "", StartDate: "", EndDate: "" });
                                    setInternError("");
                                  }
                                }}
                              >
                                + Add More Internships
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Networking & Industry Relations */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Networking & Industry Relations</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="Networking" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>How do you plan to network with other people of the industry?</span>
                              {errors.Networking && (
                                <span className="text-red-500 text-xs ml-2">{errors.Networking.message}</span>
                              )}
                            </label>

                            <textarea
                              id="Networking"
                              name="Networking"
                              placeholder="Networking strategy (max 250 words)"
                              maxLength={250}
                              rows={3}
                              value={fields.Networking}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("Networking", { required: "Networking plan is required" })}
                              onChange={handleChange}
                            />

                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.Networking)} / Max 250 words
                            </p>
                          </div>
                        </div>

                        {/* Risk Management */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-yellow-400 border-b border-richblack-600 pb-3 Liness">Risk Management</h3>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="FundDelays" className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                              <span className="text-red-500">*</span>
                              <span>How do you handle Funding Delays?</span>
                              {errors.FundDelays && (
                                <span className="text-red-500 text-xs ml-2">{errors.FundDelays.message}</span>
                              )}
                            </label>

                            <textarea
                              id="FundDelays"
                              name="FundDelays"
                              placeholder="Risk Management (max 250 words)"
                              maxLength={250}
                              rows={3}
                              value={fields.FundDelays}
                              className="w-full p-3 Texetions bg-richblack-700 border border-richblack-600 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none"
                              {...register("FundDelays", { required: "Funding delays strategy is required" })}
                              onChange={handleChange}
                            />

                            <p className="text-xs text-gray-400 flex justify-end">
                              {countWords(fields.FundDelays)} / Max 250 words
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Privacy, Terms & Submit */}
            <div className="text-white w-full pp bg-richblack-800 rounded-xl border border-richblack-700 shadow-lg overflow-hidden">
              <div className="p-6 flex flex-col items-center gap-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      className="accent-yellow-400 w-4 h-4 rounded"
                      {...register("privacyPolicy", { required: "You must agree to the Privacy & Policy" })}/>
                    I agree to the Privacy & Policy
                  </label>
                  {errors.privacyPolicy && <span className="text-red-500 text-xs mt-1 block text-center">{errors.privacyPolicy.message}</span>}
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      className="accent-yellow-400 w-4 h-4 rounded"
                      {...register("termsAndConditions", { required: "You must agree to the terms and conditions" })}/>
                    I agree to he Terms & Conditions
                  </label>
                  {errors.termsAndConditions && <span className="text-red-500 text-xs mt-1 block text-center">{errors.termsAndConditions.message}</span>}
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm mt-2">
                  Submit Application
                </button>
              </div>
            </div>
                  {confirmationModal && <Logout modalData={confirmationModal} />}
          </form>
      </div>
    </div>
  );
};
export default OrganizerVerificationForm;