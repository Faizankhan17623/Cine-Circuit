const express = require('express')
const route = express.Router()
const {auth,IsUSER} = require('../middlewares/verification')
const {MakePayment,Verifypayment,MakePdf} = require('../controllers/common/Payment')
// DONE

route.post("/Make-Payment",auth,IsUSER,MakePayment)
route.post("/Verify-Payment",auth,IsUSER,Verifypayment)
// This is the route that will make the pdf of that ticket
route.get('/download/:ticketId',auth,IsUSER,MakePdf)
// DONE

module.exports = route