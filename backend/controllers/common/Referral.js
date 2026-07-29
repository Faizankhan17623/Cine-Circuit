const crypto = require('crypto')
const Referral = require('../../models/Referral')
const USER = require('../../models/user')
const { creditWallet } = require('./Wallet')

// Reward amounts in rupees — paid out only after the invited user's first successful booking,
// so a code can never be farmed by simply creating accounts.
const REFERRER_REWARD = 100
const REFEREE_REWARD = 50

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const randomSuffix = (length) => {
    const bytes = crypto.randomBytes(length)
    let out = ''
    for (let i = 0; i < length; i++) {
        out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
    }
    return out
}

/**
 * Returns the user's referral code, generating and persisting one on first access.
 * Codes look like "FAIZAN4K7Q" — a slug of the username plus random characters.
 */
const getOrCreateReferralCode = async (userId) => {
    const user = await USER.findById(userId)
    if (!user) throw new Error('User not found')
    if (user.referralCode) return user.referralCode

    const slug = (user.userName || 'CINE').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'CINE'

    for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = `${slug}${randomSuffix(4)}`
        const clash = await USER.findOne({ referralCode: candidate })
        if (clash) continue

        const updated = await USER.findOneAndUpdate(
            { _id: userId, referralCode: { $in: [null, undefined] } },
            { $set: { referralCode: candidate } },
            { new: true }
        )
        // Another request may have assigned a code in the meantime — reuse that one
        if (!updated) return (await USER.findById(userId)).referralCode
        return updated.referralCode
    }

    throw new Error('Could not generate a unique referral code')
}

/**
 * Links a newly created user to the owner of `code`. Called from signup.
 * Best-effort: an invalid code must never block account creation, so this
 * returns a result object instead of throwing.
 */
const attachReferral = async (code, refereeId) => {
    if (!code) return { success: false, message: 'No referral code provided' }

    const referrer = await USER.findOne({ referralCode: String(code).trim().toUpperCase() })
    if (!referrer) return { success: false, message: 'Invalid referral code' }
    if (String(referrer._id) === String(refereeId)) {
        return { success: false, message: 'You cannot refer yourself' }
    }

    const existing = await Referral.findOne({ referee: refereeId })
    if (existing) return { success: false, message: 'This account already used a referral code' }

    await Referral.create({
        referrer: referrer._id,
        referee: refereeId,
        code: referrer.referralCode,
        status: 'pending'
    })

    return { success: true, referrer: referrer.userName }
}

/**
 * Completes a pending referral after the invited user's first successful booking and
 * credits both wallets. Called from payment verification inside the booking transaction.
 * Failures are swallowed — a reward payout must never roll back a paid booking.
 */
const completeReferral = async (refereeId, paymentId = null, session = null) => {
    try {
        const referral = await Referral.findOneAndUpdate(
            { referee: refereeId, status: 'pending' },
            {
                $set: {
                    status: 'completed',
                    referrerReward: REFERRER_REWARD,
                    refereeReward: REFEREE_REWARD,
                    completedAt: new Date(),
                    triggeredBy: paymentId
                }
            },
            { new: true, ...(session ? { session } : {}) }
        )
        if (!referral) return null

        await creditWallet(
            referral.referrer,
            REFERRER_REWARD,
            'referral_reward',
            'Referral reward — your invite completed their first booking',
            paymentId,
            session
        )
        await creditWallet(
            refereeId,
            REFEREE_REWARD,
            'referral_reward',
            'Welcome reward — booked with a referral code',
            paymentId,
            session
        )

        return referral
    } catch (error) {
        console.error('completeReferral error:', error)
        return null
    }
}

// POST /Validate-Referral-Code — public, used by the signup form
const ValidateReferralCode = async (req, res) => {
    try {
        const { referralCode } = req.body
        const referrer = await USER.findOne({ referralCode: String(referralCode).trim().toUpperCase() })
        if (!referrer) {
            return res.status(404).json({ success: false, message: 'Invalid referral code' })
        }

        return res.status(200).json({
            success: true,
            message: `Code applied — invited by ${referrer.userName}`,
            referrerName: referrer.userName,
            refereeReward: REFEREE_REWARD
        })
    } catch (error) {
        console.error('ValidateReferralCode error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /My-Referral — logged-in viewer: own code, reward rates and invite list
const GetMyReferral = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const referralCode = await getOrCreateReferralCode(userId)

        const referrals = await Referral.find({ referrer: userId })
            .populate('referee', 'userName email image')
            .sort({ createdAt: -1 })

        const completed = referrals.filter((r) => r.status === 'completed')

        return res.status(200).json({
            success: true,
            referralCode,
            referrerReward: REFERRER_REWARD,
            refereeReward: REFEREE_REWARD,
            stats: {
                total: referrals.length,
                pending: referrals.length - completed.length,
                completed: completed.length,
                totalEarned: completed.reduce((sum, r) => sum + r.referrerReward, 0)
            },
            referrals: referrals.map((r) => ({
                _id: r._id,
                status: r.status,
                reward: r.referrerReward,
                joinedAt: r.createdAt,
                completedAt: r.completedAt,
                user: r.referee
                    ? { userName: r.referee.userName, email: r.referee.email, image: r.referee.image }
                    : null
            }))
        })
    } catch (error) {
        console.error('GetMyReferral error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = {
    REFERRER_REWARD,
    REFEREE_REWARD,
    getOrCreateReferralCode,
    attachReferral,
    completeReferral,
    ValidateReferralCode,
    GetMyReferral
}
