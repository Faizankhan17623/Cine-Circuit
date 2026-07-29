const USER = require('../../models/user')
const Show = require('../../models/CreateShow')
const Theatres = require('../../models/Theatres')
const Payment = require('../../models/payment')
const Conversation = require('../../models/Conversation')
const ChatMessage = require('../../models/ChatMessage')

const CONTEXT_TYPE_BY_CATEGORY = {
    Organizer: 'Show',
    Theatre: 'Theatre',
    Admin: 'Support'
}

// Resolves the single staff User that should be paired with the viewer for a
// given category + contextId, and verifies the viewer actually has a
// successful booking that justifies opening this conversation.
async function resolveStaffAndVerifyContext(category, contextId, viewerId) {
    if (category === 'Organizer') {
        const show = await Show.findById(contextId)
        if (!show) return { error: 'Show not found' }

        const hasBooking = await Payment.exists({
            userid: String(viewerId),
            showid: String(contextId),
            Payment_Status: 'success'
        })
        if (!hasBooking) return { error: 'You can only message the organizer of a show you have booked' }

        const organizer = await USER.findOne({ showsCreated: contextId, usertype: 'Organizer' }).select('_id')
        if (!organizer) return { error: 'Organizer for this show could not be found' }

        return { staffId: organizer._id }
    }

    if (category === 'Theatre') {
        const theatre = await Theatres.findById(contextId)
        if (!theatre) return { error: 'Theatre not found' }

        const hasBooking = await Payment.exists({
            userid: String(viewerId),
            theatreid: String(contextId),
            Payment_Status: 'success'
        })
        if (!hasBooking) return { error: 'You can only message a theatre you have booked at' }

        if (!theatre.Owner) return { error: 'Owner for this theatre could not be found' }

        return { staffId: theatre.Owner }
    }

    // Admin: no single staff owner — shared support inbox
    return { staffId: null }
}

exports.StartConversation = async (req, res) => {
    try {
        const viewerId = req.USER.id
        const viewer = await USER.findById(viewerId)

        if (!viewer) {
            return res.status(404).json({ message: 'User not found', success: false })
        }
        if (viewer.usertype !== 'Viewer') {
            return res.status(403).json({ message: 'Only viewers can start a new conversation', success: false })
        }

        const { category, contextId } = req.body

        if (!category || !['Organizer', 'Theatre', 'Admin'].includes(category)) {
            return res.status(400).json({ message: 'A valid category is required', success: false })
        }
        if (category !== 'Admin' && !contextId) {
            return res.status(400).json({ message: 'contextId is required for this category', success: false })
        }

        const contextType = CONTEXT_TYPE_BY_CATEGORY[category]

        const resolution = await resolveStaffAndVerifyContext(category, contextId, viewerId)
        if (resolution.error) {
            return res.status(400).json({ message: resolution.error, success: false })
        }

        const existing = await Conversation.findOne({
            viewer: viewerId,
            category,
            contextId: category === 'Admin' ? null : contextId
        })

        if (existing) {
            return res.status(200).json({ message: 'Conversation already exists', success: true, data: existing })
        }

        const participants = category === 'Admin'
            ? [viewerId]
            : [viewerId, resolution.staffId]

        const conversation = await Conversation.create({
            participants,
            viewer: viewerId,
            staff: resolution.staffId,
            category,
            contextType,
            contextId: category === 'Admin' ? null : contextId
        })

        return res.status(201).json({ message: 'Conversation started', success: true, data: conversation })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'There is an error in starting the conversation', success: false })
    }
}

exports.GetConversations = async (req, res) => {
    try {
        const userId = req.USER.id
        const user = await USER.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }

        const filter = user.usertype === 'Administrator'
            ? { $or: [{ category: 'Admin' }, { staff: userId }, { viewer: userId }] }
            : { $or: [{ viewer: userId }, { staff: userId }] }

        const conversations = await Conversation.find(filter)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .populate('viewer', 'userName image')
            .populate('staff', 'userName image')

        return res.status(200).json({ message: 'Conversations fetched', success: true, data: conversations })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'There is an error in fetching conversations', success: false })
    }
}

async function assertMembership(conversationId, userId, usertype) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) return null

    if (String(conversation.viewer) === String(userId)) return conversation
    if (conversation.staff && String(conversation.staff) === String(userId)) return conversation
    if (conversation.category === 'Admin' && usertype === 'Administrator') return conversation

    return null
}

exports.GetMessages = async (req, res) => {
    try {
        const userId = req.USER.id
        const user = await USER.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }

        const { conversationId } = req.params
        const { before, limit } = req.query

        const conversation = await assertMembership(conversationId, userId, user.usertype)
        if (!conversation) {
            return res.status(403).json({ message: 'You are not part of this conversation', success: false })
        }

        const query = { conversation: conversationId }
        if (before) {
            query.createdAt = { $lt: new Date(before) }
        }

        const pageSize = Math.min(parseInt(limit, 10) || 50, 100)

        const messages = await ChatMessage.find(query)
            .sort({ createdAt: -1 })
            .limit(pageSize)

        return res.status(200).json({ message: 'Messages fetched', success: true, data: messages.reverse() })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'There is an error in fetching messages', success: false })
    }
}

exports.MarkRead = async (req, res) => {
    try {
        const userId = req.USER.id
        const user = await USER.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }

        const { conversationId } = req.params
        const conversation = await assertMembership(conversationId, userId, user.usertype)
        if (!conversation) {
            return res.status(403).json({ message: 'You are not part of this conversation', success: false })
        }

        await ChatMessage.updateMany(
            { conversation: conversationId, sender: { $ne: userId }, readAt: null },
            { $set: { readAt: new Date() } }
        )

        const isViewer = String(conversation.viewer) === String(userId)
        if (isViewer) {
            conversation.unreadForViewer = 0
        } else {
            conversation.unreadForStaff = 0
        }
        await conversation.save()

        return res.status(200).json({ message: 'Marked as read', success: true, data: conversation })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'There is an error in marking messages as read', success: false })
    }
}
