const CreateShow = require('../../models/CreateShow')

// THis is the function that is been created on the route of orgainezer on line no 15
// it is also preseent in the user route 
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 37
exports.AllShows = async(req,res)=>{
    try {

        const GetAll = await CreateShow.find({uploaded:true,VerifiedByTheAdmin:true})
        if(!GetAll ||  GetAll.length === 0){
            return res.status(400).json({
                message:"There are no shows created till now ",
                success:false
            })
        }
        // console.log("These are all the shows that are beeen created",GetAll)

        return res.status(200).json({
            message:"These are all the shows that are been created",
            success:true,
            data:GetAll
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            messsage:"There is an error in the Get all show code",
            success:false
        })
    }
}


// show should not be found by the id but by the name of the title of the show 
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 39
exports.usingtitle = async(req,res)=>{
    try {
        const Showtitle = req.query.ShowId
        if(!Showtitle){
            return res.status(400).json({
                message:"The show id is been required",
                success:false
            })
        }
        const Finding = await CreateShow.findOne(({title:Showtitle}))
        if(!Finding){
            return res.status(400).json({
                message:"Please check the title of the show that you have given",
                success:false
            })
        }

        if(Finding.uploaded === false){
            return res.status(400).json({
                message:"The show is not uploaded",
                success:false
            })
        }

        return res.status(200).json({
            message:"This is the show that you are requesting",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            messsage:"There is an error in the  show Finding code",
            success:false
        })
    }
}

exports.notUploadedShows = async(req,res)=>{
    try {
        const Finding = await CreateShow.find({uploaded:false})
        // console.log("These are all the shows that are not uploaded",Finding)
        return res.status(200).json({
            message:"These are the shows that are not been uploaded",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
            return res.status(500).json({
            messsage:"There is an error in the  show not uploaded codeFinding code",
            success:false
        })
    }
}

exports.VerifiedButnotUploaded = async(req,res)=>{
    try {
        const Finding = await CreateShow.find({VerifiedByTheAdmin:true,uploaded:false})
            .populate('genre')
            .populate('language')
            .populate('castName')
            .populate('hashtags')

        if(!Finding || Finding.length === 0){
            return res.status(200).json({
                message:"There are no verified shows ready to upload",
                success:true,
                data:[]
            })
        }

        return res.status(200).json({
            message:"These are the shows that are verified but not uploaded",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
            return res.status(500).json({
            messsage:"There is an error in the show that is verified but not uploaded code",
            success:false
        })
    }
}


exports.FindAllExpiredShows = async(req,res)=>{
    try{
        const finding = await CreateShow.find({movieStatus:'Expired'})

        if(!finding || finding.length === 0){
            return res.status(400).json({
                message:"There are no expired show at the current moment",
                success:false
            })
        } 


        return res.status(200).json({
            message:"These are all the expired shows",
            data:finding,
            success:true
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
            return res.status(500).json({
            messsage:"There is an error in the find all the expired show code",
            success:false
        })
    }
}