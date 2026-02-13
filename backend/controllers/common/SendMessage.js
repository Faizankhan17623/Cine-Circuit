const USER = require('../../models/user')
const SendMessage = require('../../models/Createmessage')
const CreateShow = require('../../models/CreateShow')

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE PAYMENT ROUTE AND IT IS PRESENTED ON LINIE NO 6
exports.SendMessage = async(req,res)=>{
    try{
        const userId = req.USER.id
        // inside the to of the body you are requested to pass the used id to whom you want to send the message
        const{to,message,type} = req.body

        const Finding = await USER.findOne({_id:userId})
        // const ShowFinding = await CreateShow.findOne({_id:showid})
        const UserFinding = await USER.findOne({userName:to})
        
        const Types = ['Chat','enquiry','Personal']

        if(!to || !message || !type){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }
        if(!Finding){
            return res.status(400).json({
                message:"The user is not loged in ",
                success:false
            })
        }


        if(!UserFinding){
            return res.status(400).json({
                message:"The user is not present",
                success:false
            })
        }

        if(!Types.includes(type)){
            return res.status(400).json({
                message:"The type that you are using is not valid",
                success:false
            })
        }

        const Creationg = await SendMessage.create({
            to:to,
            message:message,
            typeOfmessage:type,
        })

        return res.status(200).json({
            message:"the messaged is been send succesfully",
            success:true,
            data:Creationg
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the send message code",
            success:false
        })
    }
}

// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE PAYMENT ROUTE AND IT IS PRESENTED ON LINIE NO 7
exports.Updatemessage = async (req,res)=>{
    try{
        const MessageId = req.body
        const {newMesage} = req.body
        if(!MessageId){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }

        const Finding = await SendMessage.findOne({message:newMesage})

        if(Finding){
            return res.status(400).json({
                message:"The old and the new messages are the same",
                success:false
            })
        }


        const Updating = await SendMessage.findByIdAndUpdate(MessageId,{message:newMesage},{new:true})

        return res.status(200).json({
            message:"the messaged is been updated succesfully",
            success:true,
            data:Updating
        })


    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the  update message code",
            success:false
        })
    }
}


exports.getAllMessage = async (req,res)=>{
    try{
        const userId = req.USER.id
        const {id} = req.body
        if(!id){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }
        if(!userId){
            return res.status(400).json({
                message:"The user is not loged in ",
                success:false
            })
        }
        const Finding = await USER.findOne({_id:id})
        if(!Finding){
            return res.status(400).json({
                message:"The user is not loged in ",
                success:false
            })
        }

        const AllMessage = await SendMessage.find({}).populate("to")
        return res.status(200).json({
            message:"the messaged is been updated succesfully",
            success:true,
            data:AllMessage
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all message code",
            success:false
        })
    }
}
