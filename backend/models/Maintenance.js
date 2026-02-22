const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: "We are currently performing scheduled maintenance."
    },
    endTime: {
        type: Date,
        default: null
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Maintenance', maintenanceSchema)
