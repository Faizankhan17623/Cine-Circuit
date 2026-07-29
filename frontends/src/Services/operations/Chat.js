import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { ChatApi } from "../Apis/ChatApi"
import { setConversations, upsertConversation, setMessages, setChatLoading } from "../../Slices/chatSlice"

export function startConversation(category, contextId, token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", ChatApi.StartConversation, { category, contextId }, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to start conversation")
            }
            dispatch(upsertConversation(response.data.data))
            return { success: true, data: response.data.data }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not start this conversation")
            return { success: false }
        }
    }
}

export function fetchConversations(token) {
    return async (dispatch) => {
        dispatch(setChatLoading(true))
        try {
            const response = await apiConnector("GET", ChatApi.Conversations, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch conversations")
            }
            dispatch(setConversations(response.data.data))
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("fetchConversations error:", error)
            return { success: false, data: [] }
        } finally {
            dispatch(setChatLoading(false))
        }
    }
}

export function fetchMessages(conversationId, token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("GET", ChatApi.Messages(conversationId), null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch messages")
            }
            dispatch(setMessages({ conversationId, messages: response.data.data }))
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("fetchMessages error:", error)
            return { success: false, data: [] }
        }
    }
}

export function markConversationRead(conversationId, token) {
    return async (dispatch) => {
        try {
            await apiConnector("PUT", ChatApi.MarkRead(conversationId), null, {
                Authorization: `Bearer ${token}`,
            })
        } catch (error) {
            console.error("markConversationRead error:", error)
        }
    }
}
