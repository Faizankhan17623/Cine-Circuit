const mongoose = require('mongoose')

// One document per invited user — created at signup when a referral code is entered,
// and completed once that user finishes their first paid booking.
const referralSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    referee: {
        // The invited user — one referral per invited user, enforced by the unique index
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        uppercase: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    referrerReward: {
        type: Number,
        default: 0
    },
    refereeReward: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: null
    },
    // The booking that unlocked the reward
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payment',
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('Referral', referralSchema)
