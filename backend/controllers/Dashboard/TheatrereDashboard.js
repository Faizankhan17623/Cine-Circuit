const USER = require('../../models/user')
const date = require('date-and-time')
const Theatres = require('../../models/Theatres')
const Theatrestickets = require('../../models/TheatresTicket');
const Payment = require('../../models/payment')
const CreateShow = require('../../models/CreateShow');

exports.CalculateTotalSale = async(req,res)=>{
    try{
        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(!user.theatresCreated) {
            return res.status(200).json({ message: "No theatre created yet", success: true, totalAmount: 0 });
        }

        const Finding = await Theatres.findOne({_id:user.theatresCreated});

        if(!Finding) {
            return res.status(200).json({ message: "Theatre not found", success: true, totalAmount: 0 });
        }

        if(!Finding.ticketCreation || Finding.ticketCreation.length === 0) {
            return res.status(200).json({ message: "No tickets created yet", success: true, totalAmount: 0 });
        }

        const TheatreTicket = await Theatrestickets.findOne({_id:Finding.ticketCreation});
        if(!TheatreTicket || !TheatreTicket.ticketsPurchased || TheatreTicket.ticketsPurchased.length === 0) {
            return res.status(200).json({ message: "No tickets purchased yet", success: true, totalAmount: 0 });
        }

        let totalAmount = 0
        await Promise.all(
            TheatreTicket.ticketsPurchased.map(async(item) => {
            const data = await Payment.findOne({_id:item})
            if(data) totalAmount += data.amount
            return totalAmount
        }))

        return res.status(200).json({message:"Total Sale Amount",success:true,totalAmount:totalAmount})
    }catch(error){
        console.log(error)
        console.log("Error in CalculateTotalSale controller",error.message)
        res.status(500).json({message:"Internal Server Error", success: false});
    }
}

// idhar ah na chutiya 4 route baache hain na saale 
exports.SingleTheatreDetails = async(req,res)=>{
    try{
        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(!user.theatresCreated) {
            return res.status(200).json({ message: "No theatre created yet", success: true, TheatreDetails: null, TheatreTicketDetails: null });
        }
// console.log(user.theatresCreated)
        const Finding = await Theatres.findOne({_id:user.theatresCreated});
        if(!Finding) {
            return res.status(200).json({ message: "Theatre not found", success: true, TheatreDetails: null, TheatreTicketDetails: null });
        }

        const TheatreTicket = Finding.ticketCreation
            ? await Theatrestickets.findOne({_id:Finding.ticketCreation})
            : null;

        return res.status(200).json({message:"Theatre Details",success:true,TheatreDetails:Finding,TheatreTicketDetails:TheatreTicket})
    }catch(error){
        console.log(error)
        console.log("Error in GetTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error", success: false});
    }
}

exports.GetShowAllotedDetails = async(req,res)=>{
    try{
        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(!user.theatresCreated) {
            return res.status(200).json({ message: "No theatre created yet", success: true, show: [] });
        }

        const Finding = await Theatres.findOne({_id:user.theatresCreated});
        if(!Finding) {
            return res.status(200).json({ message: "Theatre not found", success: true, show: [] });
        }

        if(!Finding.showAlloted || Finding.showAlloted.length === 0) {
            return res.status(200).json({ message: "No shows alloted yet", success: true, show: [] });
        }

        const ShowData = await Promise.all(
            Finding.showAlloted.map(async(item,index)=>{
                const data = await CreateShow.findOne({_id:item})
                return {
                    data,
                    index,
                    ticketAllocation: {
                        ticketsReceived: Finding.ticketsReceived?.[index] || 0,
                        ticketPrice: Finding.priceoftheTicket?.[index] || 0,
                        ticketsReceivedTime: Finding.ticketsReceivedTime?.[index] || null
                    }
                }
            })
        )


        return res.status(200).json({
            message: "Theatre Details",
            success: true,
            show:ShowData
        });

    }catch(error){
        console.log(error)
        console.log("Error in GetShowAllotedDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error", success: false});
    }
}

exports.getAllticketsDetails = async(req,res)=>{
    try{

        const userId = req.USER.id;

        if(!userId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if(!user.theatresCreated) {
            return res.status(200).json({ message: "No theatre created yet", success: true, data: { theatre: null, shows: [], totalShows: 0, totalTicketsReceived: 0 } });
        }

        const Finding = await Theatres.findOne({_id:user.theatresCreated});
        if(!Finding) {
            return res.status(200).json({ message: "Theatre not found", success: true, data: { theatre: null, shows: [], totalShows: 0, totalTicketsReceived: 0 } });
        }

        if(!Finding.showAlloted || Finding.showAlloted.length === 0) {
            return res.status(200).json({
                message: "No shows alloted yet",
                success: true,
                data: {
                    theatre: { name: Finding.Theatrename, location: Finding.locationname },
                    shows: [],
                    totalShows: 0,
                    totalTicketsReceived: 0
                }
            });
        }

        const ShowData = await Promise.all(
            Finding.showAlloted.map(async(item, index) => {
                const showDetails = await CreateShow.findOne({_id:item});

                const ticketInfo = {
                    ticketsReceived: Finding.ticketsReceived?.[index] ? Number(Finding.ticketsReceived[index]) : 0,
                    receivedTime: Finding.ticketsReceivedTime?.[index] || null,
                    ticketPrice: Finding.priceoftheTicket?.[index] ? Number(Finding.priceoftheTicket[index]) : 0
                };

                return {
                    showDetails: showDetails,
                    showIndex: index,
                    ticketDetails: ticketInfo
                };
            })
        );

        return res.status(200).json({
            message: "Theatre Details Retrieved Successfully",
            success: true,
            data: {
                theatre: {
                    name: Finding.Theatrename,
                    location: Finding.locationname
                },
                shows: ShowData,
                totalShows: ShowData.length,
                totalTicketsReceived: (Finding.ticketsReceived || []).reduce((sum, tickets) => sum + Number(tickets), 0)
            }
        });

    }catch(error){
        console.log(error)
        console.log("Error in GetAllTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error", success: false});
    }
}

exports.getSingleShowDetails = async(req,res)=>{
    try{

        const {showId} = req.body

        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const Finding = await Theatres.findOne({_id:user.theatresCreated,showAlloted:showId});

        if(!Finding) {
            return res.status(404).json({ message: "THis show is not alloted to you",success:false });
        }

        console.log(Finding,"THis is the found data")    

        const data = await CreateShow.findOne({_id:showId})
    if(!data) {
        return res.status(404).json({ message: "Show not found",success:false });
    }
    
    const IndexFinding = Finding.showAlloted.indexOf(showId)
    const Ticketseceived = Finding.ticketsReceived[IndexFinding]
    const TicketPrice = Finding.priceoftheTicket[IndexFinding]
    const TicketTime = Finding.ticketsReceivedTime[IndexFinding]
        
        return res.status(200).json({
            message: "Theatre Details",
            success: true,
            showDetails:data,
            ticketDetails:{
                ticketsReceived: Ticketseceived ? Number(Ticketseceived) : 0,
                receivedTime: TicketTime || null,
                ticketPrice: TicketPrice ? Number(TicketPrice) : 0
            }
        });
    }catch(error){
        console.log(error)
        console.log("Error in GetTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
    }
}


exports.getTheatreDetails = async (req,res)=>{
    try{
           const { theatre } = req.body;

    if (!theatre || typeof theatre !== "string") {
      return res.status(400).json({
        message: "Input is required",
        success: false,
      });
    }


         const Finder = await Theatres.find({
      theatreformat: { $regex: theatre, $options: "i" },
      Verified:true
    });

    if (!Finder || Finder.length === 0) {
      return res.status(404).json({
        message: "No theatre found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Theatres fetched successfully",
      success: true,
      data: Finder,
      length:Finder.length
    });
    }catch(error){
        console.log(error)
        console.log("Error in GetTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.GetShowsDetails = async (req,res)=>{
    try{
        const {Theatreid} = req.query

        if (!Theatreid) {
            return res.status(400).json({
                message: "Input is required",
                success: false,
            });
        }

        const theatre = await Theatres.findById(Theatreid)

        if (!theatre) {
            return res.status(404).json({
                message: "No theatre found",
                success: false,
            });
        }

        if (!theatre.showAlloted || theatre.showAlloted.length === 0) {
            return res.status(404).json({
                message: "No shows alloted to this theatre",
                success: false,
            });
        }

        const shows = await CreateShow.find({_id: {$in: theatre.showAlloted}})

        if (!shows || shows.length === 0) {
            return res.status(404).json({
                message: "No shows found",
                success: false,
            });
        }

        // Get all ticket data for this theatre
        // const ticketData = await Theatrestickets.find({theatreId: Theatreid})

        // // Combine show data with its ticket details
        // const showsWithTickets = shows.map((show, index) => {
        //     const showTickets = ticketData.filter(t => t.showId === show._id.toString())
        //     return {
        //         show: show,
        //         ticketDetails: {
        //             ticketsReceived: theatre.ticketsReceived[index] ? Number(theatre.ticketsReceived[index]) : 0,
        //             receivedTime: theatre.ticketsReceivedTime[index] || null,
        //             ticketPrice: theatre.priceoftheTicket[index] ? Number(theatre.priceoftheTicket[index]) : 0
        //         },
        //         tickets: showTickets
        //     }
        // })

        return res.status(200).json({
            message: "Shows fetched successfully",
            success: true,
            data: shows
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


exports.GetSingleTheatreDetails = async (req,res)=>{
    try{

        const {theatreid}= req.query

          if (!theatreid) {
            return res.status(400).json({
                message: "Input is required",
                success: false,
            });
        }

        const theatre = await Theatres.findById(theatreid)

        if (!theatre) {
            return res.status(404).json({
                message: "No theatre found",
                success: false,
            });
        }


        return res.status(200).json({
            message:"This is the date of single theatre deatisl",
            success:true,
            data:theatre
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the get single theatre deatils ")
    }
}
// abhe saare shows aayyenga and uske badk dusre isme to apun log theatres and unke received tickets hain wo ayenga adnd jo time pe aaye hain wo bhee show karenge  