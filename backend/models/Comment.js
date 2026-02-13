const mongoose = require('mongoose')
const CreateComment = new mongoose.Schema({
    Showid:[{
        type:String,
        required:true
    }],
    data:{
        type:String,
        required:true,
        maxlength:150,
    },
    CreatedAt:{
        type:String,
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model("Comment",CreateComment)