const mongoose = require('mongoose');

const CreateTicketSchema = new mongoose.Schema({
    showid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Show",
        required: true,
    },
    showtype: {
        type: String,
        required: true,
    },
    overallTicketCreated: {
        type: String,
        required: true,
    },
    totalTicketsAlloted: [{
        type: String, 
    }],
    priceoftheticket: {
        type: String,
        required: true,
    },
    TicketsRemaining: {
        type:String, 
    },
    typeofticket: {
        type: String,
        required: true,
    },
    TicketCreationTime: {
        type: String,
        required: true,
    },
    timeofAllotmentofTicket: {
        type: String,
    },
    allotedToTheatres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatres", 
    }],
}, { timestamps: true });

module.exports = mongoose.model('Ticket', CreateTicketSchema);