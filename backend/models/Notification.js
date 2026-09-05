const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['booking', 'payment', 'show', 'theatre', 'account', 'system', 'chat'], default: 'system' },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    link: { type: String, default: null, maxlength: 300 },
    readAt: { type: Date, default: null, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true })

notificationSchema.index({ user: 1, createdAt: -1 })
notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
