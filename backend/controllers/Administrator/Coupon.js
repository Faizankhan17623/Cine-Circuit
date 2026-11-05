const Coupon = require('../../models/Coupon')
const logAudit = require('../../utils/logAudit')

// Returns an error message for an invalid discount, or null
const checkDiscount = (discountType, discountValue) => {
    if (!['flat', 'percentage'].includes(discountType)) return 'discountType must be flat or percentage'
    const value = Number(discountValue)
    if (!Number.isFinite(value) || value <= 0) return 'discountValue must be a number greater than 0'
    if (discountType === 'percentage' && value > 100) return 'Percentage discount must be between 1 and 100'
    return null
}

// The only coupon fields an admin may change; usedCount/usedBy/createdBy and unknown keys are ignored
const UPDATABLE_FIELDS = ['code', 'discountType', 'discountValue', 'minOrderAmount', 'maxDiscount', 'expiryDate', 'usageLimit', 'perUserLimit', 'isActive']

// POST /Create-Coupon — admin only
const CreateCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            expiryDate,
            usageLimit,
            perUserLimit
        } = req.body

        const adminId = req.USER?.id

        if (!code || !discountType || !discountValue || !expiryDate || !usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'code, discountType, discountValue, expiryDate and usageLimit are required'
            })
        }

        const discountError = checkDiscount(discountType, discountValue)
        if (discountError) {
            return res.status(400).json({ success: false, message: discountError })
        }

        const expiry = new Date(expiryDate)
        if (isNaN(expiry.getTime()) || expiry <= new Date()) {
            return res.status(400).json({ success: false, message: 'expiryDate must be a valid future date' })
        }

        // Check code uniqueness (model also enforces unique, but nicer error here)
        const existing = await Coupon.findOne({ code: code.toUpperCase().trim() })
        if (existing) {
            return res.status(409).json({ success: false, message: `Coupon code "${code.toUpperCase()}" already exists` })
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
            maxDiscount: (discountType === 'percentage' && maxDiscount) ? Number(maxDiscount) : null,
            expiryDate: expiry,
            usageLimit: Number(usageLimit),
            perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
            createdBy: adminId
        })

        await logAudit(req, {
            action: 'CREATE',
            resource: 'Coupon',
            resourceId: coupon._id,
            after: { code: coupon.code, discountType, discountValue }
        })

        return res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        })
    } catch (error) {
        console.log('CreateCoupon error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /Get-All-Coupons — admin only
const GetAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, isActive } = req.query

        const filter = {}
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true'
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const [coupons, total] = await Promise.all([
            Coupon.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('createdBy', 'userName email'),
            Coupon.countDocuments(filter)
        ])

        return res.status(200).json({
            success: true,
            data: coupons,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        })
    } catch (error) {
        console.log('GetAllCoupons error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// PUT /Update-Coupon — admin only
const UpdateCoupon = async (req, res) => {
    try {
        const { couponId } = req.body
        const updates = {}
        for (const key of UPDATABLE_FIELDS) {
            if (req.body[key] !== undefined) updates[key] = req.body[key]
        }

        if (!couponId) {
            return res.status(400).json({ success: false, message: 'couponId is required' })
        }

        const coupon = await Coupon.findById(couponId)
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' })
        }

        // Validate the discount the coupon will end up with, not just the fields sent
        const discountError = checkDiscount(updates.discountType ?? coupon.discountType, updates.discountValue ?? coupon.discountValue)
        if (discountError) {
            return res.status(400).json({ success: false, message: discountError })
        }

        // Prevent updating code to a duplicate
        if (updates.code) {
            updates.code = updates.code.toUpperCase().trim()
            const conflict = await Coupon.findOne({ code: updates.code, _id: { $ne: couponId } })
            if (conflict) {
                return res.status(409).json({ success: false, message: `Code "${updates.code}" is already taken` })
            }
        }

        // Validate expiry if provided
        if (updates.expiryDate) {
            const expiry = new Date(updates.expiryDate)
            if (isNaN(expiry.getTime())) {
                return res.status(400).json({ success: false, message: 'Invalid expiryDate' })
            }
            updates.expiryDate = expiry
        }

        const before = {
            code: coupon.code,
            isActive: coupon.isActive,
            discountValue: coupon.discountValue,
            expiryDate: coupon.expiryDate
        }

        const updated = await Coupon.findByIdAndUpdate(couponId, updates, { new: true, runValidators: true })

        await logAudit(req, {
            action: 'UPDATE',
            resource: 'Coupon',
            resourceId: couponId,
            before,
            after: { code: updated.code, isActive: updated.isActive, discountValue: updated.discountValue }
        })

        return res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: updated
        })
    } catch (error) {
        console.log('UpdateCoupon error:', error)
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ success: false, message: error.message })
        }
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// DELETE /Delete-Coupon — admin only
const DeleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.query

        if (!couponId) {
            return res.status(400).json({ success: false, message: 'couponId is required' })
        }

        const coupon = await Coupon.findById(couponId)
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' })
        }

        await Coupon.findByIdAndDelete(couponId)

        await logAudit(req, {
            action: 'DELETE',
            resource: 'Coupon',
            resourceId: couponId,
            before: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue }
        })

        return res.status(200).json({
            success: true,
            message: `Coupon "${coupon.code}" deleted successfully`
        })
    } catch (error) {
        console.log('DeleteCoupon error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { CreateCoupon, GetAllCoupons, UpdateCoupon, DeleteCoupon }
