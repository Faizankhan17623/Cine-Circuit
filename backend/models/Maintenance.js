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
    }
}, { timestamps: true })

module.exports = mongoose.model('Maintenance', maintenanceSchema)
