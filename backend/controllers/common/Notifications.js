const Notification = require('../../models/Notification')

exports.GetNotifications = async (req, res) => {
    try {
        const userId = req.USER.id
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100)
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(limit).lean()
        const unreadCount = await Notification.countDocuments({ user: userId, readAt: null })
        return res.status(200).json({ success: true, data: notifications, unreadCount })
    } catch (error) {
        console.error('GetNotifications error:', error)
        return res.status(500).json({ success: false, message: 'Unable to load notifications' })
    }
}

exports.MarkNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.USER.id, readAt: null },
            { $set: { readAt: new Date() } },
            { new: true }
        )
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' })
        return res.status(200).json({ success: true, data: notification })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Unable to update notification' })
    }
}

exports.MarkAllNotificationsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany({ user: req.USER.id, readAt: null }, { $set: { readAt: new Date() } })
        return res.status(200).json({ success: true, updated: result.modifiedCount })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Unable to update notifications' })
    }
}
