const USER = require('../../models/user')
const Theatres = require('../../models/Theatres')
// Ticket ka hour owner creation ka kuch samband he nahi aata hain
const ticket = require('../../models/ticket')
// 
const Theatrestickets = require('../../models/TheatresTicket')
const bcrypt = require('bcrypt')
const date = require('date-and-time')


// This is the function that is going to create the route in the theatrer in the line no 10
exports.CreateTheatrere = async(req,res)=>{
    try{

        // const userId = req.USER.id

        const {name,email,password,number,code} = req.body

        if(!name || !email || !password ||!number || !code){
            return res.status(400).json({
                message:"The inputs are been required",
                success:false
            })
        }
        const EmailFinding = await USER.findOne({email:email})
        const NameFinding = await USER.findOne({userName:name})
        const NumberFinding = await USER.findOne({number:number})

        if(EmailFinding){
            return res.status(400).json({
                message:"This email is allready been present please take another one",
                success:false
            })
        }

        if(NameFinding){
            return res.status(400).json({
                message:"This name is allready been present please take another one",
                success:false
            })
        }


        if(NumberFinding){
            return res.status(400).json({
                message:"This Number  is allready been present please take another one",
                success:false
            })
        }




        const PasswordCreation = await bcrypt.hash(password,10)

        
                    const now = new Date()
                    const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
                    let ps = date.format(now, pattern);
        const Creation = await USER.create({
            userName:name,
            password:PasswordCreation,
            confirmpass:PasswordCreation,
            email:email,
            usertype:'Theatrer',
            verified:true,
            number:number,
            image:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            createdAt:ps,
            countrycode:code
        })

        // await Theatres.updateOne({_id:userId},{Owner:Creation._id})
        // await Theatrestickets.updateOne({_id:userId},{Owner:Creation._id})
        console.log(Theatres.Owner)
        USER.id = Creation._id
        return res.status(200).json({
            message:"The Theatrer is been created",
            success:true,
            data:Creation
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the theatre creation  code",
            success:false
        })
    }
}