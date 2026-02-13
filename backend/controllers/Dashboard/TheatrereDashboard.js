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
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const Finding = await Theatres.findOne({_id:user.theatreCreated});

        if(!Finding) {
            return res.status(404).json({ message: "Theatre not found" });
        }


        const TheatreTicket = await Theatrestickets.findOne({_id:Finding.ticketCreation});
        if(!TheatreTicket) {
            return res.status(404).json({ message: "Theatre ticket not found" });
        }

        let totalAmount = 0
        const calcuatetotal = await Promise.all(
            TheatreTicket.ticketsPurchased.map(async(item) => {
            const data = await Payment.findOne({_id:item})
            totalAmount += data.amount
            return totalAmount
        }))

        // console.log(totalAmount)

        return res.status(200).json({message:"Total Sale Amount",success:true,totalAmount:totalAmount})
    }catch(error){
        console.log(error)
        console.log("Error in CalculateTotalSale controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
    }
}

// idhar ah na chutiya 4 route baache hain na saale 
exports.SingleTheatreDetails = async(req,res)=>{
    try{
        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const Finding = await Theatres.findOne({_id:user.theatreCreated});

        if(!Finding) {
            return res.status(404).json({ message: "Theatre not found" });
        }


        const TheatreTicket = await Theatrestickets.findOne({_id:Finding.ticketCreation});
        if(!TheatreTicket) {
            return res.status(404).json({ message: "Theatre ticket not found" });
        }

        return res.status(200).json({message:"Theatre Details",success:true,TheatreDetails:Finding,TheatreTicketDetails:TheatreTicket})
    }catch(error){
        console.log(error)
        console.log("Error in GetTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.GetShowAllotedDetails = async(req,res)=>{
    try{
        const userId = req.USER.id;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const Finding = await Theatres.findOne({_id:user.theatreCreated});
        if(!Finding) {
            return res.status(404).json({ message: "Theatre not found" });
        }

        const ShowData = await Promise.all(
            Finding.showAlloted.map(async(item,index)=>{
                const data = await CreateShow.findOne({_id:item})
                return {data,index}
            })
        )


        return res.status(200).json({
            message: "Theatre Details",
            success: true,
            show:ShowData
        });

    }catch(error){
        console.log(error)
        console.log("Error in GetTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.getAllticketsDetails = async(req,res)=>{
    try{
        
        const userId = req.USER.id;

        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await USER.findOne({_id:userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const Finding = await Theatres.findOne({_id:user.theatreCreated});
        if(!Finding) {
            return res.status(404).json({ message: "Theatre not found" });
        }

        const ShowData = await Promise.all(
            Finding.showAlloted.map(async(item, index) => {
                const showDetails = await CreateShow.findOne({_id:item});
                
                // Get corresponding ticket details for this show using index
                const ticketInfo = {
                    ticketsReceived: Finding.ticketsReceived[index] ? Number(Finding.ticketsReceived[index]) : 0,
                    receivedTime: Finding.ticketsReceivedTime[index] || null,
                    ticketPrice: Finding.priceoftheTicket[index] ? Number(Finding.priceoftheTicket[index]) : 0
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
                totalTicketsReceived: Finding.ticketsReceived.reduce((sum, tickets) => sum + Number(tickets), 0)
            }
        });

    }catch(error){
        console.log(error)
        console.log("Error in GetAllTheatreDetails controller",error.message)
        res.status(500).json({message:"Internal Server Error"});        
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


        const Finding = await Theatres.findOne({_id:user.theatreCreated,showAlloted:showId});

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
// abhe saare shows aayyenga and uske badk dusre isme to apun log theatres and unke received tickets hain wo ayenga adnd jo time pe aaye hain wo bhee show karenge