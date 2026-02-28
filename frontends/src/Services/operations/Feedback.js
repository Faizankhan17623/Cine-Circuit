import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { FeedbackApi } from "../Apis/UserApi"

const { SubmitFeedback } = FeedbackApi

export async function submitFeedback(data) {
    const toastId = toast.loading("Sending message...")
    try {
        const response = await apiConnector("POST", SubmitFeedback, data)
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to send message")
        }
        toast.success("Message sent successfully!")
        return { success: true }
    } catch (error) {
        console.error("submitFeedback error:", error)
        toast.error(error?.response?.data?.message || "Failed to send message")
        return { success: false }
    } finally {
        toast.dismiss(toastId)
    }
}
