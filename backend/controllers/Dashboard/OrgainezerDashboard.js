const USER = require('../../models/user')
const Theatres = require('../../models/Theatres')
const ticket = require('../../models/ticket')

exports.GetAllTheatreDetails = async(req,res)=>{
    try {

         const Finding = await USER.find({usertype:'Theatrer',verified:true});
// const {Showid} = req.query 
if(!Finding || Finding.length === 0) {  // Check if array is empty
    return res.status(404).json({ message: "No theatres created" });
}

// Get all theatre IDs from the array of users
const theatreIds = Finding.map(user => user.theatresCreated).flat(); // .flat() in case it's an array of arrays

const TheatreFinding = await Theatres.find({
    _id: {$in: theatreIds},  // Use $in operator with array
    Verified: true,
    status: "Approved"
})
// console.log(TheatreFinding.length)

        return res.status(200).json({message:"All theatres",success:true,data:TheatreFinding})
    } catch (error) {
        console.log(error)
        console.log("Error in GetAllTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}

exports.TicketDetails = async (req,res)=>{
    try{

        const userId = req.USER.id
        if(!userId){
            return res.status(400).json({
                message:"Please log in you are not loged in ",
                success:false
            })
        }

       const { showId } = req.query

        if(!showId){
            return res.status(400).json({
                message:"The inputs are required",
                success:false
            })
        }

        const DetailsFinding = await ticket.findOne({ showid: showId })
        if (!DetailsFinding) {
            return res.status(404).json({
                message: "Ticket details not found for this show",
                success: false
            })
        }

        return res.status(200).json({
            message:"This is the ticket date",
            success:true,
            data:DetailsFinding
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an errror in the ticket Details")
    }
}

exports.GetAllTicketDetails = async (req,res)=>{
    try{

         const userId = req.USER.id
        if(!userId){
            return res.status(400).json({
                message:"Please log in you are not loged in ",
                success:false
            })
        }

          const Finding = await USER.find({_id:userId});
if(!Finding || Finding.length === 0) {
    return res.status(404).json({ message: "No theatres created" });
}


        const theatreIds = Finding.map(user => user.ticketCreated).flat();


const TheatreFinding = await ticket.find({
    _id:  theatreIds
}).populate('showid')

const datawithindex = await Promise.all(TheatreFinding.map(async (ticketDoc) => {
    const allotments = ticketDoc.allotedToTheatres.map((theatre, index) => ({
        theatreId: theatre._id,
        ticketsAlloted: ticketDoc.totalTicketsAlloted[index] || '0'
    }));

    const theatreIdsList = allotments.map(a => a.theatreId);

    const Thearedate = await Theatres.find({ _id: { $in: theatreIdsList } });

    const enrichedAllotments = allotments.map(allot => {
        const theatre = Thearedate.find(t => t._id.toString() === allot.theatreId.toString());
        return {
            ...allot,
            theatreName: theatre?.Theatrename || 'Unknown Theatre',
            theatreLocation: theatre?.locationName || ''
        };
    });

    return {
        _id: ticketDoc._id,
        show: ticketDoc.showid,
        showtype: ticketDoc.showtype,
        typeofticket: ticketDoc.typeofticket,
        overallTicketCreated: ticketDoc.overallTicketCreated,
        TicketsRemaining: ticketDoc.TicketsRemaining,
        priceoftheticket: ticketDoc.priceoftheticket,
        TicketCreationTime: ticketDoc.TicketCreationTime,
        timeofAllotmentofTicket: ticketDoc.timeofAllotmentofTicket,
        totalTheatresAllotted: ticketDoc.allotedToTheatres.length,
        allotments: enrichedAllotments
    };
}))

   return res.status(200).json({message:"All tickets",success:true,data:datawithindex})

    }catch(error){
       console.log(error)
        console.log(error.message)
        console.log("There is an errror in the Get ticket Details")
        res.status(500).json({message:"Internal Server Error", success:false})
    }
}