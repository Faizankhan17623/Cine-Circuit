// new update gaha par lageggnage wahe functino create kar ke usko usee kar lenga apun
import toast from "react-hot-toast";
import  {Orgaineser, Genre, SubGenre, Language, VerifiedUsers, UnverifiedUsers, VerifiedOrgainesers, UnverifiedOrgainesers, VerifiedTheatres, UnverifiedTheatres, ShowVerification,Theatre,TheatreVerification} from '../Apis/AdminApi'
import {apiConnector} from '../apiConnector'
import {setLoading} from '../../Slices/orgainezerSlice'
import {setAttempts,setStatus,setEditUntil,setRoleProfile,setRoleExperience,setRejectedData,setLockedUntill} from '../../Slices/orgainezerSlice'
const {Org_details,Org_verification,Org_delete,Org_deleteAll} = Orgaineser
import {setverification} from '../../Slices/ProfileSlice'
import {setVerifiedShows, setUnverifiedShows, setAdminAllShows, setlaoding, setVerifyingShowId, moveToVerified, moveToUnverified} from '../../Slices/ShowSlice'
import Loading from "../../Components/extra/Loading";
// import {setLoading} from '../../Slices/TheatreSlice'
// Show Verification API endpoints
const { VerifyShow, UnverifiedShows, VerifiedShows, AllShows: AdminAllShows } = ShowVerification
const {GetAllTheatres} = Theatre
const {Verify_Theatres} = TheatreVerification
export function GetAllOrgDetails (token,navigate){
    return async (dispatch) => {
        if(!token){
                                        navigate("/Login")
                                        toast.error("Token is Expired Please Create a new One")
                                    }
                                    
                                    const ToastId = toast.loading("Fetching user details, please wait...");
                                    dispatch(setLoading(true))
        
        try{
                                    
            const response = await apiConnector("GET", Org_details, null, {
                Authorization: `Bearer ${token}`
            });
            
          if (!response.data.success) {
                        throw new Error(response.data.message || "Failed to fetch user details");
                    }

            console.log("User details fetched successfully");
            // console.log("This is the response fro mthe get all orgs",response)

            const detail = response?.data?.data
            // console.log("This is the Detail",detail)
            if (!detail || !detail.organizersData) {
                throw new Error("Invalid response structure");
            }

             const organizer = detail.organizersData?.[0];

      const roleProfile =
        detail.directorExperience?.[0] ||
        detail.directorFresh?.[0] ||
        detail.producerExperience?.[0] ||
        detail.producerFresh?.[0] ||
        null;

      if (organizer) {
        dispatch(setAttempts(organizer.attempts ?? 0));
        dispatch(setStatus(organizer.status ?? "pending"));
        dispatch(setEditUntil(organizer.editUntil ?? ""));

        if (organizer.status === "rejected") {
          dispatch(setRejectedData(organizer));
        }
      }

      if (roleProfile) {
        dispatch(setRoleProfile(roleProfile));
      }

      toast.success("Organizer details loaded");
      return { success: true, data: detail };


        }catch(error){
              console.error("Error fetching org details:", error);
            toast.error(error.message || "Failed to fetch details");
            
            // ✅ FIX 7: Return error info
            return { 
                success: false, 
                error: error.message 
            };
        }finally{
              toast.dismiss(ToastId);
                        dispatch(setLoading(false));
        }
    }
}

export function VerifyOrgs (token,id, verify, date, time, status,navigate){
  // console.log(token,id,verify,date,time,status)
return async (dispatch)=>{
   if(!token){
                                        navigate("/Login")
                                        toast.error("Token is Expired Please Create a new One")
                                    }
                                    
                                    const ToastId = toast.loading("Verifing Orgainezer please wait...");
                                    dispatch(setLoading(true))


                                    try{
                                       const response = await apiConnector("PUT", Org_verification,
                                        {
                                          id:id,
                                          verify:Boolean(verify),
                                          ChangesDate:date,
                                          ChangesTime:time,
                                          verificationStatus:status
                                        },{
                Authorization: `Bearer ${token}`
            });
            
          if (!response.data.success) {
                        throw new Error(response.data.message || "Failed to fetch Org Details");
                    }

                    const orgData = response.data?.data;

                    if(status === "approved" && orgData){
                      dispatch(setverification(true))
                      dispatch(setAttempts(orgData.attempts ?? 0))
                      dispatch(setStatus(orgData.status))
                      dispatch(setEditUntil(orgData.editUntil))
                      dispatch(setRoleProfile(orgData.Role))
                      dispatch(setRoleExperience(orgData.ExperienceLevel))
                    }

                    if(status === "rejected" && orgData){
                      dispatch(setverification(false))
                      dispatch(setAttempts(orgData.attempts ?? 0))
                      dispatch(setStatus(orgData.status))
                      dispatch(setEditUntil(orgData.editUntil))
                    }

                    if(status === "locked" && orgData){
                      dispatch(setverification(false))
                      dispatch(setAttempts(orgData.attempts ?? 0))
                      dispatch(setStatus(orgData.status))
                      dispatch(setEditUntil(orgData.editUntil))
                      dispatch(setLockedUntill(orgData.lockedUntill))
                    }

                    // console.log(response)
                    console.log("Organizer date Verified succesfully");
                    return { success: true, data: response.data }
                                    }catch(error){
 console.error("Error Verifying the org details", error);
            toast.error(error.message || "Error in the verification");
            
            // ✅ FIX 7: Return error info
            return { 
                success: false, 
                error: error.message 
            };
                                    }finally{
                                    dispatch(setLoading(false))
              toast.dismiss(ToastId);

                                    }
}
}

export function deleteorgs(token,id,navigate){
  return async (dispatch)=>{
     if(!token){
        navigate("/Login")
        toast.error("Token is Expired Please Create a new One")
        return { success: false, error: "Token expired" }
     }

     const ToastId = toast.loading("Deleting organizer, please wait...");
     dispatch(setLoading(true))

    try{
      const response = await apiConnector("DELETE", Org_delete,
        {
          id:id
        },{
          Authorization: `Bearer ${token}`
        });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete orgs");
      }

      console.log("Organizer deleted successfully");
      toast.success("Organizer deleted successfully");
      return { success: true, data: response.data.data }

    }catch(error){
      console.error("Error Deleting ORgs", error);
      toast.error(error.message || "Error deleting organizer");
      return { success: false, error: error.message }
    }finally{
      dispatch(setLoading(false))
      toast.dismiss(ToastId);
    }
  }
}

export function deleteAllOrgs(token,ids,navigate){
  return async (dispatch)=>{
     if(!token){
        navigate("/Login")
        toast.error("Token is Expired Please Create a new One")
        return { success: false, error: "Token expired" }
     }

     if(!ids || !Array.isArray(ids) || ids.length < 1){
        toast.error("Please select at least one organizer to delete")
        return { success: false, error: "No organizers selected" }
     }

     const ToastId = toast.loading("Deleting all selected organizers, please wait...");
     dispatch(setLoading(true))

    try{
      const response = await apiConnector("DELETE", Org_deleteAll,
        {
          id:ids
        },{
          Authorization: `Bearer ${token}`
        });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete organizers");
      }

      console.log("All selected organizers deleted successfully");
      toast.success(`${response.data.deletedCount} organizer(s) deleted successfully`);
      return { success: true, deletedCount: response.data.deletedCount }

    }catch(error){
      console.error("Error Deleting All Orgs", error);
      toast.error(error.message || "Error deleting organizers");
      return { success: false, error: error.message }
    }finally{
      dispatch(setLoading(false))
      toast.dismiss(ToastId);
    }
  }
}

// ==================== GENRE OPERATIONS ====================

export function GetAllGenres(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }
    try {
      const [genreRes, subgenreRes] = await Promise.all([
        apiConnector("GET", Genre.GetAllGenres, null, { Authorization: `Bearer ${token}` }),
        apiConnector("GET", SubGenre.getAllgenre, null, { Authorization: `Bearer ${token}` })
      ])
      if (!genreRes.data.success) throw new Error(genreRes.data.message)
      const subMap = {}
      if (subgenreRes.data.success && subgenreRes.data.data) {
        subgenreRes.data.data.forEach(s => { subMap[s._id] = s })
      }
      const genres = genreRes.data.data.map(g => ({
        _id: g._id,
        genreName: g.genreName,
        subgeneres: (g.subgeneres || []).map(id => subMap[id] || { _id: id, name: 'Unknown' })
      }))
      return { success: true, data: genres }
    } catch (error) {
      console.error("Error fetching genres:", error)
      toast.error(error.message || "Failed to fetch genres")
      return { success: false }
    }
  }
}

export function CreateGenre(token, genrename, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Creating genre...")
    try {
      const response = await apiConnector("POST", Genre.CreateGenre, { genrename }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Genre created successfully")
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error creating genre:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to create genre")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

export function UpdateGenre(token, id, newName, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Updating genre...")
    try {
      const response = await apiConnector("PUT", Genre.UpdateGenre, { id, newName }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Genre updated successfully")
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error updating genre:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to update genre")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

export function DeleteGenre(token, id, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Deleting genre...")
    try {
      const response = await apiConnector("DELETE", Genre.DeleteGenre, { id }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Genre deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("Error deleting genre:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to delete genre")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

// ==================== SUBGENRE OPERATIONS ====================

export function CreateSubgenre(token, genreId, subgenrename, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Creating subgenre...")
    try {
      const response = await apiConnector("POST", SubGenre.CreateSubgenre, { id: genreId, subgenrename }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Subgenre created successfully")
      return { success: true }
    } catch (error) {
      console.error("Error creating subgenre:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to create subgenre")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

export function DeleteSubgenre(token, id, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Deleting subgenre...")
    try {
      const response = await apiConnector("DELETE", SubGenre.deletesubgenre, { id }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Subgenre deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("Error deleting subgenre:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to delete subgenre")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

// ==================== ALL USERS / ORGANIZERS / THEATRES ====================

export function GetAllVerifiedUsers(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", VerifiedUsers.VerifiedUsers, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching verified users:", error)
      return { success: false, data: [] }
    }
  }
}

export function GetAllUnverifiedUsers(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", UnverifiedUsers.UnverifiedUsers, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching unverified users:", error)
      return { success: false, data: [] }
    }
  }
}

export function GetAllVerifiedOrganizers(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", VerifiedOrgainesers.VerifiedOrgainesers, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching verified organizers:", error)
      return { success: false, data: [] }
    }
  }
}

export function GetAllUnverifiedOrganizers(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", UnverifiedOrgainesers.UnverifiedOrgainesers, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching unverified organizers:", error)
      return { success: false, data: [] }
    }
  }
}

export function GetAllVerifiedTheatres(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", VerifiedTheatres.VerifiedTheatres, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching verified theatres:", error)
      return { success: false, data: [] }
    }
  }
}

export function GetAllUnverifiedTheatres(token, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    try {
      const response = await apiConnector("GET", UnverifiedTheatres.UnverifiedTheatres, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching unverified theatres:", error)
      return { success: false, data: [] }
    }
  }
}

// ==================== LANGUAGE OPERATIONS ====================

export function GetAllLanguages(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }
    try {
      const response = await apiConnector("GET", Language.Getalllanguage, null, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching languages:", error)
      toast.error(error.message || "Failed to fetch languages")
      return { success: false }
    }
  }
}

export function CreateLanguageOp(token, langname, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Creating language...")
    try {
      const response = await apiConnector("POST", Language.CreateLanguage, { langname }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Language created successfully")
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error creating language:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to create language")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

export function UpdateLanguageOp(token, id, newname, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Updating language...")
    try {
      const response = await apiConnector("PUT", Language.UpdateLanguage, { id, newname }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Language updated successfully")
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error updating language:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to update language")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

export function DeleteLanguageOp(token, id, navigate) {
  return async (dispatch) => {
    if (!token) { navigate("/Login"); toast.error("Token expired"); return { success: false } }
    const ToastId = toast.loading("Deleting language...")
    try {
      const response = await apiConnector("DELETE", Language.deleteLanguage, { id }, { Authorization: `Bearer ${token}` })
      if (!response.data.success) throw new Error(response.data.message)
      toast.success("Language deleted successfully")
      return { success: true }
    } catch (error) {
      console.error("Error deleting language:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to delete language")
      return { success: false }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}

// ==================== SHOW VERIFICATION OPERATIONS ====================
// ya jo four hain inlo waha verifyshow main use karna hain 
// Get All Unverified Shows (Admin)
export function GetUnverifiedShows(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }

    dispatch(setlaoding(true))

    try {
      const response = await apiConnector("GET", UnverifiedShows, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch unverified shows")
      }

      dispatch(setUnverifiedShows(response.data.data || []))
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching unverified shows:", error)
      return { success: false, error: error.message, data: [] }
    } finally {
      dispatch(setlaoding(false))
    }
  }
}

// Get All Verified Shows (Admin)
export function GetVerifiedShowsAdmin(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }

    dispatch(setlaoding(true))

    try {
      const response = await apiConnector("GET", VerifiedShows, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch verified shows")
      }

      dispatch(setVerifiedShows(response.data.data || []))
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching verified shows:", error)
      return { success: false, error: error.message, data: [] }
    } finally {
      dispatch(setlaoding(false))
    }
  }
}

// Get All Shows (Admin)
export function GetAllShowsAdmin(token, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }

    dispatch(setlaoding(true))

    try {
      const response = await apiConnector("GET", AdminAllShows, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch all shows")
      }

      dispatch(setAdminAllShows(response.data.data || []))
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error("Error fetching all shows:", error)
      return { success: false, error: error.message, data: [] }
    } finally {
      dispatch(setlaoding(false))
    }
  }
}

// Verify a Show (Admin)
export function VerifyShowAdmin(token, showId, validation, navigate) {
  return async (dispatch) => {
    if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }

    dispatch(setVerifyingShowId(showId))
    const ToastId = toast.loading(validation ? "Verifying show..." : "Rejecting show...")

    try {
      const response = await apiConnector("PUT", `${VerifyShow}?id=${showId}`,
        { Validation: validation },
        { Authorization: `Bearer ${token}` }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to verify show")
      }

      // Update local state
      if (validation) {
        dispatch(moveToVerified(showId))
        toast.success("Show verified successfully!")
      } else {
        dispatch(moveToUnverified(showId))
        toast.success("Show rejected successfully!")
      }

      return { success: true, data: response.data.updatedShow }
    } catch (error) {
      console.error("Error verifying show:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to verify show")
      return { success: false, error: error.message }
    } finally {
      toast.dismiss(ToastId)
      dispatch(setVerifyingShowId(null))
    }
  }
}


export function GetAllTheatreDetails (token,navigate){
  return async (dispatch)=>{
     if (!token) {
      navigate("/Login")
      toast.error("Token is Expired Please Create a new One")
      return { success: false }
    }
      const ToastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try{
        const response = await apiConnector("GET", GetAllTheatres,null,{
                Authorization: `Bearer ${token}`
            }
      )
// console.log("Backend log",response)
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to verify show")
      }

      return { success: true, data: response }
    }catch(error){
         console.error("Error verifying show:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to verify show")
      return { success: false, error: error.message }
    }finally{
      dispatch(setLoading(false))
      toast.dismiss(ToastId)
    }
  }
}

export function VerifyTheatres(token, navigate, id, verification) {
  return async () => {
    // Validate token
    if (!token || token === "null" || token === "undefined") {
      console.error("VerifyTheatres: Token is missing or invalid", { token })
      return { success: false, reason: "NO_TOKEN", message: "Authentication token not found" }
    }

    // Validate id
    if (!id) {
      console.error("VerifyTheatres: Owner ID is missing")
      return { success: false, message: "Theatre owner ID is required" }
    }

    const ToastId = toast.loading(verification ? "Verifying theatre..." : "Rejecting theatre...")

    try {
      // console.log("VerifyTheatres API call:", {
      //   endpoint: Verify_Theatres,
      //   id,
      //   verification: Boolean(verification),
      //   tokenLength: token?.length
      // })

      const response = await apiConnector(
        "PUT",
        Verify_Theatres,
        { id: id, verify: Boolean(verification) },
        {
          Authorization: `Bearer ${token}`,
        }
      )

      // console.log("VerifyTheatres API response:", response?.data)

      if (!response.data?.success) {
        const errorMsg = response.data?.message || "Verification failed"
        toast.error(errorMsg)
        return {
          success: false,
          message: errorMsg,
        }
      }

      toast.success(verification ? "Theatre verified successfully!" : "Theatre rejected successfully!")
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error("VerifyTheatres API error:", error)
      const errorMsg = error?.response?.data?.message || error.message || "Server error occurred"
      toast.error(errorMsg)
      return {
        success: false,
        message: errorMsg,
      }
    } finally {
      toast.dismiss(ToastId)
    }
  }
}
