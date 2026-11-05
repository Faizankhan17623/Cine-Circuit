const cron = require('node-cron')
const { expireUnpaidWalletPayments } = require('../controllers/common/Payment')

// Every 10 minutes: return the wallet amount held by Razorpay checkouts left unpaid for 30+ minutes
cron.schedule('*/10 * * * *', async () => {
    try {
        await expireUnpaidWalletPayments()
    } catch (error) {
        console.error("Error executing cron job:", error.message)
    }
})
