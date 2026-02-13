const express = require('express')
const route = express.Router()
const {auth,IsAdmin,IsOrganizer} = require('../middlewares/verification')
const {Creategenre,Updategenre,deletegenre,deleteAllgenre,getAllGenres} = require('../controllers/Administrator/CreateGenre')
const {GetAllTheatres,TheatreCreationRequest,CreateTheatres,VerifyTheatrer,GetTheatreDetails} = require('../controllers/Administrator/CreateTheatres')
const {CreateSubgenre,UpdateSubGenre,deletesubgenre,deleteAllsubGenres,getAllgenre} = require('../controllers/Administrator/CreateSubGenre')
const{VerifyOrgainezer,GetAllorg,deleteOrgainezer,DeleteAllOrgainezers} = require('../controllers/Administrator/AdminVerification')
const {VerifyShow,GetAllShows,verifiedSHows,AllShows} = require('../controllers/Administrator/ShowVerify')

const{CreateLanguage,updateLanguage,deleteLanguage,Getalllanguage,deleteallanguage,GetSingleLanguage} = require('../controllers/Orgainezer/CreateLanguage')
const {OrgainesersVerifylength,Theatrelength,GetAllUsersDetailsVerified,GetAllUsersDetailsVerifiedfalse,GetAllOrganizerDetailsVerified,GetAllOrganizerDetailsVerifiedfalse,GetAllTheatrerDetailsVerified,GetAllTheatrerDetailsVerifiedfalse} = require('../controllers/Dashboard/AdminDashboard')

const {notUploadedShows,VerifiedButnotUploaded} = require("../controllers/common/Showlist")


// This is the extra route that is been added so that the admin can delete all the comments

// This one will work for all the orgaineser 
// DONE
route.put("/Org-Verification",auth,IsAdmin,VerifyOrgainezer)
route.delete("/delete-Org",auth,IsAdmin,deleteOrgainezer)
route.delete("/delete-allOrg",auth,IsAdmin,DeleteAllOrgainezers)
route.get("/Get-All-Orgs",auth,GetAllorg)

// DONE all the four are rpresetnt in the admin foldeer in the admin verification file

// This is the one that will work to create the genre 
// DONE

route.post("/Create-Genre",auth,IsAdmin,Creategenre)
route.put("/Update-Genre",auth,IsAdmin,Updategenre)
route.delete("/delete-Genre",auth,IsAdmin,deletegenre)
route.delete("/remove-AllGenre",auth,IsAdmin,deleteAllgenre)
route.get("/Get-AllGenre",auth,IsAdmin,getAllGenres)

// DONE all present from 23 to 27 in the create genre file in the admin folder


// This are the route that are going to create all the sub genre
// DONE

route.post("/Create-SubGenre",auth,IsAdmin,CreateSubgenre)
route.put("/Update-SubGenre",auth,IsAdmin,UpdateSubGenre)
route.delete("/delete-SubGenre",auth,IsAdmin,deletesubgenre)
route.delete("/remove-All-SubGenre",auth,IsAdmin,deleteAllsubGenres)
route.get("/Get-AllSubGenre",auth,IsAdmin,getAllgenre)
// DONE this all are presnt in the sub genre file



// DONE 
// This is the route that is going to create the theatres
route.get("/Theatre-Request",auth,IsAdmin,TheatreCreationRequest)
// ya wo route hain jo ke saare thatre ka data show karena 
// route.get("/Get-AllTheatres",auth,IsAdmin,GetAllTheatres)
// 3 This is the third step for creating the theatre and the fianl step for creating the theatre
route.post("/Theatre-FormData",auth,IsAdmin,CreateTheatres)
// This is the route using which you can forcefully delete a theatre  ... Thinking of it as of now 
// DONE This are all the routes that are present in the create theatres file in the admin folder

// DOne 
// This is the route that is gonng to verify the show
route.put("/Verify-Show",auth,IsAdmin,VerifyShow)
route.get("/Unverified-Shows",auth,IsAdmin,AllShows)
route.get("/Verified-Shows",auth,IsAdmin,verifiedSHows)
route.get("/All-Shows",auth,IsAdmin,AllShows)

route.get("/not-uploaded",auth,IsAdmin,notUploadedShows)
route.get("/verified-not-uploaded",auth,IsAdmin,VerifiedButnotUploaded)

// DONE this are all the routes that are present in the show verify file in the admin folder

// DONE
// This are going to be the routes that are been going  to be used for creating the languages
route.post("/Create-Language",auth,IsAdmin,CreateLanguage)
route.put("/Update-Language",auth,IsAdmin,updateLanguage)
route.delete("/delete-Language",auth,IsAdmin,deleteLanguage)
route.get("/All-Languages",auth,IsAdmin,Getalllanguage)
route.delete("/delete-AllLanguage",auth,IsAdmin,deleteallanguage)
route.get("/Single-Languages",auth,IsAdmin,GetSingleLanguage)
// DONE
// This are all the routes that are present in the create language file in the orgaineser folder

// DONE
// THis will be all the routes that are going to be used for the Admin dashboard
route.get("/Orgaineser-Request",auth,IsAdmin,OrgainesersVerifylength)
route.get("/Theatre-Request",auth,IsAdmin,Theatrelength)
route.get("/Get-AllTheatres",auth,IsAdmin,GetTheatreDetails)
// Verify Theatre

route.get("/Verified-Users",auth,IsAdmin,GetAllUsersDetailsVerified)
route.get("/Unverified-Users",auth,IsAdmin,GetAllUsersDetailsVerifiedfalse)
route.get("/Verified-Orgainesers",auth,IsAdmin,GetAllOrganizerDetailsVerified)
route.get("/Unverified-Orgainesers",auth,IsAdmin,GetAllOrganizerDetailsVerifiedfalse)
route.put("/Verify-Theatres",auth,IsAdmin,VerifyTheatrer)
route.get("/Unverified-Theatres",auth,IsAdmin,GetAllTheatrerDetailsVerifiedfalse)
// DONE this are all the routes that are present in the admin dashboard file in the dashboard folder

module.exports = route