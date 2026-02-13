const mongoose = require('mongoose')

const GenreCreationSchema = new mongoose.Schema({
    genreName:{
        type:String,
        required:true
    },
    subgeneres:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubGeneres'
    }]
},{timestamps:true})
module.exports = mongoose.model('Genre',GenreCreationSchema)