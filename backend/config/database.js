require('dotenv').config()
const mongoose = require('mongoose')
const DatabaseConnection = async ()=>{
    if (!process.env.DATABASE_URL) {
        console.error("MongoDB connection failed: DATABASE_URL is not set")
        return
    }
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("The databse connection is been done".bgBlue)
    })
    .catch((error)=>{
        // Usual causes on Render: Atlas Network Access not allowing 0.0.0.0/0, wrong password in DATABASE_URL, paused cluster
        console.error("MongoDB connection failed:", error.message)
    });
}
module.exports = DatabaseConnection;
