import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { BugReportApi } from "../Apis/UserApi"
import { BugReportAdminApi } from "../Apis/AdminApi"

const { ReportBug, MyBugReports } = BugReportApi
const { GetAllBugReports, UpdateBugStatus } = BugReportAdminApi

export function SubmitBugReport(formData, token, onSuccess) {
    return async () => {
        const toastId = toast.loading("Submitting bug report...")
        try {
            const response = await apiConnector("POST", ReportBug, formData, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to submit bug report")
            }
            toast.success("Bug report submitted! Check your email for details.")
            if (onSuccess) onSuccess(response.data.data)
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("SubmitBugReport error:", error)
            toast.error(error?.response?.data?.message || "Failed to submit bug report")
            return { success: false }
        } finally {
            toast.dismiss(toastId)
        }
    }
}

export function FetchMyBugReports(token) {
    return async () => {
        try {
            const response = await apiConnector("GET", MyBugReports, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch bug reports")
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("FetchMyBugReports error:", error)
            toast.error("Failed to fetch your bug reports")
            return { success: false, data: [] }
        }
    }
}

export function FetchAllBugReports(token, status = "", page = 1) {
    return async () => {
        try {
            const params = new URLSearchParams({ page })
            if (status) params.append("status", status)
            const url = `${GetAllBugReports}?${params.toString()}`
            const response = await apiConnector("GET", url, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch bug reports")
            }
            return { success: true, data: response.data.data, total: response.data.total, totalPages: response.data.totalPages }
        } catch (error) {
            console.error("FetchAllBugReports error:", error)
            toast.error("Failed to fetch bug reports")
            return { success: false, data: [], total: 0, totalPages: 0 }
        }
    }
}

export function ChangeBugStatus(bugReportId, status, adminNote, token, onSuccess) {
    return async () => {
        const toastId = toast.loading("Updating status...")
        try {
            const response = await apiConnector("PUT", UpdateBugStatus, { bugReportId, status, adminNote }, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update status")
            }
            toast.success(`Status updated to "${status}"`)
            if (onSuccess) onSuccess(response.data.data)
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("ChangeBugStatus error:", error)
            toast.error(error?.response?.data?.message || "Failed to update status")
            return { success: false }
        } finally {
            toast.dismiss(toastId)
        }
    }
}
