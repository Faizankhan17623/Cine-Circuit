const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    countrycode: { type: String, required: true },
    number:    { type: String, required: true },
    message:   { type: String, required: true, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Feedback', FeedbackSchema)
