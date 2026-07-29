import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversations: [],
    activeConversationId: null,
    messagesByConversation: {},
    loading: false,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConversations(state, action) {
            state.conversations = action.payload
        },
        upsertConversation(state, action) {
            const incoming = action.payload
            const idx = state.conversations.findIndex(c => c._id === incoming._id)
            if (idx === -1) {
                state.conversations.unshift(incoming)
            } else {
                state.conversations[idx] = { ...state.conversations[idx], ...incoming }
            }
        },
        setActiveConversation(state, action) {
            state.activeConversationId = action.payload
        },
        setMessages(state, action) {
            const { conversationId, messages } = action.payload
            state.messagesByConversation[conversationId] = messages
        },
        appendMessage(state, action) {
            const message = action.payload
            const convId = message.conversation
            if (!state.messagesByConversation[convId]) {
                state.messagesByConversation[convId] = []
            }
            const alreadyExists = state.messagesByConversation[convId].some(m => m._id === message._id)
            if (!alreadyExists) {
                state.messagesByConversation[convId].push(message)
            }

            const conv = state.conversations.find(c => c._id === convId)
            if (conv) {
                conv.lastMessage = message.body
                conv.lastMessageAt = message.createdAt
                conv.lastSender = message.sender
            }
        },
        setChatLoading(state, action) {
            state.loading = action.payload
        },
        clearChat() {
            return initialState
        }
    }
})

export const {
    setConversations,
    upsertConversation,
    setActiveConversation,
    setMessages,
    appendMessage,
    setChatLoading,
    clearChat
} = chatSlice.actions

export default chatSlice.reducer
