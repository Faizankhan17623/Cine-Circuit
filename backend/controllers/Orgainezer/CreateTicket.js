const date = require('date-and-time')
const CreateShow = require('../../models/CreateShow')
const USER = require('../../models/user')
const ticket = require('../../models/ticket')
const Theatre = require('../../models/Theatres')

// THis is the function that is been created on the route of orgainezer on line no 13
exports.CreateTicket = async(req,res)=>{
    try {
        const ShowId = req.query.ShowId
        const userId = req.USER.id
        const {overallTicketCreated,priceoftheticket} = req.body

        if(!ShowId || !overallTicketCreated || !priceoftheticket){
            return res.status(400).json({
                message:"The input fields are been required",
                success:false
            })
        }
        const Finding = await CreateShow.findOne({_id:ShowId})

        if(!Finding){
            return res.status(404).json({
                message:"The show is not been found please check the input",
                success:false
            })
        }

        if(Finding.uploaded === false){
            return res.status(404).json({
                message:`The show is not uploaded and you cannot create a ticket now ${Finding.uploaded}`,
                success:false
            })
        }
        const existinggTicket = await ticket.findOne({showid:ShowId})

        if(existinggTicket){
            return res.status(400).json({
                message: "The ticket are already been created for this show",
                success: false
            });
        }


        const Extra = await USER.findOne({_id:userId,showsCreated:ShowId})
        if(Extra){
            const now = new Date();
        const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
        let ShowTime = date.format(now, pattern);

        // const formatNumber =  new Intl.NumberFormat('en-IN').format(overallTicketCreated);
        // const formatNumber2 =  new Intl.NumberFormat('en-IN').format(priceoftheticket);
        // console.log("This is the formattd number",formatNumber)


        const creation = await ticket.create({
            showid:ShowId,
            showtype:'Theatre',
            overallTicketCreated:overallTicketCreated,
            priceoftheticket:priceoftheticket,
            typeofticket:"Movie Ticket",
            TicketCreationTime:ShowTime,  
            TicketsRemaining:overallTicketCreated
        })
        
        await USER.updateOne({_id:userId},{$push:{ticketCreated:creation._id}})
        await CreateShow.updateOne({_id:ShowId},{totalticketsCreated:creation._id})
        // await Theatre.updateOne({$push:{showAlloted:ShowId}})
        return res.status(200).json({
            message:"The ticket is been created",
            success:true,
            data:creation
        })
        }else{
            return res.status(400).json({
                "message": "You are not the creator of this show. You cannot create a ticket for it.",
                "success": false
            })
            
        }


    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create Ticket code",
            success:false
        })        
    }
}