const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    viewer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Only set for category Organizer/Theatre — a single staff owner of the conversation.
    // Left null for category Admin, since any Administrator may participate.
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    category:{
        type: String,
        required: true,
        enum: ['Organizer', 'Theatre', 'Admin']
    },
    contextType:{
        type: String,
        required: true,
        enum: ['Show', 'Theatre', 'Support']
    },
    contextId:{
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    lastMessage:{
        type: String,
        default: null
    },
    lastMessageAt:{
        type: Date,
        default: null
    },
    lastSender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // 0 or 1 — a Viewer may have at most one unanswered message pending per conversation
    viewerPendingCount:{
        type: Number,
        default: 0
    },
    unreadForViewer:{
        type: Number,
        default: 0
    },
    unreadForStaff:{
        type: Number,
        default: 0
    }
},{timestamps:true})

ConversationSchema.index({ viewer: 1, category: 1, contextId: 1 })
ConversationSchema.index({ staff: 1 })
ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ category: 1 })

module.exports = mongoose.model('Conversation', ConversationSchema)
