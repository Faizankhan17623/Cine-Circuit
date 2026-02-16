const mongoose = require('mongoose')
const userSchema =  new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmpass:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    id:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    countrycode:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        required:true,
        enum:["Viewer","Organizer","Administrator","Theatrer"],
        default:"Viewer"
    },
    verified:{
        type:Boolean,
        default:false
    },
    number:{
        type:String,
        required:true,
        match: [/^\d{10}$/, "Invalid phone number"],
    },
    image:{
        type:String,
        required:true
    },
    resetPasswordExpires:{
        type:Date
    },
    theatresCreated:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Theatrees'
    },
    ticketCreated:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket"
    }],
    languagesCreated:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Languages"
    },
    showsCreated:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Show"
    }],
    Casttaken:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cast"
    }],
    currentlocation:{
        latitude:{
            type:String,
        },
        longitude:{
            type:String,
        },
        name:{
            type:String,
        }
    },
    createdAt:{
        type:String,
        required:true
    },
    lastlogin:[{
        type:String,
        required:true
    }],
    UserBannerliked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Show'
    }],
    UserBannerhated:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Show'
    }],
    messageReceived:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    
    lastUsernameUpdate: {
        type: String,
    },
    lastPasswordUpdate: {
        type: String
    },
    lastImageUpdate: {
        type: String
    },
    lastNumberUpdate: { 
        type: String
    },
    PaymentId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment"
    }],
    TheatreDataSend:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TheatreRequests"
    },
    orgainezerdata:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrgainezerData"
    }
},{timestamps:true})
module.exports = mongoose.model('User',userSchema)