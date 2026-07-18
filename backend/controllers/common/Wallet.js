const mongoose = require('mongoose')
const date = require('date-and-time')
const Wallet = require('../../models/Wallet')

const nowStamp = () => date.format(new Date(), date.compile('ddd, DD/MM/YYYY HH:mm:ss'))

/**
 * Shared wallet credit logic — used by cancellation refunds, loyalty redemption,
 * and admin adjustments. Creates the wallet document on first use.
 * Pass a mongoose session when calling inside an existing transaction.
 */
const creditWallet = async (userId, amount, reason, description = '', referenceId = null, session = null) => {
    if (!amount || amount <= 0) {
        throw new Error('Credit amount must be greater than 0')
    }

    const opts = session ? { session } : {}

    let wallet = await Wallet.findOne({ userId }).session(session || null)
    if (!wallet) {
        const created = await Wallet.create([{ userId, balance: 0, transactions: [] }], opts)
        wallet = created[0]
    }

    const newBalance = wallet.balance + amount

    const updated = await Wallet.findOneAndUpdate(
        { userId },
        {
            $inc: { balance: amount },
            $push: {
                transactions: {
                    type: 'credit',
                    amount,
                    reason,
                    description,
                    referenceId,
                    balanceAfter: newBalance,
                    time: nowStamp()
                }
            }
        },
        { new: true, ...opts }
    )

    return updated
}

/**
 * Shared wallet debit logic — used when a user pays (partially) using wallet balance.
 * Throws if balance is insufficient.
 */
const debitWallet = async (userId, amount, reason, description = '', referenceId = null, session = null) => {
    if (!amount || amount <= 0) {
        throw new Error('Debit amount must be greater than 0')
    }

    const opts = session ? { session } : {}

    // Atomic guard — only succeeds if balance is sufficient, avoids race conditions
    const updated = await Wallet.findOneAndUpdate(
        { userId, balance: { $gte: amount } },
        [
            {
                $set: {
                    balance: { $subtract: ['$balance', amount] }
                }
            }
        ],
        { new: true, ...opts }
    )

    if (!updated) {
        throw new Error('Insufficient wallet balance')
    }

    updated.transactions.push({
        type: 'debit',
        amount,
        reason,
        description,
        referenceId,
        balanceAfter: updated.balance,
        time: nowStamp()
    })
    await updated.save(opts)

    return updated
}

// GET /Wallet-Balance — logged-in viewer
const GetWalletBalance = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const wallet = await Wallet.findOne({ userId })
        return res.status(200).json({
            success: true,
            balance: wallet ? wallet.balance : 0
        })
    } catch (error) {
        console.error('GetWalletBalance error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /Wallet-History — logged-in viewer, most recent first
const GetWalletHistory = async (req, res) => {
    try {
        const userId = req.USER?.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'You are not logged in' })
        }

        const wallet = await Wallet.findOne({ userId })
        if (!wallet) {
            return res.status(200).json({ success: true, balance: 0, transactions: [] })
        }

        const transactions = [...wallet.transactions].sort((a, b) => b.createdAt - a.createdAt)

        return res.status(200).json({
            success: true,
            balance: wallet.balance,
            transactions
        })
    } catch (error) {
        console.error('GetWalletHistory error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { creditWallet, debitWallet, GetWalletBalance, GetWalletHistory }
