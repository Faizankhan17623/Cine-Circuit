const MaintenanceModel = require('../../models/Maintenance')
const User = require('../../models/user')
const mailSenders = require('../../utils/mailsender')
const maintenanceTemplate = require('../../templates/userTemplates/maintenanceTemplate')

// GET /Maintenance-Status — public, no auth needed
const GetMaintenance = async (req, res) => {
    try {
        let record = await MaintenanceModel.findOne()
        if (!record) {
            record = await MaintenanceModel.create({})
        }
        return res.status(200).json({
            success: true,
            data: {
                isActive: record.isActive,
                message: record.message,
                endTime: record.endTime,
            }
        })
    } catch (error) {
        console.log("GetMaintenance error:", error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

// PUT /Set-Maintenance — admin only
const SetMaintenance = async (req, res) => {
    try {
        const { isActive, message, endTime, notifyUsers } = req.body

        if (isActive === undefined) {
            return res.status(400).json({ success: false, message: "isActive is required" })
        }

        let record = await MaintenanceModel.findOne()
        if (!record) {
            record = new MaintenanceModel()
        }

        record.isActive = isActive
        record.message = message || record.message
        record.endTime = endTime ? new Date(endTime) : null
        record.updatedAt = new Date()
        await record.save()

        // Send email blast to all users if notifyUsers is true
        if (notifyUsers && isActive) {
            const users = await User.find({}, 'email')
            const emailPromises = users.map(u =>
                mailSenders(
                    u.email,
                    "Scheduled Maintenance — Cine Circuit",
                    maintenanceTemplate({ message: record.message, endTime: record.endTime })
                ).catch(err => console.log(`Failed to send to ${u.email}:`, err.message))
            )
            await Promise.all(emailPromises)
        }

        return res.status(200).json({
            success: true,
            message: isActive
                ? "Maintenance mode activated" + (notifyUsers ? " and users notified" : "")
                : "Maintenance mode deactivated",
            data: {
                isActive: record.isActive,
                message: record.message,
                endTime: record.endTime,
            }
        })
    } catch (error) {
        console.log("SetMaintenance error:", error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = { GetMaintenance, SetMaintenance }
