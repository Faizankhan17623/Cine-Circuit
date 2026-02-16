const bcrypt = require('bcrypt')
const USER = require('../../models/user')
const date = require('date-and-time')
const jwt = require('jsonwebtoken')
const cookieParser  = require('cookie-parser')
const OTP = require('../../models/otp')
const {Orgdata} = require('../../models/Org_data')
const {uploadDatatoCloudinary}= require('../../utils/imageUploader')
const qs = require('qs')
const directorfresher = require('../../models/DirectorFresher')
const directorexperience = require('../../models/DirectorExperience')
const producerexperience = require("../../models/ProducerExperience")
const producerfresher = require('../../models/ProducerFresher')

// This is the function that is going to create the route in the orgainezer in the line no 10   
exports.CreateOrgainezer = async(req,res)=>{
    try {

      // const USERId = req.USER.id

        const {name,password,email,usertype="Organizer",number,countrycode,otp} = req.body
    
        if(!name || !password || !email || !number || !countrycode || !otp){
            return res.status(400).json({
                message:"The input fields are been required",
                success:false
            })
        }

        const Finding = await USER.findOne({userName:name})
        if(Finding){
            return res.status(400).json({
                message:"The username is already beeen taken please take another one",
                success:false,
                extra:`email that is using the usernam ${Finding.email}`
            })
        }
        const EmailFinding = await USER.findOne({email:email})
        if(EmailFinding && EmailFinding !== number){
            return res.status(400).json({
                message:"The email is already beeen taken please take another one",
                success:false
            })
        }


        const numberRecord = await USER.findOne({number}).populate("resetPasswordExpires")
        if(numberRecord && numberRecord.email !== email){
            return res.status(409).json({
                message: "The number is already taken and linked to a different email.",
                success: false,
                data: `number: ${number}, linked email: ${numberRecord.email}`
            });
        }
const otps = await OTP.find({ email:email }).sort({createdAt:-1}).limit(1)
// console.log("This is the otp records",otps)

    if(otps.length === 0 ) {
                return res.status(400).json({
                    message: "No OTP found for this email. Please request a new OTP.",
                    success: false
                }); 
            }
            
            if (otp !== otps[0].otp){
                return res.status(400).json({
                    message: "The OTP is not correct please try again",
                    success: false
                });
            }

// now we will hash the password 
const hasing = await bcrypt.hash(password, 10);
const now = new Date();
const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
let ps = date.format(now, pattern);

const Creation = new USER({
    userName: name,
    email: email,
    password: hasing,
    confirmpass: hasing,
    number: number,
    countrycode: countrycode,
    usertype: usertype,
    createdAt: ps,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    verified: false
});


// USER.id = Creation._id
  await Creation.save()
  // await Orgdata.updateOne({attempts:0})

return res.status(200).json({
    message: "The orgainezer is been created",
    success: true,
});
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create orgainezer code",
            success:false
        })
    }
}

// This is the function that is going to create the route in the orgainezer in the line no 11
exports.OrgaineserLogin = async(req,res)=>{
    try{
            const {email,password} = req.body
            if(!email || !password){
                return res.status(400).json({
                    message:"The input fields are been required",
                    success:false
                })
            }
    
            const user = await USER.findOne({email:email.toLowerCase()})
                .populate('resetPasswordExpires')
                .populate({path:'showsCreated',model:'Show'})
                .populate({path:'UserBannerliked',model:'Show'})
                .populate({path:'UserBannerhated',model:'Show'})
                .populate({path:'messageReceived',model:'Message'})
                .populate({path:'comment',model:'Comment'})
                .exec()

            if(!user){
                return res.status(404).json({
                    message:"The email is not been found",
                    success:false
                })
            }

            if(user.usertype === 'Viewer'){
                return res.status(400).json({
                    message:"The User is an Viewer Please Use The Viewer Login",
                    success:false
                })
            }
            const compare = await bcrypt.compare(password,user.confirmpass)
    
            if(!compare){
                return res.status(400).json({
                    message:"please enter the right password",
                    success:false
                })
            }

                const {userName,usertype,verified,number,_id ,image} = user
                const now = new Date();
                const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
                let lastLoginTime = date.format(now, pattern);
                const USERid = _id
                // console.log("This is the id",_id)
                await USER.findByIdAndUpdate(_id,{$push:{lastlogin:lastLoginTime}},{new:true})

  await Orgdata.updateOne({_id:USERid},{attempts:0})


                // console.log("This is the login code",login)
                const jwtCreation = jwt.sign({usertype,verified,id:_id},process.env.JWT_PRIVATE_KEY,{ expiresIn: '24h', algorithm: 'HS256' })
                const options = {
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                      httpOnly:true,
            secure: true, 
            sameSite: 'Lax'
                }

                await USER.findByIdAndUpdate(_id,{token:jwtCreation},{new:true})

                // console.log("THis is the user id",_id)
                     user.token = jwtCreation;
                    user.password = undefined;  
                    user.id = _id.toString()

                    // console.log("This is the user",user)
                    // console.log(_id)

                res.cookie('token',jwtCreation,options).status(200).json({
                    message:"The user is been loged in",
                    success:true,
                    token:jwtCreation,
                    user
                })
        }catch(error){
            console.log(error)
            console.log(error.message)
            return res.status(500).json({
                message:"error in the login code",
                success:false
            })
            
        }
}

function WordCounts(text){
    const MaxWords = 250 
      if (typeof text !== 'string' || text.trim() === '') return null 
    const TextSpliting = text.trim().split(/\s+/).filter(Boolean).length

    if(TextSpliting > MaxWords){
      return `Text exceeds maximum allowed ${MaxWords} words (${TextSpliting})`
    }

    return null
}

const normalizeBoolean = (val) => {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return null; // invalid
};

exports.OrgData = async (req, res) => {
  try {
    const parsedBody = req.body;

    const ID = req?.USER.id

    const Finding = await Orgdata.findOne({id:ID})
    if(Finding){
      // If the organizer was rejected, delete old data so they can re-submit
      if(Finding.status === "rejected"){
        // Delete old role-specific data
        if(Finding.DirectFresh){
          await directorfresher.findByIdAndDelete(Finding.DirectFresh)
        }
        if(Finding.DirectorExperience){
          await directorexperience.findByIdAndDelete(Finding.DirectorExperience)
        }
        if(Finding.ProducerFresher){
          await producerfresher.findByIdAndDelete(Finding.ProducerFresher)
        }
        if(Finding.ProducerExperience){
          await producerexperience.findByIdAndDelete(Finding.ProducerExperience)
        }
        // Delete old org data
        await Orgdata.findByIdAndDelete(Finding._id)
        // Remove reference from user
        await USER.findByIdAndUpdate(ID, { orgainezerdata: null })
      } else {
        return res.status(400).json({
          message:"You have already registered the data in the orgainzation form",
          success:false
        })
      }
    }

    const {
      First, Last, Email, Countrycode, number, countryname, statename, cityname,
      Sameforlocalandpermanent, local, permanent, gender, website, totalProjects,
      Experience, shortbio, notableProjects, SocialMedia, ongoingProject,
      projectspllanned, Genre, subGenre, Screen, Target, Distribution,
      Promotions, Assistance, support, mainreason, certifications,
      ExperienceCollabrating, collabrotion, role, experience
    } = parsedBody;

    const Image = req.files?.Image
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    const Max_Size = 5 * 1024 * 1024 //The max size is 5 mb

    // console.log("This is the image type",Image)

    if(!allowedImageTypes.includes(Image.mimetype)){
      return res.status(400).json({
        message:`The file is not allowed the allowed types are ${allowedImageTypes}`,
        success:false 
      })
    }

    if(Image.size > Max_Size){
      return res.status(400).json({
        message:"Your Image Exceeds the max limit size  allowed limit is 5 MB",
        success:false
      })
    }


    const ImageUpload = await uploadDatatoCloudinary(Image,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
    // T2-MEDIA Kingdom
    // console.log("THis ist he check the image uplaod",ImageUpload)


const Username = First + " " + Last

const NotableKeys = Object.keys(req.body).filter(key => key.startsWith("notable["))
// console.log("This is the notable",notableProjects)
// console.log("This is the notable",typeof notableProjects)
let notable = []
    if(String(notableProjects) && notableProjects === "Yes"){
      const notablename = new Map()
      const Name = new Set()
      const Url = new Set()
      const DuplicateNames =[]
      const DuplicateUrls = []
// console.log("This is the notable keys",NotableKeys)
      NotableKeys.forEach(key =>{
         const match = key.match(/notable\[(\d+)\]\[(.+)\]/);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!notablename.has(index)) notablename.set(index, {});
      notablename.get(index)[field] = req.body[key];
    }
      })

      notable = Array.from(notablename.values())

      // console.log("This is the notable",notable)

      for (const project of notable) {
        const { name, url,role } = project;
// console.log("THis is the name from the notable",name)
          if (!name || !role || !url) {
      return res.status(400).json({
        success: false,
        message: "Required fields (name, Role, or url) are missing in notable projects.",
        data: project
      });
    }

          if (Name.has(name)) DuplicateNames.push(name); else Name.add(name);
          if (Url.has(url)) DuplicateUrls.push(url); else Url.add(url);
        }

        if (DuplicateNames.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Duplicate entries found in notable projects",
            names: DuplicateNames,
          });
        }
        if (DuplicateUrls.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Duplicate URLs found in notable projects",
            urls: DuplicateUrls
          });
        }
    }else{
      notable = []
    }

    // console.log(notable)
    // Parse social[] from form-data
const socialKeys = Object.keys(req.body).filter(key => key.startsWith("social["));
let social = [];
// console.log("This is the Social",SocialMedia)
// console.log("This is the Social",typeof SocialMedia)
// Check if SocialMedia is true (case-insensitive)
if (String(SocialMedia) && SocialMedia === "Yes") {
  const socialMap = new Map();
  const Url = new Set()
  const DuplicateUrls = []


  socialKeys.forEach(key => {
    const match = key.match(/social\[(\d+)\]\[(.+)\]/);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!socialMap.has(index)) socialMap.set(index, {});
      socialMap.get(index)[field] = req.body[key];
    }
  });

  social = Array.from(socialMap.values());
  // console.log("✅ Parsed Social:", social);

   const MediaMap = {
        LinkedIn: "https://www.linkedin.com/",
        YouTube: "https://www.youtube.com/",
        Instagram: "https://www.instagram.com/",
        IMDB: "https://www.imdb.com/",
        Twitter: "https://x.com/"
      };

    for (const project of social) {
          const {  mediaName,follwers,urls } = project;

              if (!mediaName || !follwers || !urls) {
      return res.status(400).json({
        success: false,
        message: "Required fields (mediaName, followers or urls) are missing in Social Media",
        data: project
      });
    }

          // console.log("This are the urls",urls)
          // console.log("THis are the projects",project)
          if (Url.has(urls)) DuplicateUrls.push(urls); else Url.add(urls);

        const baseUrl = MediaMap[project.mediaName];
        if (!baseUrl) {
          return res.status(400).json({
            success: false,
            message: `Unsupported mediaName: ${project.mediaName}`
          });
        }

        if (!project.urls.startsWith(baseUrl)) {
          return res.status(400).json({
            success: false,
            message: `Invalid URL for ${project.mediaName}. It should start with '${baseUrl}'`
          });
        }

        }
        
        if (DuplicateUrls.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Duplicate URLs found in notable projects",
            urls: DuplicateUrls
          });
        }

} else {
  social = [];
}
// console.log("Final social array:", social);


    // Parse ongoing[] from form-data
   // Parse ongoing[] from form-data

// console.log("This is the Ongoing",ongoingProject)
// console.log("This is the Ongoing",typeof ongoingProject)
const ongoingKeys = Object.keys(req.body).filter(k => k.startsWith("ongoing["));
let ongoing = [];
if (String(ongoingProject) && ongoingProject === "Yes") {
  const ongoingMap = new Map();
  ongoingKeys.forEach(key => {
    const m = key.match(/ongoing\[(\d+)\]\[(.+)\]/);
    if (!m) return;
    const idx = m[1], field = m[2];
    if (!ongoingMap.has(idx)) ongoingMap.set(idx, {});
    ongoingMap.get(idx)[field] = req.body[key];
  });

  ongoing = Array.from(ongoingMap.values());

  const errors = [];
  const seenNames = new Set();
  const seenScriptNames = new Set();
  const duplicateNames = [];
  const duplicateScripts = [];

  const DateChecker = (str) => {
    const [day, month, year] = str.split('/');
    const fullYear = year === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month}-${day}`);
  };


  // 1) VALIDATE ONLY. Collect files to upload later.
  const uploads = []; // { index, file }
  for (let i = 0; i < ongoing.length; i++) {
    const project = ongoing[i];
    const { name, startdate, enddate, released } = project || {};

    // required fields
    if (!name || !startdate || !enddate || typeof released === "undefined") {
      errors.push({ index: i, message: "Missing required fields", data: project });
    }

    // duplicate names (track as objects for clarity)
    if (name) {
      if (seenNames.has(name)) duplicateNames.push({ index: i, name });
      else seenNames.add(name);
    }

    // date checks (only if parseable)
       const StartDate = DateChecker(startdate);
    const EndDate = DateChecker(enddate);

    if (StartDate.getTime() === EndDate.getTime()) {
      return res.status(400).json({
        message: 'The start and end date should not be the same',
        success: false,
        data: project,
      });
    }

    if (StartDate > EndDate) {
      return res.status(400).json({
        message: 'The start date cannot be later than the end date',
        success: false,
        data: project,
      });
    }
   
if (StartDate >= EndDate) {
  throw new Error("Start Date must be before End Date");
}

    // file validation — guard every access
    const script = req.files?.[`ongoing[${i}][script]`];
    const expectedType = "application/pdf";

    if (!script) {
      errors.push({ index: i, message: "Missing script file" });
      continue; // IMPORTANT: don't touch script.name when it's missing
    }

    if (Array.isArray(script)) {
      errors.push({ index: i, message: `Only one file is allowed for ongoing[${i}][script]` });
      continue;
    }

    if (script.mimetype !== expectedType) {
      errors.push({
        index: i,
        message: `Invalid file type for ongoing[${i}][script]. Expected: ${expectedType}, Received: ${script.mimetype}`,
      });
      continue;
    }

    // duplicates by file name (safe now because script exists)
    if (seenScriptNames.has(script.name)) {
      duplicateScripts.push({ index: i, name: script.name });
    } else {
      seenScriptNames.add(script.name);
    }

    // queue upload for later
    uploads.push({ index: i, file: script });
  }

  // duplicates summaries
  if (duplicateNames.length) {
    errors.push({ message: "Duplicate project names in ongoing[]", items: duplicateNames });
  }
  if (duplicateScripts.length) {
    errors.push({ message: "Duplicate script filenames in ongoing[]", items: duplicateScripts });
  }

  // if any validation errors, bail out BEFORE uploading
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Some ongoing projects are invalid",
      errors,
    });
  }

  // 2) UPLOAD after validation passes
  for (const { index, file } of uploads) {
    const fileUrl = await uploadDatatoCloudinary(file, process.env.CLOUDINARY_FOLDER_NAME, 1000, 1000);
    if (!fileUrl?.secure_url) {
      return res.status(400).json({
        success: false,
        message: `Error uploading script for ongoing[${index}]`,
      });
    }
    ongoing[index].scriptUrl = fileUrl.secure_url;
  }
} else {
  ongoing = [];
}

    const projectKeys = Object.keys(req.body).filter(key => key.startsWith("projects["));
let Project = [];

// console.log("This is the Projects",projectspllanned)
// console.log("This is the Projects",typeof projectspllanned)
if (String(projectspllanned) && projectspllanned === "Yes") {
  const projectMap = new Map();

  projectKeys.forEach(key => {
    const match = key.match(/projects\[(\d+)\]\[(.+)\]/);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!projectMap.has(index)) projectMap.set(index, {});
      projectMap.get(index)[field] = req.body[key];
    }
  });

  Project = Array.from(projectMap.values());

  const projectNames = new Set();

const DateChecker = (str = "") => {
  if (!str) return new Date("Invalid");

  // supports YYYY-MM (from <input type="month">)
  if (/^\d{4}-\d{2}$/.test(str)) {
    return new Date(`${str}-01`);
  }

  return new Date(str);
};


const projectStatusReleaseMap = {
  releaseFalse: [
    "Idea/Concept",
    "Scripting/Screenwriting",
    "Development",
    "Pre-Production",
    "Casting",
    "Production (Filming)",
    "Post-Production (Editing, VFX, Sound)",
    "Distribution/Marketing",
    "On Hold",
    "Cancelled",
  ],

  releaseTrue: [
    "Release",
    "Completed",
  ],
};

  for (let index = 0; index < Project.length; index++) {
    const project = Project[index];
    const { name, status, start, end, released } = project;
// console.log("THis is the name from the project",name)

    // Required fields check
    if (!name  || !status || !released || !start || !end) {
      return res.status(400).json({
        message: "The input fields are required",
        data: project,
      });
    }


     const stat = status.trim().toLowerCase()

    if(projectStatusReleaseMap.releaseFalse.some(s => s.toLowerCase() === stat)){
      Project[index].released = false
    }else if (projectStatusReleaseMap.releaseTrue.some(s => s.toLowerCase() === stat)){
      Project[index].released = true
    }else{
      return null
    }



    // Duplicate name check
    if (projectNames.has(name)) {
      return res.status(400).json({
        message: `Duplicate project name found: ${name}`,
        data: project,
      });
    }
    projectNames.add(name);

    // Date validation
    const StartDate = DateChecker(start);
    const EndDate = DateChecker(end);

    if (StartDate.getTime() === EndDate.getTime()) {
      return res.status(400).json({
        message: 'The start and end date should not be the same',
        success: false,
        data: project,
      });
    }

    if (StartDate > EndDate) {
      return res.status(400).json({
        message: 'The start date cannot be later than the end date',
        success: false,
        data: project,
      });
    }

    if (StartDate >= EndDate) {
  throw new Error("Start Date must be before End Date");
}

  }

  // console.log("This is the project data", Project);
} else {
  Project = [];
}

const DistKeys = Object.keys(req.body).filter(key => key.startsWith("distributions["))
let Dist = []

// console.log("This is the Distributions",Distribution)
// console.log("This is the Distributions",typeof Distribution)
if(String(Distribution) && Distribution === "Yes"){

  const DistMaps = new Map()
  DistKeys.forEach(key => {
      const match = key.match(/distributions\[(\d+)\]\[(.+)\]/);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!DistMaps.has(index)) DistMaps.set(index, {});
      DistMaps.get(index)[field] = req.body[key];
    }
  })

  Dist = Array.from(DistMaps.values());

  const DuplicateName = []
  const Names = new Set()

  for(let index = 0 ; index < Dist.length ; index++ ){
    const Distribute =  Dist[index]

   const {name,budget,role,date} = Distribute 
// console.log("THis is the name from the Distribution",name)

   if(!name || !budget || !role || !date){
      return res.status(400).json({
        message: "The input fields are required",
        data: Distribute,
      });
   }
   
    if (Names.has(name)) DuplicateName.push(index,name); else Names.add(name);

      if (DuplicateName.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Duplicate entries found  Distributions",
    data: DuplicateName,
  });
}
  }

}else{
  Dist = []
}


// console.log("This is the Assistance",Assistance)
// console.log("This is the Assistance",typeof Assistance)

if (String(Assistance) && Assistance === "Yes") {
  if (!support || support.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Support field is required when Assistance is true",
    });
  }
}


// certifications, cert = []
const Certficatekeys = Object.keys(req.body).filter(key => key.startsWith('Cert['));
let cert = [];
// console.log("This is the Certifications",certifications)
// console.log("This is the Certifications",typeof certifications)

if (String(certifications) && certifications === "Yes") {
  const certmaps = new Map();

  Certficatekeys.forEach(key => {
    const match = key.match(/Cert\[(\d+)\]\[(.+)\]/);
    if (match) {
      const index = match[1];
      const field = match[2];
      if (!certmaps.has(index)) certmaps.set(index, {});
      certmaps.get(index)[field] = req.body[key];
    }
  });

  cert = Array.from(certmaps.values());

  const Certname = new Set();
  const certCertificates = new Set();
  const Duplicatename = [];
  const DuplicateCertificate = [];

  for (let index = 0  ; index < cert.length; index++) {
    const certficate = cert[index];
    const { name, date } = certficate;
    const script = req.files?.[`Cert[${index}][certificate]`];
    const fileType = 'application/pdf'
// console.log("THis is the name from the Certificate",name)

    if (!name || !date) {
      return res.status(400).json({
        message: "The input fields are required",
        success: false,
      });
    }

    if (Certname.has(name)) Duplicatename.push(index, name);
    else Certname.add(name);
    
    
    if (!script) {
      return res.status(400).json({
        message: "The file is not taken in the input",
        success: false
      });
    }

    
    if (Array.isArray(script)) {
      return res.status(400).json({
        success: false,
        message: `Only one file is allowed for Cert[${index}][certificate]`,
      });
    }

      if (script.mimetype !== fileType) {
      return res.status(400).json({
        index,
        message: `Invalid file type for Cert[${index}][certificate]. Expected: ${fileType}, Received: ${script.mimetype}`,
      });
    }

    if (certCertificates.has(script.name)) DuplicateCertificate.push(index, script.name);
    else certCertificates.add(script.name);

     if (Duplicatename.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Duplicate entries found in Certificate with the same name",
      data: Duplicatename,
    });
  }

  if (DuplicateCertificate.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Duplicate certificate file uploaded",
      data: DuplicateCertificate,
    });
  }
const fileUrl = await uploadDatatoCloudinary(script, process.env.CLOUDINARY_FOLDER_NAME, 1000, 1000);
      cert[index].certificateUrl = fileUrl.secure_url;
      // console.log("This is the file url",fileUrl)

      if(!fileUrl){
        return res.status(400).json({
          message:"The file is required",
          success:false
        })
      }

  }


} else {
  cert = [];
}

    // Validate required fields
    const RequiredFields = {
      First, Last, Email, Countrycode, number, countryname, statename, cityname,
      Sameforlocalandpermanent, local, permanent, gender, totalProjects, Experience,
      shortbio, notableProjects, SocialMedia, ongoingProject, Genre, subGenre, Screen,
      Target, Distribution, mainreason, certifications, ExperienceCollabrating,
      collabrotion, role, experience,Image
    };


    const missingFields = Object.keys(RequiredFields).filter((key) => {
      const value = RequiredFields[key];
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    });
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These fields are required: ${missingFields.join(", ")}`,
      });
    }

    // Validate textarea word count
    const textareaFields = ['shortbio', 'mainreason'];
    const textareaErrors = textareaFields
      .map(field => {
        if (!Object.prototype.hasOwnProperty.call(req.body, field)) return null;
        const val = req.body[field];
        if (typeof val !== 'string' || val.trim() === '') return null;
        const err = WordCounts(val); // assuming WordCounts function exists
        return err ? `${field}: ${err}` : null;
      })
      .filter(Boolean);
    if (textareaErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'One or more text fields exceed the 250-word limit',
        fields: textareaErrors
      });
    }

    // console.log("This is the data from the notable",notable)
    // console.log("This is the data from the social media",social)
    // console.log("This is the data from the ongoing projects",ongoing)

    // console.log("This is the data from the planned projects",Project)
    // console.log("This is the data from the Distributions",Dist)
    // console.log("This is the data from the certifications",cert)
//  console.log(typeof Sameforlocalandpermanent)
try{
  const Uploading = await Orgdata.create({
    id:ID,
      username:Username,
      email:Email,
      CountryCode:Countrycode,
      number:number,
      Country:countryname,
      state:statename,
      City:cityname,
      sameforlocalandpermanent:Boolean(Sameforlocalandpermanent),
      localaddress:local,
      permanentaddress:permanent,
      gender:gender,
      image:ImageUpload.secure_url,
      website:website,
      totalprojects:totalProjects,
      yearsexperience:Experience,
      Shortbio:shortbio,
      NotableProjects:{
        needed:String(notableProjects), 
        items:notable.map((data)=>({
          Name:data.name,
          Budget:data.budget,
          Role:data.role,
          link:data.url
        }))
      },
      SocialMedia:{
        active:String(SocialMedia),
        profiles:social.map((data)=>({
          Platform:data.mediaName,
          followers:data.follwers,
          link:data.urls
        }))
      },
      ongoing:{
        active:String(ongoingProject),
        items:ongoing.map((data)=>({
          ProjectName:data.name,
          Script:data.scriptUrl,
          StartDate:data.startdate,
          EndDate:data.enddate,
          Released:data.released
        }))
      },
      planned:{
        active:String(projectspllanned),
        items:Project.map((data)=>({
          ProjectName:data.name,
          ProjectType:data.type,
          ProjectStatus:data.status,
          StartDate:data.start,
          EndDate:data.end,
          Released:data.released
        }))
      },
      Genre:Genre,
      SubGenre:subGenre,
      Screening:Screen,
      Audience:Target,
      Distribution:{
        needed:String(Distribution),
        projects:Dist.map((data)=>({
          ProjectName:data.name,
          Budget:data.budget,
          Role:data.role,
          ReleaseDate:data.date
        }))
      },
      Promotions:String(Promotions),
      Support:{
        needed:String(Assistance),
        type:support
      },
      MainReason:mainreason,
      Certifications:{
        active:String(certifications),
        items:cert.map((data)=>({
          Name:data.name,
          Certificate:data.certificateUrl,
          Date:data.date
        }))
      },
      Collaboration:String(ExperienceCollabrating),
      Comfortable:String(collabrotion),
      Role:role,
      ExperienceLevel:experience,
      status:"pending"
})

await USER.findByIdAndUpdate(ID,{orgainezerdata:Uploading._id})
// await Orgdata.save()

  return res.status(200).json({
      success: true,
      message: "Data Submitted Succesfully",
    });

}catch(error){
  console.log(error)
  console.log(error.message)
  return res.status(400).json({
    message:"There is an error in uploading the data",
    success:false,
    error:error.message
  })
}

  } catch (error) {
    console.log("❌ Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "There is an error in the Organizer Data code",
      error:error
    });
  }
};

exports.DirectorFresher = async(req,res)=>{
  try{
    const parsedBody = req.body;

    const Id = req?.USER.id

    const Finding = await Orgdata.findOne({id:Id})
    if(!Finding){
      return res.status(400).json({
        message:"You have not filled the form in the org data",
        success:false
      })
    }

    const {
      Inspirtion,Projects,ChallengedFaced,Marketing,DirectorInspirtion,sceneVisualization
    } = parsedBody;

    const requiredFields = {Inspirtion,ChallengedFaced,Marketing,DirectorInspirtion,sceneVisualization}

    const missingFields = Object.keys(requiredFields).filter((key) => {
      const value = requiredFields[key];
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    });
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These fields are required: ${missingFields.join(", ")}`,
      });
    }

      const textareaFields = ['Inspirtion','ChallengedFaced','Marketing','DirectorInspirtion','sceneVisualization'];
    const textareaErrors = textareaFields
      .map(field => {
        if (!Object.prototype.hasOwnProperty.call(req.body, field)) return null;
        const val = req.body[field];
        if (typeof val !== 'string' || val.trim() === '') return null;
        const err = WordCounts(val); // assuming WordCounts function exists
        return err ? `${field}: ${err}` : null;
      })
      .filter(Boolean);

    if (textareaErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'One or more text fields exceed the 250-word limit',
        fields: textareaErrors
      });
    }

const {Role , ExperienceLevel} = Finding
    try{
// Inspirtion,Projects,ChallengedFaced,Marketing,DirectorInspirtion,sceneVisualization
      const Uploading = await directorfresher.create({
        Role:Role,
        ExperienceLevel:ExperienceLevel,
        DirectorInspiration:Inspirtion,
        ProjectsDone:Projects,
        EarlyChalenges:ChallengedFaced,
        ProjectPlanning:Marketing,
        PromotionMarketing:DirectorInspirtion,
        SceneVisualization:sceneVisualization
      })

      await Orgdata.updateOne({id:Id},{DirectFresh:Uploading._id})

      return res.status(200).json({
        message:"The Director Fresher data is been created",
        success:true,
        data:Uploading
      })
    }catch(error){
      console.log(error)
      console.log(error.message)
      return res.status(500).json({
        message:"There is an error while creating the data",
        success:false,
        error:error.message
      })
    }


  }catch(error){
    console.log(error)
    console.log(error.message)
    return res.status(400).json({
      message:"There is an something wrong in the DirectorFresher code",
      success:false
    })
  }
}

exports.DirectorExperience = async (req, res) => {
  try {
    const parsedBody = req.body;
    const Id = req?.USER?.id;

    const Finding = await Orgdata.findOne({ id: Id });
    if (!Finding) {
      return res.status(400).json({
        message: "You have not filled the form in the org data",
        success: false
      });
    }

    // Normalize incoming values (case-insensitive)
    const rawAwards = parsedBody.Awards;
    const rawToolsSoftware = parsedBody.ToolsSoftware;
    const rawTeamSize = parsedBody.TeamSize;

    // Accept "true"/"false" OR "yes"/"no" OR boolean true/false
    const normalizeFlag = (v) => {
      if (v === undefined || v === null) return "";
      const s = String(v).trim().toLowerCase();
      if (s === "true" || s === "yes" || s === "1") return "true";
      if (s === "false" || s === "no" || s === "0") return "false";
      return s; // return as-is for other cases
    };

    const AwardsFlag = normalizeFlag(rawAwards);
    const ToolsSoftwareFlag = normalizeFlag(rawToolsSoftware);

    // TeamSize required
    if (rawTeamSize === undefined || rawTeamSize === null || String(rawTeamSize).trim() === "") {
      return res.status(400).json({
        message: "TeamSize is required",
        success: false
      });
    }

    // TeamSize must be numeric
    const teamSizeNum = Number(String(rawTeamSize).replace(/\D/g, "")); // strip non-digits first
    if (!Number.isFinite(teamSizeNum) || teamSizeNum < 0) {
      return res.status(400).json({
        message: "TeamSize must be a non-negative number",
        success: false
      });
    }

    // Awards must be provided
    if (AwardsFlag === "") {
      return res.status(400).json({
        message: "Awards is required and must be 'true' or 'false'",
        success: false
      });
    }

    // ---------------------------------------------
    // Awards[] parsing
    // ---------------------------------------------
    const AwardsObjects = Object.keys(req.body).filter(key => key.startsWith("Awards["));
    let Awards = [];

    if (AwardsFlag === "true") {
      const AwardsMap = new Map();

      AwardsObjects.forEach(key => {
        const match = key.match(/Awards\[(\d+)\]\[(.+)\]/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (!AwardsMap.has(index)) AwardsMap.set(index, {});
          AwardsMap.get(index)[field] = req.body[key];
        }
      });

      Awards = Array.from(AwardsMap.values());

      const AwardFestival = new Set();
      const DuplicateAward = [];
      const WebSeries = new Set();
      const DuplicateWebSeries = [];

      const ParseDate = (str) => {
        const [ day,month, year] = (str || "").split("/");
        if (!day || !month || !year) return new Date("Invalid");
        const fullYear = year.length === 2 ? `20${year}` : year;
        return new Date(`${day}/${month}/${fullYear}`);
      };

      for (let index = 0; index < Awards.length; index++) {
        const Awarding = Awards[index];
        const { AwardCat, Festival, Movie, releaseDate, Curency, Currency, budget, earned } = Awarding || {};
        const money = Currency ?? Curency;

        if (!AwardCat || !Festival || !Movie || !releaseDate || !money || !budget || !earned ) {
          return res.status(400).json({
            message: "These fields are required for awards",
            success: false
          });
        }

        const budgetNum = Number(budget);
        const earnedNum = Number(earned);
        if (budgetNum < 0) {
          return res.status(400).json({
            message: "budget must be a non-negative number",
            success: false
          });
        }
        if ( earnedNum < 0) {
          return res.status(400).json({
            message: "earned must be a non-negative number",
            success: false
          });
        }

        // let ReleaseDate = ParseDate(releaseDate);
        // if (isNaN(ReleaseDate.getTime())) {
        //   return res.status(400).json({
        //     message: "Invalid releaseDate (use dd/mm/yy or dd/mm/yyyy)",
        //     success: false
        //   });
        // }

        if (AwardFestival.has(AwardCat)) DuplicateAward.push(index, AwardCat); else AwardFestival.add(AwardCat);
        if (WebSeries.has(Festival)) DuplicateWebSeries.push(index, Festival); else WebSeries.add(Festival);

        Awards[index].Curency = money;
        Awards[index].budget = budgetNum;
        Awards[index].earned = earnedNum;
        Awards[index].releaseDate = releaseDate;
      }

      if (DuplicateAward.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Duplicate entries found with the same AwardCat",
          data: DuplicateAward
        });
      }

      if (DuplicateWebSeries.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Duplicate entries found with the same Festival",
          data: DuplicateWebSeries
        });
      }
    } else {
      Awards = [];
    }

    // ---------------------------------------------
    // Tools & Software parsing
    // ---------------------------------------------
    let Tools = [];
    let Software = [];

    if (ToolsSoftwareFlag === "true") {
      const rawTools = parsedBody.Tools ?? parsedBody["Tools[]"];
      const rawSoftware = parsedBody.Software ?? parsedBody["Software[]"];

      const toList = (v) => {
        if (v === undefined || v === null) return [];
        if (Array.isArray(v)) return v;
        return [v];
      };

      Tools = toList(rawTools).map(x => String(x).trim()).filter(Boolean);
      Software = toList(rawSoftware).map(x => String(x).trim()).filter(Boolean);

      Tools = [...new Set(Tools)];
      Software = [...new Set(Software)];

      if (Tools.length === 0) {
        return res.status(400).json({
          message: "This Tools are required",
          success: false
        });
      }
      if (Software.length === 0) {
        return res.status(400).json({
          message: "This Software are required",
          success: false
        });
      }
    } else {
      Tools = [];
      Software = [];
    }

    // ---------------------------------------------
    // Save record
    // ---------------------------------------------
    const { Role, ExperienceLevel } = Finding;
    try {
      const Updating = await directorexperience.create({
        Role: Role,
        ExperienceLevel: ExperienceLevel,
        Awards: {
          needed: AwardsFlag === "true",
          items: Awards.map((data) => ({
            AwardCategory: data.AwardCat,
            AwardFestival: data.Festival,
            MovieName: data.Movie,
            ReleaseDate: data.releaseDate,
            Currency: data.Curency,
            TotalBudget: data.budget,
            TotalEarned: data.earned
          }))
        },
        ToolsSoftware: {
          needed: ToolsSoftwareFlag === "true",
          Software: Software,
          Tools: Tools
        },
        TeamSize: String(teamSizeNum) // store string like before, but validation used numeric
      });

      await Orgdata.updateOne({ id: Id }, { DirectorExperience: Updating._id });

      return res.status(200).json({
        message: "The data has been sent successfully",
        success: true,
        data: Updating
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "There is an error while uploading the director experience data",
        success: false,
        error: error.message || error
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "There is something wrong in the DirectorExperienced code",
      success: false,
      error: error.message || error
    });
  }
};

exports.ProducerFresher = async (req, res) => {
  try {
    const Id = req?.USER?.id;
    if (!Id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const parsedBody = req.body;

    // ✅ Find organization record
    const Finding = await Orgdata.findOne({ id: Id });
    // if (!Finding) {
    //   return res.status(400).json({
    //     message: "You have not filled the form in the org data",
    //     success: false,
    //   });
    // }

    const {
      Inspiration,
      ProjectCount,
      budget,
      CrowdFunding,
      Network,
      Funding,
    } = parsedBody;

    const CrowdKeys = Object.keys(req.body).filter((key) => key.startsWith("Crowd["));
    let Crowd = [];

    // ✅ Only process crowd data if crowdfunding is true
    if (CrowdFunding && CrowdFunding.toString().toLowerCase() === "true") {
      const Crowdmaps = new Map();

      // Group crowd data by index
      CrowdKeys.forEach((key) => {
        const match = key.match(/Crowd\[(\d+)\]\[(.+)\]/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (!Crowdmaps.has(index)) Crowdmaps.set(index, {});
          Crowdmaps.get(index)[field] = req.body[key];
        }
      });

      Crowd = Array.from(Crowdmaps.values());
      const Name = new Set();
      const Certificate = new Set();
      const DuplicateName = [];
      const DuplicateCertificate = [];

      const DateChecker = (str) => {
        if (!str) return null;
        const [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
      };

      // ✅ Loop through each crowd entry
      for (let index = 0; index < Crowd.length; index++) {
        const crowd = Crowd[index];
        const { name, start, completion } = crowd;

        // Validate presence
        if (!name || !start || !completion) {
          return res.status(400).json({
            success: false,
            message: `Missing required fields for Crowd[${index}] — name, start, completion`,
            received: { name, start, completion },
          });
        }

        // Duplicate name check
        if (Name.has(name)) DuplicateName.push({ index, name });
        else Name.add(name);

        // Validate dates
        const StartDate = DateChecker(start);
        const CompletionDate = DateChecker(completion);

        if (isNaN(StartDate.getTime()) || isNaN(CompletionDate.getTime())) {
          return res.status(400).json({
            message: `Invalid date format for Crowd[${index}]`,
          });
        }

        if (StartDate.getTime() === CompletionDate.getTime()) {
          return res.status(400).json({
            message: `Start and completion date cannot be same for Crowd[${index}]`,
          });
        }

        if (CompletionDate <= StartDate) {
          return res.status(400).json({
            message: `Completion date cannot be earlier than start date for Crowd[${index}]`,
          });
        }

        // ✅ Handle file (fixed part)
        const script = req.files?.[`Crowd[${index}][documents]`]
        const fileType = "application/pdf";

        if (!script) {
          return res.status(400).json({
            index,
            message: "Missing documents file",
            data: crowd,
          });
        }

        // console.log(`✅ Found file for Crowd[${index}]:`, script.name);

        // Duplicate file name check
        if (Certificate.has(script.name)) {
          DuplicateCertificate.push({ index, name: script.name });
        } else {
          Certificate.add(script.name);
        }

        if (Array.isArray(script)) {
          return res.status(400).json({
            success: false,
            message: `Only one file is allowed for Crowd[${index}][documents]`,
          });
        }

        if (script.mimetype !== fileType) {
          return res.status(400).json({
            success: false,
            message: `Invalid file type for Crowd[${index}][documents]. Expected: ${fileType}`,
            received: script.mimetype,
          });
        }

        // ✅ Upload file to Cloudinary
        const fileUrl = await uploadDatatoCloudinary(
          script,
          process.env.CLOUDINARY_FOLDER_NAME,
          1000,
          1000
        );

        if (!fileUrl?.secure_url) {
          return res.status(400).json({
            message: `Error uploading file for Crowd[${index}]`,
            success: false,
          });
        }

        // Add file URL to crowd entry
        Crowd[index].scriptUrl = fileUrl.secure_url;
      }

      // ✅ Duplicate checks
      if (DuplicateName.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Duplicate entries found with the same project name",
          data: DuplicateName,
        });
      }

      if (DuplicateCertificate.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Duplicate script files found",
          data: DuplicateCertificate,
        });
      }
    } else {
      Crowd = [];
    }

    // console.log("This is the crowddate",Crowd )
    // ✅ Required fields check
    const requiredFields = {
      Inspiration,
      ProjectCount,
      budget,
      CrowdFunding,
      Network,
      Funding,
    };
    const missingFields = Object.keys(requiredFields).filter((key) => {
      const val = requiredFields[key];
      return (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These fields are required: ${missingFields.join(", ")}`,
      });
    }

    // ✅ Word limit check (250 words)
    const WordCounts = (text, limit = 250) => {
      const words = text.trim().split(/\s+/);
      return words.length > limit ? `Exceeded ${limit} words` : null;
    };

    const textareaFields = ["Inspiration", "budget", "Network", "Funding"];
    const textareaErrors = textareaFields
      .map((field) => {
        const val = req.body[field];
        if (!val || typeof val !== "string" || !val.trim()) return null;
        const err = WordCounts(val);
        return err ? `${field}: ${err}` : null;
      })
      .filter(Boolean);

    if (textareaErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more text fields exceed the 250-word limit",
        fields: textareaErrors,
      });
    }

    const { Role, ExperienceLevel } = Finding;
// console.log("This is the crowd data",Crowd)
    // ✅ Create entry
    const Uploading = await producerfresher.create({
      Role,
      ExperienceLevel,
      Producerinspiration: Inspiration,
      ProjectsCount: ProjectCount,
      BudgetPlanning: budget,
      industryRelation: Network,
      FundingDelays: Funding,
      CrowdFunding:{
        needed:CrowdFunding,
        items:Crowd.map((data)=>({
          Name:data.name,
          StartDate:data.start,
          EndDate:data.completion,
          link:data.scriptUrl
        }))
      }

    });
    await Orgdata.updateOne({ id: Id }, { ProducerFresher: Uploading._id });

    return res.status(200).json({
      success: true,
      message: "Producer data sent successfully",
      Crowd,
    });
  } catch (error) {
    console.error("❌ Error in producerfresher:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in producerfresher",
      error: error.message,
    });
  }
};

exports.ProducerExperience = async (req, res) => {
  try {
    const parsedBody = req.body;

    const Id = req?.USER?.id;

    const Finding = await Orgdata.findOne({ id: Id });
    if (!Finding) {
      return res.status(400).json({
        message: "You have not filled the form in the org data",
        success: false,
      });
    }

        // -------- Resume (PDF) --------
    // Expecting a single file field named "Resume" (or "resume")
    let Resum = req.files.Resume || req.files.resume;

    const { affiliated, teamSize, projectcount, riskmanagement } = parsedBody;

    // Required: EMPTY string check only (your requirement)
    if (
      String(affiliated).trim() === "" ||
      String(teamSize).trim() === "" ||
      String(projectcount).trim() === "" ||
      String(riskmanagement).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "affiliated, teamSize, projectcount, and riskmanagement are required",
      });
    }

    // (Optional) If you want numbers to be valid non-negative:
    // const teamSizeNum = Number(teamSize);
    // const projectCountNum = Number(projectcount);
    // if (!Number.isFinite(teamSizeNum) || teamSizeNum < 0) {
    //   return res.status(400).json({ message: "teamSize must be a non-negative number", success: false });
    // }
    // if (!Number.isFinite(projectCountNum) || projectCountNum < 0) {
    //   return res.status(400).json({ message: "projectcount must be a non-negative number", success: false });
    // }

// console.log(Resum)

    if (!Resum) {
      return res.status(400).json({
        message: "This resume fields is required",
        success: false,
      });
    }

    if (Array.isArray(Resum)) {
      return res.status(400).json({
        message: "Only one file is allowed",
        success: false,
      });
    }

    const MaxLimit = 5 * 1024 * 1024; // 5 MB
    const fileType = "application/pdf";

    if (Resum.mimetype !== fileType) {
      return res.status(400).json({
        message: `Invalid file type. Expected: ${fileType}, Received: ${Resum.mimetype}`,
        success: false,
      });
    }

    if (Resum.size > MaxLimit) {
      return res.status(400).json({
        message: "Your resume exceeds the 5 MB limit",
        success: false,
      });
    }

    // Upload resume
    const fileUrl = await uploadDatatoCloudinary(
      Resum,
      process.env.CLOUDINARY_FOLDER_NAME,
      1000,
      1000
    );

    if (!fileUrl || !fileUrl.secure_url) {
      return res.status(400).json({
        message: "The file was not converted into a URL due to some issue",
        success: false,
      });
    }

    // -------- riskmanagement word limit (if you use WordCounts like before) --------
    // If WordCounts returns an error message when exceeding limit, keep your pattern:
    const WordsErr = WordCounts(riskmanagement);
    if (WordsErr) {
      return res.status(400).json({
        success: false,
        message: `riskmanagement: ${WordsErr}`,
      });
    }

    // -------- Funding (array) from form-data --------
    // You referenced Fund / Fund[] – parse either repeated keys or [] keys.
    const toList = (v) => {
      if (v === undefined || v === null) return [];
      if (Array.isArray(v)) return v;
      return [v]; 
    };

    // Accept multiple possible keys the frontend might send
  let Funding = toList(
  parsedBody.Fund ??
  parsedBody["Fund[]"] ??
  parsedBody.Funding ??
  parsedBody["Funding[]"]
);

   if (Funding.length === 1) {
  const fundIdxKeys = Object.keys(parsedBody)
    .filter(k => /^Fund\[\d+\]$/.test(k))
    .sort((a, b) => {
      const ai = Number(a.match(/\[(\d+)\]/)[1]);
      const bi = Number(b.match(/\[(\d+)\]/)[1]);
      return ai - bi;
    });

  if (fundIdxKeys.length > 0) {
    Funding = fundIdxKeys.map(k => String(parsedBody[k]).trim());
  }
}

// Final cleanup
Funding = Funding.map(x => String(x).trim()).filter(Boolean);
Funding = [...new Set(Funding)];

if (Funding.length === 0) {
  return res.status(400).json({
    message: "Funding is required (provide at least one item in Fund/Fund[]/Funding)",
    success: false,
  });
}

    // -------- Affiliations (dynamic objects) --------
    const affiliatedObjects = Object.keys(req.body).filter((key) =>
      key.startsWith("Affili[")
    );
    let Affilition = [];

    if (String(affiliated) && affiliated=== "Yes") {
      const AwardsMap = new Map();
      // String(notableProjects) && notableProjects === "Yes"

      affiliatedObjects.forEach((key) => {
        const match = key.match(/Affili\[(\d+)\]\[(.+)\]/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (!AwardsMap.has(index)) AwardsMap.set(index, {});
          AwardsMap.get(index)[field] = req.body[key];
        }
      });

      Affilition = Array.from(AwardsMap.values());

      for(let index =0 ;index<Affilition.length ; index++){
        const Aff = Affilition[index]
        const {name,membership,yearjoined,expirydate} = Aff

        if(!name || !membership || !yearjoined || !expirydate){
          return res.status(400).json({
            message:"This fields are required",
            success:false
          })
        }
      }
      // (Optional) Validate each affiliation row here if needed
      // for (let i = 0; i < Affilition.length; i++) {
      //   const row = Affilition[i];
      //   if (!row.name || !row.role) {
      //     return res.status(400).json({ message: "Affiliation fields are required", success: false });
      //   }
      // }
    } else {
      Affilition = [];
    }


    // console.log("This is the affiliated data",Affilition)
    // -------- Respond (or save to DB) --------
    // If you want to persist, add your model create/update here.\\\

    const {Role,ExperienceLevel} = Finding
    // name,membership,yearjoined,expirydate
    // affiliated, teamSize, projectcount, riskmanagement
    // console.log("This is the affiliation data",affiliated)
    // console.log("This isth details",Affilition)

    try{

      const Updating = await producerexperience.create({
        Resume:fileUrl.secure_url,
        Role:Role,
        ExperienceLevel:ExperienceLevel,
        Funding:Funding,
        Affiliation:{
          needed:affiliated,
          items:Affilition.map((data)=>({
            union:data.name,
            Membershipid:data.membership,
            Yearjoined:data.yearjoined,
            ExpiryDate:data.expirydate
          }))
        },
        TeamSize:teamSize,
        TotalProjects:projectcount,
        RiskManagement:riskmanagement
      })

    await Orgdata.updateOne({ id: Id }, { ProducerExperience: Updating._id });


      return res.status(200).json({
        message:"This data is send to the producer experience",
        success:true,
        data:Updating
      })
    }catch(error){
      console.log(error)
      return res.status(500).json({
        message:"There is an error while creating the producer experieence data"
      })
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(400).json({
      message: "There is an something wrong in the ProducerFresher code",
      success: false,
      error: error.message,
    });
  }
};

// New controller to get organizer's own data
exports.GetMyOrgData = async (req, res) => {
  try {
    const userId = req.USER.id;
    console.log("Fetching org data for user:", userId);

    // Get the user
    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If user doesn't have orgainezerdata, return empty
    if (!user.orgainezerdata) {
      return res.status(200).json({
        success: true,
        message: "No organizer data found",
        data: {
          organizerData: null,
          directorFresher: null,
          directorExperience: null,
          producerFresher: null,
          producerExperience: null,
          status: "pending",
          attempts: 0,
          editUntil: null
        }
      });
    }

    // Get the organizer data
    const organizerData = await Orgdata.findById(user.orgainezerdata);

    if (!organizerData) {
      return res.status(200).json({
        success: true,
        message: "No organizer data found",
        data: {
          organizerData: null,
          directorFresher: null,
          directorExperience: null,
          producerFresher: null,
          producerExperience: null,
          status: "pending",
          attempts: 0,
          editUntil: null
        }
      });
    }

    // Get role-specific data
    let directorFresher = null;
    let directorExperience = null;
    let producerFresher = null;
    let producerExperience = null;

    if (organizerData.DirectFresh) {
      directorFresher = await directorfresher.findById(organizerData.DirectFresh);
    }
    if (organizerData.DirectorExperience) {
      directorExperience = await directorexperience.findById(organizerData.DirectorExperience);
    }
    if (organizerData.ProducerFresher) {
      producerFresher = await producerfresher.findById(organizerData.ProducerFresher);
    }
    if (organizerData.ProducerExperience) {
      producerExperience = await producerexperience.findById(organizerData.ProducerExperience);
    }

    return res.status(200).json({
      success: true,
      message: "Organizer data fetched successfully",
      data: {
        organizerData,
        directorFresher,
        directorExperience,
        producerFresher,
        producerExperience,
        status: organizerData.status,
        attempts: organizerData.attempts,
        editUntil: organizerData.editUntil,
        lockedUntill: organizerData.lockedUntill
      }
    });

  } catch (error) {
    console.log("Error in GetMyOrgData:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching organizer data",
      error: error.message
    });
  }
};

// New controller to get organizer's own data
exports.GetOrganizerOwnData = async (req, res) => {
  try {
    const currentUserId = req.USER.id;
    console.log("Fetching own org data for user:", currentUserId);

    // Find user
    const user = await USER.findById(currentUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If user doesn't have org data linked, return empty
    if (!user.orgainezerdata) {
      return res.status(200).json({
        success: true,
        message: "No organizer data found",
        data: {
          organizersData: [],
          directorExperience: [],
          directorFresh: [],
          producerExperience: [],
          producerFresh: [],
        },
      });
    }

    // Fetch organizer's data
    const orgData = await Orgdata.findById(user.orgainezerdata);
    if (!orgData) {
      return res.status(200).json({
        success: true,
        message: "No organizer data found",
        data: {
          organizersData: [],
          directorExperience: [],
          directorFresh: [],
          producerExperience: [],
          producerFresh: [],
        },
      });
    }

    // Fetch role-specific data
    let directorExperience = [];
    let directorFresh = [];
    let producerExperience = [];
    let producerFresh = [];

    if (orgData.DirectorExperience) {
      const dirExp = await directorexperience.findById(orgData.DirectorExperience);
      if (dirExp) directorExperience = [dirExp];
    }

    if (orgData.DirectFresh) {
      const dirFresh = await directorfresher.findById(orgData.DirectFresh);
      if (dirFresh) directorFresh = [dirFresh];
    }

    if (orgData.ProducerExperience) {
      const prodExp = await producerexperience.findById(orgData.ProducerExperience);
      if (prodExp) producerExperience = [prodExp];
    }

    if (orgData.ProducerFresher) {
      const prodFresh = await producerfresher.findById(orgData.ProducerFresher);
      if (prodFresh) producerFresh = [prodFresh];
    }

    return res.status(200).json({
      success: true,
      message: "Organizer data fetched successfully",
      data: {
        organizersData: [orgData],
        directorExperience,
        directorFresh,
        producerExperience,
        producerFresh,
      },
    });

  } catch (error) {
    console.log("Error in GetOrganizerOwnData:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching organizer data",
      error: error.message
    });
  }
};