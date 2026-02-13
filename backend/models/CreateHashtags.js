const mongoose = require('mongoose')
const CreatehashtagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
})
module.exports = mongoose.model("Hashtags",CreatehashtagSchema)