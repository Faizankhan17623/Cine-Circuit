const mongoose = require('mongoose')

const BugReportSchema = new mongoose.Schema(
    {
        bugId: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                type: String, // Cloudinary URLs
            },
        ],
        videos: [
            {
                type: String, // Cloudinary URLs
            },
        ],
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open',
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        adminNote: {
            type: String,
            default: '',
            trim: true,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
)

// "My reports" + admin queue
BugReportSchema.index({ reportedBy: 1 })
BugReportSchema.index({ status: 1 })

module.exports = mongoose.model('BugReport', BugReportSchema)
