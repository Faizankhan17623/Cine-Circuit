const mongoose = require('mongoose')

// One wallet document per user — balance in rupees, transactions kept as an embedded log
// so the whole history is available in a single query (mirrors how Payment stores everything inline).
const walletTransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        enum: ['cancellation_refund', 'loyalty_redemption', 'booking_payment', 'admin_adjustment'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    referenceId: {
        // e.g. the Payment/_id this transaction relates to
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { _id: true, timestamps: true })

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [walletTransactionSchema]
}, { timestamps: true })

module.exports = mongoose.model('Wallet', walletSchema)
