const BugReport = require('../../models/BugReport')
const USER = require('../../models/user')
const mailSenders = require('../../utils/mailsender')
const bugResolvedTemplate = require('../../templates/userTemplates/bugResolvedTemplate')
const logAudit = require('../../utils/logAudit')

// GET /Bug-Reports — admin only
const GetAllBugReports = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query

        const filter = {}
        if (status && ['open', 'in-progress', 'resolved'].includes(status)) {
            filter.status = status
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [reports, total] = await Promise.all([
            BugReport.find(filter)
                .populate('reportedBy', 'userName email usertype')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            BugReport.countDocuments(filter),
        ])

        return res.status(200).json({
            success: true,
            data: reports,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        })
    } catch (error) {
        console.log('GetAllBugReports error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// PUT /Update-Bug-Status — admin only
const UpdateBugStatus = async (req, res) => {
    try {
        const { bugReportId, status, adminNote } = req.body

        if (!bugReportId) {
            return res.status(400).json({ success: false, message: 'Bug report ID is required' })
        }
        if (!status || !['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Valid status is required (open, in-progress, resolved)' })
        }

        const bugReport = await BugReport.findById(bugReportId).populate('reportedBy', 'userName email')
        if (!bugReport) {
            return res.status(404).json({ success: false, message: 'Bug report not found' })
        }

        const updateData = { status }
        if (adminNote !== undefined) {
            updateData.adminNote = adminNote.trim()
        }
        if (status === 'resolved') {
            updateData.resolvedAt = new Date()
        }

        const updated = await BugReport.findByIdAndUpdate(bugReportId, updateData, { new: true })
            .populate('reportedBy', 'userName email usertype')

        // Send resolution email to user
        if (status === 'resolved' && bugReport.reportedBy?.email) {
            try {
                await mailSenders(
                    bugReport.reportedBy.email,
                    `Your Bug Report ${bugReport.bugId} Has Been Resolved | Cine Circuit`,
                    bugResolvedTemplate(
                        bugReport.bugId,
                        bugReport.title,
                        adminNote || '',
                        bugReport.reportedBy.userName
                    )
                )
            } catch (emailErr) {
                console.log('Bug resolved email failed:', emailErr.message)
            }
        }

        await logAudit(req, {
            action: 'UPDATE',
            resource: 'BugReport',
            resourceId: bugReportId,
            before: { status: bugReport.status, adminNote: bugReport.adminNote },
            after:  { status, adminNote: updateData.adminNote ?? bugReport.adminNote },
        })

        return res.status(200).json({
            success: true,
            message: `Bug report status updated to "${status}"`,
            data: updated,
        })
    } catch (error) {
        console.log('UpdateBugStatus error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { GetAllBugReports, UpdateBugStatus }
