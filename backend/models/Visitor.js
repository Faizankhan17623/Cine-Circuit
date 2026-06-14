const mongoose = require("mongoose");

// Define a schema for visitor tracking
const visitorSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    visitCount: { type: Number, default: 0 },
    lastVisited: { type: Date, default: Date.now }
},{timestamps:true});

// Upsert-by-IP on every visit
visitorSchema.index({ ip: 1 });

module.exports = mongoose.model("Visitor", visitorSchema);