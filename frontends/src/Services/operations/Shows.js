import toast from "react-hot-toast";
import { show, Uploading, language, Genres, SUBGENRE } from '../Apis/CreateShowApi'
import { GetAllSHowsDetails } from '../Apis/OranizaerApi'
import { apiConnector } from '../apiConnector'
import { setShow, setlaoding, setallShow } from '../../Slices/ShowSlice'

const { Getallshowsdetails,notuploaded,verifiedNotUploaded } = GetAllSHowsDetails

const {
    CreateShow,
    UpdateShowtitle,
    UpdateShowtagline,
    UpdateTitleImage,
    UpdateTitleTrailer,
    deleteShow,
    DeleteAllShow
} = show

const { Upload } = Uploading
const { GetLanguage, FindSingleLanguage } = language
const { genre: GenreEndpoint } = Genres
const { subgenre: SubgenreEndpoint } = SUBGENRE

// Create Show
export function CreateNewShow(token, showData, imageFile, trailerFile, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Creating show...")
        dispatch(setlaoding(true))

        try {
            const formData = new FormData()

            // Append all show data
            formData.append("title", showData.title)
            formData.append("tagline", showData.tagline)
            formData.append("releasedate", showData.releasedate)
            formData.append("genreid", showData.genreid)
            formData.append("subgenereid", showData.subgenereid)
            formData.append("languagename", showData.languagename)
            formData.append("directorname", showData.directorname)
            formData.append("producername", showData.producername)
            formData.append("writersname", showData.writersname)
            formData.append("totalbudget", showData.totalbudget)
            formData.append("Duration", showData.Duration)

            // Append cast IDs (array)
            if (showData.castid && showData.castid.length > 0) {
                showData.castid.forEach(id => {
                    formData.append("castid", id)
                })
            }

            // Append hashtag ID
            if (showData.hashid) {
                formData.append("hashid", showData.hashid)
            }

            // Append files
            if (imageFile) {
                formData.append("image", imageFile)
            }
            if (trailerFile) {
                formData.append("trailer", trailerFile)
            }

            const response = await apiConnector("POST", CreateShow, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create show")
            }

            toast.success("Show created successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error creating show:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to create show")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Update Show Title
export function UpdateShowTitle(token, id, newTitle, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating show title...")
        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("PUT", `${UpdateShowtitle}?id=${id}`, { newTitle }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update show title")
            }

            toast.success("Show title updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating show title:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update show title")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Update Show Tagline
export function UpdateShowTagline(token, Showid, newTagline, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating show tagline...")
        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("PUT", `${UpdateShowtagline}?Showid=${Showid}`, { newTagline }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update show tagline")
            }

            toast.success("Show tagline updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating show tagline:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update show tagline")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Update Show Title Image (Poster)
export function UpdateShowImage(token, id, imageFile, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating show image...")
        dispatch(setlaoding(true))

        try {
            const formData = new FormData()
            formData.append("newImage", imageFile)

            const response = await apiConnector("PUT", `${UpdateTitleImage}?id=${id}`, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update show image")
            }

            toast.success("Show image updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating show image:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update show image")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Update Show Trailer
export function UpdateShowTrailer(token, id, trailerFile, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating show trailer...")
        dispatch(setlaoding(true))

        try {
            const formData = new FormData()
            formData.append("newTrailer", trailerFile)

            const response = await apiConnector("PUT", `${UpdateTitleTrailer}?id=${id}`, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update show trailer")
            }

            toast.success("Show trailer updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating show trailer:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update show trailer")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Delete Single Show
export function DeleteSingleShow(token, showId, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Deleting show...")
        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("DELETE", `${deleteShow}?showId=${showId}`, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete show")
            }

            toast.success("Show deleted successfully")
            return { success: true }
        } catch (error) {
            console.error("Error deleting show:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to delete show")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Delete All Shows
export function DeleteAllShows(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Deleting all shows...")
        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("DELETE", DeleteAllShow, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete all shows")
            }

            dispatch(setallShow([]))
            toast.success("All shows deleted successfully")
            return { success: true }
        } catch (error) {
            console.error("Error deleting all shows:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to delete all shows")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Upload Show (Publish)
export function UploadShow(token, showId, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Publishing show...")
        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("PUT", `${Upload}?id=${showId}`, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to publish show")
            }

            toast.success("Show published successfully!")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error publishing show:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to publish show")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setlaoding(false))
        }
    }
}

// Get All Languages (from CreateShowApi)
export function GetAllLanguagesForShow(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", GetLanguage, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch languages")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching languages:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch languages")
            return { success: false, error: error.message }
        }
    }
}

// Find Single Language
export function FindLanguageByName(token, langname, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", FindSingleLanguage, { langname }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Language not found")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error finding language:", error)
            return { success: false, error: error.message }
        }
    }
}

// Get All Genres (from CreateShowApi)
export function GetAllGenresForShow(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", GenreEndpoint, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch genres")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching genres:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch genres")
            return { success: false, error: error.message }
        }
    }
}

// Get All Subgenres (from CreateShowApi)
export function GetAllSubgenresForShow(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", SubgenreEndpoint, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch subgenres")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching subgenres:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch subgenres")
            return { success: false, error: error.message }
        }
    }
}

// Get All Uploaded Shows (Organizer)
export function GetAllShows(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("GET", Getallshowsdetails, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch shows")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching all shows:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch shows")
            return { success: false, error: error.message }
        } finally {
            dispatch(setlaoding(false))
        }
    }
}

// Get Not Uploaded Shows (Organizer)
export function GetNotUploadedShows(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("GET", notuploaded, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch shows")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching not uploaded shows:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch shows")
            return { success: false, error: error.message }
        } finally {
            dispatch(setlaoding(false))
        }
    }
}

// Get Verified But Not Uploaded Shows (Ready to Upload)
export function GetVerifiedNotUploadedShows(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        dispatch(setlaoding(true))

        try {
            const response = await apiConnector("GET", verifiedNotUploaded, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch verified shows")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching verified not uploaded shows:", error)
            return { success: false, error: error.message, data: [] }
        } finally {
            dispatch(setlaoding(false))
        }
    }
}
