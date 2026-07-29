const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL + "/api/v1/Chat"

export const ChatApi = {
    StartConversation: BASE_URL + "/Start-Conversation",
    Conversations: BASE_URL + "/Conversations",
    Messages: (conversationId) => BASE_URL + "/Messages/" + conversationId,
    MarkRead: (conversationId) => BASE_URL + "/Mark-Read/" + conversationId,
}
