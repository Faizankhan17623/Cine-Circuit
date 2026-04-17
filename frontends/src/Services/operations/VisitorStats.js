import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { AdminStatsApi } from "../Apis/AdminApi"

const { GetVisitorStats } = AdminStatsApi

export function FetchVisitorStats(token, page = 1) {
    return async () => {
        try {
            const params = new URLSearchParams({ page, limit: 20 })
            const url = `${GetVisitorStats}?${params.toString()}`
            const response = await apiConnector("GET", url, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch visitor stats")
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("FetchVisitorStats error:", error)
            toast.error("Failed to fetch visitor stats")
            return { success: false, data: null }
        }
    }
}
