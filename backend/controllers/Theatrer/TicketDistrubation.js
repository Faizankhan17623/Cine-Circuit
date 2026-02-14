const USER = require('../../models/user');
const Theatrestickets = require('../../models/TheatresTicket');
const Theatre = require('../../models/Theatres');
const CreateShow = require('../../models/CreateShow');
const date = require('date-and-time');

// THis is the function which is present in the theatre route on line no 27
// need to do a lot of changes in the code os we will do it from staring 
// 1 try to understand this code because most of the things are been copied from gpt
exports.TicketDistributionSystem = async (req, res) => {
    try {
        const userId = req.USER.id;
        const ShowId = req.query.ShowId;
        const { ticketsCreation, ReleaseDate } = req.body;
        
        if (!Array.isArray(ticketsCreation) || ticketsCreation.length === 0) {
            return res.status(400).json({
                message: "The ticket creation must be a non-empty array",
                success: false
            });
        }
        if (!ShowId || !userId) {
            return res.status(400).json({
                message: "Show ID and User ID are required",
                success: false
            });
        }
        
        const ShowFinding = await CreateShow.findById(ShowId);
        if (!ShowFinding) {
            return res.status(404).json({
                message: "Show not found, please check your inputs",
                success: false
            });
        }

        const UserFinding = await USER.findById(userId);
        if (!UserFinding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const TheatreFinding = await Theatre.findById(UserFinding.theatresCreated);
        if (!TheatreFinding) {
            return res.status(404).json({
                message: "Theatre not found or not created",
                success: false
            });
        }

        if (!TheatreFinding.showAlloted.includes(ShowId)) {
            return res.status(403).json({
                message: "This show is created, but you are not allotted this show",
                success: false
            });
        }

        const existingTicketForDate = await Theatrestickets.findOne({ theatreId: UserFinding.theatresCreated, showId: ShowId, Date: ReleaseDate });
        if (existingTicketForDate) {
            return res.status(400).json({
                message: `Tickets have already been created for this date: ${ReleaseDate}`,
                success: false
            });
        }

        const index = TheatreFinding.showAlloted.findIndex(id => id.toString() === ShowId.toString());
        const TicketPrice = TheatreFinding.priceoftheTicket[index];
        const TicketReceived = TheatreFinding.ticketsReceived[index];
        const TicketReceivedTime = TheatreFinding.ticketsReceivedTime[index];

        const Dates = new Date()
        const formats = date.format(Dates, "DD/MM/YYYY")
        // console.log("This is for the dates",formats)
        // console.log("This is the release date",ReleaseDate)

        if(ReleaseDate === formats){
            return res.status(400).json({
                message:`you cannot create tickets on the same date as od that is today date ${Dates} release date ${ReleaseDate}`,
                success:false
            })
        }
        
        let totalTicketsCreated = 0 

        for(const tickets of ticketsCreation){
            if(tickets.price < TicketPrice){
                return res.status(400).json({
                    message:`The price cannot be lower then the price that is been given by the orgainzer ${TicketPrice}`,
                    success:false
                })
            }

            if (!tickets.category || !tickets.numberOftickets || !tickets.price) {
                    throw new Error("All ticket details (category, numberOftickets, price) are required");
                }

                 totalTicketsCreated += tickets.numberOftickets
        }



        // console.log("This is the index",index,"This is the ticket price",TicketPrice,"This are the total tickets received,",TicketReceived)
        const ExistingTickets = await Theatrestickets.find({ showId: ShowId, theatreId: UserFinding.theatresCreated }).sort({ Date: -1 }).limit(1);
        let Remaining = ExistingTickets.length > 0 ? ExistingTickets[0].TicketsRemaining - totalTicketsCreated : TicketReceived - totalTicketsCreated;

        if (Remaining < 0) {
            return res.status(400).json({
                message: "Not enough tickets available",
                success: false
            });
        }



        const formattedNow = new Date();
        formattedNow.setHours(0, 0, 0, 0);


const parsedReleaseDate = date.parse(ReleaseDate, "DD/MM/YYYY");
if (!parsedReleaseDate || isNaN(parsedReleaseDate)) {
    return res.status(400).json({
        message: "Invalid date format. Please use DD/MM/YYYY.",
        success: false
    });
}

parsedReleaseDate.setHours(0, 0, 0, 0);

// Check if release date is in the past
if (parsedReleaseDate < formattedNow) {
    return res.status(400).json({
        message: "You cannot create tickets for a date in the past.",
        success: false
    });
}


const tenDaysFromNow = new Date(formattedNow);
tenDaysFromNow.setDate(formattedNow.getDate() + 10);

// Check if release date is more than 10 days away
if (parsedReleaseDate > tenDaysFromNow) {
    return res.status(400).json({
        message: "The release date must be within 10 days from today.",
        success: false
    });
}

// Check if release date is today
if (parsedReleaseDate.getTime() === formattedNow.getTime()) {
    return res.status(400).json({
        message: "You cannot create tickets for today's date.",
        success: false
    });
}


        const TicketCreations = await Theatrestickets.create({
            showId: ShowId,
            theatreId: UserFinding.theatresCreated,
            userId: userId,
            Date: ReleaseDate,
            pricefromtheorg: TicketPrice,
            totalticketfromorg: TicketReceived,
            
            ticketsCategory: ticketsCreation.map(data => ({
                category: data.category,
                price: data.price,
                ticketsCreated: data.numberOftickets,
                ticketsPurchaseafterRemaining:data.numberOftickets
            })),
            
            ticketsReceivingTime: TicketReceivedTime,
            Status: "Upcoming",
            TicketsRemaining: Remaining
        });

  TheatreFinding.ticketCreation.push(TicketCreations._id);
await TheatreFinding.save();

        return res.status(201).json({
            message: "Ticket distribution created successully",
            success: true,
            data: TicketCreations
        });

    } catch (error) {
        console.log("Error in Ticket Distribution:",error)
        console.error( error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

// /THis is the numbeer one code that is been same like the second one
// THis is the function which is present in the theatrer route on line no 29

exports.GetAllticketsCreated = async (req, res) => {
    try {
        const userId = req.USER?.id;  // Ensure req.USER is defined

        if (!userId) {
            return res.status(404).json({
                message: "The user ID is required",
                success: false
            });
        }

        const Finding = await USER.findOne({ _id: userId });

        if (!Finding) {
            return res.status(400).json({
                message: "User not found or not created",
                success: false
            });
        }

        const theatreData = await Theatre.findOne({ _id: Finding.theatresCreated });
        // console.log(theatreData.ticketCreation)
        if (!theatreData) {
            return res.status(400).json({
                message: "No theatre assigned to this user",
                success: false
            });
        }

        if (!theatreData.ticketCreation || theatreData.ticketCreation.length === 0) {
            return res.status(400).json({
                message: "No tickets created for this theatre",
                success: false
            });
        }

        const tickets = await Promise.all(
            theatreData.ticketCreation.map(async (data)=>{
                return await Theatrestickets.findOne({ _id: data })
            })
        )

        const ValidTickets = tickets.filter(ticket => ticket !== null)
            res.status(200).json({
                message: "These are all the created tickets",
                success: true,
                data:ValidTickets
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "There was an error in the Ticket Distribution System",
            success: false
        });
    }
};
// both the codes are the same
const convertTimeToMs = (time) => {
    const [hours, minutes] = time.split(':').map(Number);

    return (hours * 60 * 60 * 1000) +
           (minutes * 60 * 1000);
};

exports.UpdateTime = async (req, res) => {
    try {
        const userId = req.USER.id;
        const { theatreId, ShowId } = req.query;
        const { Ticketid, time } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User not logged in",
                success: false,
            });
        }

        if (!time || !Ticketid) {
            return res.status(400).json({
                message: "Time and Ticket ID are required",
                success: false,
            });
        }

        const TheatreFinding = await Theatre.findById(theatreId);
        if (!TheatreFinding) {
            return res.status(400).json({
                message: "Theatre not found",
                success: false,
            });
        }

        const ShowFinding = await CreateShow.findById(ShowId);
        if (!ShowFinding) {
            return res.status(400).json({
                message: "Show not found",
                success: false,
            });
        }

        const TicketFinding = await Theatrestickets.findById(Ticketid);

        if (!TicketFinding) {
            return res.status(400).json({
                message: "Ticket not found",
                success: false,
            });
        }

        // ✅ Convert duration
        const movieDurationMinutes = Number(ShowFinding.movieDuration);
        const movieDurationMs = movieDurationMinutes * 60 * 1000;

        // ✅ 30 minute buffer
        const bufferMs = 30 * 60 * 1000;

        // ✅ Validate time format
        const [hours, minutes] = time.split(":").map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
            return res.status(400).json({
                message: "Invalid time format. Use HH:mm",
                success: false,
            });
        }

        if (hours < 0 || hours > 23) {
            return res.status(400).json({
                message: "Hours must be between 0 and 23",
                success: false,
            });
        }

        if (minutes < 0 || minutes > 59) {
            return res.status(400).json({
                message: "Minutes must be between 0 and 59",
                success: false,
            });
        }

        // ✅ Convert new time to ms
        const newStartTimeMs = convertTimeToMs(time);

        // ✅ Only check timings inside THIS ticket document
        if (TicketFinding.timings && TicketFinding.timings.length > 0) {

            // Sort timings properly
            const sortedTimings = TicketFinding.timings
                .map(t => convertTimeToMs(t))
                .sort((a, b) => a - b);

            const lastStartTimeMs = sortedTimings[sortedTimings.length - 1];

            const minimumNextStartTime =
                lastStartTimeMs + movieDurationMs + bufferMs;

            if (newStartTimeMs < minimumNextStartTime) {
                return res.status(400).json({
                    message: `Next show must start after movie duration (${movieDurationMinutes} mins) + 30 min buffer.`,
                    success: false,
                });
            }
        }

        // ✅ Push new timing
        TicketFinding.timings.push(time);
        await TicketFinding.save();

        return res.status(200).json({
            message: "Show timing added successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error in update time",
            success: false,
        });
    }
};



exports.UpcomigTickets = async (req, res) => {
    try {
        console.log("Running the ticket Released Job");
        const currentDate = new Date();
        // console.log("This is the current date",currentDate)
        const formattedCurrentDate = date.format(currentDate, "DD/MM/YYYY");
        // console.log("This is the date format log",formattedCurrentDate)
        const allTickets = await Theatrestickets.find();
        console.log(allTickets)
        if (!allTickets) {
            return res.status(400).json({
                message: "There are no Tickets present",
                success: false
            });
        }

        // Filter only tickets that should be released today
            const ticketsToUpdate = allTickets.filter(ticket => {
                // console.log("This is the ticket",ticket)
                let ticketDate;
                if (typeof ticket.Date === "string") {
                    ticketDate = ticket.Date.trim(); // If stored as string in "DD/MM/YYYY"
                } else {
                    ticketDate = new Date(ticket.Date).toISOString().split("T")[0]; // If stored as ISO Date
                }
            
                // console.log("Formatted Ticket Date:", ticketDate);
                // console.log("Formatted Current Date:", formattedCurrentDate);
            
                return ticketDate === formattedCurrentDate; //
            });
            // console.log("This is the tickets to update array",ticketsToUpdate)

        if (ticketsToUpdate.length > 0) {
            const updatedTickets = await Theatrestickets.updateMany(
                { _id: { $in: ticketsToUpdate.map(t => t._id) } }, 
                { $set: { Status: "Released" } }
            );

            console.log("Updated tickets:", updatedTickets);
        } else {
            console.log("No tickets matched today's release date.");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "There is an error in the update time code",
            success: false,
        });
    }
}

exports.ExpireTickets = async (req, res) => {
    try {

        const  Yesterday = new Date()
        Yesterday.setDate(Yesterday.getDate() - 1 )
        const YesterdayDate = date.format(Yesterday, "DD/MM/YYYY");
        // console.log("Yesterday date",YesterdayDate)

        const allTickets = await Theatrestickets.find();
        // console.log(allTickets)

        if (!allTickets) {
            return res.status(400).json({
                message: "There are no Tickets present",
                success: false
            });
        }
        // console.log("THis is the date that was yesterday",Yesterday)
        // console.log("This one is been formatted",YesterdayDate)
        const TicketsToexpiry = allTickets.filter(ticket => {
            // console.log("This is the ticket",ticket)
            let ticketDate;
            if (typeof ticket.Date === "string") {
                ticketDate = ticket.Date.trim(); // If stored as string in "DD/MM/YYYY"
            } else {
                ticketDate = new Date(ticket.Date).toISOString().split("T")[0]; // If stored as ISO Date
            }
        
            // console.log("Formatted Ticket Date:", ticketDate);
            // console.log("Formatted Current Date:", formattedCurrentDate);
        
            return ticketDate === YesterdayDate; //
        });
        // console.log("This is the tickets to update array",TicketsToexpiry)

    if (TicketsToexpiry.length > 0) {
        const expiredTickets = await Theatrestickets.updateMany(
            { _id: { $in: TicketsToexpiry.map(t => t._id) } }, 
            { $set: { Status: "Expired" } }
        );

        console.log("expired tickets:", expiredTickets);
    } else {
        console.log("No tickets available to expiry");
    }
        console.log("The cron job is done");
        return { success: true };
    } catch (error) {
        console.log(error.message);
        console.log("Error in the expire tickets code");
        throw error;
    }
};

exports.ReturnRemainingTickets = async (req, res) => {
    try {
        const AllTickets = await Theatrestickets.find();

        const expiredTickets = AllTickets.filter(data => data.Status === "Expired");

        // console.log('This are all the tickets',AllTickets)
        // console.log("This is the expired tickets",expiredTickets)

        if (!expiredTickets) {  // Fix: Check if array is empty instead of `!expiredTickets`
            res.status(400).json({
                message: "There are no expired tickets available",
                success: false
            });
        }
        
        const now = new Date(Date.now())
        const pattern = date.compile('ddd, DD/MM/YYYY HH:mm:ss');
        let ps = date.format(now, pattern);
        for (const ticket of expiredTickets) {
            let remainingTickets = 0;
            console.log("This is the ticket",ticket)

            // Calculate total remaining tickets for this specific ticket
            for (const category of ticket.ticketsCategory) {
                remainingTickets += category.ticketsPurchaseafterRemaining;
            }

            // Update this specific ticket's document
            const updatedTicket = await Theatrestickets.findByIdAndUpdate(
                ticket._id, // Use ticket's unique ID to update only that ticket
                {
                    $set: {
                        unsoldTickets: [{
                            date: ticket.Date,
                            totalTickets: remainingTickets,
                            time:ps
                        }]
                    }
                },
                { new: true }
            );
            console.log("This is the updated ticket",updatedTicket)
            if(!updatedTicket){
                return res.status(400).json({
                    message: "There are no tickets available to return",
                    success: false
                });
                // console.log("there are no tickets availabe to retunr")
            }
            console.log(`Updated Ticket ${ticket._id}:`, updatedTicket);
        }

        console.log("All expired tickets updated successfully.");
    } catch (error) {
        console.error("Error in ReturnRemainingTickets:", error.message);
    }
};