const mongoose = require('mongoose')
const CreateOnlineSection = new mongoose.Schema({
    Sectioname:{
        type:String,
        required:true,
        unique:true
    },
    sectionimageurl:{
        type:String,
        // required:true
    },
    uploaded:{
        type:Boolean,
        required:true,
        default:false
    },
    reviewed:{
        type:Boolean,
        required:true,
        default:false
    }
},{timeseries:true})
module.exports = mongoose.model("OnlineSection",CreateOnlineSection)