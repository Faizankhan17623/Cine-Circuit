const mongoose = require('mongoose')

const CreateLanguageSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})
module.exports = mongoose.model('Languages',CreateLanguageSchema)