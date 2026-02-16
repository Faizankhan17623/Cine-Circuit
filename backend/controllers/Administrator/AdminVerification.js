const USER = require("../../models/user");
const {Orgdata} = require("../../models/Org_data");
const SendMessage = require("../../models/Createmessage");
const mailSender = require("../../utils/mailsender");
const sendingOtpTeemplate = require("../../templates/userTemplates/emailTemplate");
const orgApprovedTemplate = require("../../templates/userTemplates/orgApprovedTemplate");
const orgRejectedTemplate = require("../../templates/userTemplates/orgRejectedTemplate");
const directorfresher = require('../../models/DirectorFresher')
const directorexperience = require('../../models/DirectorExperience')
const producerexperience = require("../../models/ProducerExperience")
const producerfresher = require('../../models/ProducerFresher')


// ================= CLEAN REPLACEMENT FOR VerifyOrgainezer ================
exports.VerifyOrgainezer = async (req, res) => {
  try {
    const {
      id,
      verify,    // true or false
      ChangesDate,   // DD/MM/YYYy
      ChangesTime,   //hh:mm 
      verificationStatus,  
    } = req.body;


    //   console.log("=== VERIFICATION REQUEST ===");
    // console.log("Received ID:", id);
    // console.log("Verify:", verify);
    // console.log("Status:", verificationStatus);


    /* ================= BASIC VALIDATION ================= */
    if (!id || typeof verify !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "id and verify(boolean) are required",
      });
    }

    const user = await USER.findById(id);  // ✅ Use findById directly
    // console.log(user)  This will log the user date whose id is given in the input
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.usertype !== "Organizer") {
      return res.status(403).json({
        success: false,
        message: "User is not an organizer",
      });
    }

    if (!user.orgainezerdata) {
      return res.status(400).json({
        success: false,
        message: "Organizer data not linked",
      });
    }

    const org = await Orgdata.findById(user.orgainezerdata);
    // console.log(org) This will log the date that is givne in the orgainezeer 
    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    /* ================= APPROVE ================= */
    if (verify === true) {
      // ✅ FIX: Use org._id (Org document ID), not org.id (User ID)
      const o = await Orgdata.findByIdAndUpdate(org._id, {
        status: "Approved",
        attempts: 0,
        editUntil: null,
        lockedUntill: null,
      }, { new: true });
// console.log("This ist e org date from ",o)
      // ✅ FIX: Use user._id (User document ID), not user.id
      // console.log(user,"logs for deecgin some user date ")
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
        "Your Organizer Account Has Been Approved - Cine Circuit",
        orgApprovedTemplate(user.name || user.userName || "User")
      );

      return res.status(200).json({
        success: true,
        message: "Organizer verified successfully",
        data:o
      });
    }

    /* ================= REJECT ================= */
    if (verify === false) {
      if (!ChangesDate || !ChangesTime || !verificationStatus) {
        return res.status(400).json({
          success: false,
          message: "ChangesDate, ChangesTime and verificationStatus are required",
        });
      }

      const allowedStatuses = ["pending", "rejected", "approved", "locked"];
      if (!allowedStatuses.includes(verificationStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification status",
        });
      }

      const now = new Date();

      /* ================= LOCK AFTER 3 ATTEMPTS ================= */
      if (org.attempts >= 3) {  // ✅ Use >= instead of ===
        const lockTill = new Date(now);
        lockTill.setMonth(lockTill.getMonth() + 2);

        const orglocked = await Orgdata.findByIdAndUpdate(org._id, {  // ✅ FIX: org._id
          status: "locked",
          lockedUntill: lockTill,
        });

        // console.log(orglocked,"This isthe profile lock")
        return res.status(403).json({
          success: false,
          message: "Profile locked for 2 months",
        });
      }

      /* ================= DATE VALIDATION ================= */
      const parseDate = (str) => {
        const [dd, mm, yyyy] = str.split("/").map(Number);
        return new Date(yyyy, mm - 1, dd, 0, 0, 0);
      };

      const editDateObj = parseDate(ChangesDate);
      const todayIST = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      todayIST.setHours(0, 0, 0, 0);

      if (editDateObj <= todayIST) {
        return res.status(400).json({
          success: false,
          message: "Edit date must be in the future",
        });
      }

      /* ================= TIME VALIDATION ================= */
      const timeToMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const currentTimeIST = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (
        editDateObj.getTime() === todayIST.getTime() &&
        timeToMinutes(ChangesTime) <= timeToMinutes(currentTimeIST)
      ) {
        return res.status(400).json({
          success: false,
          message: "Edit time must be in the future",
        });
      }

      /* ================= SAVE ================= */
      // ✅ FIX: Use org._id and user._id
      // Calculate attempts left before incrementing
      const attemptsLeft = 3 - (org.attempts || 0);

     const orgReject =  await Orgdata.findByIdAndUpdate(org._id, {
        status: verificationStatus,
        $inc: { attempts: 1 },
        editUntil: new Date(
          `${ChangesDate.split("/").reverse().join("-")}T${ChangesTime}:00`
        ),
      }, { new: true });

      await USER.findByIdAndUpdate(user._id, {
        verified: false,
      });

      await SendMessage.create({
        to: id,
        message: ["Your account verification request was Rejected"],
        typeOfmessage: 'Chat'
      });

      // Format date for display (DD/MM/YYYY)
      const formattedDate = ChangesDate;
      const formattedTime = ChangesTime;

      await mailSender(
        user.email,
        "Your Organizer Application Needs Revision - Cine Circuit",
        orgRejectedTemplate(
          user.name || user.userName || "User",
          formattedDate,
          formattedTime,
          attemptsLeft
        )
      );

      return res.status(200).json({
        success: true,
        message: "Verification rejected with edit window",
        data: orgReject
      });
    }

  } catch (error) {
    console.error("VerifyOrganizer Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// This route is present in the admin route on the line no 18
exports.GetAllorg = async(req,res)=>{
    try{
      // Get the current user ID from the auth middleware
      const currentUserId = req.USER.id;
      console.log("Fetching org data for user:", currentUserId);

      // First, check if the current user has organizer data
      const currentUser = await USER.findById(currentUserId);

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // If user has orgainezerdata, fetch it
      let organizersData = [];
      let directorExperience = [];
      let directorFresh = [];
      let producerExperience = [];
      let producerFresh = [];

      if (currentUser.orgainezerdata) {
        const orgData = await Orgdata.findById(currentUser.orgainezerdata);
        if (orgData) {
          organizersData = [orgData];

          // Fetch role-specific data if exists
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
        }
      }

      return res.status(200).json({
        success: true,
        message: "This is the Orgainezers Data",
        data: {
          organizersData,
          directorExperience,
          directorFresh,
          producerExperience,
          producerFresh,
        },
      });

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the Get All orgainezer code",
            success:false
        })
    }
}

exports.OrgDetails = async(req,res)=>{
    try{
      // Get all organizers (all statuses) for admin dashboard
      const users = await USER.find({ usertype:"Organizer" });

      if (!users || users.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No organizers found",
          data: {
            organizersData: [],
            directorExperience: [],
            directorFresh: [],
            producerExperience: [],
            producerFresh: [],
          },
        });
      }

      // Collect org data IDs from all users
      const orgDataIds = users
        .map(u => u.orgainezerdata)
        .filter(Boolean);

      const organizersData = orgDataIds.length
        ? await Orgdata.find({ _id: { $in: orgDataIds } })
        : [];

      // Collect role-specific IDs from all org data
      const directorExperienceIds = organizersData.map(o => o.DirectorExperience).filter(Boolean);
      const directorFreshIds = organizersData.map(o => o.DirectFresh).filter(Boolean);
      const producerExperienceIds = organizersData.map(o => o.ProducerExperience).filter(Boolean);
      const producerFreshIds = organizersData.map(o => o.ProducerFresher).filter(Boolean);

      // Fetch all role-specific data in parallel
      const [directorExperience, directorFresh, producerExperience, producerFresh] = await Promise.all([
        directorExperienceIds.length ? directorexperience.find({ _id: { $in: directorExperienceIds } }) : [],
        directorFreshIds.length ? directorfresher.find({ _id: { $in: directorFreshIds } }) : [],
        producerExperienceIds.length ? producerexperience.find({ _id: { $in: producerExperienceIds } }) : [],
        producerFreshIds.length ? producerfresher.find({ _id: { $in: producerFreshIds } }) : [],
      ]);

      return res.status(200).json({
        success: true,
        message: "This is the Orgainezers Data",
        data: {
          organizersData,
          directorExperience,
          directorFresh,
          producerExperience,
          producerFresh,
        },
      });

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the Get All orgainezer code",
            success:false
        })
    }
}

// This route is present in the admin route on the line no 16
exports.deleteOrgainezer = async(req,res)=>{
    try{
        const {  id } = req.body;
        if(!id){
            return res.status(400).json({
                message:"The user id is required",
                success:false
            })    
        }
        const finder = await USER.findOne({_id:id})
        if(!finder){
            return res.status(404).json({
                message:"User not found",
                success:false
            })    
        }

        const deletion = await USER.findByIdAndDelete(id)
        if(!deletion){
            return res.status(400).json({
                message:"Cannot delete this user",
                success:false
            })
        }


        return res.status(200).json({
            message:"User deleted successfully",
            success:true,
            data:deletion
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete orgainezer code",
            success:false
        })
    }
}
// This route is present in the admin route on the line no 17
exports.DeleteAllOrgainezers = async(req,res)=>{
    try{
        const {id} = req.body
        if(!id || !Array.isArray(id)){
            return res.status(400).json({
                message:"User IDs are required as an array",
                success:false
            })    
        }
        
        if(id.length < 1){
            return res.status(400).json({
                message:"You need to delete more than one user",
                success:false
            })
        }

        const deletion = await USER.deleteMany({_id: {$in: id}})
        if(deletion.deletedCount === 0){
            return res.status(400).json({
                message:"No users found to delete",
                success:false
            })
        }


        return res.status(200).json({
            message:"Users deleted successfully",
            success:true,
            deletedCount: deletion.deletedCount
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"There is an error in the delete all orgainezer at once  code",
            success:false
        })
    }
}
