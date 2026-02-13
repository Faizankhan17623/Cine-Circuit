const mongoose = require('mongoose')
const date = require('date-and-time');
const CreateShow = require('../../models/CreateShow');
const Theatre = require('../../models/Theatres');
const Ticket = require('../../models/ticket');
const Theatrestickets = require('../../models/TheatresTicket')
const USER = require('../../models/user')

// THis is the function that is been created on the route of orgainezer on line no 14
exports.AllotTheatre = async (req, res) => {
    try {
        const ShowId = req.query.ShowId;
        const TheatreId = req.query.TheatreId;
        const userId = req.USER.id;
        const { TotalTicketsToAllot } = req.body;

        if (!ShowId || !TheatreId || !TotalTicketsToAllot) {
            return res.status(400).json({
                message: "All input fields are required",
                success: false,
            });
        }

        const ShowFinding = await CreateShow.findOne({_id: ShowId});
        if (!ShowFinding) {
            return res.status(404).json({
                message: "Show not found. Please check your input.",
                success: false,
            });
        }

        const TicketsCheckers = await Ticket.findOne({showid: ShowId})
        if (!TicketsCheckers) {
            return res.status(404).json({
                message: "Tickets are not created for this show please go and create ticket",
                success: false,
            });
        }

        const TheatreFinding = await Theatre.findOne({_id: TheatreId});
        if (!TheatreFinding) {
            return res.status(404).json({
                message: "Theatre not found. Please check your input.",
                success: false,
            });
        }

        const ShowAllottingFinding = await Theatre.findOne({showAlloted: ShowId, _id: TheatreId});
        if (ShowAllottingFinding) {
            return res.status(400).json({
                message: "This theatre has already been allotted the show",
                success: false,
            });
        }

        const ticketDetails = await Ticket.findOne({ showid: ShowId });
        if (!ticketDetails) {
            return res.status(404).json({
                message: "No ticket details found for the given show",
                success: false,
            });
        }

        const { priceoftheticket } = ticketDetails;

        // ✅ CONVERT TO NUMBERS
        const ticketsRemaining = Number(ticketDetails.TicketsRemaining);
        const ticketsToAllot = Number(TotalTicketsToAllot);

        // Check if tickets are over
        if (ticketsRemaining === 0) {
            return res.status(400).json({
                message: "The tickets for this show are over",
                success: false,
            });
        }

        if (ShowFinding.VerifiedByTheAdmin === false && ShowFinding.uploaded === true) {
            return res.status(400).json({
                message: "You cannot proceed forward because your show is not verified by the admin",
                success: false
            })
        }

        // ✅ NOW COMPARE NUMBERS, NOT STRINGS
        if (ticketsRemaining < ticketsToAllot) {
            return res.status(400).json({
                message: `Cannot allot more tickets than available. Available: ${ticketsRemaining}, Requested: ${ticketsToAllot}`,
                success: false,
            });
        }

        // ✅ CALCULATE REMAINING AS NUMBER
        const TotalRemaining = ticketsRemaining - ticketsToAllot;

        // Get current timestamp
        const now = new Date();
        const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
        let AllotmentTime = date.format(now, pattern);

        // Update ticket collection
        await Ticket.updateOne(
            { showid: ShowId },
            {
                timeofAllotmentofTicket: AllotmentTime,
                TicketsRemaining: TotalRemaining,  // Store as number
                $push: { 
                    allotedToTheatres: TheatreId,
                    totalTicketsAlloted: ticketsToAllot
                },
            }
        );

        // Update theatre collection
        await Theatre.updateOne(
            { _id: TheatreId },
            { $push: { 
                showAlloted: ShowId,
                ticketsReceived: ticketsToAllot,  // Store as number
                ticketsReceivedTime: AllotmentTime,
                priceoftheTicket: priceoftheticket
            }}
        );
        
        await CreateShow.updateOne(
            {_id: ShowId},
            {$push: {AllotedToTheNumberOfTheatres: TheatreId}}
        )
        
        await USER.updateOne(
            {_id: userId},  // ✅ Fixed: should be userId, not TheatreId
            {$push: {AllotedNumber: TheatreId}}
        )
        
        console.log("Allotted tickets successfully");

        return res.status(200).json({
            message: "Tickets successfully allotted to the theatre",
            success: true,
            data: {
                TheatreId,
                ShowId,
                TotalTicketsToAllot: ticketsToAllot,
                RemainingTickets: TotalRemaining,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while allotting tickets to the theatre",
            success: false,
            error: error.message
        });
    }
};