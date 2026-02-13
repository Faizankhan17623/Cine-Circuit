require('dotenv').config()
const nodemailer = require('nodemailer')
const transporter =  nodemailer.createTransport({
    host: process.env.HOST_NAME,
    port: process.env.NODEMAILER_PORT_NUMBER,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.PASSWORD_NAME,
    },
    secure: false,
  })
module.exports = transporter