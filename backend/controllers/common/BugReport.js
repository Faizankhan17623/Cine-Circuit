const BugReport = require('../../models/BugReport')
const USER = require('../../models/user')
const { uploadDatatoCloudinary } = require('../../utils/imageUploader')
const mailSenders = require('../../utils/mailsender')
const bugReportSubmittedTemplate = require('../../templates/userTemplates/bugReportSubmittedTemplate')

const generateBugId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = 'BUG-'
    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }
    return id
}

// POST /Report-Bug — any logged-in user
const ReportBug = async (req, res) => {
    try {
        const { title, description } = req.body
        const userId = req.USER.id

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: 'Bug title is required' })
        }
        if (!description || !description.trim()) {
            return res.status(400).json({ success: false, message: 'Bug description is required' })
        }

        const user = await USER.findById(userId).select('email userName')
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        // Upload images
        const imageUrls = []
        if (req.files && req.files.images) {
            const imagesRaw = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images]

            for (const img of imagesRaw) {
                const uploaded = await uploadDatatoCloudinary(img, 'bug-reports/images')
                imageUrls.push(uploaded.secure_url)
            }
        }

        // Upload videos
        const videoUrls = []
        if (req.files && req.files.videos) {
            const videosRaw = Array.isArray(req.files.videos)
                ? req.files.videos
                : [req.files.videos]

            for (const vid of videosRaw) {
                const uploaded = await uploadDatatoCloudinary(vid, 'bug-reports/videos')
                videoUrls.push(uploaded.secure_url)
            }
        }

        // Generate unique bugId (retry if collision)
        let bugId
        let attempts = 0
        while (attempts < 5) {
            bugId = generateBugId()
            const existing = await BugReport.findOne({ bugId })
            if (!existing) break
            attempts++
        }

        const bugReport = await BugReport.create({
            bugId,
            title: title.trim(),
            description: description.trim(),
            images: imageUrls,
            videos: videoUrls,
            reportedBy: userId,
        })

        // Send confirmation email
        try {
            await mailSenders(
                user.email,
                `Bug Report Received — ${bugId} | Cine Circuit`,
                bugReportSubmittedTemplate(bugId, title.trim(), description.trim(), user.userName)
            )
        } catch (emailErr) {
            console.log('Bug report email failed:', emailErr.message)
        }

        return res.status(201).json({
            success: true,
            message: 'Bug report submitted successfully',
            data: {
                bugId: bugReport.bugId,
                title: bugReport.title,
                status: bugReport.status,
                createdAt: bugReport.createdAt,
            },
        })
    } catch (error) {
        console.log('ReportBug error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /My-Bug-Reports — any logged-in user
const GetMyBugReports = async (req, res) => {
    try {
        const userId = req.USER.id

        const reports = await BugReport.find({ reportedBy: userId })
            .select('bugId title description status images videos adminNote createdAt resolvedAt')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: reports,
        })
    } catch (error) {
        console.log('GetMyBugReports error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { ReportBug, GetMyBugReports }
