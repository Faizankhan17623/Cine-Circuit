import toast from 'react-hot-toast'
import {apiConnector} from '../apiConnector'
import {CreateOrgainezer,Ticket,AllotTheatre,GetAllSHowsDetails,GetAllTheatreDetails,orgainezerdata} from "../Apis/OranizaerApi"
import {setLoading,setStatus,setAttempts,setEditUntil,setRejectedData} from '../../Slices/orgainezerSlice'
import {setToken,setLogin,setUserImage,setUser} from '../../Slices/authSlice.js'
import {setloading, setuser} from '../../Slices/ProfileSlice.js'
import Cookies from "js-cookie";

const {createorgainezer,orgainezerlogin} = CreateOrgainezer
const {OrgainezerData,DirectorFresher,DirectorExperience,ProducerFresher,ProducerExperience,GetMyOrgData} = orgainezerdata
const {CreateTicket} = Ticket
const {Allotment} = AllotTheatre
const {Getalltheatredetails,ticketdetails,AllDetails} = GetAllTheatreDetails

export function Creation(name,password,email,number,otp,code){
  // console.log("log fro mthe creation ",name,password,email,number,otp,code)
    return async (dispatch) => {
        dispatch(setLoading(true));
        const ToastId = toast.loading("Creating the orgainezer, please wait...");
        try{
            if (!name || !password || !email || !number || !otp ||!code) {
        throw new Error('Missing required fields');
      }

            const response = await apiConnector("POST",createorgainezer,{
                name:name,
                email: email,
                password: password,
                number: number,
                countrycode:code,
                otp:String(otp),
            })
            //  console.log("This is the responsee data",response)

            if(!response.data.success){
                throw new Error(response.data.message || "Failed to create orgainezer");
            }
             // toast.success("Signup Successful")otp
            return { success: true, data: response.data };
        }catch(error){
            console.log("Error in Creating the orgainezer",error)
            console.log("Error in Creating the orgainezer",error.message)
            return { success: false, error: error.message };
        }
        finally {
            dispatch(setLoading(false));
            toast.dismiss(ToastId);
        }
    }    
}

export function OrgainezerLogin(email,password,navigate){
    return async (dispatch) => {
        dispatch(setLoading(true));
        // const ToastId = toast.loading("Logging in, please wait...");
        try{
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const response = await apiConnector("POST",orgainezerlogin,{
                email:email,
                password:password
            })

            // console.log("THis is the response",response)
                 console.log("User is been logged in ")
                toast.success('Congragulations you are logged in')
                // console.log(response.data.user.verified)

                 // Reset organizer slice to clean state before setting new user data
                 dispatch(setStatus("pending"))
                 dispatch(setAttempts(0))
                 dispatch(setEditUntil(""))
                 dispatch(setRejectedData(null))
                 localStorage.removeItem('Data_Submitted')

                 dispatch(setToken(response.data.token))
                 dispatch(setLogin(true))

                     const userimage = response?.data?.user?.image

                      dispatch(setUserImage(userimage))

                    dispatch(setuser({ ...response.data.user ,usertype:response.data.user.usertype, image:userimage }))
            dispatch(setUser(response.data.user))

                      Cookies.set('token', response.data.token, { expires: 3 });
                      localStorage.setItem('token', JSON.stringify(response.data.token))
                      localStorage.setItem('Verified', JSON.stringify(response.data.user.verified))
                      localStorage.setItem('userImage', userimage)


            navigate('/Dashboard/My-Profile')

                         if(!response.data.success){
                                    toast.error(response.response.data.message)   
                                }
        }catch(error){
           toast.error(error.response.data.message)
                      console.log(error.response.data.message)
                      console.log("There is an error in the login process",error)
                      console.log("unable to log in")
        }
        finally {
            dispatch(setLoading(false));
            // toast.dismiss(ToastId);
        }
    }    
}
// keep the same export name and structure you used
export function Orgainezer_Data(data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Build FormData that matches backend names exactly
      // console.log("THis is the data",data)
     
      let tokenStr = token;
      try {
        // If token is a quoted JSON string like "\"eyJ...\"", this will parse to real string.
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        // ignore parse error and use original token
        console.error(e)
      }
      // console.log("DEBUG tokenStr:", tokenStr);

      const fd = new FormData();

      fd.append("First", data.First || "");
      fd.append("Last", data.Last || "");
      fd.append("Email", data.Email || "");
      fd.append("Countrycode", data.CountryCode || "");
      fd.append("number", data.MobileNumber || "");
      fd.append("countryname", data.CountryName || "");
      fd.append("statename", data.StateName || "");
      fd.append("cityname", data.CityName || "");
      fd.append("Sameforlocalandpermanent", data.SameAddress   || "false");  
      fd.append("local", data.LocalAddress || "");
      fd.append("permanent", data.PermanentAddress || "");
      fd.append("gender", data.Gender || "");
      fd.append("website", data.Portfolio || "");
      fd.append("totalProjects", data.TotalProjects || "");
      fd.append("Experience", data.YearExperience || "");
      fd.append("shortbio", data.bio || "");
      // console.log(data.Notable)
      fd.append("notableProjects", data.Work || "No");
      fd.append("SocialMedia", data.mediaChoice ||"No");
      fd.append("ongoingProject", data.Ongoing ||"No");
      fd.append("projectspllanned", data.Planned ||"No");
      fd.append("Distribution", data.distributions ||"No");
      fd.append("Promotions", data.promotions ||"No");
      fd.append("Assistance", data.AssistanceRequired ||"No");
      fd.append("certifications", data.Certified ||"No");
      fd.append("ExperienceCollabrating", data.Experience ||"No");
      fd.append("collabrotion", data.Collaboration ||"No");


      fd.append("Genre" , data.genres || [])
      fd.append("subGenre",data.subgenres || [])
      fd.append("Screen",data.screenFormats || [])
      fd.append("Target", data.audienceTypes || [])
      fd.append("support", data.AssistanceType || "");
      fd.append("mainreason", data.JoiningReason || "");
      fd.append("role", data.selectedRole || "");
      fd.append("experience", data.experiences || "");

      // MAIN IMAGE: backend expects req.files?.Image
      if (data.posterImage) {
        // posterImage must be a File object (from input[type=file])
        fd.append("Image", data.posterImage);
      }

if (Array.isArray(data.Notable)) {
  data.Notable.forEach((s, i) => {
    fd.append(`notable[${i}][name]`, s.name || "");
    fd.append(`notable[${i}][url]`, s.url || "");
    fd.append(`notable[${i}][role]`, s.role || "");
    fd.append(`notable[${i}][budget]`, s.budget || "");
  });
}

      // Socials -> social[i][mediaName], social[i][follwers], social[i][urls]
      if (data.mediaChoice === "Yes" && Array.isArray(data.socials)) {
        data.socials.forEach((s, i) => {
          fd.append(`social[${i}][mediaName]`, s.mediaName || "");
          fd.append(`social[${i}][follwers]`, s.follwers || "");
          fd.append(`social[${i}][urls]`, s.urls ||  "");
        });
      }

      // Ongoing projects: ongoing[i][name], ongoing[i][startdate], ongoing[i][enddate], ongoing[i][released]
      // and file key ongoing[i][script] (PDF)
      if (Array.isArray(data.ongoingProjects)) {
        data.ongoingProjects.forEach((p, i) => {
          fd.append(`ongoing[${i}][name]`, p.ProName || "");
          fd.append(`ongoing[${i}][startdate]`, p.Start_Date ||  "");
          fd.append(`ongoing[${i}][enddate]`, p.Start_End ||"");
          fd.append(`ongoing[${i}][released]`, p.Release ||"No");
          if (p.ProFile instanceof FileList) {
  Array.from(p.ProFile).forEach(file => {
    fd.append(`ongoing[${i}][script]`, file);
  });
} else if (p.ProFile instanceof File) {
  fd.append(`ongoing[${i}][script]`, p.ProFile);
}
        });
      }

    

      // Planned projects -> projects[i][name], projects[i][type], projects[i][status], projects[i][start], projects[i][end], projects[i][released]
      if (Array.isArray(data.plannedProjects)) {
        data.plannedProjects.forEach((p, i) => {
          fd.append(`projects[${i}][name]`, p.Proname || "");
          fd.append(`projects[${i}][type]`, p.PType || "");
          fd.append(`projects[${i}][status]`, p.PStatus || "");
          fd.append(`projects[${i}][start]`, p.PStart || "");
          fd.append(`projects[${i}][end]`, p.PEnd || "");
          fd.append(`projects[${i}][released]`, p.PReles ||"No");
        });
      }

      // Certificates -> Cert[i][name], Cert[i][date], and file key Cert[i][certificate]
      if (Array.isArray(data.certifications)) {
        data.certifications.forEach((c, i) => {
          fd.append(`Cert[${i}][name]`, c.CertificateName || "");
          fd.append(`Cert[${i}][date]`, c.CertDate || "");

           if (c.Certificatealink instanceof FileList) {
  Array.from(c.Certificatealink).forEach(file => {
    fd.append(`Cert[${i}][certificate]`, file);
  });
} else if (c.Certificatealink instanceof File) {
  fd.append(`Cert[${i}][certificate]`, c.Certificatealink);
}
        });
      }

      // Distributions -> distributions[i][name], distributions[i][budget], distributions[i][role], distributions[i][date]
      if (Array.isArray(data.distributionsEntries)) {
        data.distributionsEntries.forEach((d, i) => {
          fd.append(`distributions[${i}][name]`, d.projectname || d.ProjectName || "");
          fd.append(`distributions[${i}][budget]`, d.Budget || "");
          fd.append(`distributions[${i}][role]`, d.Role || "");
          fd.append(`distributions[${i}][date]`, d.ReleaseDate || "");
        });
      }

       const config = {
        headers: {
          // do NOT set 'Content-Type' here
          ...(tokenStr ? { Authorization: `Bearer ${tokenStr}` } : {})
        },  
        // if server expects cookie-based auth or you need cookies sent do this:
        withCredentials: true
      };

   const response = await apiConnector("POST", OrgainezerData, fd, config.headers, null);
    dispatch(setStatus("submitted"));
      // If apiConnector returns axios response, prefer returning response.data
      // console.log("DEBUG response:", response?.data || response);
      return (response && response.data) ? response.data : response;
    } catch (error) {
      console.log("Error in the org code", error);
      try {
        toast.error(error?.response?.data?.message || error.message);
      } catch (e) {
        console.error(e);
      }
  // toast.success("done from the ")
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function DirectorFres (data,token){
  return async (dispatch)=>{
   dispatch(setLoading(true));
    try{

      // console.log(data)
        let tokenStr = token;
      try {
        // If token is a quoted JSON string like "\"eyJ...\"", this will parse to real string.
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        // ignore parse error and use original token
        console.error(e)
      }

      const fd = new FormData()
      fd.append("Inspirtion", data.DirectorInspiration || "")
      fd.append("Projects", data.fresherProjects || "")
      fd.append("ChallengedFaced", data.EarlyChallengs || "")
      fd.append("Marketing", data.ProjectPlanning || "")
      fd.append("DirectorInspirtion", data.ProjectPromotion || "")
      fd.append("sceneVisualization", data.SceneVisualize || "")

        const config = {
        headers: {
          // do NOT set 'Content-Type' here
          ...(tokenStr ? { Authorization: `Bearer ${tokenStr}` } : {})
        },
        // if server expects cookie-based auth or you need cookies sent do this:
        withCredentials: true
      };
       const response = await apiConnector("POST", DirectorFresher, fd, config.headers, null);
      // If apiConnector returns axios response, prefer returning response.data
      // console.log("DEBUG response:", response?.data || response);
      return (response && response.data) ? response.data : response;
    }catch(error){
      console.log(error)
      console.log(error.message)
    }finally{
      dispatch(setLoading(false));
    }

  }
}

export function DirectorExperien (data,token){
  return async(dispatch)=>{
     dispatch(setLoading(true));
    try{

   let tokenStr = token;
      try {
        // If token is a quoted JSON string like "\"eyJ...\"", this will parse to real string.
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        // ignore parse error and use original token
        console.error(e)
      }

      // console.log(typeof data.teamSize)
      const fd = new FormData()
      // Awards, ToolsSoftware ,TeamSize
      fd.append("Awards", data.hasAwards === "Yes" ? "Yes" : "No");
      fd.append("ToolsSoftware", data.ToolsChoice || "")

     if (Array.isArray(data.tools) && data.tools.length > 0) {
        data.tools.forEach(t => fd.append("Tools[]", t));
      } else {
        // append empty to keep shape (backend also checks presence)
        fd.append("Tools", "");
      }
      if (Array.isArray(data.software) && data.software.length > 0) {
        data.software.forEach(s => fd.append("Software[]", s));
      } else {
        fd.append("Software", "");
      }


      fd.append("TeamSize",data.teamSize.toString() || "")
      
      // AwardCat, Festival, Movie, releaseDate, Curency, Currency, budget, earned

       if (Array.isArray(data.Awards)) {
        data.Awards.forEach((p, i) => {
           const Release = p.releaseDate.split('-').reverse().join('/')
          console.log("Releasse",Release)
          fd.append(`Awards[${i}][AwardCat]`, p.category || "");
          fd.append(`Awards[${i}][Festival]`, p.awardName || "");
          fd.append(`Awards[${i}][Movie]`, p.movieName || "");
          fd.append(`Awards[${i}][releaseDate]`, Release || "");
          fd.append(`Awards[${i}][Curency]`, p.Currencey || "");
          fd.append(`Awards[${i}][budget]`, p.budget ||"");
          fd.append(`Awards[${i}][earned]`, p.earned ||"");
        });
      }

        const config = {
        headers: {
          // do NOT set 'Content-Type' here
          ...(tokenStr ? { Authorization: `Bearer ${tokenStr}` } : {})
        },
        // if server expects cookie-based auth or you need cookies sent do this:
        withCredentials: true
      };

       const response = await apiConnector("POST", DirectorExperience, fd, config.headers, null);
      // If apiConnector returns axios response, prefer returning response.data
      // console.log("DEBUG response:", response?.data || response);
      return (response && response.data) ? response.data : response;
    } catch (error) {
      console.log("Error in the org code", error);
      try {
        toast.error(error?.response?.data?.message || error.message);
      } catch (e) {
        console.error(e);
      }
      throw error;
    }finally{
      dispatch(setLoading(false));

    }
  }
}

export function ProducerFreshe (data,token){
   return async(dispatch)=>{
     dispatch(setLoading(true));
    try{

        let tokenStr = token;
      try {
        // If token is a quoted JSON string like "\"eyJ...\"", this will parse to real string.
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        // ignore parse error and use original token
        console.error(e)
      }

    // console.log(data,"This is thte like form the producer fresher")
      const fd = new FormData()
      fd.append("Inspiration",data.DirectorInspiration || "")
      fd.append("ProjectCount",data.fresherProjects || "")
      fd.append("budget",data.BudgetHandling || "")
      fd.append("CrowdFunding",data.internshipExperience || "No")
      fd.append("Network",data.Networking|| "")
      fd.append("Funding",data.FundDelays || "")


        if (Array.isArray(data.internships)) {
        data.internships.forEach((s, i) => {
          fd.append(`Crowd[${i}][name]`, s.InternshipName || "");
          fd.append(`Crowd[${i}][start]`, s.StartDate || "");
          fd.append(`Crowd[${i}][completion]`, s.EndDate ||  "");
          fd.append(`Crowd[${i}][documents]`, s.InternshipDocs[0] || "");
          // console.log(s,"This is the s data")
        });
      }

   const config = {
        headers: {
          // do NOT set 'Content-Type' here
          ...(tokenStr ? { Authorization: `Bearer ${tokenStr}` } : {})
        },
        // if server expects cookie-based auth or you need cookies sent do this:
        withCredentials: true
      };

       const response = await apiConnector("POST", ProducerFresher, fd, config.headers, null);
      // If apiConnector returns axios response, prefer returning response.data
      // console.log("DEBUG response:", response?.data || response);
      return (response && response.data) ? response.data : response;
    } catch (error) {
      console.log("Error in the org code", error);
      try {
        toast.error(error?.response?.data?.message || error.message);
      } catch (e) {
        console.error(e);
      }
      throw error;
    }finally{
      dispatch(setLoading(false));
    }
  }
}

export function ProducerExpe (data,token){
 return async (dispatch)=>{
  dispatch(setLoading(true));
  try {
            let tokenStr = token;
      try {
        // If token is a quoted JSON string like "\"eyJ...\"", this will parse to real string.
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        // ignore parse error and use original token
        console.error(e)
      }

      const fd = new FormData()
    if (data.supportingDocs?.[0] instanceof File) {
        fd.append("resume", data.supportingDocs[0]);
      }

      fd.append("teamSize",data.teamSize || "")
      fd.append("projectcount", data.projectCount || "")
      fd.append("riskmanagement",data.RiskManagement || "")
       fd.append("Fund", JSON.stringify(data.fundingSources ?? []));

        fd.append("affiliated", data.affiliation || "No");

       if (data.affiliation) {
        fd.append("Affili[0][name]", data.guildUnion);
        fd.append("Affili[0][membership]", data.membershipId);
        fd.append("Affili[0][yearjoined]", data.yearJoined);
        fd.append("Affili[0][expirydate]", data.expiryDate);
      }

   const config = {
        headers: {
          // do NOT set 'Content-Type' here
          ...(tokenStr ? { Authorization: `Bearer ${tokenStr}` } : {})
        },
        // if server expects cookie-based auth or you need cookies sent do this:
        withCredentials: true
      };

       const response = await apiConnector("POST", ProducerExperience, fd, config.headers, null);
      // If apiConnector returns axios response, prefer returning response.data
      // console.log("DEBUG response:", response?.data || response);
      return (response && response.data) ? response.data : response;
  } catch (error) {
     console.log("Error in the Producer Experience code", error);
      try {
        toast.error(error?.response?.data?.message || error.message);
      } catch (e) {
        console.error(e);
      }
      throw error;
  }finally{
      dispatch(setLoading(false));
  }
 } 
}

export function MakeTicket  (ShowId, totalticket,price)  {
  return async (dispatch) => {
    dispatch(setLoading(true));
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Validate token exists
      if (!token) {
        toast.error("Please login to create tickets");
        return;
      }

      // Parse token if it's a JSON string
      let tokenStr = token;
      try {
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        console.error("Token parse error:", e);
      }

      // Validate input data
      if (!ShowId || !totalticket || !price) {
        toast.error("All fields are required");
        dispatch(setLoading(false));
        return;
      }

      // API configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStr}`
        },
        withCredentials: true
      };

      // Make API call
      const response = await apiConnector(
        "PUT", 
        `${CreateTicket}?ShowId=${ShowId}`, // Add query parameter
        {
          overallTicketCreated:totalticket,
          priceoftheticket:price
        },
        config.headers
      );

      // Handle success
      if (response?.data?.success) {
        toast.success(response.data.message);
        return response.data.data; // Return ticket data if needed
      } else {
        toast.error(response?.data?.message || "Failed to create ticket");
      }

    } catch (error) {
      console.error("CreateTicket Error:", error);
      
      // Better error handling
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Failed to create ticket";
      
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export function AllotTickets(showid, theatreid, totaltoallot) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Validate token exists
      if (!token) {
        toast.error("Please login to allot tickets");
        return;
      }

      // Parse token if it's a JSON string
      let tokenStr = token;
      try {
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        console.error("Token parse error:", e);
      }

      // Validate input data
      if (!showid || !theatreid || !totaltoallot) {
        toast.error("All fields are required");
        dispatch(setLoading(false));
        return;
      }

      // API configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenStr}`
        },
        withCredentials: true
      };

      // Make API call
      const response = await apiConnector(
        "PUT", 
        `${Allotment}?ShowId=${showid}&TheatreId=${theatreid}`, // Add query parameters
        {
          TotalTicketsToAllot: totaltoallot
        },
        config.headers
      );

      // Handle success
      if (response?.data?.success) {
        toast.success(response.data.message);
        return response.data.data; // Return allotment data if needed
      } else {
        toast.error(response?.data?.message || "Failed to allot tickets");
      }

    } catch (error) {
      console.error("AllotTickets Error:", error);
      
      // Better error handling
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Failed to allot tickets";
      
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function VerifiedTheatres (token,navigate){
    return async (dispatch) => {
    dispatch(setLoading(true));
     const ToastId = toast.loading("Fetching Theatres details, please wait...");
    try {
      // Get token from localStorage
     if(!token){
                             navigate("/Login")
                             toast.error("Token is Expired Please Create a new One")
                         }

      // Parse token if it's a JSON string
    
      // Validate input data

      // API configuration


      // Make API call
      const response = await apiConnector(
        "GET", 
        Getalltheatredetails,null,{
                Authorization: `Bearer ${token}`
            });

      // Handle success
      if (response?.data?.success) {
        toast.success(response.data.message);
        return response.data.data; // Return allotment data if needed
      } else {
        toast.error(response?.data?.message || "Failed to Get theatres date");
      }

    } catch (error) {
      console.error("Theatres error", error);
      
      // Better error handling
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Theatres error";
      
      toast.error(errorMessage);
    } finally {
            toast.dismiss(ToastId);
      dispatch(setLoading(false));
    }
  };
}

export function TicketDetails (token,showid,navigate){
  return async(dispatch)=>{
     dispatch(setLoading(true));
     const ToastId = toast.loading("Fetching Ticket details, please wait...");
    try{
       if(!token){
                             navigate("/Login")
                             toast.error("Token is Expired Please Create a new One")
                         }

                          const response = await apiConnector(
                "GET", 
                `${ticketdetails}?showId=${showid}`,  // ✅ Add query param to URL
                null,  // ✅ No body for GET
                {
                    Authorization: `Bearer ${token}`
                }
            )

      // Handle success
      if (response?.data?.success) {
        toast.success(response.data.message);
        return response.data; // Return full response with success flag and data
      } else {
        toast.error(response?.data?.message || "Failed to Get ticket details");
      }
    }catch(error){
       console.error("Ticket error", error);
      
      // Better error handling
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Ticket error";
      
      toast.error(errorMessage);
    }finally{
      toast.dismiss(ToastId);
      dispatch(setLoading(false));
    }
  }
}
  
export function Alldetails (token,navigate){
  return async(dispatch)=>{
     dispatch(setLoading(true));
     const ToastId = toast.loading("Fetching  All Ticket details, please wait...");
    try{
       if(!token){
                             navigate("/Login")
                             toast.error("Token is Expired Please Create a new One")
                         }

                          const response = await apiConnector(
                "GET", 
                AllDetails,  // ✅ Add query param to URL
                null,  // ✅ No body for GET
                {
                    Authorization: `Bearer ${token}`
                }
            )

      // Handle success
      if (response?.data?.success) {
        toast.success(response.data.message);
        return response.data; // Return full response with success flag and data
      } else {
        toast.error(response?.data?.message || "Failed to Get  all ticket details");
      }
    }catch(error){
       console.error("Ticket error", error);

      // Better error handling
      const errorMessage = error?.response?.data?.message
        || error?.message
        || "Ticket error";

      toast.error(errorMessage);
    }finally{
      toast.dismiss(ToastId);
      dispatch(setLoading(false));
    }
  }
}

// New function to get organizer's own data
export function GetMyOrgDetails(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      if (navigate) {
        navigate("/Login");
        toast.error("Token is Expired Please Create a new One");
      }
      return { success: false, error: "Token missing" };
    }

    dispatch(setLoading(true));

    try {
      // Parse token if needed
      let tokenStr = token;
      try {
        if (typeof token === "string" && (token.startsWith('"') || token.startsWith("{"))) {
          tokenStr = JSON.parse(token);
        }
      } catch (e) {
        console.error(e);
      }

      const response = await apiConnector("GET", GetMyOrgData, null, {
        Authorization: `Bearer ${tokenStr}`
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch organizer details");
      }

      const data = response.data.data;
      // console.log("Organizer data fetched:", data);

      // Update Redux state
      dispatch(setStatus(data.status || "pending"));
      dispatch(setAttempts(data.attempts ?? 0));
      dispatch(setEditUntil(data.editUntil ?? ""));

      // If rejected, store the rejected data with role-specific data
      if (data.status === "rejected" && data.organizerData) {
        const rejectedData = {
          ...data.organizerData,
          directorFresherData: data.directorFresher,
          directorExperienceData: data.directorExperience,
          producerFresherData: data.producerFresher,
          producerExperienceData: data.producerExperience
        };
        dispatch(setRejectedData(rejectedData));
      } else {
        dispatch(setRejectedData(null));
      }

      return { success: true, data: data };
    } catch (error) {
      console.error("Error fetching organizer details:", error);
      toast.error(error.message || "Failed to fetch organizer details");
      return { success: false, error: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };
}

