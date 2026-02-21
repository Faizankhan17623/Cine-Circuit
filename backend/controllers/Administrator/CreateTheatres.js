const Theatre  = require('../../models/Theatres')
const {uploadDatatoCloudinary} = require('../../utils/imageUploader')
const lanuages = require('../../models/CreateLanguage')
const date = require('date-and-time')
const USER  = require('../../models/user')
const TheatreCreation = require('../../models/TheatrerRequest')
const Theatres = require('../../models/Theatres')
const Theatrestickets = require('../../models/TheatresTicket')
const bcrypt = require('bcrypt')
const SendMessage = require("../../models/Createmessage");
const mailSender = require("../../utils/mailsender");
const sendingOtpTeemplate = require("../../templates/userTemplates/emailTemplate");
const theatreApprovedTemplate = require("../../templates/userTemplates/theatreApprovedTemplate");
const theatreRejectedTemplate = require("../../templates/userTemplates/theatreRejectedTemplate");
// const date = require('date-and-time')


// Theare is a warning to the theatre that he cannot edit any of his details and he cannot change anything without the authorization of the administrator 
// ya wala jo hain wo admin ko dena hain data input ka leya  hour wo he theatre create karenga y data use kar ke 
// THis is the function which is present in the admin route on line no 49
exports.CreateTheatres = async(req,res)=>{

    try {
        const {name,locationname,locationurl,languagename,theatreformat,TheatreOwner,parking} = req.body
        let theatreImage = req.files.theatreImage
        // console.log("This is the theatre images",theatreImage)

        if(!name || !locationname || !locationurl || !languagename || !theatreformat || !TheatreOwner ||   !parking ){
            return res.status(400).json({
                message:"the input fields are been required",
                success:false
            })
        }

        const OwnerFinding = await USER.findOne({_id:TheatreOwner})

        // console.log(OwnerFinding.theatreCreated)

        if(!OwnerFinding){
            return res.status(400).json({
                message:"The user is not been found or check your inputs",
                success:false
            })
        }


        if(OwnerFinding.theatreCreated){
            return res.status(400).json({
                message:"The user has already created a theatre and cannot create another oneplease check your inputs or youe email id ",
                success:false
            })
        }

        // if(OwnerFinding.)
        if(!req.files || !req.files.theatreImage){
            return res.status(400).json({
                message:"no images uploaded",
                success:false
            })
        }
        const finding = await Theatre.findOne({Theatrename:name})
        if(finding){
            return res.status(400).json({
                message:"The theatre is aready been present pleas take another one",
                success:false
            })
        }

        const locationFinding = await Theatre.findOne({locationname:locationname})


        if(locationFinding){
            return res.status(400).json({
                message:"This location theatre is lalready beeen present",
                successs:false
            })
        }

                        const now = new Date()
                        const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
                        let ps = date.format(now, pattern);
                        
                                    // const uploadingImage = await uploadDatatoCloudinary(theatreImage,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                                    const uploadingImage = await Promise.all(
                                        theatreImage.map(async(file)=>{
                                            let ats = await uploadDatatoCloudinary(file,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
                                            // console.log("This is the multiple",ats)
                                            return ats.secure_url
                                        })
                                    )
                                    // console.log("This is th thestre image",theatreImage)

                                    // console.log("This is the uploaded image",uploadingImage)

        const CreateTheatre =  await Theatre.create({
            Theatrename:name,
            locationname:locationname,
            locationurl:locationurl,
            languagesavailable:languagename,
            theatreformat:theatreformat,
            CreationDate:ps,
            locationimagesurl:uploadingImage,
            TheatreOwner:TheatreOwner,
            parking:parking
        }) 


        await USER.updateOne({_id:TheatreOwner},{theatreCreated:CreateTheatre._id})
        // console.log("THis is the theatre that has been creatd",CreateTheatre)
        return res.status(200).json({
            message:"The theatre is been created",
            success:true,
            data:CreateTheatre
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create theatre code",
            success:false
        })
    }
}

// THis is the function which is present in the admin route on line no 46 
// THis is the function which is present in the and also present in the theatrer route on line no 19
exports.GetAllTheatres = async(req,res)=>{
    try {
        const Finding = await Theatre.find()
        if(!Finding){
            return res.status(400),json({
                message:"no theatre are created"
            })
        }

        // console.log(Finding)

        return res.status(200).json({
            message:"These are all the theatres that are been created",
            success:true,
            data:Finding
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the get all theatres code",
            success:false
        })
    }
}

// THis is the function which is present in the admin route on line no 44
// THis is the function which is present in the theatrer route on line no 2
// This will be the route where the person that want to create the theatre on our platform will enter 
exports.TheatreCreationRequest = async(req,res)=>{
    try{
        // Get All the request that have come to create a theatre
        const Finding = await TheatreCreation.find()

        if(!Finding || Finding.length === 0){
            return res.status(400).json({
                message:"There are no request availbe to create Theatre",
                success:false
            })
        }


        return res.status(200).json({
            message:"This is the list that is been availabe to create Theatres",
            success:true,
            data:Finding
        })
    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the create TheatreCreationRequest code",
            success:false
        })
    }
}

// using this route we will get all the details that the use has provided to us
// /And THis is the only function that will be going to be used as the form input
// This is the function that is going to be used in the route of the theatreer on line no 16

 exports.TheatreCreationRequestPassing = async(req, res) => {
    try {
        // Extract non-array fields
        const {
            email,
            Username,
            theatrename,
            password,
            countrycode,
            mobilenumber,
            locationname,
            locationurl,
            TheatreOwner
        } = req.body;

        // Helper function to parse arrays from form-data
        const parseArray = (value) => {
            if (Array.isArray(value)) return value;
            
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    return [];
                }
            }
            
            return [];
        };

        // Parse all array fields
        const typesofseats = parseArray(req.body.typesofseats);
        const Screentypes = parseArray(req.body.Screentypes);
        const languageAvailable = parseArray(req.body.languageAvailable);
        const parking = parseArray(req.body.parking);
        const theatreformat = parseArray(req.body.theatreformat);

        // Get images
        const TheareOutsideImages = req.files?.TheareOutsideImages;
        const TheatreInsideImages = req.files?.TheatreInsideImages;

        // Define required fields
        const requiredFields = [
            { field: email, message: "Email is required" },
            { field: Username, message: "Username is required" },
            { field: theatrename, message: "Theatre name is required" },
            { field: password, message: "Password is required" },
            { field: countrycode, message: "Country code is required" },
            { field: mobilenumber, message: "Mobile number is required" },
            { field: locationname, message: "Location name is required" },
            { field: locationurl, message: "Location URL is required" },
            { field: TheatreOwner, message: "Theatre owner is required" }
        ];

        // Check each required field
        for (const { field, message } of requiredFields) {
            if (!field && field !== 0 && field !== false) {
                return res.status(400).json({
                    message: message,
                    success: false
                });
            }
        }

        // Check arrays (must have at least one item)
        const requiredArrays = [
            { array: typesofseats, message: "At least one seat type is required" },
            { array: Screentypes, message: "At least one screen type is required" },
            { array: languageAvailable, message: "At least one language is required" },
            { array: theatreformat, message: "At least one theatre format is required" },
            { array: parking, message: "At least one parking option is required" }
        ];

        for (const { array, message } of requiredArrays) {
            if (!Array.isArray(array) || array.length === 0) {
                return res.status(400).json({
                    message: message,
                    success: false
                });
            }
        }

        // Check theatre images
        if (!TheareOutsideImages) {
            return res.status(400).json({
                message: "Please insert the images outside of the theatre",
                success: false
            });
        }

        if (Array.isArray(TheareOutsideImages) && TheareOutsideImages.length === 0) {
            return res.status(400).json({
                message: "At least one outside theatre image is required",
                success: false
            });
        }

        if (!TheatreInsideImages) {
            return res.status(400).json({
                message: "Please insert the images from inside of the theatre",
                success: false
            });
        }

        if (Array.isArray(TheatreInsideImages) && TheatreInsideImages.length === 0) {
            return res.status(400).json({
                message: "At least one inside theatre image is required",
                success: false
            });
        }

        // Check for existing email
        // const EmailFinding = await Theatres.findOne({ email: email });
        // if (EmailFinding) {
        //     return res.status(400).json({
        //         message: "This email is already taken. Use another email",
        //         success: false
        //     });
        // }

        // // Check for existing username
        // const NameFinding = await Theatres.findOne({ username: Username });
        // if (NameFinding) {
        //     return res.status(400).json({
        //         message: "The name is already taken. Please take another one",
        //         success: false
        //     });
        // }

        // Check for existing mobile number
        const NumberFinding = await USER.findOne({ number: mobilenumber });
        if (NumberFinding) {
            return res.status(400).json({
                message: "The mobile number is already taken. Use another number",
                success: false
            });
        }


         const UserNameFinding = await USER.findOne({ userName: Username });
        if (UserNameFinding) {
            return res.status(400).json({
                message: "The name is already taken. Please take another one",
                success: false
            });
        }

        // Check for existing mobile number
        const UserNumberFinding = await USER.findOne({ number: mobilenumber });
        if (UserNumberFinding) {
            return res.status(400).json({
                message: "The mobile number is already taken. Use another number",
                success: false
            });
        }

        // FIX THIS LINE - Change "Theatre" to "Theatres"
        const TheatreFinding = await Theatres.findOne({ Theatrename: theatrename });
        if (TheatreFinding) {
            return res.status(400).json({
                message: "The theatre in this location is already taken. Please choose another one",
                success: false
            });
        }

        // Constants for validation
        const SEAT_TYPES = [
            "Regular", "Premium", "Recliner", "Couple Seat", "Executive",
            "Royal/VIP", "D-BOX Motion", "Wheelchair Accessible",
            "Gold Class", "Silver Class", "Bronze Class"
        ];

        const SCREEN_TYPES = [
            "2D", "3D", "IMAX 2D", "IMAX 3D", "4DX 2D", "4DX 3D",
            "ScreenX", "Dolby Cinema", "MX4D", "ICE", "Standard Screen",
            "Premium Large Format", "Laser Projection"
        ];

        const LANGUAGES = [
            "Hindi", "English", "Tamil", "Telugu", "Malayalam", "Kannada",
            "Bengali", "Marathi", "Gujarati", "Punjabi", "Spanish", "French",
            "German", "Japanese", "Korean", "Chinese", "Arabic", "Dubbed", "Subtitled"
        ];

        const THEATRE_FORMATS = [
            "Dolby Atmos", "Dolby Digital 7.1", "DTS:X", "Dolby Digital 5.1",
            "Auro 3D", "4K Digital", "2K Digital", "Laser Projection",
            "Standard Cinema", "Premium Cinema", "Luxury Cinema", "Dine-in Cinema",
            "IMAX", "4DX", "Drive-in"
        ];

        const PARKING_OPTIONS = [
            "Available - Free", "Available - Paid", "Valet Parking Available",
            "Street Parking Only", "No Parking Available", "Two-Wheeler Parking",
            "Four-Wheeler Parking", "Multi-level Parking"
        ];

        const ALLOWED_IMAGE_TYPES = [
            "image/jpeg", "image/jpg", "image/png", "image/webp"
        ];

        // Validate seat types
        if (!typesofseats.every(seat => SEAT_TYPES.includes(seat))) {
            const invalidSeatTypes = typesofseats.filter(seat => !SEAT_TYPES.includes(seat));
            return res.status(400).json({
                message: `Invalid seat type(s): ${invalidSeatTypes.join(', ')}`,
                success: false
            });
        }

        // Validate screen types
        if (!Screentypes.every(screen => SCREEN_TYPES.includes(screen))) {
            const invalidScreenTypes = Screentypes.filter(screen => !SCREEN_TYPES.includes(screen));
            return res.status(400).json({
                message: `Invalid screen type(s): ${invalidScreenTypes.join(', ')}`,
                success: false
            });
        }

        // Validate languages
        if (!languageAvailable.every(lang => LANGUAGES.includes(lang))) {
            const invalidLanguages = languageAvailable.filter(lang => !LANGUAGES.includes(lang));
            return res.status(400).json({
                message: `Invalid language(s): ${invalidLanguages.join(', ')}`,
                success: false
            });
        }

        // Validate theatre formats
        if (!theatreformat.every(format => THEATRE_FORMATS.includes(format))) {
            const invalidFormats = theatreformat.filter(format => !THEATRE_FORMATS.includes(format));
            return res.status(400).json({
                message: `Invalid theatre format(s): ${invalidFormats.join(', ')}`,
                success: false
            });
        }

        // Validate parking
        if (!parking.every(p => PARKING_OPTIONS.includes(p))) {
            const invalid = parking.filter(p => !PARKING_OPTIONS.includes(p));
            return res.status(400).json({
                message: `Invalid parking option(s): ${invalid.join(', ')}`,
                success: false
            });
        }

        // Validate images function
        const validateImages = (files, fieldName) => {
            if (!files) {
                return `${fieldName} images are required`;
            }

            const imagesArray = Array.isArray(files) ? files : [files];

            if (imagesArray.length === 0) {
                return `At least one ${fieldName} image is required`;
            }

            for (const file of imagesArray) {
                if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
                    return `Invalid file type in ${fieldName}. Allowed types: jpg, jpeg, png, webp`;
                }
            }

            return null;
        };

        // Validate outside images
        const outsideImageError = validateImages(TheareOutsideImages, "outside theatre");
        if (outsideImageError) {
            return res.status(400).json({
                success: false,
                message: outsideImageError
            });
        }

        // Validate inside images
        const insideImageError = validateImages(TheatreInsideImages, "inside theatre");
        if (insideImageError) {
            return res.status(400).json({
                success: false,
                message: insideImageError
            });
        }

        // Define maximum file size (5 MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

        // Validate file sizes
        const validateFileSize = (files, fieldName) => {
            const imagesArray = Array.isArray(files) ? files : [files];
            for (const file of imagesArray) {
                if (file.size > MAX_FILE_SIZE) {
                    return `File size for ${fieldName} must not exceed 5 MB`; 
                }
            }
            return null;
        };

        // Validate outside images size
        const outsideImageSizeError = validateFileSize(TheareOutsideImages, "outside theatre");
        if (outsideImageSizeError) {
            return res.status(400).json({
                success: false,
                message: outsideImageSizeError
            });
        }

        // Validate inside images size
        const insideImageSizeError = validateFileSize(TheatreInsideImages, "inside theatre");
        if (insideImageSizeError) {
            return res.status(400).json({
                success: false,
                message: insideImageSizeError
            });
        }

        // Upload outside images to Cloudinary
        let OutsideImages = await Promise.all(
            (Array.isArray(TheareOutsideImages) ? TheareOutsideImages : [TheareOutsideImages]).map(async(data) => {
                let uploadingImages = await uploadDatatoCloudinary(
                    data, 
                    process.env.CLOUDINARY_FOLDER_NAME, 
                    1000, 
                    1000
                );
                return uploadingImages.secure_url;
            })
        );

        // Upload inside images to Cloudinary
        let InsideImages = await Promise.all(
            (Array.isArray(TheatreInsideImages) ? TheatreInsideImages : [TheatreInsideImages]).map(async(data) => {
                let uploadingImages = await uploadDatatoCloudinary(
                    data, 
                    process.env.CLOUDINARY_FOLDER_NAME, 
                    1000, 
                    1000
                );
                return uploadingImages.secure_url;
            })
        );

        // Create date
        const now = new Date();
        const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);

        // Hash password
        const hasing = await bcrypt.hash(password, 10);

        const UserCreation = await USER.create({
            email: email,
            userName: Username,
            number: mobilenumber,
            password: hasing,
            confirmpass: hasing,
            usertype:"Theatrer",
            countrycode:countrycode,
            image:`https://ui-avatars.com/api/?name=${encodeURIComponent(Username)}&background=random`,
            createdAt:ps,
        })
        // Create theatre
        const Creation = await Theatres.create({
            locationName: locationname,
            locationurl: locationurl,
            TheatreInsideimages: InsideImages,
            Theatreoutsideimages: OutsideImages,
            typesofseatsAvailable: typesofseats,
            movieScreeningType: Screentypes,
            languagesAvailable: languageAvailable,
            Theatrename: theatrename,
            theatreformat: theatreformat,
            CreationDate: ps,
            TheatreOwner: TheatreOwner,
            parking: parking,
            Verified:false,
            status:"Pending"
        });


        await USER.updateOne({_id:UserCreation._id},{theatresCreated:Creation._id})
        // Update theatre with owner
        await Theatres.updateOne(
            { _id: Creation._id },
            { $set: { Owner: UserCreation._id } }
        );
        // Update theatre tickets
        await Theatrestickets.updateOne(
            { _id: Creation._id },
            { $set: { Owner: Creation._id } }
        );

        return res.status(200).json({
            message: "The data is sent to the admin to be verified",
            success: true,
            data: Creation
        });

    } catch (error) {
        console.log(error);
        console.log(error.message);
        return res.status(500).json({
            message: "There is an error in the TheatreCreationRequestPassing code",
            success: false,
        });
    }
};




exports.VerifyTheatrer = async (req, res) => {
  try {
    const {
      id,
      verify,    // true or false
      rejectionReason,  // optional reason for rejection
    } = req.body;

    // console.log("=== THEATRE VERIFICATION REQUEST ===");
    // console.log("Received ID:", id);
    // console.log("Verify:", verify);
    // console.log("Verify type:", typeof verify);

    /* ================= BASIC VALIDATION ================= */
    if (!id) {
      console.log("Validation failed: ID is missing");
      return res.status(400).json({
        success: false,
        message: "Theatre owner ID is required",
      });
    }

    if (typeof verify !== "boolean") {
    //   console.log("Validation failed: verify is not a boolean, received:", typeof verify);
      return res.status(400).json({
        success: false,
        message: "verify must be a boolean (true/false)",
      });
    }

    const user = await USER.findById(id);
    // console.log("User found:", user ? `${user._id} (${user.usertype})` : "NOT FOUND");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided ID"
      });
    }

    if (user.usertype !== "Theatrer") {
    //   console.log("User type mismatch. Expected: Theatrer, Got:", user.usertype);
      return res.status(403).json({
        success: false,
        message: `User is not a Theatrer. Current type: ${user.usertype}`,
      });
    }

    if (!user.theatresCreated) {
      console.log("Theatre not linked to user");
      return res.status(400).json({
        success: false,
        message: "No theatre is linked to this user account",
      });
    }

    const org = await Theatres.findById(user.theatresCreated);
    // console.log("Theatre found:", org ? `${org._id} (${org.Theatrename})` : "NOT FOUND");

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Theatre profile not found in database",
      });
    }

     const now = new Date();
        const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);


        if(org.status === "Approved" && Verified === true){
            return res.status(400).json({
                message:"This Theatrere is already verified you cannot verify him again",
                success:false
            })
        }

    /* ================= APPROVE ================= */
    if (verify === true) {
      // ✅ FIX: Use org._id (Org document ID), not org.id (User ID)
      const o = await Theatres.findByIdAndUpdate(org._id, {
        status: "Approved",
        VerifiedAt:ps,
        Verified:true
      }, { new: true });
// console.log("This ist e org date from ",o)
      // ✅ FIX: Use user._id (User document ID), not user.id
      const u = await USER.findByIdAndUpdate(user._id, {
        verified: true,
      }, { new: true });
// console.log(u)
      await SendMessage.create({
        to: id,
        message: ["Your account verification request was Accepted. Good Luck!"],
        typeOfmessage: 'Chat'
      });
      
      await mailSender(
        user.email,
        "Your Theatre Has Been Approved - Cine Circuit",
        theatreApprovedTemplate(org.Theatrename, user.name || user.userName || "User")
      );

      return res.status(200).json({
        success: true,
        message: "Organizer verified successfully",
        data:o
      });
    }

    /* ================= REJECT ================= */
    if (verify === false) {

      // ✅ FIX: Use org._id and user._id
     const orgReject =  await Theatres.findByIdAndUpdate(org._id, {
        status: "Rejected",
        RejectedAt:ps,
        Verified:false
      }, { new: true });
// console.log(orgReject)
      const userReject = await USER.findByIdAndUpdate(user._id, {
        verified: false,
      }, { new: true });
// console.log(userReject)
      await SendMessage.create({
        to: id,
        message: ["Your account verification request was Rejected"],
        typeOfmessage: 'Chat'
      });
      
      await mailSender(
        user.email,
        "Your Theatre Application Needs Revision - Cine Circuit",
        theatreRejectedTemplate(org.Theatrename, user.name || user.userName || "User", rejectionReason)
      );

      return res.status(200).json({
        success: true,
        message: "Theatre Verification Rejected",
      });
    }

  } catch (error) {
    console.error("=== THEATRE VERIFICATION ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Server error during theatre verification",
    });
  }
};


exports.GetTheatreDetails = async (req, res) => {
    try {
        // Get ALL users who are theatre owners (not just one)
        const TheatreUsers = await USER.find({ usertype: "Theatrer" })
        
        if (!TheatreUsers || TheatreUsers.length === 0) {
            return res.status(400).json({
                message: "No theatre users present",
                success: false
            })
        }

        // console.log("Found theatre users:", TheatreUsers)

        // Extract all theatre IDs from all users
        const theatreIds = TheatreUsers
            .map(user => user.theatresCreated)
            .filter(id => id) // Remove null/undefined

        if (theatreIds.length === 0) {
            return res.status(400).json({
                message: "No theatres created yet",
                success: false
            })
        }

        // Get ALL theatres using those IDs
        const TheatreDetails = await Theatres.find({ _id: { $in: theatreIds } })

        if (!TheatreDetails || TheatreDetails.length === 0) {
            return res.status(400).json({
                message: "No theatre details found",
                success: false
            })
        }

        // console.log("These are the details", TheatreDetails)

        // Filter verified and unverified
        const VerifiedReject = TheatreDetails.filter((data) => {
            return data.Verified === false
        })

        const VerifiedAccept = TheatreDetails.filter((data) => {
            return data.Verified === true
        })

        return res.status(200).json({
            message: "Theatre data retrieved successfully",
            users:TheatreUsers,
            data: TheatreDetails,
            verified: VerifiedAccept,
            unverified: VerifiedReject,
            success: true
        })

    } catch (error) {
        console.error("Error in getting theatre details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}