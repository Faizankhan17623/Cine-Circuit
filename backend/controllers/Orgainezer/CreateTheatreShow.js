const CreateShow = require('../../models/CreateShow')
const {uploadDatatoCloudinary} = require('../../utils/imageUploader')
const genre = require('../../models/genre')
const subgenre = require('../../models/subgenre')
const language = require('../../models/CreateLanguage')
const hashtags = require('../../models/CreateHashtags')
const cast = require('../../models/Createcast')
const USER = require('../../models/user')
const message = require('../../models/Createmessage')
const mongoose = require('mongoose')
const date = require('date-and-time')
const cookie = require('cookie-parser')
const cron = require('node-cron')
const Theatres = require('../../models/Theatres')

// Helper function to convert total seconds to the duration format
function convertSecondsToDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor((totalSeconds % 3600) % 60)
  
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
}  
// This is the function that is present in the create show route on line noe 40

exports.CreateShow = async(req,res)=>{
    try {
        const userid = req.USER.id

        const {title,tagline,releasedate,genreid,subgenereid,languagename,castid=[],directorname,producername,writersname,totalbudget,hashid,Duration} = req.body
        const image = req.files.image
        const trailer = req.files.trailer
        // console.log('THis is the image ',image.size)
        // console.log("This is the trailer",trailer.size)

        const UserVerify = await USER.findOne({_id:userid})

        if(UserVerify.verified === false){
            return res.status(400).json({
                message:"The user is not verified you cannot create a show",
                success:false
            })
        }
        const max_upload_size = 100
        if(!title || !tagline || !releasedate || !genreid || !subgenereid || !languagename  || !castid || !directorname ||!producername||!writersname || !totalbudget || !hashid ||!Duration    ){
            return res.status(400).json({
                message:"This input fields are been required",
                success:false
            })
        }

        
        if(!req.files.image || !req.files.trailer || !req.files){
            return res.status(400).json({
                message:"The input fields of the images are been required",
                success:false
            })
        }

        const Image_Format = ['png','jpeg','jpg']
        const Video_Format = ['mp4','mov','mkv','gif','mkv','mpeg']

        let imageTypes = image.mimetype.split('/')[1].toLowerCase();

        let VideoTypes = trailer.mimetype.split('/')[1].toLowerCase()


        if(!Image_Format.includes(imageTypes)){
            return res.status(400).json({
                message:`The image type is not valid The valid types are ${Image_Format}`,
                success:false
            })
        }


        if(!Video_Format.includes(VideoTypes)){
            return res.status(400).json({
                message:`The video type is not valid The valid types are ${Video_Format}`,
                success:false
            })
        }

      if (image.size / (1024 * 1024) > max_upload_size || trailer.size / (1024 * 1024) > max_upload_size) {
  return res.status(400).json({
    error: `Image or video file too large. Max allowed is ${max_upload_size} MB`,
    success: false,
  });
}

        const FindingTitle = await CreateShow.findOne({title:title})
        const FindingTagline = await CreateShow.findOne({tagline})
        const findingGenreid  = await genre.findOne({_id:genreid})
        const findingsubGenreid  = await subgenre.findOne({_id:subgenereid})
        const FindingLanguage = await language.findOne({name:languagename})
        
        if (!Array.isArray(castid) || castid.length === 0) {
  return res.status(400).json({
    message: "At least one cast ID is required and must be an array.",
    success: false
  });
}


        const castFinding = await cast.find({_id:{$in:castid}})
        
        // console.log(castFinding)
        // console.log(castid)

        const haahsFinding = await hashtags.findOne({_id:hashid})

        if(FindingTitle){
            return res.status(400).json({
                message:"This title is already been present pleasea take antoher one",
                success:false
            })
        }

        if(FindingTagline){
            return res.status(400).json({
                message:"This tagline is already presnnt please take antoher one",
                success:false
            })
        }

        if(!findingGenreid){
            return res.status(400).json({
                message:"This genre id is not present please re check",
                success:false
            })
        }

        if(!findingsubGenreid){
            return res.status(400).json({
                message:"This sub genre id is not present please re chek it again",
                success:false
            })
        }

        if(!FindingLanguage){
            return res.status(400).json({
                message:"This language is not present please check it again",
                success:false
            })
        }

       
if (castFinding.length !== castid.length) {
  return res.status(400).json({
    message: "One or more cast IDs are invalid.",
    success: false
  });
}
        if(!haahsFinding){
            return res.status(400).json({
                message:"The hash id is not present please re check it again",
                success:false
            })
        }
        
        const now = new Date(Date.now())
        const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
        let ps = date.format(now, pattern);
        const releasingDate =   date.parse(releasedate,'DD/MM/YYYY')


        if(!releasingDate || isNaN(releasingDate.getTime())){
            return res.status(400).json({ message: "The release date is not valid. Use DD/MM/YYYY format.", success: false });
        }

        const formattedReleaseDate = date.format(releasingDate, 'ddd, DD MMM YYYY');
        if( now > releasingDate){
            return res.status(400).json({
                message:'The release date should be in future not in the past',
                date:`Date today ${ps} \n Date you are trying to release on ${releasingDate}`,
                success:false
            })
        }


        if(formattedReleaseDate === ps){
            return res.status(400).json({
                message: 'The show cannot be uploaded on the same day it is created. Choose a future date.',
                success: false,
                date: `Today: ${ps}, You entered: ${formattedReleaseDate}`
            });
        }

        const diff = releasingDate.getTime() - now.getTime()
        const uploadingAfter = 60 * 60 * 1000


        let uploadingAfterDays = now.getTime() + uploadingAfter
        if( diff < uploadingAfter){
            return res.status(400).json({
                message:'The release date should be atleast after two days of creating the show',
                date:`Date today ${ps} \n Date you can release ${date.format(new Date(uploadingAfterDays),'ddd, DD MMM YYYY')}`,
                success:false
            })
        }

        if (!process.env.CLOUDINARY_FOLDER_NAME) {
            return res.status(500).json({
                message: "Cloudinary folder name is not defined in the environment variables",
                success: false
            });
        }

        var postersending 
        var trailerSending

        try {
            postersending = await uploadDatatoCloudinary(image,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
            trailerSending = await uploadDatatoCloudinary(trailer,process.env.CLOUDINARY_FOLDER_NAME)
        } catch (uploadError) {
            console.log("THis is the cloudinary uploding error",uploadError)
            return res.status(500).json({
                message: "Error uploading files to Cloudinary",
                success: false
            });
        }

        let conversion =  convertSecondsToDuration(trailerSending.duration)
        // console.log("This is the whole conversion",conversion)
        const Creation = await CreateShow.create({
            title:title,
            tagline:tagline,
            Posterurl:postersending.secure_url,
            trailerurl:trailerSending.secure_url,
            showType:"Theatre",
            createdAt:now,
            uploaded:false,
            VerifiedByTheAdmin:false,
            directorname:directorname,
            producername:producername,
            writersname:writersname,
            totalbudget:totalbudget,
            releasedate:formattedReleaseDate,
            genre:genreid,
            SUbGenre:subgenereid,
            language:FindingLanguage._id,
            TotalDuration:conversion,
            hashtags:hashid,
            uploadingTime:ps,
            movieDuration:Duration,
            movieStatus:'Upcoming',
            castName:castid
        })
        // castName

        await USER.updateOne({_id:req.USER.id},{$push:{showsCreated:Creation._id}})
        return res.status(200).json({
            message:"The show is been created",
            success:true,
            data:Creation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create show code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 41
exports.UpdateShowtitle = async(req,res)=>{
    try {
        const id = req.query.id
        const {newTitle} = req.body
        if(!id || !newTitle){
            return res.status(400).json({
                message:"The id and new title are required",
                success:false
            })
        }

        const Finding = await CreateShow.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This show is not presentplease rechek the id",
                success:false
            })
        }

        if(newTitle === Finding.title){
            return res.status(400).json({
                message:"The old and the new title both are the same",
                success:false
            })
        }
        if(Finding.VerifiedByTheAdmin === false && Finding.uploaded === false){
            const Updating = await CreateShow.findByIdAndUpdate(id,{title:newTitle},{new:true})
            return res.status(200).json({
                message:"The title is been updated",
                success:true,
                data:Updating
            })
        }
        return res.status(400).json({
            message:"The show is already been verified and cannot update it's title",
            success:false
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update show title code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 42
exports.UpdateShowtagline = async(req,res)=>{
    try {
        const Showid = req.query.Showid
        const {newTagline} = req.body
        if(!Showid || !newTagline){
            return res.status(400).json({
                message:"The show id and the new tagline are required",
                success:false
            })
        }

        // console.log("This is the id",s)
        const Finding = await CreateShow.findOne({_id:Showid})
        if(!Finding){
            return res.status(400).json({
                message:"This show is not present please recheck the id",
                success:false
            })
        }

        if(newTagline === Finding.tagline){
            return res.status(400).json({
                message:"The old and the new tagline both are the same",
                success:false
            })
        }

        if(Finding.VerifiedByTheAdmin === false && Finding.uploaded === false){
            const Updating = await CreateShow.findByIdAndUpdate(
                Showid,
                { tagline: newTagline },
                { new: true }
            )
            return res.status(200).json({
                message:"The tagline has been updated",
                success:true,
                data:Updating
            })
        }

        return res.status(400).json({
            message:"The show is already verified and cannot update its tagline",
            success:false
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"There is an error in the update show tagline code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 43
exports.UpdateTitleImage = async(req,res)=>{
    try {
        const newImage = req.files.newImage
        const id = req.query.id

        const Image_Format = ['png','jpeg','jpg']
       

        let imageTypes = newImage.mimetype.split('/')[1].toLowerCase();


        if(!Image_Format.includes(imageTypes)){
            return res.status(400).json({
                message:`The image type is not valid The valid types are ${Image_Format}`,
                success:false
            })
        }

        if(!id ){
            return res.status(400).json({
                message:"The id and the new image are required",
                success:false
            })
        }
       

        if(!req.files || !req.files.newImage || !req.files){
            return res.status(400).json({
                message:"The input fields are required",
                success:false
            })
        }

        
        const Finding = await CreateShow.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This show is not present please rechek the id",
                success:false
            })
        }


        if(Finding.VerifiedByTheAdmin === false && Finding.uploaded === false){
            let imageUpdating
            try {
                imageUpdating = await uploadDatatoCloudinary(newImage,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                const updating = await CreateShow.findByIdAndUpdate(id,{Posterurl:imageUpdating.secure_url},{new:true})
                return res.json({
                    message:"The new image is been uploaded",
                    success:true
                })            
            } catch (uploadError) {
                    console.log("THis is the cloudinary uploding error",uploadError)
                    return res.status(500).json({
                        message: "Error uploading files to Cloudinary",
                        success: false
                    });
            }
        }

        return res.status(400).json({
            message:"The show is already been verified and cannot update it's poster",
            success:false
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update show title code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 44
exports.UpdateTitletrailer = async(req,res)=>{
    try {
        const newTrailer = req.files.newTrailer
        
 const id = req.query.id
        
        if(!id){
            return res.status(400).json({
                message:"The id and new title are required",
                success:false
            })
        }


        
        const Video_Format = ['mp4','mov','mkv','gif','mkv','mpeg']


        let VideoTypes = newTrailer.mimetype.split('/')[1].toLowerCase()


        if(!Video_Format.includes(VideoTypes)){
            return res.status(400).json({
                message:`The video type is not valid The valid types are ${Video_Format}`,
                success:false
            })
        }

       

        if(!req.files || !req.files.newTrailer || !req.files){
            return res.status(400).json({
                message:"The input fields are required",
                success:false
            })
        }

        
        const Finding = await CreateShow.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This show is not present please rechek the id",
                success:false
            })
        }


        if(Finding.VerifiedByTheAdmin === false && Finding.uploaded === false){
            let imageUpdating
            try {
                imageUpdating = await uploadDatatoCloudinary(newTrailer,process.env.CLOUDINARY_FOLDER_NAME)
                let conversion =  convertSecondsToDuration(imageUpdating.duration)
                const updating = await CreateShow.findByIdAndUpdate(id,{trailerurl:imageUpdating.secure_url,TotalDuration:conversion},{new:true})
                return res.json({
                    message:"The new trailer is been uploaded",
                    success:true
                })            
            } catch (uploadError) {
                    console.log("THis is the cloudinary uploding error",uploadError)
                    return res.status(500).json({
                        message: "Error uploading files to Cloudinary",
                        success: false
                    });
            }
        }

        return res.status(400).json({
            message:"The show is already been verified and cannot update it's poster",
            success:false
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update show title code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 45
exports.deleteShow = async(req,res)=>{
    try {
        // This code will delete only one single show 
        const showId = req.query.showId
        if(!showId){
            return res.status(400).json({
                message:"The show id is been required",
                success:false
            })
        }

        const Deetion = await CreateShow.findByIdAndDelete(showId)
        if(!Deetion){
            return res.status(400).json({
                message:"The show is not been found",
                success:false
            })
        }
        return res.status(200).json({
            message:"The show is been deleted",
            success:true,
            data:Deetion
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete show  code",
            success:false
        })
    }
}

// This is the function that is present in the create show route on line 46
exports.DeleteAllShow = async(req,res)=>{
    try {
        // const DeleteAll = await CreateShow.findOne()
        const userId = req.USER.id
        if(!userId){
            return res.status(400).json({
                message:"The user id is not present please log in",
                success:false
            })
        }
        
        const Deletion = await CreateShow.deleteMany({_id:{$in:userId.showsCreated}})    
        if(!Deletion){
            return res.status(400).json({
                message:"There are no shows to  deleted",
                success:false
            })
        }
        if(Deletion.length === 0){
            return res.status(400).json({
                message:"There are no shows present to delete"
            })
        }
        return res.status(200).json({
            message:"all the shows are been deleted",
            success:true,
            data:Deletion
        }) 
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete  all show  code",
            success:false
        })
    }
}



// THis are not for now but for after wards 

// These all are of the users not of the orgainzer
exports.updateUpcomingToReleased = async () => {
    try {
        const currentDate = new Date(Date.now());
        currentDate.setHours(0, 0, 0, 0);
        // console.log('Printing the current date',currentDate)
        const upcomingMovies = await CreateShow.updateMany(
            { 
                movieStatus: "Upcoming", 
                releasedate: { $lte: currentDate } 
            },
            { 
                $set: { 
                    movieStatus: "Released", 
                    lastUpdated: new Date() 
                } 
            }
        );

        console.log(`🎬 Updated ${upcomingMovies.modifiedCount} movies from Upcoming to Released`);
        return {
            success: true
        };
    } catch(error) {
        console.error("Error updating Upcoming to Released:", error);
        throw error;
    }
}

exports.updateReleasedToExpired = async () => {
    try {
        const CurrentDate = new Date();
        CurrentDate.setHours(0, 0, 0, 0);


        const releasedMovies = await CreateShow.find({ movieStatus: "Released" });

        for(const movies of releasedMovies){
            const releaseDate = new Date(movies.releasedate);
            releaseDate.setHours(0, 0, 0, 0);

            const expiryDate = new Date(releaseDate);
            expiryDate.setDate(expiryDate.getDate() + 30); // Add 30 days to the release date

            if(CurrentDate >= expiryDate){
                await CreateShow.findByIdAndUpdate(
                    movies._id,
                    {
                        $set: {
                            movieStatus: "Expired",
                            lastUpdated: CurrentDate
                        }
                    },{new:true}
                );
                console.log(`📅 Updated movie ${movies.title} from Released to Expired`);
            }
        }
        return {
            success: true,
             message: "Movie status update completed"
        };
    } catch(error) {
        console.error("Error updating Released to Expired:", error);
        throw error;
    }
}


exports.SendCustomMessage = async(req,res)=>{
    try {
        const id = req.query.id
        const messages = req.body
        const Finding = await USER.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This user is not present please recheck your id",
                success:false
            })
        }

        const updatin = await message.create({
            to:id,
            message:messages
        })
        await CreateShow.updateOne({customeMessage:updatin.id})
        return res.status(200).json({
            message:"The message is been send",
            success:false
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update show title code",
            success:false
        })
    }
}

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 42
exports.PosterLike = async(req,res)=>{
    try{
        const id = req.query.id
        const userId = req.USER.id

        if(!id){
            return res.status(400).json({
                message:"The input is been required",
                success:false
            })
        }

        const Finding = await CreateShow.findById(id)
        if(!Finding){
            return res.status(400).json({
                message:"The show is not been found please check the inputs",
                success:false
            })
        }

        // Check if THIS user has already liked this show
        const currentUser = await USER.findById(userId)
        const alreadyLiked = currentUser.UserBannerliked.some(showId => showId.toString() === id)
        if(alreadyLiked){
            return res.status(400).json({
                message:"You have already liked this show",
                success:false
            })
        }

        // Increment like count
        await CreateShow.findByIdAndUpdate(id, {$inc:{BannerLiked:1}}, {new:true})
        // Add show to user's liked list
        await USER.findByIdAndUpdate(userId, {$push:{UserBannerliked:id}})

        // If user had previously disliked, remove the dislike
        const hadDisliked = currentUser.UserBannerhated.some(showId => showId.toString() === id)
        if(hadDisliked){
            await USER.findByIdAndUpdate(userId, {$pull:{UserBannerhated:id}})
            await CreateShow.findByIdAndUpdate(id, {$inc:{BannerDisLiked:-1}})
        }

        // Fetch updated counts
        const updatedShow = await CreateShow.findById(id)

        return res.status(200).json({
            message:"You have liked the show",
            success:true,
            likes: Math.max(0, updatedShow.BannerLiked),
            dislikes: Math.max(0, updatedShow.BannerDisLiked)
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the like code",
            success:false
        })
    }
}

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 43
exports.BannerDisliked = async(req,res)=>{
    try{
        const id = req.query.id
        const userId = req.USER.id

        if(!id){
            return res.status(404).json({
                message:"The input fields are been required",
                success:false
            })
        }

        const Finding = await CreateShow.findOne({_id:id})
        if(!Finding){
            return res.status(404).json({
                message:"The show with this id is not present please re-check your inputs",
                success:false
            })
        }

        // Check if THIS user has already disliked this show
        const currentUser = await USER.findById(userId)
        const alreadyDisliked = currentUser.UserBannerhated.some(showId => showId.toString() === id)
        if(alreadyDisliked){
            return res.status(400).json({
                message:"You have already disliked this show",
                success:false
            })
        }

        // Increment dislike count
        await CreateShow.findByIdAndUpdate(id, {$inc:{BannerDisLiked:1}}, {new:true})
        // Add show to user's disliked list
        await USER.findByIdAndUpdate(userId, {$push:{UserBannerhated:id}})

        // If user had previously liked, remove the like
        const hadLiked = currentUser.UserBannerliked.some(showId => showId.toString() === id)
        if(hadLiked){
            await USER.findByIdAndUpdate(userId, {$pull:{UserBannerliked:id}})
            await CreateShow.findByIdAndUpdate(id, {$inc:{BannerLiked:-1}})
        }

        // Fetch updated counts
        const updatedShow = await CreateShow.findById(id)

        return res.status(200).json({
            message:"You have disliked this show",
            success:true,
            likes: Math.max(0, updatedShow.BannerLiked),
            dislikes: Math.max(0, updatedShow.BannerDisLiked)
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the banner disliked code",
            success:false
        })
    }
}
