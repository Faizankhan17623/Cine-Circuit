// ...existing code...
const mongoose = require('mongoose')
const { CONSTANTS } = require('./Org_data')
const {ROLES,EXPERIENCE_LEVELS} = CONSTANTS

const wordLimitValidator = (max = 250) => ({
  validator: function(v) {
    if (typeof v !== 'string') return false;
    const count = v.trim().split(/\s+/).filter(Boolean).length;
    return count <= max;
  },
  message: props => `${props.path} cannot exceed ${max} words!`
})

const ProducerFresherSchema = new mongoose.Schema({
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
  Producerinspiration: {
    type: String,
    required: true,
    set: v => (typeof v === 'string' ? v.trim() : v),
    validate: wordLimitValidator(250),
    message: 'Producerinspiration cannot exceed 250 words'
  },
  ProjectsCount: {
    type: String,
    required: true,
    min: 0
  },
  BudgetPlanning: {
    type: String,
    required: true,
    set: v => (typeof v === 'string' ? v.trim() : v),
    validate: wordLimitValidator(250)
  },
  industryRelation: {
    type: String,
    required: true,
    set: v => (typeof v === 'string' ? v.trim() : v),
    validate: wordLimitValidator(250)
  },
  FundingDelays: {
    type: String,
    required: true,
    set: v => (typeof v === 'string' ? v.trim() : v),
    validate: wordLimitValidator(250)
  },
  CrowdFunding: {
    needed :{type: String,required: true,default: "No"},
    items:[
      {
       Name: { type: String, maxlength: 100,required:function (){return this.active} },
      StartDate: { type: String, required: function() { return this.active; } },
      EndDate: { type: String, required: function() { return this.active; } },
      link: { type: String ,required:true}
      }
    ]
  }
}, { timestamps: true })

ProducerFresherSchema.pre('validate', function(next) {
  if (this.CrowdFunding === true) {
    const fd = this.FundingData;
    if (!fd || !fd.internshipName || !Array.isArray(fd.certificateDocuments) || fd.certificateDocuments.length === 0 || !fd.startDate || !fd.endDate) {
      return next(new Error('When CrowdFunding is true, FundingData.internshipName, certificateDocuments, startDate and endDate are required.'));
    }
    const s = new Date(fd.startDate), e = new Date(fd.endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) {
      return next(new Error('FundingData dates must be valid and endDate >= startDate.'));
    }
    // validate certificateDocuments entries
    if (fd.certificateDocuments.some(d => !d || String(d).trim() === '')) {
      return next(new Error('FundingData.certificateDocuments must contain non-empty strings.'));
    }
  } else {
    const fd = this.FundingData;
    if (fd && (fd.internshipName || (Array.isArray(fd.certificateDocuments) && fd.certificateDocuments.length) || fd.startDate || fd.endDate)) {
      return next(new Error('FundingData must be empty when CrowdFunding is false.'));
    }
  }
  next();
})

module.exports = mongoose.model("producerfresher", ProducerFresherSchema)
// ...existing code...