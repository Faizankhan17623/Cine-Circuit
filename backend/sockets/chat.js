const jwt = require('jsonwebtoken')
const USER = require('../models/user')
const Conversation = require('../models/Conversation')
const ChatMessage = require('../models/ChatMessage')

// Maps a User.usertype value to the role that participates in a conversation
const STAFF_CATEGORY_BY_USERTYPE = {
    Organizer: 'Organizer',
    Theatrer: 'Theatre',
    Administrator: 'Admin'
}

function userRoom(userId) {
    return `user:${userId}`
}

function conversationRoom(conversationId) {
    return `conv:${conversationId}`
}

// Verifies the socket's user is allowed to read/write this conversation.
// Returns the loaded conversation on success, or null on failure.
async function authorizeConversation(socket, conversationId) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) return null

    const { id, usertype } = socket.user

    if (String(conversation.viewer) === String(id)) return conversation
    if (conversation.staff && String(conversation.staff) === String(id)) return conversation
    if (conversation.category === 'Admin' && usertype === 'Administrator') return conversation

    return null
}

module.exports = function attachChatSocket(io) {
    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace('Bearer ', '')

            if (!token) return next(new Error('Token Missing'))

            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            if (!decoded?.id) return next(new Error('Invalid token'))

            const user = await USER.findById(decoded.id).select('_id usertype userName')
            if (!user) return next(new Error('User not found'))

            socket.user = { id: String(user._id), usertype: user.usertype, userName: user.userName }
            next()
        } catch (error) {
            next(new Error('Token is invalid'))
        }
    })

    io.on('connection', (socket) => {
        socket.join(userRoom(socket.user.id))

        socket.on('join_conversation', async (conversationId) => {
            try {
                const conversation = await authorizeConversation(socket, conversationId)
                if (!conversation) {
                    return socket.emit('chat_error', { message: 'You are not part of this conversation' })
                }
                socket.join(conversationRoom(conversationId))
            } catch (error) {
                socket.emit('chat_error', { message: 'Could not join conversation' })
            }
        })

        socket.on('leave_conversation', (conversationId) => {
            socket.leave(conversationRoom(conversationId))
        })

        socket.on('send_message', async ({ conversationId, body }) => {
            try {
                const text = (body || '').trim()
                if (!text) {
                    return socket.emit('chat_error', { message: 'Message cannot be empty' })
                }
                if (text.length > 2000) {
                    return socket.emit('chat_error', { message: 'Message is too long' })
                }

                const conversation = await authorizeConversation(socket, conversationId)
                if (!conversation) {
                    return socket.emit('chat_error', { message: 'You are not part of this conversation' })
                }

                const isViewerSender = socket.user.usertype === 'Viewer' && String(conversation.viewer) === socket.user.id

                if (isViewerSender && conversation.viewerPendingCount >= 1) {
                    return socket.emit('message_blocked', {
                        conversationId,
                        reason: 'Please wait for a reply before sending another message'
                    })
                }

                const message = await ChatMessage.create({
                    conversation: conversation._id,
                    sender: socket.user.id,
                    senderRole: socket.user.usertype,
                    body: text
                })

                conversation.lastMessage = text
                conversation.lastMessageAt = message.createdAt
                conversation.lastSender = socket.user.id

                if (isViewerSender) {
                    conversation.viewerPendingCount = 1
                    conversation.unreadForStaff += 1
                } else {
                    conversation.viewerPendingCount = 0
                    conversation.unreadForViewer += 1
                }

                await conversation.save()

                const payload = {
                    _id: message._id,
                    conversation: conversation._id,
                    sender: socket.user.id,
                    senderRole: socket.user.usertype,
                    body: text,
                    createdAt: message.createdAt
                }

                io.to(conversationRoom(conversationId)).emit('new_message', payload)

                // Notify the other side even if they haven't opened this conversation's room yet
                if (isViewerSender) {
                    if (conversation.category === 'Admin') {
                        const admins = await USER.find({ usertype: 'Administrator' }).select('_id')
                        admins.forEach(admin => io.to(userRoom(String(admin._id))).emit('conversation_updated', conversation))
                    } else if (conversation.staff) {
                        io.to(userRoom(String(conversation.staff))).emit('conversation_updated', conversation)
                    }
                } else {
                    io.to(userRoom(String(conversation.viewer))).emit('conversation_updated', conversation)
                }
            } catch (error) {
                console.log(error)
                socket.emit('chat_error', { message: 'Could not send message' })
            }
        })

        socket.on('mark_read', async (conversationId) => {
            try {
                const conversation = await authorizeConversation(socket, conversationId)
                if (!conversation) return

                const isViewer = socket.user.usertype === 'Viewer' && String(conversation.viewer) === socket.user.id

                await ChatMessage.updateMany(
                    { conversation: conversation._id, sender: { $ne: socket.user.id }, readAt: null },
                    { $set: { readAt: new Date() } }
                )

                if (isViewer) {
                    conversation.unreadForViewer = 0
                } else {
                    conversation.unreadForStaff = 0
                }
                await conversation.save()

                io.to(conversationRoom(conversationId)).emit('read_receipt', {
                    conversationId,
                    readBy: socket.user.id
                })
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('typing', (conversationId) => {
            socket.to(conversationRoom(conversationId)).emit('typing', { conversationId, userId: socket.user.id })
        })

        socket.on('stop_typing', (conversationId) => {
            socket.to(conversationRoom(conversationId)).emit('stop_typing', { conversationId, userId: socket.user.id })
        })
    })
}
