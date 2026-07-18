const mongoose = require('mongoose')
const CreateLanguageSchema =  new mongoose.Schema({
     locationName:{
        type:String,
        required:true,
        unique:true
    },
     locationurl:{
            type:String,
            required:true
        },
        TheatreInsideimages:[{
            type:String,
            required:true
        }],
        Theatreoutsideimages:[{
            type:String,
            required:true
        }],
        typesofseatsAvailable:[{
            type:String,
            required:true
        }],
        CustomMessage:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }],
        movieScreeningType:[{
            type:String,
            required:true
        }],
        languagesAvailable:[{
            type:String,
            required:true
        }],

    Theatrename:{
        type:String,
        required:true
    },
    theatreformat:[{
        type:String,
        required:true
    }],
    CreationDate:{
        type:String,
    },
    // One sub-document per show allotted to this theatre — replaces the old
    // showAlloted/ticketsReceived/ticketsReceivedTime/priceoftheTicket parallel
    // arrays, which were only ever correlated by matching array index and could
    // silently desync (partial writes, concurrent allotments, etc).
    allotments:[{
        showId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Show",
            required:true
        },
        ticketsReceived:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        receivedAt:{
            type:String,
            required:true
        },
        // Running counter of tickets this theatre has distributed into
        // Theatrestickets categories for this show, across all dates.
        // Maintained via $inc so it never needs an O(n) re-sum.
        ticketsDistributed:{
            type:Number,
            default:0
        }
    }],
    issues:{
        type:String,
        maxlength:200
    },
    TheatreOwner:{
        type:String,
        required:true
    },
    ticketCreation:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CreateTicket'
    }],
    parking:[{
        type:String ,
        required:true
    }],
    Owner:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Verified:{
        type:Boolean,
        required:true,
        default:false
    },
    VerifiedAt:{
        type:String
    },
    RejectedAt:{
        type:String
    },
    status:{
        type:String,
        required:true,
        default:"Pending",
        enum :["Pending","Approved","Rejected"]
    }
},{timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}})

// Admin filtering by owner / approval status
CreateLanguageSchema.index({ Owner: 1 })
CreateLanguageSchema.index({ status: 1 })

// Backward-compatible read-only view of allotted show IDs — kept so existing
// frontend code (theatre.showAlloted.length / .some(...)) needs no changes.
CreateLanguageSchema.virtual('showAlloted').get(function () {
    return this.allotments.map(a => a.showId)
})

module.exports = mongoose.model('Theatrees',CreateLanguageSchema)