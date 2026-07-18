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
                type:Number,
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
                },
                seatsPerRow: {
                    type: Number,
                    default: 10
                }
            }],
            // Seats booked so far, grouped per showtime so the same category
            // capacity can be reused safely across the different `timings` entries.
            bookedSeats: [{
                time: {
                    type: String,
                    required: true
                },
                category: {
                    type: String,
                    required: true
                },
                seats: [{
                    type: String
                }]
            }],
            Date:{
                type:String,
                required:true
            },
            TicketsRemaining: {
                type: Number
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

        // Ticket availability lookups
        createTicketSchema.index({ showId: 1 })
        createTicketSchema.index({ theatreId: 1 })
        createTicketSchema.index({ Owner: 1 })

        module.exports = mongoose.model("CreateTicket",createTicketSchema)

