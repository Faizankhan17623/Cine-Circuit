const comment = require('../../models/Comment')
const CreateShow = require('../../models/CreateShow')
const USER = require('../../models/user')
const date = require('date-and-time')

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 46
exports.Comment = async(req,res)=>{
    try {
        const userId = req.USER.id
        // console.log(`${userId}`.bgBlue)
        const Showid = req.query.Showid
        const {coment} = req.body
        if(!Showid){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }
        const Finding = await CreateShow.findOne({_id:Showid})
        if(!Finding){
            return res.status(500).json({
                message:"There is some mistake please check you inputs",
                success:false
            })
        }
        const now = new Date();
                    const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
                    let ComemntTime = date.format(now, pattern);
        const Creation = await comment.create({
            Showid:Showid,
            data:coment,
            CreatedAt:ComemntTime
        })
        await USER.updateOne({_id:userId},{$push:{comment:Creation._id}})
        await CreateShow.updateOne({_id:Showid},{$push:{Comment:Creation._id}})

        return res.status(200).json({
            message:"you have commented on this show",
            success:true,
            data:Creation
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the comment code",
            success:false
        })
    }
}

exports.getAllComment = async (req,res)=>{
    try{
        const Showid = req.query.Showid
        if(!Showid){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }
        const Finding = await CreateShow.findOne({_id:Showid})
        if(!Finding){
            return res.status(500).json({
                message:"The show is not present",
                success:false
            })
        }


        let AllComments = Finding.Comment.map(async(data)=>{
            let allComm = await comment.findOne({_id:data})
            console.log(allComm)
            return allComm
        })


        console.log(AllComments)

        return res.status(200).json({
            message:"These are all the comments",
            success:true,
            data:AllComments
        })

        
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the  code",
            success:false
        })
    }
}

exports.deleteComment = async (req,res)=>{
    try{
        const Showid = req.query.Showid
        if(!Showid){
            return res.status(500).json({
                message:"The input Fields are been required",
                success:false
            })
        }
        const Finding = await CreateShow.findOne({_id:Showid})
        if(!Finding){
            return res.status(500).json({
                message:"The show is not present",
                success:false
            })
        }

        const Deletion = await comment.findByIdAndDelete(Showid,{new:true})

        return res.status(200).json({
            message:"These comment is been deleted",
            success:true,
            data:Deletion
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete comment code",
            success:false
        })
    }
}
