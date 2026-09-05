const mongoose = require('mongoose')
const date = require('date-and-time')
const Payment = require('../../models/payment')
const Theatrestickets = require('../../models/TheatresTicket')
const USER = require('../../models/user')
const instance = require('../../config/razorpay')
const mailSender = require('../../utils/mailsender')
const cancellationTemplate = require('../../templates/userTemplates/cancellationTemplate')
const { creditWallet } = require('./Wallet')
const { notifyUser } = require('../../utils/notificationSender')

const CANCELLATION_CUTOFF_HOURS = 2

const parseShowDateTime = (showDate, time) => {
    // showDate is DD/MM/YYYY, time is HH:mm
    const parsedDate = date.parse(showDate, "DD/MM/YYYY")
    if (!parsedDate || isNaN(parsedDate)) return null

    const [hours, minutes] = (time || "00:00").split(":").map(Number)
    parsedDate.setHours(hours || 0, minutes || 0, 0, 0)
    return parsedDate
}

// POST /Payment/Cancel-Ticket  { paymentId, refundToWallet }
// refundToWallet=true skips Razorpay (which can take 5-7 days) and credits the
// amount to the user's in-app wallet instantly instead.
exports.CancelTicket = async (req, res) => {
    try {
        const userId = req.USER?.id
        const { paymentId, refundToWallet } = req.body

        if (!userId) {
            return res.status(400).json({ message: "You are not logged in", success: false })
        }
        if (!paymentId) {
            return res.status(400).json({ message: "paymentId is required", success: false })
        }

        const paymentDoc = await Payment.findById(paymentId)
        if (!paymentDoc) {
            return res.status(404).json({ message: "Ticket not found", success: false })
        }

        if (paymentDoc.userid.toString() !== userId.toString()) {
            return res.status(403).json({ message: "This is not your ticket", success: false })
        }

        if (paymentDoc.Payment_Status !== "success") {
            return res.status(400).json({ message: "Only successfully paid tickets can be cancelled", success: false })
        }

        if (paymentDoc.cancelled && !['pending', 'failed'].includes(paymentDoc.refundStatus)) {
            return res.status(400).json({ message: "This ticket is already cancelled", success: false })
        }

        if (paymentDoc.checkedIn) {
            return res.status(400).json({ message: "This ticket has already been used for entry and cannot be cancelled", success: false })
        }

        const showDateTime = parseShowDateTime(paymentDoc.Showdate, paymentDoc.time)
        if (showDateTime) {
            const cutoff = new Date(showDateTime.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000)
            if (new Date() > cutoff) {
                return res.status(400).json({
                    message: `Tickets can only be cancelled up to ${CANCELLATION_CUTOFF_HOURS} hours before showtime`,
                    success: false
                })
            }
        }

        if (!paymentDoc.razorpay_payment_id) {
            return res.status(400).json({ message: "No payment record to refund", success: false })
        }

        // Mark cancellation before calling the gateway so a crash cannot leave
        // a refunded ticket admissible. Pending/failed requests can be retried.
        paymentDoc.cancelled = true
        paymentDoc.refundStatus = 'pending'
        await paymentDoc.save()

        // Two refund paths: instant wallet credit, or the original Razorpay refund (5-7 business days).
        let refund = null
        if (!refundToWallet) {
            // Call Razorpay refund first — if it fails, no state should change.
            try {
                refund = await instance.payments.refund(paymentDoc.razorpay_payment_id, {
                    amount: Math.round(paymentDoc.amount * 100),
                    speed: "normal"
                })
            } catch (refundError) {
                console.error("Razorpay refund error:", refundError)
                await Payment.findByIdAndUpdate(paymentDoc._id, { refundStatus: 'failed', failureReason: refundError.message })
                return res.status(502).json({
                    message: "Refund could not be processed right now. Please try again later.",
                    success: false
                })
            }
        }

        const session = await mongoose.startSession()
        try {
            session.startTransaction()

            const now = new Date()
            const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss')
            const ps = date.format(now, pattern)

            paymentDoc.cancelled = true
            paymentDoc.cancelledAt = ps
            const totalRefund = paymentDoc.amount + (paymentDoc.walletAmountUsed || 0)
            paymentDoc.refundAmount = totalRefund

            if (refundToWallet) {
                await creditWallet(
                    userId,
                    totalRefund,
                    'cancellation_refund',
                    `Refund for cancelled booking on ${paymentDoc.Showdate}`,
                    paymentDoc._id,
                    session
                )
                paymentDoc.refundId = 'wallet'
                paymentDoc.refundStatus = 'processed'
            } else {
                paymentDoc.refundId = refund.id
                paymentDoc.refundStatus = refund.status === "processed" ? "processed" : "pending"
                if (paymentDoc.walletAmountUsed > 0) {
                    await creditWallet(
                        userId,
                        paymentDoc.walletAmountUsed,
                        'cancellation_refund',
                        `Wallet portion refund for cancelled booking on ${paymentDoc.Showdate}`,
                        paymentDoc._id,
                        session
                    )
                }
            }
            await paymentDoc.save({ session })

            // Restore ticket counts and free up seats
            for (const category of paymentDoc.ticketCategorey) {
                const requestedTickets = parseInt(category.ticketsPurchased)

                await Theatrestickets.findOneAndUpdate(
                    {
                        _id: paymentDoc.ticketid,
                        "ticketsCategory.category": category.categoryName
                    },
                    { $inc: { "ticketsCategory.$.ticketsPurchaseafterRemaining": requestedTickets } },
                    { session }
                )

                if (category.seats && category.seats.length > 0) {
                    await Theatrestickets.findOneAndUpdate(
                        { _id: paymentDoc.ticketid, "bookedSeats.time": paymentDoc.time, "bookedSeats.category": category.categoryName },
                        { $pull: { "bookedSeats.$.seats": { $in: category.seats } } },
                        { session }
                    )
                }
            }

            await session.commitTransaction()
        } catch (txError) {
            await session.abortTransaction()
            throw txError
        } finally {
            session.endSession()
        }

        try {
            await notifyUser(userId, {
                type: 'payment',
                title: 'Booking cancelled',
                message: `Your booking was cancelled. Refund of ₹${paymentDoc.refundAmount} is ${paymentDoc.refundStatus}.`,
                link: '/Dashboard/Purchase-History',
                metadata: { paymentId: String(paymentDoc._id) }
            })
            const userDoc = await USER.findById(userId)
            if (userDoc) {
                await mailSender(
                    userDoc.email,
                    "Booking Cancelled - Cine Circuit",
                    cancellationTemplate(userDoc.name || userDoc.userName, {
                        Showdate: paymentDoc.Showdate,
                        time: paymentDoc.time,
                        refundAmount: paymentDoc.refundAmount,
                        refundStatus: paymentDoc.refundStatus
                    })
                )
            }
        } catch (mailError) {
            console.error("Failed to send cancellation email:", mailError)
        }

        return res.status(200).json({
            message: "Ticket cancelled and refund initiated successfully",
            success: true,
            data: {
                refundId: paymentDoc.refundId,
                refundStatus: paymentDoc.refundStatus,
                refundAmount: paymentDoc.refundAmount
            }
        })
    } catch (error) {
        console.error("Error in CancelTicket:", error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}
