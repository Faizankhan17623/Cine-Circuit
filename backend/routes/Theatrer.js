const express = require('express')
const route = express.Router()
const {auth,IsTheatrer} = require('../middlewares/verification')
const {CreateTheatrere} = require('../controllers/Theatrer/Theatrer')
const {TicketDistributionSystem,GetAllticketsCreated,UpdateTime} = require('../controllers/Theatrer/TicketDistrubation')
const {TheatreCreationRequestPassing,GetAllTheatres,TheatreCreationRequest} = require('../controllers/Administrator/CreateTheatres')
const {CalculateTotalSale,SingleTheatreDetails,GetShowAllotedDetails,getAllticketsDetails,getSingleShowDetails} = require('../controllers/Dashboard/TheatrereDashboard')
// THis are all the routes that are present an all of them are working fine 
// ya first wala hain iske andar theatrer apen  email id and password input main denga 
// 1 This is the first step for creating the theatre

route.post("/Create-Theatre",CreateTheatrere)

// uske badh jo admin hain wo 
// ya wala jo route hain wo using the form logo ke leya use hoga
// 2 This is the second step for creating the theatre
route.post("/Theatre-info",TheatreCreationRequestPassing)

route.get("/All-Theatres",auth,IsTheatrer,GetAllTheatres)

route.get("/Theatre-Creation-request",auth,IsTheatrer,TheatreCreationRequest)
// DONE
// This route are specificalley used for the tickets
route.post("/Distribute-Tickets",auth,IsTheatrer,TicketDistributionSystem)
route.put("/Update-TicketsTime",auth,IsTheatrer,UpdateTime)
route.get("/Tickets-Created",auth,IsTheatrer,GetAllticketsCreated)


// DONE

// new 
route.get("/Theatre-Details",auth,IsTheatrer,SingleTheatreDetails)
route.get("/CalculateTotalSale",auth,IsTheatrer,CalculateTotalSale)
route.get("/Show-Alloted-Details",auth,IsTheatrer,GetShowAllotedDetails)
route.get("/All-Tickets-Details",auth,IsTheatrer,getAllticketsDetails)
route.get("/GetSingleShowDetails",auth,IsTheatrer,getSingleShowDetails)
module.exports = route