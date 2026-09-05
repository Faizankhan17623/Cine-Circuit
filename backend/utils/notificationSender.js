const Notification = require('../models/Notification')

let io = null
const setNotificationIo = (socketIo) => { io = socketIo }

const notifyUser = async (userId, { type = 'system', title, message, link = null, metadata = {} }) => {
    if (!userId || !title || !message) return null
    const notification = await Notification.create({ user: userId, type, title, message, link, metadata })
    const payload = notification.toObject()
    if (io) io.to(`user:${String(userId)}`).emit('notification:new', payload)
    return payload
}

const notifyUsers = async (userIds, data) => {
    const uniqueIds = [...new Set((userIds || []).map(String))]
    return Promise.all(uniqueIds.map(id => notifyUser(id, data).catch(error => {
        console.error('Notification delivery failed:', error.message)
        return null
    })))
}

module.exports = { setNotificationIo, notifyUser, notifyUsers }
