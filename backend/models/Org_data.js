const mongoose = require('mongoose');

const OrgDataSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase:true,
         match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    CountryCode:{
        type: String,
        required: true
    },
  number:{
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    Country:{
       type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    City:{
        type: String,
        required: true
    },
    sameforlocalandpermanent:{
        type: Boolean,
        required: true
    },
    localaddress:{
        type: String,
        required: true,
        maxlength: 1000
    },
    permanentaddress:{
        type: String,
        required: true,
        maxlength: 1000
    },
    gender:{
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    image:{
        type: String,
        required: true
    },

    // Professional Background
    website:{
        type: String,
    },
    totalprojects:{
        type: Number,
        required: true
    },
    yearsexperience:{
        type: String,
        required: true  
    },
    Shortbio:{
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            // Split string by whitespace to count words
            const wordCount = v.trim().split(/\s+/).length;
            return wordCount <= 250; // maximum 250 words
          },
        message: props => `MainReason cannot exceed 250 words!`
    }
    },

   NotableProjects: {
  needed: { type: String, required: true, default: false },
  items: [
    {
      Name: { type: String, maxlength: 100 },
      Budget: { type: String},
      Role: { type: String, required:true },
      link: { type: String ,required:true}
    }
  ]
},

    SocialMedia: {
  active: { type: String, required: true, default: false },
  profiles: [
    {
      Platform: { type: String, required:true },
      followers: { type: String, required:true },
      link: { type: String, required:true }
    }
  ]
},


    // Projects
    // THis is for the ongoing projects
  ongoing: {
    active: { type: String, default: false , required: true },
    items: [
      {
        ProjectName: { type: String, required: function() { return this.active; }, maxlength: 100 },
        Script: { type: String, required: function() { return this.active; } },
        StartDate: { type: String, required: function() { return this.active; } },
        EndDate: { type: String, required: function() { return this.active; } },
        Released: { type: String, required: function() { return this.active; } }
      }
    ]
  },

//   THis is for the planned projects
  planned: {
    active: { type: String, default: false },
    items: [
      {
        ProjectName: { type: String, required: function() { return this.active; }, maxlength: 100 },
        ProjectType: { type: String, required: function() { return this.active; } },
        ProjectStatus: { type: String, required: function() { return this.active; } },
        StartDate: { type: String, required: function() { return this.active; } },
        EndDate: { type: String, required: function() { return this.active; } },
        Released: { type: String, required: function() { return this.active; } }
      }
    ]
  },

  Genre: {
    type: [String], // ✅ Simple string array like ["Action", "Comedy"]
    required: true
  },

  SubGenre: {
    type: [String], // ✅ Same here
    required: true
  },

    // Distribution 
Screening: {
    type: [String], 
    required: true
},

Audience: {
    type: [String], 
    required: true
},


Distribution: {
  needed: { 
    type: String, 
    required: true, 
    default: false
  },

  projects: [
    {
      ProjectName: { 
        type: String, 
        required: function() { return this.parent().needed; }, // required only if needed = true
        maxlength: 200 
      },
      Budget: { type: String },
      Role: { 
        type: String, 
        required: function() { return this.parent().needed; } 
      },
      ReleaseDate: { 
        type: String, 
        required: function() { return this.parent().needed; } 
      }
    }
  ]
},


    Promotions:{
        type: String,
        required: true,
        default: false
    },

    // Support & Motivation
   Support: {
  needed: { type: String, default: false },
  type: { type: String, default: null } // only set when needed = true
},

MainReason: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            // Split string by whitespace to count words
            const wordCount = v.trim().split(/\s+/).length;
            return wordCount <= 250; // maximum 250 words
        },
        message: props => `MainReason cannot exceed 250 words!`
    }
},

Certifications: {
   active: { type: String, default: false },
   items:[
    {
      Name: {
      type: String,
      required: true,
      maxlength: 200 
    },
    Certificate: {
      type: String,
      required: true
    },
    Date: {
      type: String, 
      required: true
    }
    }
   ]
},

Collaboration: {
    type: String,
    required: true,
    default: false 
},

Comfortable: {
    type: String,
    required: true,
    default: false // false = Not comfortable, true = Comfortable
},

  Role: {
    type: String,
    required: true,
    enum: ["Director", "Producer"] // Role options
  },
  ExperienceLevel: {
    type: String,
    required: true,
    enum: ["Fresher", "Experienced"] // Experience options
  },
  DirectFresh:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'directorfresher'
  },
  DirectorExperience:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'directorexperience'
  },
  ProducerFresher:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'producerfresher'
  },
  ProducerExperience:{
     type: mongoose.Schema.Types.ObjectId,
        ref: 'producerexperience'
  },
  status: {
    type: String,
    enum: ["pending", "rejected", "Approved", "locked"],
    default: "pending",
    required:true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  editUntil: {
    type: String
  },
  lockedUntill:{
    type:Date
  }
},{timestamps:true})

const Orgdata =  mongoose.model("OrgainezerData", OrgDataSchema);

const CONSTANTS = {
  ROLES: ["Director", "Producer"],
  EXPERIENCE_LEVELS: ["Fresher", "Experienced"],
};

module.exports = {Orgdata,CONSTANTS}
