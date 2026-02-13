// ...existing code...
const mongoose = require('mongoose')
const { ROLES, EXPERIENCE_LEVELS } = require('./Org_data')
const ProducerExperienceSchema = new mongoose.Schema({
  Resume: {
    type: String,
    required: true,
     validate: {
      validator: v => /\.pdf(\?|$)/i.test(v),
      message: "Resume must be a PDF URL"
    }
  },

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
    
  Funding: {
    type: [String],
    required:true
  },

  Affiliation: {
    needed:{  type: String,required: true,default: "No" },
    items:[
      {
        union:{type:String,required:true},
        Membershipid:{type:String,required:true,maxlength:30},
        Yearjoined:{type:String,required:true},
        ExpiryDate:{type:String,required:true}
      }
    ]
  },
  TeamSize: {
    type: String,
    required: true,
    min: 0
  },

  TotalProjects: {
    type: Number,
    required: true,
    min: 0
  },

  RiskManagement: {
    type: String,
    required: true,
    set: v => (typeof v === 'string' ? v.trim() : v),
    validate: {
      validator: function (v) {
        if (typeof v !== 'string') return false;
        const wordCount = v.trim().split(/\s+/).filter(Boolean).length;
        return wordCount <= 250;
      },
      message: props => `${props.path} cannot exceed 250 words!`
    }
  }

}, { timestamps: true })

module.exports = mongoose.model("producerexperience", ProducerExperienceSchema)
// ...existing code...