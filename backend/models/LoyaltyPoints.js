const mongoose = require('mongoose')

// One document per user — mirrors Wallet.js structure (balance + embedded log)
const loyaltyTransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['earn', 'redeem'],
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        enum: ['booking_payment', 'redemption', 'admin_adjustment'],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    pointsAfter: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { _id: true, timestamps: true })

const loyaltyPointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [loyaltyTransactionSchema]
}, { timestamps: true })

module.exports = mongoose.model('LoyaltyPoints', loyaltyPointsSchema)
