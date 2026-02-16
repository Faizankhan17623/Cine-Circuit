const cast = require('../../models/Createcast')
const {uploadDatatoCloudinary}= require('../../utils/imageUploader')
const USER = require('../../models/user')

// This is the function that is present in the create show file route on line no 29
exports.CreateCast = async(req,res)=>{
    try {
        const {name} = req.body
        const UserId = req.USER.id
        // 1. Validate name first before using it
        if(!name){
            return res.status(400).json({
                message:"The name field is required",
                success:false
            })
        }

        // 2. Check if files exist before accessing them
        if(!req.files || !req.files.image){
            return res.status(400).json({
                message:"The image is required",
                success:false
            })
        }

        // 3. Now safe to access the image
        const image = req.files.image

        // 4. Check for duplicate cast name
        const Finding = await cast.findOne({name:name})
        if(Finding){
            return res.status(400).json({
                message:"This name is already taken or this cast is already present",
                success:false
            })
        }

        // 5. Validate image format - compare extracted type with allowed types
        const Image_Format = ["jpeg", "jpg", "png", "webp"]
        let imageTypes = image.mimetype.split('/')[1].toLowerCase();
        if(!Image_Format.includes(imageTypes)){
            return res.status(400).json({
                message:"The image type is not valid. Allowed types: JPEG, JPG, PNG, WEBP",
                success:false
            })
        }

        const imageUploading = await uploadDatatoCloudinary(image,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
        const creation = await cast.create({
            name:name,
            images:imageUploading.secure_url,
            userid:UserId
        })
        console.log(`The image is been uploaded`.bgRed)

        return res.status(200).json({
            message:"The cast for the show is been created",
            success:true,
            data:creation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create cast code",
            success:false
        })
    }
}
// This is the function that is present in the create show file route on line no 30
exports.updateCastname = async (req,res)=>{
    try{
        const {newname,id} = req.body

        if(!newname || !id){
            return res.status(400).json({
                message:"the input field is been required",
                success:false
            })
        }
        const Finding = await cast.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This name is alreay been taken ir this cast is alreay present",
                success:false
            })
        }

        const nameFinding = await cast.findOne({name:newname})
        if(nameFinding){
            return res.status(400).json({
                message:"This name is alreay been taken ir this cast is alreay present",
                success:false
            })
        }

        const timeNow = new Date(Date.now())
        const updating = await cast.findByIdAndUpdate(id,{name:newname,updatedAt:timeNow},{new:true})

        return res.status(200).json({
            message:"The cast name is been updated",
            success:true,
            data:updating
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update cast name code",
            success:false
        })
    }
}
// This is the function that is present in the create show file route on line no 31
exports.updatecastimage = async (req,res)=>{
    try{
        const {id} = req.body
        const image = req.files.image

        if(!id){
            return res.status(400).json({
                message:"the input field is been required",
                success:false
            })
        }


        const Finding = await cast.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This id  is not preseent please check your inpputs",
                success:false
            })
        }
        if(!req.files || !req.files.image){
            return res.status(400).json({
                message:"The images are been important",
                success:false
            })
        }
        const Image_Format = ['png','jpeg','jpg']
        let imageTypes = image.mimetype.split('/')[1].toLowerCase();
        if(!Image_Format.includes(imageTypes)){
            return res.status(400).json({
                message:"The image type is not valid",
                success:false
            })
        }

        const imageUploading = await uploadDatatoCloudinary(image,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
        const creation = await cast.findByIdAndUpdate(id,{images:imageUploading.secure_url},{new:true})
        console.log(`The image is been uploaded`.bgRed)
    // console.log(imageUploading)
    return res.status(200).json({
        message:"The cast for the show is been created",
        success:true,
        data:creation
    })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the image updation code",
            success:false
        })
    }
}
// This is the function that is present in the create show file route on line no 32
exports.deletecast = async (req,res)=>{
    try{
        const {id} = req.body

        if(!id){
            return res.status(400).json({
                message:"the input field is been required",
                success:false
            })
        }
        const Finding = await cast.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"This name is alreay been taken ir this cast is alreay present",
                success:false
            })
        }


        const deletion = await cast.findByIdAndDelete(id,{new:true})
        return res.status(200).json({
            message:"The cast is been deleted",
            success:true,
            data:deletion
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the cast deletion code",
            success:false
        })
    }
}
// This is thee function that is present in the create show file route on line no 33
exports.getwholecastlist = async (req,res)=>{
    try{
        const UserId = req.USER.id

        const data = await cast.find({userid:UserId})
        if(!data){
            return res.status(400).json({
                message:"no cast is been created till now",
                success:false
            })
        }
        return res.status(200).json({
            message:"This is the whole cast data",
            success:true,
            data:data
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the  get whole cast list code",
            success:false
        })
    }
}

// This is the function that is present in the create show file route on line no 34
exports.FindSingleCast = async (req,res)=>{
    try{
        const {CastName} = req.body

        if(!id){
            return res.status(400).json({
                message:"the input field is been required",
                success:false
            })
        }
        const Finding = await cast.findOne({name:CastName})
        if(!Finding){
            return res.status(400).json({
                message:"The input name that you are giving is not been found",
                success:false
            })
        }


        return res.status(200).json({
            message:"The cast is been Found",
            success:true,
            data:Finding
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the cast Finding code",
            success:false
        })
    }
}