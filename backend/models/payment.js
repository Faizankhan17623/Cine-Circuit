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
            },
            seats:[{
                type:String
            }]
        }
    ],
    time:{
        type:String,
        required:true
    },
    Payment_Status: {
        type: String,
        enum: ["pending", "success", "failure", 'created'],
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
    ticketid:{
        type:String
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
    couponCode: {
        type: String,
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    originalAmount: {
        type: Number,
        default: null
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    checkedInAt: {
        type: String,
        default: null
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    cancelledAt: {
        type: String,
        default: null
    },
    refundId: {
        type: String,
        default: null
    },
    refundStatus: {
        type: String,
        enum: ["none", "pending", "processed", "failed"],
        default: "none"
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    walletAmountUsed: {
        type: Number,
        default: 0
    },
},{timestamps:true})

// Indexes — these fields are looked up on every payment verification / user history
paymentSchema.index({ userid: 1 })
paymentSchema.index({ showid: 1 })
paymentSchema.index({ theatreid: 1 })
paymentSchema.index({ razorpay_order_id: 1 })

module.exports = mongoose.model("payment",paymentSchema)