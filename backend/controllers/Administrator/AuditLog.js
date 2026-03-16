const AuditLog = require('../../models/AuditLog')
const logAudit  = require('../../utils/logAudit')

// GET /Audit-Logs — admin only
// Query params: action, resource, userId, status, dateFrom, dateTo, page, limit
const GetAuditLogs = async (req, res) => {
    try {
        const {
            action, resource, userId, status,
            dateFrom, dateTo,
            page  = 1,
            limit = 30,
        } = req.query

        const filter = {}
        if (action)   filter.action   = action
        if (resource) filter.resource = resource
        if (userId)   filter.userId   = userId
        if (status)   filter.status   = status

        if (dateFrom || dateTo) {
            filter.createdAt = {}
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom)
            if (dateTo)   filter.createdAt.$lte = new Date(dateTo)
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [logs, total] = await Promise.all([
            AuditLog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            AuditLog.countDocuments(filter),
        ])

        return res.status(200).json({
            success: true,
            data: logs,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        })
    } catch (error) {
        console.log('GetAuditLogs error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /Export-Audit-Log — admin only, returns CSV file
const ExportAuditLogCSV = async (req, res) => {
    try {
        const { action, resource, dateFrom, dateTo } = req.query

        const filter = {}
        if (action)   filter.action   = action
        if (resource) filter.resource = resource
        if (dateFrom || dateTo) {
            filter.createdAt = {}
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom)
            if (dateTo)   filter.createdAt.$lte = new Date(dateTo)
        }

        const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(5000).lean()

        // Build CSV
        const headers = ['Timestamp', 'User Email', 'User Type', 'Action', 'Resource', 'Resource ID', 'Endpoint', 'IP Address', 'Status']
        const rows = logs.map(l => [
            new Date(l.createdAt).toISOString(),
            l.userEmail,
            l.userType,
            l.action,
            l.resource,
            l.resourceId || '',
            l.endpoint,
            l.ipAddress,
            l.status,
        ])

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n')

        // Log the export action itself
        await logAudit(req, { action: 'EXPORT', resource: 'AuditLog', after: { filters: req.query } })

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="audit-log-${Date.now()}.csv"`)
        return res.status(200).send(csv)
    } catch (error) {
        console.log('ExportAuditLogCSV error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { GetAuditLogs, ExportAuditLogCSV }
