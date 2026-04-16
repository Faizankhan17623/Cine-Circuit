const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['flat', 'percentage'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 1
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    // Only matters when discountType = 'percentage' — caps the discount in ₹
    maxDiscount: {
        type: Number,
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    // Array of userIds who used this coupon — one entry per use
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    // How many times a single user can use this coupon
    perUserLimit: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Coupon', couponSchema)
