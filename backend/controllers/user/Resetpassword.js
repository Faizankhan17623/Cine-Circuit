const express = require('express')
const crypto = require('crypto')
const USER = require('../../models/user')
const bcrypt = require('bcrypt')
const mailSenders = require('../../utils/mailsender')
const ResetPasword = require("../../templates/userTemplates/Updatepasswordtemplate")
const passwordChangedTemplate = require("../../templates/userTemplates/passwordChangedTemplate")
// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 32
exports.LinkSend = async(req,res)=>{
    try {
        const email = req.body.email
        const Finding = await USER.findOne({email:email.toLowerCase()})
        if(!Finding){
            return res.status(400).json({
                message:`This email id ${email} is not present please is create it`,
                success:false
            })
        }

        const token = crypto.randomBytes(20).toString('hex')
        // console.log("This is the crypto token generatdd",cryptoToken)
        const updateDetails = await USER.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() +  300000,
            },{new:true})
            // console.log("This is the updated details",updateDetails)

            const url = `http://localhost:5173/Reset-Password/${token}`
            
            await mailSenders(email,
                'Reset Your Password - Cine Circuit',
                ResetPasword(email,token)
            )

            res.json({
                success: true,
                message:
                  "Email Sent Successfully, Please Check Your Email to Continue Further",
                  token:token,
              })
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
          })
    }
}
// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 34
exports.ResetPassword = async(req,res)=>{
    try {
        const {password,ConfirmPassword,token} = req.body

         if (ConfirmPassword !== password) {
       return res.json({
         success: false,
         message: "Password and Confirm Password Does not Match",
       })
     }
     
        const TokenFinding = await USER.findOne({token:token})
        if(!TokenFinding){
            return res.status(400).json({
                message:"The Rreset Email is Been Expired Please Ask For a New One",
                success:false
            })
        }

        if((TokenFinding.resetPasswordExpires < Date.now())){
            return res.status(400).json({
                message:"This email is not valid or the token is expird please genereate a new one",
                success:false
            })
        }

        const encryptinPassword = await bcrypt.hash(password,10)
        const PasswordChanging = await USER.findOneAndUpdate({token:token},{password:encryptinPassword,confirmpass:encryptinPassword,resetPasswordExpires:null},{new:true})

        // Send password change confirmation email
        await mailSenders(
            TokenFinding.email,
            "Your Password Has Been Changed - Cine Circuit",
            passwordChangedTemplate(TokenFinding.email)
        )

        return res.status(200).json({
            message:"The password is been updated",
            success:true,
            data:PasswordChanging
        })
        
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        })        
    }
}
