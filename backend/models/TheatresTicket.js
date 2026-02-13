        const mongoose = require('mongoose')
        const createTicketSchema = new mongoose.Schema({
            showId:{
                type:String,
                required:true
            },
            userId:{
                type:String,
                required:true
            },
            theatreId:{
                type:String,
                required:true
            },
            pricefromtheorg:{
                type:Number,
                required:true
            },
            totalticketfromorg:{
                type:String,
                required:true   
            },
            ticketsCategory:[{
                category: {
                    type: String,
                    enum: ["Standard", "Premium", "VIP", "Family", "Loyalty"],
                    required: true
                },
                ticketsCreated:{
                    type: Number
                },
                ticketsPurchaseafterRemaining:{
                    type: Number
                    // required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }],
            Date:{
                type:String,
                required:true
            },
            TicketsRemaining: {
                type: String
            },
            timings:[{
                type:String
            }],
            Owner:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Theatrees'
            },
            Status:{
                type:String,
                required:true,
                enum:["Upcoming","Released","Expired"]
            },
            ticketsReceivingTime:{
                type:String,
                required:true
            },
            ticketsPurchased:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"payment"
            }],
            unsoldTickets:[{
                date:{
                    type:String,
                },
                totalTickets:{
                    type:String,
                },
                time:{
                    type:String
                },
            }]
        },{timestamps:true})
        module.exports = mongoose.model("CreateTicket",createTicketSchema)

