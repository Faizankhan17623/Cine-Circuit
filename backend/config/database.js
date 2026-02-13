require('dotenv').config()
const mongoose = require('mongoose')
const DatabaseConnection = async ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("The databse connection is been done".bgBlue)
    })
    .catch((error)=>{
        console.log("There is an error in the code",error.message)
        console.log(error.message)
    });
}
module.exports = DatabaseConnection;