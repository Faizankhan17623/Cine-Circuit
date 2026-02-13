const express = require('express')
const route = express.Router()
const {auth,IsUSER} = require('../middlewares/verification')
const {Createuser,CreateOtp,updateUserName,updatePassword,UpdateImage,updateNUmber,CurrentLoginUser} = require('../controllers/user/Createuser')
const {login} = require('../controllers/user/auth')
const {SendMessage,Updatemessage,getAllMessage} = require('../controllers/common/SendMessage')
const {Comment,getAllComment} = require('../controllers/common/Comment')
const {PosterLike,BannerDisliked} = require('../controllers/Orgainezer/CreateTheatreShow')
const {LinkSend,ResetPassword} = require('../controllers/user/Resetpassword')
const {AllShows,usingtitle} = require('../controllers/common/Showlist')
const {createRating,getAverageRating,getAllRatingReview} = require("../controllers/common/RatingAndRviews")
const {TicketPurchased,TicketPurchasedFullDetails} = require("../controllers/Dashboard/UserDashboard")
const {GetAlluserDetails,FindUserNames,FindLoginEmail,FindNumber,FindCreationEmail} = require('../controllers/user/User')
const {BannerMovies,FIndusingMOvieTags,FindWholeMoviesData} = require('../controllers/Dashboard/UserDashboard')
const {getTheatreDetails} = require('../controllers/Dashboard/TheatrereDashboard')
// DONE 
// This is the first route that will be used to create the user and all the things that the user will do releated to his personal info
route.post("/Create-User",Createuser)
route.post("/Create-OTP",CreateOtp) 
// This is the extra route that was added to get all the user details
route.get("/Get-All-UserDetails",auth,GetAlluserDetails)
route.post("/Find-UserNames",FindUserNames)
route.post("/Find-Login-Email",FindLoginEmail)
route.post("/Find-creation-Email",FindCreationEmail)
route.post("/Find-Number",FindNumber)

route.put("/Update-userName",auth,updateUserName)
route.put("/Update-Password",auth,updatePassword) 
route.put("/Update-Image",auth,UpdateImage) 
route.put("/Update-Number",auth,updateNUmber) 
route.get("/Current-UserDetails",auth,CurrentLoginUser)
// DONE

// DONE
// This is the login route
route.post("/Login",login)
// DONE

// This are the route that are going to be used to reseet thee password
// 1 Before resetting the password you neeed to send the link of the password via the email
route.post("/Send-Link",LinkSend) 
// 2 The second step is the reset the password once the link is been send
route.put("/Change-Password",ResetPassword) 

// This is the route that will help us to see all the shows that are going on
route.get("/Shows",AllShows) 
// for Finding specific shows
route.get("/Specific-Show",auth,IsUSER,usingtitle)

// This are the route that are going to be used to like and dislike the banner
route.put("/Like-Banner",auth, IsUSER,PosterLike) 
route.put("/Dislike-Banner",auth, IsUSER,BannerDisliked) 
route.get('/Banner',BannerMovies)
route.get('/Movie-Tags',FIndusingMOvieTags)
route.get('/Theatre-Tags',getTheatreDetails)
route.post('/Finder',FindWholeMoviesData)



route.put("/Comment-Banner",auth, IsUSER,Comment) 
route.get("/Get-Comment",auth, IsUSER,getAllComment)

route.post("/Send-Message",auth, IsUSER,SendMessage) 
route.put("/Update-Message",auth, IsUSER,Updatemessage)
route.get("/Get-AllMessages",auth, IsUSER,getAllMessage)
// This is the route that will be used to create the user dashboard and this is going to be used in the dashboard

route.get("/Ticket-Purchased",auth, IsUSER,TicketPurchased)
route.get("/Ticket-Purchased-FullDetails",auth, IsUSER,TicketPurchasedFullDetails)


route.post("/createRating", auth, IsUSER, createRating)
route.get("/getAverageRating", getAverageRating)
route.get("/getReviews", getAllRatingReview)
module.exports = route      
// memphis