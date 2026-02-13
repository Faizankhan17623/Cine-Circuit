const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({
    razorpay_payment_id:{
        type:String
    },
    razorpay_order_id:{
        type:String
    },
    razorpay_signature:{
        type:String
    },
    ticketCategorey:[
        {
            categoryid:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"CreateTicket"
            },  
            categoryName:{
                type:String,
                required:true
            },
            price:{
                type:String,
                required:true
            },
            ticketsPurchased:{
                type:String,
                required:true
            }
        }
    ],
    time:{
        type:String,
        required:true
    },
    Payment_Status: {
        type: String,
        enum: ["success", "failure",'created'],
        default: "pending",
    },
    showid:{
        type:String,
        required:true
    },
    // yaha taak saab theek ho gaya hain
        amount:{
            type: Number,
            required: true,
        },
    totalTicketpurchased:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    theatreid:{
        type:String,
        required:true
    },
    paymentDate:{
        type:String
    },
    purchaseDate:{
        type:String
    },
    paymentMethod: {
        type: String,
    },
    Showdate:{
        type:String
    },
},{timestamps:true})
module.exports = mongoose.model("payment",paymentSchema)