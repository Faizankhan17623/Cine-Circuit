const mongoose = require('mongoose')
const genre = require('../../models/genre')
const subgenre = require('../../models/subgenre')
// This function is present in the admin route on line no 33
exports.CreateSubgenre = async(req,res)=>{
    try {
        const {id,subgenrename} = req.body
        if(!subgenrename || !id){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }
        const finding = await genre.findOne({_id:id})
        if(!finding){
            return res.status(404).json({
                message:"The genre is not been found",
                success:false
            })
        }

        const sub = await subgenre.findOne({name:subgenrename})
        if(sub){
            return res.status(404).json({
                message:"The sub genre is already been present please create another one",
                success:false
            })
        }

        const Creation = await subgenre.create({name:subgenrename})
        const {_id} = Creation
        const updating = await genre.findByIdAndUpdate(id,{$push:{subgeneres:_id}},{new:true})
        return res.status(200).json({
            message:"The sub genre is been created",
            success:true
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create genre code",
            success:false
        })       
    }
}

// This function is present in the admin route on line no 34
exports.UpdateSubGenre = async(req,res)=>{
    try {
        const {id,newname} = req.body
        if(!newname || !id){
        return res.status(400).json({
            message:"The input name is been required",
            success:false
        })
    }


    const SUbGenreFindng = await subgenre.findOne({_id:id})

    if(!SUbGenreFindng){
        return res.status(400).json({
            message:"The sub genre is not been found",
            success:false
        })
    }

    const Oldname = await subgenre.findOne({name:newname})

    if(Oldname){
        return res.status(400).json({
            message:"This name is already been present please take aanother name",
            success:false
        })
    }


    const updating = await subgenre.findByIdAndUpdate(id,{name:newname},{new:true})

    return res.status(200).json({
        message:"The sub genre is name is been  updated",
        success:true,
        data:updating
    })   
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update sub genre code",
            success:false
        })
    }
}
// This function is present in the admin route on line no 35
exports.deletesubgenre = async(req,res)=>{
    try{
        const {id} = req.body
        if(!id){
            return res.status(400).json({
                message:"The input is is been required",
                success:false
            })
        }


        const Finding = await subgenre.findOne({_id:id})

        if(!Finding){
            return res.status(400).json({
                message:"The sub genre is not been found",
                success:false
            })
        }


        const deletion = await subgenre.findByIdAndDelete(id,{new:true})

        const objectId = new mongoose.Types.ObjectId(id)
        await genre.updateMany(
            { subgeneres: objectId },
            { $pull: { subgeneres: objectId } }
        )

        return res.status(200).json({
            message:"The sub genre is been deleted",
            success:true,
            data:deletion
        })  
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete sub genre code",
            success:false
        })
    }
}
// This function is present in the admin route on line no 36
exports.deleteAllsubGenres = async(req,res)=>{
    try {
        const {id} = req.body
        if(!id){
            return res.status(400).json({
                message:"The input is is been required",
                success:false
            })
        }


        const deletion = await subgenre.deleteMany(id)

        return res.status(200).json({
            message:"The sub genre is been deleted",
            success:true,
            data:deletion
        })  

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete all sub genre code",
            success:false
        })
    }
}
// This function is present in the admin route on line no 37
exports.getAllgenre = async(req,res)=>{
    try {
        const data =await subgenre.find()
        if(!data){
            return res.status(500).json({
                message:"No sub genre are been created untill now",
                success:false
            })
        }


        return res.status(200).json({
            message:"This are all the subgenres",
            success:true,
            data:data
        })  
        
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all sub genre code",
            success:false
        })
    }
}
