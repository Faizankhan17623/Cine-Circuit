const crypto = require('crypto')
const Payment = require('../../models/payment')
const { Verifypayment } = require('./Payment')

// Razorpay sends a signature over the exact raw request body. Keep this route
// before express.json() in index.js and never verify a re-serialized object.
exports.HandlePaymentWebhook = async (req, res) => {
    try {
        const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '')
        const signature = req.get('X-Razorpay-Signature')
        const expected = crypto.createHmac('sha256', process.env.RAZORPAY_HEADERS).update(rawBody).digest('hex')
        if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.status(400).json({ success: false, message: 'Invalid webhook signature' })

        const event = JSON.parse(rawBody.toString('utf8'))
        const paymentEntity = event?.payload?.payment?.entity
        if (!paymentEntity?.order_id || !paymentEntity?.id) return res.status(200).json({ success: true, ignored: true })
        if (!['payment.captured', 'order.paid'].includes(event.event)) return res.status(200).json({ success: true, ignored: true })

        const payment = await Payment.findOne({ razorpay_order_id: paymentEntity.order_id })
        if (!payment) return res.status(200).json({ success: true, ignored: true })
        if (payment.Payment_Status === 'success') return res.status(200).json({ success: true, idempotent: true })

        const result = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(data) { this.body = data; return this } }
        await Verifypayment({ USER: { id: payment.userid }, body: {
            razorpay_order_id: paymentEntity.order_id,
            razorpay_payment_id: paymentEntity.id,
            razorpay_signature: crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRETS).update(`${paymentEntity.order_id}|${paymentEntity.id}`).digest('hex'),
            paymentId: String(payment._id)
        } }, result)
        return res.status(200).json({ success: true, processed: true })
    } catch (error) {
        console.error('Payment webhook error:', error.message)
        return res.status(500).json({ success: false, message: 'Webhook processing failed' })
    }
}
