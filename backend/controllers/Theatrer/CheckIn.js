const Payment = require('../../models/payment')
const USER = require('../../models/user')
const Theatre = require('../../models/Theatres')
const { signPaymentId } = require('../../utils/generateTicketQr')
const date = require('date-and-time')

// POST /Theatre/Check-In  { paymentId, signature }
// Called by theatre staff scanning a ticket's QR code at entry.
exports.CheckInTicket = async (req, res) => {
    try {
        const userId = req.USER.id
        const { paymentId, signature } = req.body

        if (!paymentId || !signature) {
            return res.status(400).json({
                message: "paymentId and signature are required",
                success: false
            })
        }

        const expectedSignature = signPaymentId(paymentId)
        if (expectedSignature !== signature) {
            return res.status(400).json({
                message: "Invalid or tampered ticket QR code",
                success: false
            })
        }

        const staffUser = await USER.findById(userId)
        if (!staffUser || !staffUser.theatresCreated) {
            return res.status(404).json({
                message: "Theatre staff account not found",
                success: false
            })
        }

        const paymentDoc = await Payment.findById(paymentId)
        if (!paymentDoc) {
            return res.status(404).json({
                message: "Ticket not found",
                success: false
            })
        }

        if (paymentDoc.theatreid.toString() !== staffUser.theatresCreated.toString()) {
            return res.status(403).json({
                message: "This ticket does not belong to your theatre",
                success: false
            })
        }

        if (paymentDoc.Payment_Status !== "success") {
            return res.status(400).json({
                message: "This ticket was not successfully paid for",
                success: false
            })
        }

        if (paymentDoc.cancelled) {
            return res.status(400).json({
                message: "This ticket was cancelled and refunded",
                success: false
            })
        }

        if (paymentDoc.checkedIn) {
            return res.status(409).json({
                message: `Ticket already checked in at ${paymentDoc.checkedInAt}`,
                success: false
            })
        }

        const now = new Date()
        const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss')
        const ps = date.format(now, pattern)

        paymentDoc.checkedIn = true
        paymentDoc.checkedInAt = ps
        await paymentDoc.save()

        return res.status(200).json({
            message: "Ticket checked in successfully",
            success: true,
            data: {
                totalTicketpurchased: paymentDoc.totalTicketpurchased,
                showid: paymentDoc.showid,
                Showdate: paymentDoc.Showdate,
                time: paymentDoc.time,
                checkedInAt: ps
            }
        })
    } catch (error) {
        console.error("Error in CheckInTicket:", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}
