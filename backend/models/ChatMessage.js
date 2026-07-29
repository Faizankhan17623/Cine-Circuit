const mongoose = require('mongoose')

const ChatMessageSchema = new mongoose.Schema({
    conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole:{
        type: String,
        required: true,
        enum: ['Viewer', 'Organizer', 'Theatrer', 'Administrator']
    },
    body:{
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    readAt:{
        type: Date,
        default: null
    }
},{timestamps:true})

ChatMessageSchema.index({ conversation: 1, createdAt: 1 })

module.exports = mongoose.model('ChatMessage', ChatMessageSchema)
