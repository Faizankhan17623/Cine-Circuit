const mongoose = require('mongoose')
const { ROLES, EXPERIENCE_LEVELS } = require('./Org_data')
const DirectorExperienceSchema = new mongoose.Schema({
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
    Awards:{
      needed:{type:String,default:"No",required:true},
      items:[
        {
          AwardCategory:{type:String,required:true},
          AwardFestival:{type:String,required:true,maxlength:100},
          MovieName:{type:String,required:true,maxlength:100},
          ReleaseDate:{type:String,required:true},
          Currency:{type:String,required:true},
          TotalBudget:{type:String,required:true},
          TotalEarned:{type:String,required:true}
        }
      ]
    },
    ToolsSoftware:{
      needed:{type:String,default:"No",required:true},
      Software:{type:[String],required:true},
      Tools:{type:[String],required:true}
    },
    TeamSize:{
      type:String,
      required:true,
      default:0
    }

})
// ...existing code...
DirectorExperienceSchema.pre('validate', function(next) {
  try {
    // Validate Projects when PreviousProjets is true
    if (this.PreviousProjets === true) {
      const p = this.Projects;
      if (!p) {
        return next(new Error('Projects is required when PreviousProjets is true.'));
      }

      const requiredFields = ['Category','AwardName','MovieName','ReleaseDate','Currency','TotalBudget','TotalEarned'];
      for (const f of requiredFields) {
        const val = p[f];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          return next(new Error(`Projects.${f} is required when PreviousProjets is true.`));
        }
      }

      // validate ReleaseDate is a valid date
      const rd = new Date(p.ReleaseDate);
      if (isNaN(rd.getTime())) {
        return next(new Error('Projects.ReleaseDate must be a valid date (ISO string or Date).'));
      }
    } else {
      // Ensure Projects is empty/absent when PreviousProjets is false
      const p = this.Projects;
      if (p && (p.Category || p.AwardName || p.MovieName || p.ReleaseDate || p.Currency || p.TotalBudget || p.TotalEarned)) {
        return next(new Error('Projects must be empty when PreviousProjets is false.'));
      }
    }

    // Validate Tools/Software consistency with ToolsSoftware flag
    if (this.ToolsSoftware === true) {
      if (!Array.isArray(this.Tools) || this.Tools.length === 0) {
        return next(new Error('Tools array is required when ToolsSoftware is true.'));
      }
      if (!Array.isArray(this.Software) || this.Software.length === 0) {
        return next(new Error('Software array is required when ToolsSoftware is true.'));
      }
    } else {
      // ensure arrays are empty/absent when ToolsSoftware is false
      if ((Array.isArray(this.Tools) && this.Tools.length > 0) || (Array.isArray(this.Software) && this.Software.length > 0)) {
        return next(new Error('Tools and Software must be empty when ToolsSoftware is false.'));
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
});
module.exports = mongoose.model("directorexperience",DirectorExperienceSchema)