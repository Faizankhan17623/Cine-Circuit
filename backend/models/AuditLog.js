const mongoose = require('mongoose')

const AuditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null,
        },
        userEmail: {
            type: String,
            default: 'unknown',
        },
        userType: {
            type: String,
            default: 'unknown',
        },
        action: {
            type: String,
            required: true,
            // CREATE | UPDATE | DELETE | VERIFY | TOGGLE | LOGIN | LOGOUT | EXPORT
            enum: ['CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'TOGGLE', 'LOGIN', 'LOGOUT', 'EXPORT'],
        },
        resource: {
            type: String,
            required: true,
            // e.g. "Show", "BugReport", "Maintenance", "Genre", "Theatre", "User"
        },
        resourceId: {
            type: String,
            default: null,
        },
        changes: {
            before: { type: mongoose.Schema.Types.Mixed, default: null },
            after:  { type: mongoose.Schema.Types.Mixed, default: null },
        },
        ipAddress: {
            type: String,
            default: 'unknown',
        },
        userAgent: {
            type: String,
            default: 'unknown',
        },
        endpoint: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILED'],
            default: 'SUCCESS',
        },
    },
    { timestamps: true }
)

// Index for fast admin queries — filter by resource, action, user, date
AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ resource: 1, action: 1 })
AuditLogSchema.index({ userId: 1 })

module.exports = mongoose.model('AuditLog', AuditLogSchema)
