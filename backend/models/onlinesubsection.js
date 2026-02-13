const mongoose = require('mongoose')
const CreateOnlineSubSection = new mongoose.Schema({
    SubSectioname:{
        type:String,
        required:true,
        unique:true
    },
    sectionvideourl:{
        type:String,
        required:true
    },
    totalvideotime:{
        type:String
    },
    uploaded:{
        type:Boolean,
        required:true,
        default:false
    },
},{timeseries:true})
module.exports = mongoose.model("OnlineSubSection",CreateOnlineSubSection)