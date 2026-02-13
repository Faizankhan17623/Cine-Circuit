import toast from "react-hot-toast";
import { cast } from '../Apis/CreateShowApi'
import { apiConnector } from '../apiConnector'
import { setCastList, setCastLoading } from '../../Slices/CastSlice'

const { CreateCast, updateCastname, updatecastimage, deletecast, getwholecastlist, FindSingleCast } = cast

// Get All Cast
export function GetAllCast(token, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        dispatch(setCastLoading(true))
        try {
            const response = await apiConnector("GET", getwholecastlist, null, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch cast")
            }

            dispatch(setCastList(response.data.data))
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error fetching cast:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to fetch cast")
            return { success: false, error: error.message }
        } finally {
            dispatch(setCastLoading(false))
        }
    }
}

// Create Cast (with image)
export function CreateNewCast(token, name, imageFile, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Creating cast member...")
        dispatch(setCastLoading(true))

        try {
            const formData = new FormData()
            formData.append("name", name)
            if (imageFile) {
                formData.append("image", imageFile)
            }

            const response = await apiConnector("POST", CreateCast, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to create cast member")
            }

            toast.success("Cast member created successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error creating cast:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to create cast member")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setCastLoading(false))
        }
    }
}

// Update Cast Name
export function UpdateCastName(token, id, newname, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating cast name...")
        dispatch(setCastLoading(true))

        try {
            const response = await apiConnector("PUT", updateCastname, { id, newname }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update cast name")
            }

            toast.success("Cast name updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating cast name:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update cast name")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setCastLoading(false))
        }
    }
}

// Update Cast Image
export function UpdateCastImage(token, id, imageFile, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Updating cast image...")
        dispatch(setCastLoading(true))

        try {
            const formData = new FormData()
            formData.append("id", id)
            formData.append("image", imageFile)

            const response = await apiConnector("PUT", updatecastimage, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update cast image")
            }

            toast.success("Cast image updated successfully")
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error updating cast image:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to update cast image")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setCastLoading(false))
        }
    }
}

// Delete Cast
export function DeleteCast(token, id, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        const ToastId = toast.loading("Deleting cast member...")
        dispatch(setCastLoading(true))

        try {
            const response = await apiConnector("DELETE", deletecast, { id }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete cast member")
            }

            toast.success("Cast member deleted successfully")
            return { success: true }
        } catch (error) {
            console.error("Error deleting cast:", error)
            toast.error(error?.response?.data?.message || error.message || "Failed to delete cast member")
            return { success: false, error: error.message }
        } finally {
            toast.dismiss(ToastId)
            dispatch(setCastLoading(false))
        }
    }
}

// Find Single Cast
export function FindCastByName(token, CastName, navigate) {
    return async (dispatch) => {
        if (!token) {
            navigate("/Login")
            toast.error("Token expired. Please login again")
            return { success: false }
        }

        try {
            const response = await apiConnector("GET", FindSingleCast, { CastName }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message || "Cast member not found")
            }

            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("Error finding cast:", error)
            return { success: false, error: error.message }
        }
    }
}
