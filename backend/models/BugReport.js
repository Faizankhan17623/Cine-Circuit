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
            ref: 'user',
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

module.exports = mongoose.model('BugReport', BugReportSchema)
