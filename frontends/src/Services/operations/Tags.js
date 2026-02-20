import toast from "react-hot-toast";
import { tags } from '../Apis/CreateShowApi'
import { apiConnector } from '../apiConnector'
import { setTags, setTagsLoading } from '../../Slices/TagsSlice'

const { CreateTags, UpdateTagsname, DeleteTagsname, GetAlltags, SearchTags } = tags

// Get All Tags
export function GetAllTags(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        dispatch(setTagsLoading(true))
        try {
            const response = await apiConnector("GET", GetAlltags, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch tags")
            }

            dispatch(setTags(response.data.data))
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching tags:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch tags")
            return { success: false, error: error.message }
        } finally {
            dispatch(setTagsLoading(false))
        }
    }
}

// Create Tag
export function CreateTag(token, tagname, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Creating hashtag...")
        dispatch(setTagsLoading(true))

        try {
            // console.log("This is the tagname fro mthe frontend",tagname)
            const response = await apiConnector("POST", CreateTags, { name:tagname }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create hashtag")
            }

            toast.success("Hashtag created successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error creating hashtag:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to create hashtag")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setTagsLoading(false))
        }
    }
}


export function CreateHashtag(token, tagname, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Creating hashtag...")
        dispatch(setTagsLoading(true))

        try {
            const response = await apiConnector("POST", CreateTags, { name: tagname }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create hashtag")
            }

            toast.success("Hashtag created successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error creating hashtag:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to create hashtag")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setTagsLoading(false))
        }
    }
}
// Update Tag
export function UpdateTagName(token, id, newname, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating tag...")
        dispatch(setTagsLoading(true))

        try {
            const response = await apiConnector("PUT", UpdateTagsname, { id, newname }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update tag")
            }

            toast.success("Tag updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating tag:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update tag")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setTagsLoading(false))
        }
    }
}

// Delete Tag
export function DeleteTag(token, id, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Deleting tag...")
        dispatch(setTagsLoading(true))

        try {
            const response = await apiConnector("DELETE", DeleteTagsname, { id }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete tag")
            }

            toast.success("Tag deleted successfully")
            return { success: true }
        } catch (error) {
            console.error("Error deleting tag:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to delete tag")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setTagsLoading(false))
        }
    }
}

// Search Tags
export function SearchTagsByName(token, name, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", SearchTags, null, {
                Authorization: `Bearer ${token}`
            }, { name })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to search tags")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error searching tags:", error)
            return { success: false, error: error.message }
        }
    }
}
