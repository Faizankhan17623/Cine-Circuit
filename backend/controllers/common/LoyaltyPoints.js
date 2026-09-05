const date = require('date-and-time')
const LoyaltyPoints = require('../../models/LoyaltyPoints')
const { creditWallet } = require('./Wallet')

const nowStamp = () => date.format(new Date(), date.compile('ddd, DD/MM/YYYY HH:mm:ss'))

// Earn rate: 1 point per ₹10 spent. Redeem rate: 100 points = ₹10 wallet credit.
const RUPEES_PER_POINT_EARNED = 10
const POINTS_PER_REDEMPTION_BLOCK = 100
const RUPEES_PER_REDEMPTION_BLOCK = 10

/**
 * Shared earn logic — called after a booking payment succeeds.
 * Pass a mongoose session when calling inside an existing transaction.
 */
const earnPoints = async (userId, amountSpent, referenceId = null, session = null) => {
    const points = Math.floor(amountSpent / RUPEES_PER_POINT_EARNED)
    if (points <= 0) return null

    const opts = session ? { session } : {}

    let wallet = await LoyaltyPoints.findOne({ userId }).session(session || null)
    if (!wallet) {
        const created = await LoyaltyPoints.create([{ userId, points: 0, transactions: [] }], opts)
        wallet = created[0]
    }

    const pointsAfter = wallet.points + points

    const updated = await LoyaltyPoints.findOneAndUpdate(
        { userId },
        {
            $inc: { points },
            $push: {
                transactions: {
                    type: 'earn',
                    points,
                    reason: 'booking_payment',
                    referenceId,
                    pointsAfter,
                    time: nowStamp()
                }
            }
        },
        { new: true, ...opts }
    )

    return updated
}

// GET /Loyalty-Balance — logged-in viewer
const GetLoyaltyBalance = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const record = await LoyaltyPoints.findOne({ userId })
        return res.status(200).json({
            success: true,
            points: record ? record.points : 0,
            redeemableValue: Math.floor((record ? record.points : 0) / POINTS_PER_REDEMPTION_BLOCK) * RUPEES_PER_REDEMPTION_BLOCK
        })
    } catch (error) {
        console.error('GetLoyaltyBalance error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /Loyalty-History — logged-in viewer, most recent first
const GetLoyaltyHistory = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const record = await LoyaltyPoints.findOne({ userId })
        if (!record) {
            return res.status(200).json({ success: true, points: 0, transactions: [] })
        }

        const transactions = [...record.transactions].sort((a, b) => b.createdAt - a.createdAt)

        return res.status(200).json({
            success: true,
            points: record.points,
            transactions
        })
    } catch (error) {
        console.error('GetLoyaltyHistory error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// POST /Redeem-Points  { blocks }  — redeems `blocks * 100` points for `blocks * ₹10` wallet credit
const RedeemPoints = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const blocks = parseInt(req.body.blocks)
        if (!blocks || blocks <= 0) {
            return res.status(400).json({ success: false, message: 'blocks must be a positive integer' })
        }

        const pointsToRedeem = blocks * POINTS_PER_REDEMPTION_BLOCK
        const creditAmount = blocks * RUPEES_PER_REDEMPTION_BLOCK

        const record = await LoyaltyPoints.findOne({ userId })
        if (!record || record.points < pointsToRedeem) {
            return res.status(400).json({
                success: false,
                message: `You need at least ${pointsToRedeem} points to redeem this amount. Current balance: ${record ? record.points : 0}`
            })
        }

        const pointsAfter = record.points - pointsToRedeem

        const debited = await LoyaltyPoints.findOneAndUpdate(
            { userId, points: { $gte: pointsToRedeem } },
            {
                $inc: { points: -pointsToRedeem },
                $push: {
                    transactions: {
                        type: 'redeem',
                        points: pointsToRedeem,
                        reason: 'redemption',
                        referenceId: null,
                        pointsAfter,
                        time: nowStamp()
                    }
                }
            }
        )
        if (!debited) return res.status(409).json({ success: false, message: 'Points changed; please try again' })

        const wallet = await creditWallet(
            userId,
            creditAmount,
            'loyalty_redemption',
            `Redeemed ${pointsToRedeem} loyalty points`
        )

        return res.status(200).json({
            success: true,
            message: `Redeemed ${pointsToRedeem} points for ₹${creditAmount} wallet credit`,
            remainingPoints: pointsAfter,
            walletBalance: wallet.balance
        })
    } catch (error) {
        console.error('RedeemPoints error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { earnPoints, GetLoyaltyBalance, GetLoyaltyHistory, RedeemPoints }
