const cron = require('node-cron')
const { updateUpcomingToReleased,updateReleasedToExpired } = require('../../controllers/Orgainezer/CreateTheatreShow')
// Correct syntax for daily at midnight is "* * * * *"
cron.schedule('1 */6 * * *', async () => {
    try {
        console.log("THe jobs has started")
        // console.log("This will run once in Five Hours")
        await updateUpcomingToReleased()
        console.log("This is of the movie status of making the upcoming to released")
        console.log("The cron job is been done to update the movie status")
    } catch (error) {
        console.error("Error executing cron job:", error.message)
    }
})

cron.schedule('2 */6 * * *', async () => {
    try {
        console.log("THe jobs has started")
        // console.log("This will run once in Five Hours")
        await updateReleasedToExpired()
        console.log("This is of the movie status of making the   released to expired")
        console.log("The cron job is been done to update the movie status")
    } catch (error) {
        console.error("Error executing cron job:", error.message)
    }
})
