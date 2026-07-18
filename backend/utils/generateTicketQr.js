const QRCode = require('qrcode')
const crypto = require('crypto')

// The QR encodes the paymentId plus an HMAC signature so the check-in scanner
// can verify a scanned code was actually issued by us, without needing a live
// lookup first. The secret reuses JWT_PRIVATE_KEY — no need for a second secret.
const signPaymentId = (paymentId) => {
    return crypto
        .createHmac('sha256', process.env.JWT_PRIVATE_KEY)
        .update(paymentId.toString())
        .digest('hex')
        .slice(0, 16)
}

exports.signPaymentId = signPaymentId

exports.generateTicketQrDataUrl = async (paymentId) => {
    const signature = signPaymentId(paymentId)
    const payload = JSON.stringify({ id: paymentId.toString(), sig: signature })
    return QRCode.toDataURL(payload, { margin: 1, width: 240 })
}
