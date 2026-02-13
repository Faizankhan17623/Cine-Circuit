const cron = require('node-cron')
const {UpcomigTickets,ExpireTickets} = require('../../controllers/Theatrer/TicketDistrubation')
// Correct syntax for daily at midnight is "* * * * *"

cron.schedule('3 */6 * * *', async () => {
    try {
        console.log("THe jobs has started")
        console.log("This is to check the tickets are working fine")
        // console.log("This will run once in Five Hours")
        await UpcomigTickets()

        console.log("The cron job is been done for the Released tickets")
    } catch (error) {
        console.error("Error executing cron job:", error.message)
    }
})

cron.schedule('4 */6 * * *', async () => {
    try {
        console.log("THe jobs has started")
        console.log("This is to check the tickets are working fine")
        // console.log("This will run once in Five Hours")
        await ExpireTickets()

        console.log("The cron job is been done for the expired tickets")
    } catch (error) {
        console.error("Error executing cron job:", error.message)
    }
})