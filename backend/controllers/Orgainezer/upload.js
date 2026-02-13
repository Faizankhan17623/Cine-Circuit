const CreateShow = require('../../models/CreateShow')
// This is the function thatis present in the createe sho route on the line no 50
exports.uploadtheshow = async(req,res)=>{
    try {
        const id = req.query.id

        if(!id){
            return res.status(404).json({
                message:"The id is not been found",
                success:false
            })
        }

        const Finding = await CreateShow.findById(id)
        // console.log(Finding)
        if(!Finding){
            return res.status(400).json({
                message:"The show is not been found please check inputs",
                success:false
            })
        }
        if(Finding.VerifiedByTheAdmin === false){
            return res.status(400).json({
                message:"you canot upload the show untill it is verified by the admin",
                success:false
            })
        }

        if(Finding.uploaded === true){
            return res.status(400).json({
                message:"The show is already been uploaded and you are trying to re-upload it",
                success:false
            })
        }
        const time = new Date(Date.now())
        if(Finding.VerifiedByTheAdmin === true){
            const updating = await CreateShow.findByIdAndUpdate(id,{uploaded:true,uploadingTime:time},{new:true})
            // console.log("This is the updatedd result",updating)
            return res.status(200).json({
                message:"you show is been uploaded",
                success:true,
                data:updating
            })
        }
        

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the upload the show  code",
            success:false
        })
    }
}
