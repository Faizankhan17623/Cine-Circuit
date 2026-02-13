const mongoose = require('mongoose')

const subGenereSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
},{timestamps:true})
module.exports = mongoose.model('SubGeneres',subGenereSchema)