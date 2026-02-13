const cron = require('node-cron')
const {ReturnRemainingTickets} = require('../controllers/Theatrer/TicketDistrubation')

cron.schedule('5 */6 * * *',async()=>{
      try {
            console.log("THe jobs has started")
            console.log("This is to check the recovering  are working fine")
            // console.log("This will run once in Five Hou5rs")
            await ReturnRemainingTickets()
    
            console.log("The cron job is been done for the expired tickets")
        } catch (error) {
            console.error("Error executing cron job:", error.message)
        }
})
