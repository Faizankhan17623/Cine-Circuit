const hashtags = require('../../models/CreateHashtags')
const USER = require('../../models/user')
// Done
// THis is the function that is present in the create show route on line no 12
exports.Createtags = async(req, res) => {
    try {
        const userId = req.USER.id;
        const { name } = req.body;

        // Validate tagname exists and is not empty
        // console.log(name)
        if (!name ) {
            return res.status(400).json({
                message: "Tag name is required and cannot be empty",
                success: false
            });
        }

        // Clean the tagname (trim and lowercase)
        // const cleanName = tagname.trim().toLowerCase();

        // Check if tag already exists
        const existing = await hashtags.findOne({ name: name });
        if (existing) {
            return res.status(400).json({
                message: "This tag name is already taken",
                success: false
            });
        }

        // Create the hashtag
        const creation = await hashtags.create({
            name: name,
            userid: userId
        });

        return res.status(200).json({
            message: "Tag created successfully",
            success: true,
            data: creation
        });

    } catch (error) {
        console.error("Create Hashtag Error:", error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message,
                success: false
            });
        }

        // Handle duplicate key errors (unique constraint)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "This tag name already exists",
                success: false
            });
        }

        return res.status(500).json({
            message: "Error creating hashtag",
            success: false,
            error: error.message
        });
    }
};
// This is the function that is present in the create show route on line no 13
exports.updateTagsname = async(req,res)=>{
    try{
        const {id,newName} = req.body
        if(!oldname || !newName){
            return res.status(400).json({
                message:"The inputs are been required",
                success:false
            })
        }

        const Finding  = await hashtags.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"There is an error in the update tag name code",
                success:false
            })
        }

        const updating = hashtags.findByIdAndUpdate(id,{name:newName},{new:true})
        return res.status(200).json({
            message:'The hashtags is been updated',
            success:true,
            data:updating
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update tags name code",
            success:false
        })
    }
}
// This is the function that is present in the create show route on line no 14
exports.DeleteTagsname = async(req,res)=>{
    try{
        const id = req.body

        const Finding = await hashtags.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"The hashtags is not been found",
                success:false
            })
        }


        const deletion = await hashtags.findByIdAndDelete(id,{new:true})
        return res.status(200).json({
            message:"The hashtags is been deleted",
            success:true,
            data:deletion
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the Delete tags name code",
            success:false
        })
    }
}
// This is the function that is present in the create show route on line no 15
exports.getAlltags = async (req,res)=>{
    try{
        const userId = req.USER.id

         const data = await hashtags.find({userid:userId})
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
            message:"There is an error in the get all tags code",
            success:false
        })
    }
}

// THis is the function that is present in the create show route on line no 16
exports.SearchTags = async (req,res)=>{
    try {
        const userId = req.USER.id

        const name = req.body
        if(!name){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }
        const Finding = await hashtags.find({name:name,userid:userId})
        if(!Finding){
            return res.status(400).json({
                message:"The tag is not been found",
                success:false
            })
        }

        return res.status(200).json({
            message:"The tag name is been found",
            success:true,
            data:Finding
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the search tags code",
            success:false
        })
    }
}