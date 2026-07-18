const mongoose = require('mongoose')
const date = require('date-and-time');
const CreateShow = require('../../models/CreateShow');
const Theatre = require('../../models/Theatres');
const Ticket = require('../../models/ticket');
const Theatrestickets = require('../../models/TheatresTicket')
const USER = require('../../models/user')

// THis is the function that is been created on the route of orgainezer on line no 14
exports.AllotTheatre = async (req, res) => {
    const session = await mongoose.startSession()
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

        const alreadyAllotted = TheatreFinding.allotments.some(a => a.showId.toString() === ShowId.toString())
        if (alreadyAllotted) {
            return res.status(400).json({
                message: "This theatre has already been allotted the show",
                success: false,
            });
        }

        const ticketDetails = TicketsCheckers
        const { priceoftheticket } = ticketDetails;

        const ticketsRemaining = Number(ticketDetails.TicketsRemaining);
        const ticketsToAllot = Number(TotalTicketsToAllot);

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

        if (ticketsRemaining < ticketsToAllot) {
            return res.status(400).json({
                message: `Cannot allot more tickets than available. Available: ${ticketsRemaining}, Requested: ${ticketsToAllot}`,
                success: false,
            });
        }

        const TotalRemaining = ticketsRemaining - ticketsToAllot;

        const now = new Date();
        const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
        let AllotmentTime = date.format(now, pattern);

        // All 4 collections must move together — a crash partway through would
        // otherwise leave the ticket batch decremented but the theatre without
        // its allotment (or vice versa).
        session.startTransaction()

        await Ticket.updateOne(
            { showid: ShowId },
            {
                timeofAllotmentofTicket: AllotmentTime,
                TicketsRemaining: TotalRemaining,
                $push: {
                    allotedToTheatres: TheatreId,
                    totalTicketsAlloted: ticketsToAllot
                },
            },
            { session }
        );

        await Theatre.updateOne(
            { _id: TheatreId },
            { $push: {
                allotments: {
                    showId: ShowId,
                    ticketsReceived: ticketsToAllot,
                    price: Number(priceoftheticket),
                    receivedAt: AllotmentTime,
                    ticketsDistributed: 0
                }
            }},
            { session }
        );

        await CreateShow.updateOne(
            {_id: ShowId},
            {$push: {AllotedToTheNumberOfTheatres: TheatreId}},
            { session }
        )

        await USER.updateOne(
            {_id: userId},
            {$push: {AllotedNumber: TheatreId}},
            { session }
        )

        await session.commitTransaction()

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
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while allotting tickets to the theatre",
            success: false,
        });
    } finally {
        session.endSession()
    }
};
