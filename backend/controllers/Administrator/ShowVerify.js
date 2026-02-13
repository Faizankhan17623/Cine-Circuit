const USER = require('../../models/user')
const CreateShow = require('../../models/CreateShow')
const SendMessage = require('../../models/Createmessage')
// This is the function that is present in the admin route on line no 54
exports.VerifyShow = async (req, res) => {
    try {
        const id = req.query.id
        const {Validation} = req.body
        if (!id) {
            return res.status(400).json({
                message: "The input ID is required",
                success: false,
            });
        }
        // Find the show by ID
        const Finding = await CreateShow.findById(id);
        if (!Finding) {
            return res.status(404).json({
                message: "The show was not found",
                success: false,
            });
        }
        const date = new Date(Date.now())
        if(typeof Validation == 'boolean'){
            const updating = await CreateShow.findByIdAndUpdate(
                id,
                { VerifiedByTheAdmin: Validation ,VerificationTime:date}, 
                { new: true }
            );
    
            // console.log(updating);
            return res.status(200).json({
                message: "The show has been verified",
                success: true,
                updatedShow: updating
            });

        }else{
            return res.status(400).json({
                message: "The validation type should be boolean",
                success: false,
            });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "There was an error verifying the show",
            success: false,
        });
    }
};

// This is the function that is present in the admin route on line no 55
exports.GetAllShows = async(req,res)=>{
    try{
        const Finding = await CreateShow.find({VerifiedByTheAdmin:false})
            .populate('genre')
            .populate('SUbGenre')
            .populate('language')
            .populate('castName')
            .populate('hashtags')
        if(!Finding || Finding.length === 0){
            return res.status(200).json({
                message:"There are no shows to verify",
                success:true,
                data:[]
            })
        }

        return res.status(200).json({
            message:"These are the list of all unverified shows",
            success:true,
            data:Finding
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: "There was an error in the Get All show code",
            success: false,
        });
    }
}
// This is the function that is present in the admin route on line no 56
exports.verifiedSHows = async(req,res)=>{
    try{
        const Finding = await CreateShow.find({VerifiedByTheAdmin:true})
            .populate('genre')
            .populate('SUbGenre')
            .populate('language')
            .populate('castName')
            .populate('hashtags')
        if(!Finding || Finding.length === 0){
            return res.status(200).json({
                message:"There are no verified shows",
                success:true,
                data:[]
            })
        }

        return res.status(200).json({
            message:"These are the list of all verified shows",
            success:true,
            data:Finding
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: "There was an error in the Get All show code",
            success: false,
        });
    }
}
// This is the function that is present in the admin route on line no 57
exports.AllShows = async(req,res)=>{
    try{
        const Finding = await CreateShow.find()
            .populate('genre')
            .populate('SUbGenre')
            .populate('language')
            .populate('castName')
            .populate('hashtags')
        if(!Finding || Finding.length === 0){
            return res.status(200).json({
                message:"There are no shows",
                success:true,
                data:[]
            })
        }

        return res.status(200).json({
            message:"These are the list of all shows",
            success:true,
            data:Finding
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: "There was an error in the Get All show code",
            success: false,
        });
    }
}