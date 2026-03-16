import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { AuditLogApi } from "../Apis/AdminApi"

const { GetAuditLogs, ExportAuditLogCSV } = AuditLogApi

export function FetchAuditLogs(token, filters = {}, page = 1) {
    return async () => {
        try {
            const params = new URLSearchParams({ page })
            if (filters.action)   params.append("action",   filters.action)
            if (filters.resource) params.append("resource", filters.resource)
            if (filters.status)   params.append("status",   filters.status)
            if (filters.dateFrom) params.append("dateFrom", filters.dateFrom)
            if (filters.dateTo)   params.append("dateTo",   filters.dateTo)

            const url = `${GetAuditLogs}?${params.toString()}`
            const response = await apiConnector("GET", url, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) throw new Error(response.data.message)
            return {
                success:    true,
                data:       response.data.data,
                total:      response.data.total,
                totalPages: response.data.totalPages,
            }
        } catch (error) {
            console.error("FetchAuditLogs error:", error)
            toast.error("Failed to fetch audit logs")
            return { success: false, data: [], total: 0, totalPages: 0 }
        }
    }
}

export function DownloadAuditLogCSV(token, filters = {}) {
    return async () => {
        const toastId = toast.loading("Preparing CSV export...")
        try {
            const params = new URLSearchParams()
            if (filters.action)   params.append("action",   filters.action)
            if (filters.resource) params.append("resource", filters.resource)
            if (filters.dateFrom) params.append("dateFrom", filters.dateFrom)
            if (filters.dateTo)   params.append("dateTo",   filters.dateTo)

            const url = `${ExportAuditLogCSV}?${params.toString()}`
            const response = await apiConnector("GET", url, null, {
                Authorization: `Bearer ${token}`,
            }, { responseType: "blob" })

            // Trigger browser download
            const blob = new Blob([response.data], { type: "text/csv" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `audit-log-${Date.now()}.csv`
            link.click()
            URL.revokeObjectURL(link.href)

            toast.success("CSV downloaded!")
            return { success: true }
        } catch (error) {
            console.error("DownloadAuditLogCSV error:", error)
            toast.error("Failed to export CSV")
            return { success: false }
        } finally {
            toast.dismiss(toastId)
        }
    }
}
