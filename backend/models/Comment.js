const mongoose = require('mongoose')
const CreateComment = new mongoose.Schema({
    Showid:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
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

// Comment lists are fetched per-show / per-user
CreateComment.index({ Showid: 1 })
CreateComment.index({ userId: 1 })

module.exports = mongoose.model("Comment",CreateComment)