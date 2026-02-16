// This is the orgainezer personal route the Things that the org will do will come here
const express = require('express')
const route = express.Router()
const {CreateOrgainezer,OrgaineserLogin,OrgData,DirectorFresher,DirectorExperience,ProducerFresher,ProducerExperience,GetMyOrgData} = require('../controllers/Orgainezer/CreateOrg')
const {auth,IsOrganizer,DF,DE,PF,PE} = require('../middlewares/verification')
const {AllShows, VerifiedButnotUploaded} = require('../controllers/common/Showlist')
const {AllotTheatre} = require('../controllers/Orgainezer/Allotment')
const {CreateTicket} = require('../controllers/Orgainezer/CreateTicket')
const {GetAllTheatreDetails,TicketDetails,GetAllTicketDetails} = require("../controllers/Dashboard/OrgainezerDashboard")
const {notUploadedShows} = require("../controllers/common/Showlist")
// DONE

route.post('/Create-Orgainezer',CreateOrgainezer)
route.post('/Orgainezer-login',OrgaineserLogin)
// DONE

// DONE
route.put("/Create-Ticket",auth,IsOrganizer,CreateTicket)
route.put("/Allot-Theatre",auth,IsOrganizer,AllotTheatre)
route.get("/All-Shows",auth,IsOrganizer,AllShows)
route.get("/not-uploaded",auth,IsOrganizer,notUploadedShows)
route.get("/verified-not-uploaded",auth,IsOrganizer,VerifiedButnotUploaded)
// hello this is for the tesing 
// notUploadedShows
// DONE
route.get("/Ticket-Details",auth,IsOrganizer,TicketDetails)
route.get("/All-Ticket-Details",auth,IsOrganizer,GetAllTicketDetails)   


// new
route.get("/Get-All-Theatre-Details",auth,IsOrganizer,GetAllTheatreDetails)
route.post("/Org-Data", auth, IsOrganizer ,OrgData)
route.get("/My-Org-Data", auth, IsOrganizer, GetMyOrgData)
route.post("/Dir-Fresh", auth, IsOrganizer, DF, DirectorFresher)
route.post("/Dir-Experience", auth, IsOrganizer, DE, DirectorExperience)
route.post("/Pro-Fresh", auth, IsOrganizer, PF, ProducerFresher)
route.post("/Pro-Expe", auth, IsOrganizer, PE, ProducerExperience)

module.exports = route