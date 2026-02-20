const mongoose = require('mongoose')
const CreateComment = new mongoose.Schema({
    Showid:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    data:{
        type:String,
        required:true,
        maxlength:500,
    },
    CreatedAt:{
        type:String,
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model("Comment",CreateComment)    