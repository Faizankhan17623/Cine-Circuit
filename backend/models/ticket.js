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
        type: Number,
        required: true,
    },
    totalTicketsAlloted: [{
        type: Number,
    }],
    priceoftheticket: {
        type: Number,
        required: true,
    },
    TicketsRemaining: {
        type: Number,
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
        ref: "Theatrees", 
    }],
}, { timestamps: true });

CreateTicketSchema.index({ showid: 1 });

module.exports = mongoose.model('Ticket', CreateTicketSchema);