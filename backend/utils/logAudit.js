const AuditLog = require('../models/AuditLog')
const USER = require('../models/user')

/**
 * logAudit — fire-and-forget audit logger.
 * Never throws — logging must NEVER break the main request flow.
 *
 * @param {Object} req          - Express request (for IP, userAgent, endpoint)
 * @param {Object} options
 *   @param {string}  action     - CREATE | UPDATE | DELETE | VERIFY | TOGGLE | LOGIN | LOGOUT | EXPORT
 *   @param {string}  resource   - "Show" | "BugReport" | "Maintenance" | "Genre" | "User" | etc.
 *   @param {string}  resourceId - MongoDB _id of the affected document (optional)
 *   @param {Object}  before     - State before the change (optional)
 *   @param {Object}  after      - State after the change (optional)
 *   @param {string}  status     - "SUCCESS" | "FAILED" (default SUCCESS)
 */
const logAudit = async (req, { action, resource, resourceId = null, before = null, after = null, status = 'SUCCESS' }) => {
    try {
        let userEmail = 'unknown'
        let userType  = 'unknown'
        const userId  = req.USER?.id || null

        // Fetch email + type from DB if we have a userId
        if (userId) {
            const found = await USER.findById(userId).select('email usertype').lean()
            if (found) {
                userEmail = found.email    || 'unknown'
                userType  = found.usertype || 'unknown'
            }
        }

        await AuditLog.create({
            userId,
            userEmail,
            userType,
            action,
            resource,
            resourceId: resourceId ? String(resourceId) : null,
            changes: { before, after },
            ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
            userAgent: req.headers?.['user-agent'] || 'unknown',
            endpoint:  `${req.method} ${req.originalUrl}`,
            status,
        })
    } catch (err) {
        // Intentionally silent — audit failure must never crash the API
        console.log('AuditLog write failed:', err.message)
    }
}

module.exports = logAudit
