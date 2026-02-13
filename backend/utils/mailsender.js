require('dotenv').config()
// const sendingOtpTeemplate = require('../templates/emailTemplate')
const transporter = require('../config/nodemailer')
const mailSenders = async(email,title,body)=>{
  try {
    const info = await transporter.sendMail({
      from:`Movie Webiste <${process.env.MAIL_USER}>`,
      to:`${email}`,
      subject:`${title}`,
      html:body,
    })  
    // console.log("THis is the message send to thee mail",info)
    return info
  } catch (error) {
    console.log(error)
    console.log("This is the error message",error.message)
    throw new Error("There is an  error in the sending the  email")
  }
}
module.exports = mailSenders