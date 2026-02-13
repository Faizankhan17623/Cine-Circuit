const { ObjectId } = require('mongodb');
const language = require('../../models/CreateLanguage')
// THis is the function which is present in the admin route on line no 61
exports.CreateLanguage = async(req,res)=>{
    try {
        const {langname} = req.body
        const Finding = await language.findOne({name:langname})
        if(Finding){
            return res.status(400).json({
                message:"This language name is already been taken please take another one",
                success:false
            })
        }
        const Creation = await language.create({name:langname})
        return res.status(200).json({
            message:"The new language is been created",
            success:true,
            data:Creation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create language code ",
            success:false
        })
    }
}
// This is the function which is present in the admin route on line no 62
exports.updateLanguage = async(req,res)=>{
    try {
        const {newname,id} = req.body

        const Finding = await language.findOne({_id:id})
        if(!Finding){
            return res.status(404).json({
                message:"This language is not present please check your inputs",
                success:false
            })
        }

        const nameFinding = await language.findOne({name:newname})
        if(nameFinding){
            return res.status(404).json({
                message:"This language is not present please check your inputs",
                success:false
            })
        }
        const Ides = new ObjectId(id);
        const updation = await language.findOneAndUpdate(Ides,{name:newname},{new:true})
        return res.status(200).json({
            message:"The new language is been created",
            success:true,
            data:updation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the update language code ",
            success:false
        })
    }
}
// this is the function which is present in the admin route on line no 63
exports.deleteLanguage = async(req,res)=>{
    try {
        const {id} = req.body
        const Finding = await language.findOne({_id:id})
        if(Finding){
            return res.status(400).json({
                message:"This language name is not present please recheck",
                success:false
            })
        }

        const updation = await language.findByIdAndDelete(id,{new:true})
        return res.status(200).json({
            message:"The language is been deleted",
            success:true,
            data:updation
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete language code ",
            success:false
        })
    }
}
// This is the function which is present in the admin route on line no 64
// This function is alos present in the create show route on line no 23
exports.Getalllanguage = async(req,res)=>{
    try {
        const Finding = await language.find()
        if(!Finding){
            return res.status(400).json({
                message:"There are no languages created please create one",
                success:false,
                data:Finding
            })
        }

        return res.status(200).json({
            message:"This is the list of all the languages present",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all language code ",
            success:false
        })
    }
}
// This is the function which is present in the admin route on line no 65
exports.deleteallanguage = async(req,res)=>{
    try {
        const Finding = await language.find()
        if(!Finding){
            return res.status(400).json({
                message:"There are no languages created please create one",
                success:false,
                data:Finding
            })
        }

        const Deletion = await language.deleteMany(Finding)
        return res.status(200).json({
            message:"Congrogulations all the languages are been deleted",
            success:true,
            data:Finding,
            deletion:Deletion
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete all language code ",
            success:false
        })
    }
}
// This is the function which is present in the admin route on line no 66
// This function is also present in the create show route on line no 24
exports.GetSingleLanguage = async(req,res)=>{
    try {
        const LangName = req.query.LangName ? req.query.LangName:null
        
        if(!LangName){
            return res.status(400).json({
                message:"The language name is not present please enter one",
                success:false
            })
        }
        
        const Finding = await language.findOne({name:LangName})
        if(!Finding){
            return res.status(400).json({
                message:"no languages are been created with this name",
                success:false
            })
        }

        return res.status(200).json({
            message:"This language is present",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in get single language  code",
            success:false
        })
    }
}
