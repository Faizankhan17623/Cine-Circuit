const express = require('express')
const route = express.Router()
const { body, query, validationResult } = require('express-validator')
const {auth,IsUSER} = require('../middlewares/verification')

// Returns first validation error as a 400 response — controllers never run if this fails
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }
    next()
}
const {Createuser,CreateOtp,updateUserName,updatePassword,UpdateImage,updateNUmber,CurrentLoginUser} = require('../controllers/user/Createuser')
const {login} = require('../controllers/user/auth')
const {SendMessage,Updatemessage,getAllMessage} = require('../controllers/common/SendMessage')
const {UserComments,getAllComment,deleteComment} = require('../controllers/common/Comment')
const {PosterLike,BannerDisliked} = require('../controllers/Orgainezer/CreateTheatreShow')
const {LinkSend,ResetPassword} = require('../controllers/user/Resetpassword')
const {AllShows,usingtitle,SearchAll} = require('../controllers/common/Showlist')
const {createRating,getAverageRating,getAllRatingReview} = require("../controllers/common/RatingAndRviews")
const {TicketPurchased,TicketPurchasedFullDetails} = require("../controllers/Dashboard/UserDashboard")
const {GetAlluserDetails,FindUserNames,FindLoginEmail,FindNumber,FindCreationEmail} = require('../controllers/user/User')
const {BannerMovies,FIndusingMOvieTags,FindWholeMoviesData,FindMovieById,PurcahsingData,MostLikedMovies,HighlyRatedMovies,RecentlyReleased,ContentBasedAlgorithm} = require('../controllers/Dashboard/UserDashboard')
const {GetSingleTheatreDetails,getTheatreDetails, GetShowsDetails} = require('../controllers/Dashboard/TheatrereDashboard')
// DONE 
const {TheatreNavbar,MovieNavbar}  = require('../controllers/common/Comment')
// This is the first route that will be used to create the user and all the things that the user will do releated to his personal info
route.post("/Create-User", [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('number').notEmpty().withMessage('Phone number is required'),
    body('countrycode').notEmpty().withMessage('Country code is required'),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
], validate, Createuser)
route.post("/Create-OTP",CreateOtp)
// This is the extra route that was added to get all the user details
route.get("/Get-All-UserDetails",auth,GetAlluserDetails)
route.post("/Find-UserNames",FindUserNames)
route.post("/Find-Login-Email",FindLoginEmail)
route.post("/Find-creation-Email",FindCreationEmail)
route.post("/Find-Number",FindNumber)
route.get("/Personal",auth, ContentBasedAlgorithm)

route.put("/Update-userName",auth,updateUserName)
route.put("/Update-Password",auth,updatePassword) 
route.put("/Update-Image",auth,UpdateImage) 
route.put("/Update-Number",auth,updateNUmber) 
route.get("/Current-UserDetails",auth,CurrentLoginUser)

route.get("/Theatre-data", TheatreNavbar)
route.get("/Movie-data", MovieNavbar)
// DONE

// DONE
// This is the login route
route.post("/Login", [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, login)
// DONE

// This are the route that are going to be used to reseet thee password
// 1 Before resetting the password you neeed to send the link of the password via the email
route.post("/Send-Link",LinkSend) 
// 2 The second step is the reset the password once the link is been send
route.put("/Change-Password",ResetPassword) 

// This is the route that will help us to see all the shows that are going on
route.get("/Shows",AllShows)
route.get("/Search", SearchAll)
// for Finding specific shows
route.get("/Specific-Show",auth,IsUSER,usingtitle)

// This are the route that are going to be used to like and dislike the banner
route.put("/Like-Banner",auth, IsUSER,PosterLike) 
route.put("/Dislike-Banner",auth, IsUSER,BannerDisliked) 

route.get('/Banner',BannerMovies)
route.post('/Movie-Tags',FIndusingMOvieTags)
route.post('/Theatre-Tags',getTheatreDetails)
route.post('/Finder',FindWholeMoviesData)
route.get('/Movie-Details',FindMovieById)


route.post("/Comment-Banner", auth, IsUSER, [
    query('Showid').isMongoId().withMessage('Valid Show ID is required'),
    body().custom((_, { req }) => {
        const text = req.body.coment || req.body.comment
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            throw new Error('Comment text is required')
        }
        return true
    }),
], validate, UserComments)
route.get("/Get-Comment",getAllComment)
route.delete("/delte-Comment",auth,IsUSER,deleteComment)

route.post("/Send-Message",auth, IsUSER,SendMessage) 
route.put("/Update-Message",auth, IsUSER,Updatemessage)
route.get("/Get-AllMessages",auth, IsUSER,getAllMessage)
// This is the route that will be used to create the user dashboard and this is going to be used in the dashboard

route.get("/Ticket-Purchased",auth, IsUSER,TicketPurchased)
route.get("/Ticket-Purchased-FullDetails",auth, IsUSER,TicketPurchasedFullDetails)


route.post("/createRating", auth, IsUSER, [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
    body('review').isString().trim().notEmpty().withMessage('Review text is required'),
    body('showId').isMongoId().withMessage('Valid Show ID is required'),
], validate, createRating)
route.get("/getAverageRating", getAverageRating)
route.get("/getReviews", getAllRatingReview)

route.get('/Purchasing',PurcahsingData)
route.get('/Most-Liked',MostLikedMovies)
route.get('/Highly-Rated',HighlyRatedMovies)
route.get('/Recently-Released',RecentlyReleased)
route.get('/Theatre-Shows', GetShowsDetails)
route.get('/Single-Theatre', GetSingleTheatreDetails)
module.exports = route      
// memphis