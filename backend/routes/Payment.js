const express = require('express')
const route = express.Router()
const {auth,IsUSER} = require('../middlewares/verification')
const {MakePayment,Verifypayment,MakePdf} = require('../controllers/common/Payment')
const {GetSeatMap} = require('../controllers/common/Seats')
const {CancelTicket} = require('../controllers/common/CancelTicket')
// DONE

route.post("/Make-Payment",auth,IsUSER,MakePayment)
route.post("/Verify-Payment",auth,IsUSER,Verifypayment)
// This is the route that will make the pdf of that ticket
route.get('/download/:ticketId',auth,IsUSER,MakePdf)
// Seat map for a given ticket + showtime
route.get('/Seat-Map',auth,IsUSER,GetSeatMap)
// Cancel a ticket and trigger a Razorpay refund
route.post('/Cancel-Ticket',auth,IsUSER,CancelTicket)
// DONE

module.exports = route