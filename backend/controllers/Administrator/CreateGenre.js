const genre = require('../../models/genre')
const Subgenre = require('../../models/subgenre')

// This is the function that is present in the admin route on line no 22
exports.Creategenre = async(req,res)=>{
    try {
        const {genrename} = req.body
        if(!genrename){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }

        const Finding = await genre.findOne({genreName:genrename})
        const SubFinding = await Subgenre.findOne({name:genrename})
        if(Finding){
            return res.status(400).json({
                message:"This genere is already present please create an another one",
                success:false
            })
        }

    
        if(SubFinding){
            return res.status(400).json({
                message:"This genere is already present in the sub genere plese re check what you are uploading",
                success:false
            })
        }

        const Creation = await genre.create({genreName:genrename})
        return res.status(200).json({
            message:"The genere is been created",
            success:true,
            data:Creation
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
// This is the function that is present in the admin route on line no 23
exports.Updategenre = async(req,res)=>{
    try {
        const {newName,id} = req.body
        if(!newName || id){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }

        const Finding = await genre.findOne({_id:id})
        if(!Finding){
            return res.status(404).json({
                message:"The genre is not beeen found check your inputs",
                success:false
            })
        }

        if(Finding.subgeneres.length === 0 ){
            return res.status(404).json({
                message:"you cannot update this genre as no sub genres are alloted to it",
                success:false
            })
        }

        let nameFindinggenre = await genre.findOne({genreName:newName})
        let nameFindingsubgenre = await Subgenre.findOne({name:newName})

        if(nameFindinggenre){
            return res.status(400).json({
                message:"This genere is already present please create an another one",
                success:false
            })
        }

    
        if(nameFindingsubgenre){
            return res.status(400).json({
                message:"This genere is already present in the sub genere plese re check what you are uploading",
                success:false
            })
        }


        const Updating = await genre.findByIdAndUpdate(id,{genreName:newName},{new:true})

        return res.status(200).json({
            message:"The genere is been updated",
            success:true,
            data:Updating
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update genre code",
            success:false
        })
    }
}
// This is the function that is present in the admin route on line no 24
exports.deletegenre = async(req,res)=>{
    try {
        
        const {id} = req.body
        if(!id){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }


        const Finding = await genre.findOne({_id:id})
        if(!Finding){
            return res.status(404).json({
                message:"The genre is not beeen found check your inputs",
                success:false
            })
        }

        if(Finding.subgeneres.length > 0 ){
            return res.status(404).json({
                message:"you cannot delete this genre as no sub genres are alloted to it",
                success:false
            })
        }


        const deletion  = await genre.findByIdAndDelete(id,{new:true})
        return res.status(200).json({
            message:"This genere is been delete",
            success:true,
            data:deletion
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete genre code",
            success:false
        })
    }
}
// This is the function that is present in the admin route on line no 25
exports.deleteAllgenre = async(req,res)=>{
    try {
        const {id} = req.body
        if(!id){
            return res.status(400).json({
                message:"The input name is been required",
                success:false
            })
        }

        const deletion = await genre.deleteMany({_id:id})
        if(!deletion){
            return res.status(500).json({
                message:"The genre is not been present or already beeen deleted",
                success:false
            })
        }


        return res.status(200).json({
            message:"The genre is been deleted",
            success:true,
            data:deletion
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the deleete all  genre code",
            success:false
        })
    }
}
// This is the function that is present in the admin route on line no 26
exports.getAllGenres = async(req,res)=>{
    try {
        const data = await genre.find()
        // console.log(data)
        if(!data){
            return res.status(404).json({
                message:"no genres are been created till now",
                success:false
            })
        }

        return res.status(200).json({
            message:"This are all the genres and the subgenres",
            success:true,
            data:data
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all the genres and the sub genres code",
            success:false
        })
    }
}