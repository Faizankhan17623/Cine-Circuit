const mongoose = require('mongoose')
const { CONSTANTS } = require('./Org_data')
const {ROLES,EXPERIENCE_LEVELS} = CONSTANTS

const wordLimitValidator = (maxWords = 250) => ({
    validator: function (v) {
        if (typeof v !== 'string') return false;
        const wordCount = v.trim().split(/\s+/).filter(Boolean).length;
        return wordCount <= maxWords;
    },
    message: props => `${props.path} cannot exceed ${maxWords} words!`
});

const DirectorFresherSchema = new mongoose.Schema({
    Role: {
        type: String,
        enum: ROLES,
        required: true
    },
    ExperienceLevel: {
        type: String,
        enum: EXPERIENCE_LEVELS,
        required: true
    },
    DirectorInspiration: {
        type: String,
        required: true,
        set: v => (typeof v === 'string' ? v.trim() : v),
        validate: wordLimitValidator(250)
    },
    ProjectsDone: {
        type: String,
        required: true,
        min: 0
    },
    EarlyChalenges: {
        type: String,
        required: true,
        set: v => (typeof v === 'string' ? v.trim() : v),
        validate: wordLimitValidator(250)
    },
    ProjectPlanning: {
        type: String,
        required: true,
        set: v => (typeof v === 'string' ? v.trim() : v),
        validate: wordLimitValidator(250)
    },
    PromotionMarketing: {
        type: String,
        required: true,
        set: v => (typeof v === 'string' ? v.trim() : v),
        validate: wordLimitValidator(250)
    },
    SceneVisualization: {
        type: String,
        required: true,
        set: v => (typeof v === 'string' ? v.trim() : v),
        validate: wordLimitValidator(250)
    }
}, { timestamps: true });

// ...existing code...
module.exports = mongoose.model("directorfresher", DirectorFresherSchema)