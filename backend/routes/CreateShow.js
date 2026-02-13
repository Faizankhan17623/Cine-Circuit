const express = require('express')
const route = express.Router()

const {Createtags,updateTagsname,DeleteTagsname,getAlltags,SearchTags} = require('../controllers/Orgainezer/CreateHashtags')
const {auth,IsOrganizer} = require('../middlewares/verification')
const {Getalllanguage,GetSingleLanguage} = require('../controllers/Orgainezer/CreateLanguage')
const {CreateShow,updateMovieStatus,UpdateShowtitle,UpdateShowtagline,UpdateTitleImage,UpdateTitletrailer,deleteShow,DeleteAllShow} = require('../controllers/Orgainezer/CreateTheatreShow')
const {CreateCast,updateCastname,updatecastimage,deletecast,getwholecastlist,FindSingleCast} = require('../controllers/Orgainezer/CreateCast')
const {uploadtheshow} = require('../controllers/Orgainezer/upload')
const {getAllGenres} = require('../controllers/Administrator/CreateGenre')
const {getAllgenre} = require('../controllers/Administrator/CreateSubGenre')
const {AllShows} = require('../controllers/common/Showlist')
// THis is the route that will create the tags for the show
// DONE
// These all the function are present in the create hashtags file 

route.post("/Create-tags",auth,IsOrganizer,Createtags)
route.put("/Update-tags",auth,IsOrganizer,updateTagsname)
route.delete("/Delete-tags",auth,IsOrganizer,DeleteTagsname)
route.get("/Get-Alltags",auth,IsOrganizer,getAlltags)
route.get("/Search-tags",auth,IsOrganizer,SearchTags)
// DONE

route.get('/Both-Verified_data',auth,IsOrganizer,AllShows)
route.get('/genre',auth,IsOrganizer,getAllGenres)
route.get('/sub-genre',auth,IsOrganizer,getAllgenre)
// DONE
// This is the route that is going to be used to get all the languages that are been available
route.get("/Get-AllLanguages",auth,IsOrganizer,Getalllanguage)
route.get("/Find-Singlelanguage",auth,IsOrganizer,GetSingleLanguage)
// DONE This all the routes are present in the create language file

// Done 
// This is the route that is going to be used to create the cast 
route.post("/Create-cast",auth,IsOrganizer,CreateCast)
route.put("/Update-castName",auth,IsOrganizer,updateCastname)
route.put("/Update-castImage",auth,IsOrganizer,updatecastimage)
route.delete("/Delete-cast",auth,IsOrganizer,deletecast)
route.get("/Get-WholeCast",auth,IsOrganizer,getwholecastlist)
route.get("/Find-SingleCast",auth,IsOrganizer,FindSingleCast)
// Done 



// This is the route that is going to be used to create the show
route.post("/Create-Show",auth,IsOrganizer,CreateShow)
route.put("/Update-ShowTitle",auth,IsOrganizer,UpdateShowtitle)
route.put("/Update-TagLine",auth,IsOrganizer,UpdateShowtagline)
route.put("/Update-TitleImage",auth,IsOrganizer,UpdateTitleImage)
route.put("/Update-TitleTrailer",auth,IsOrganizer,UpdateTitletrailer)
route.delete("/delete-show",auth,IsOrganizer,deleteShow)
route.delete("/delete-Allshow",auth,IsOrganizer,DeleteAllShow)

// DONE
// THis is the route that is going to upload the show
route.put("/Upload",auth,IsOrganizer,uploadtheshow)
module.exports = route

// /api/v1/Show/Get-Alltags