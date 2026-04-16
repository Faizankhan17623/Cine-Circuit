const Coupon = require('../../models/Coupon')

/**
 * Shared coupon validation logic — used by both the validate endpoint
 * and MakePayment (server-side re-check before charging).
 *
 * Returns { valid: true, coupon, discountAmount, finalAmount }
 *      or { valid: false, message }
 */
const applyCouponLogic = async (couponCode, totalAmount, userId) => {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() })

    if (!coupon) {
        return { valid: false, message: 'Coupon not found' }
    }
    if (!coupon.isActive) {
        return { valid: false, message: 'This coupon is no longer active' }
    }
    if (new Date() > new Date(coupon.expiryDate)) {
        return { valid: false, message: 'This coupon has expired' }
    }
    if (coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: 'This coupon has reached its usage limit' }
    }
    if (totalAmount < coupon.minOrderAmount) {
        return {
            valid: false,
            message: `Minimum order amount of ₹${coupon.minOrderAmount} required to use this coupon`
        }
    }

    // Per-user limit check
    if (userId) {
        const timesUsed = coupon.usedBy.filter(id => id.toString() === userId.toString()).length
        if (timesUsed >= coupon.perUserLimit) {
            return {
                valid: false,
                message: coupon.perUserLimit === 1
                    ? 'You have already used this coupon'
                    : `You have already used this coupon ${timesUsed} time(s)`
            }
        }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'flat') {
        discountAmount = coupon.discountValue
    } else {
        // percentage
        discountAmount = (totalAmount * coupon.discountValue) / 100
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount
        }
    }

    // Discount cannot exceed the total amount
    discountAmount = Math.min(discountAmount, totalAmount)
    const finalAmount = totalAmount - discountAmount

    return {
        valid: true,
        coupon,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100
    }
}

// POST /Validate-Coupon — logged-in viewer
const ValidateCoupon = async (req, res) => {
    try {
        const { couponCode, totalAmount } = req.body
        const userId = req.USER?.id

        if (!couponCode || !totalAmount) {
            return res.status(400).json({ success: false, message: 'couponCode and totalAmount are required' })
        }

        const amount = parseFloat(totalAmount)
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'totalAmount must be a positive number' })
        }

        const result = await applyCouponLogic(couponCode, amount, userId)

        if (!result.valid) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            discountAmount: result.discountAmount,
            finalAmount: result.finalAmount,
            couponCode: result.coupon.code,
            discountType: result.coupon.discountType,
            discountValue: result.coupon.discountValue
        })
    } catch (error) {
        console.log('ValidateCoupon error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { ValidateCoupon, applyCouponLogic }
