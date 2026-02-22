import { apiConnector } from "../apiConnector"
import { MaintenanceApi } from "../Apis/AdminApi"
import { MaintenanceStatus } from "../Apis/UserApi"
import { setMaintenance } from "../../Slices/maintenanceSlice"
import toast from "react-hot-toast"

// Called on app load — fetches current maintenance status
export const fetchMaintenanceStatus = () => async (dispatch) => {
    try {
        const response = await apiConnector("GET", MaintenanceStatus.status)
        if (response?.data?.success) {
            dispatch(setMaintenance(response.data.data))
        }
    } catch (error) {
        // Silent fail — don't block the app if maintenance check fails
        console.log("Maintenance status check failed:", error?.message)
    }
}

// Admin: toggle maintenance mode
export const toggleMaintenance = (payload, token) => async (dispatch) => {
    const toastId = toast.loading("Updating maintenance mode...")
    try {
        const response = await apiConnector(
            "PUT",
            MaintenanceApi.SetMaintenance,
            payload,
            { Authorization: `Bearer ${token}` }
        )
        if (response?.data?.success) {
            dispatch(setMaintenance(response.data.data))
            toast.success(response.data.message, { id: toastId })
            return true
        } else {
            toast.error(response?.data?.message || "Failed", { id: toastId })
            return false
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Server error", { id: toastId })
        return false
    }
}
