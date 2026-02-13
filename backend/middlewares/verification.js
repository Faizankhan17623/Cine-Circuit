require('dotenv').config()
const jwt = require('jsonwebtoken');
const USER = require('../models/user');
const {Orgdata} = require('../models/Org_data')

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "")  ;
            // console.log("This is the token",token)
            // || req.USER.token

        if (!token) {
            return res.status(401).json({ success: false, message: "Token Missing" });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            // console.log("Decoded Token:", decode);

            if (!decode) {
                return res.status(400).json({
                    message: "Invalid token format",
                    success: false
                });
            }

            // ✅ Attach decoded data to req.user
            req.USER = { id:decode.id } 

            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

    } catch (error) {
        console.log(error)
        console.log("Error in auth middleware:", error.message);
        return res.status(500).json({
            message: "There is an error in the auth middleware",
            success: false
        });
    }
};


exports.IsAdmin = async (req, res, next) => {
    try {
        const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log("Finding in IsAdmin:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (Finding.usertype === 'Administrator') {
            // console.log('Allowed');
            next();
        } else {
            return res.status(403).json({
                message: "You are not allowed to access this route",
                success: false
            });
        }
    } catch (error) {
        console.log("Error in IsAdmin middleware:", error.message);
        return res.status(500).json({
            message: "There is an error in the IsAdmin middleware",
            success: false
        });
    }
};

exports.IsOrganizer = async (req, res, next) => {
    try {
        const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log(Finding)
        // console.log("Finding in IsOrganizer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (Finding.usertype == 'Organizer') {
            // console.log('Org Allowed');
            next();
        } else {
            return res.status(403).json({
                message: "You are not allowed to access this route",
                success: false
            });
        }
    } catch (error) {
        console.log("Error in IsOrganizer middleware:", error.message);
        return res.status(500).json({
            message: "There is an error in the IsOrganizer middleware",
            success: false
        });
    }
};


exports.IsUSER = async (req, res, next) => {
    try {
        const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log("Finding in IsUSER:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (Finding.usertype === 'Viewer') {
            // console.log('Allowed');
            next();
        } else {
            return res.status(403).json({
                message: "You are not allowed to access this route ",
                success: false
            });
        }
    } catch (error) {
        console.log("Error in IsAdmin middleware:", error.message);
        return res.status(500).json({
            message: "There is an error in the IsAdmin middleware",
            success: false
        });
    }
};

exports.IsTheatrer = async (req, res, next) => {
    try {
        const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log("Finding in IsTheatrer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (Finding.usertype === 'Theatrer') {
            // console.log('Allowed');
            next();
        } else {
            return res.status(403).json({
                message: "You are not allowed to access this route",
                success: false
            });
        }
    } catch (error) {
        console.log("Error in Theatrer middleware:", error.message);
        return res.status(500).json({
            message: "There is an error in the Theatrer middleware",
            success: false
        });
    }
};

exports.DF = async (req,res,next)=>{
    try {
           const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log(Finding)
        // console.log("Finding in IsOrganizer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }


        const {orgainezerdata} = Finding

        if (!orgainezerdata) {
            return res.status(400).json({
                message: "Organizer data not linked with this user.",
                    success: false,
            });
        }

      const roleInfo = await Orgdata.findById(orgainezerdata);
      console.log(roleInfo)
    if (!roleInfo) {
      return res.status(400).json({
        message: "The user has not filled the Organizer form.",
        success: false,
      });
    }

    if (roleInfo. Role ===  'Director' && roleInfo.ExperienceLevel ===  'Fresher') {
      return next();
    }

    return res.status(403).json({
      message: "Access denied: Only Directors with Fresher experience can access this route.",
      success: false,
    });

    } catch (error) {
        console.log(error)
         console.log("Error in Director Fresher middleware:", error.message);
        return res.status(500).json({
             message: "Internal server error in DirectorFresher middleware.",
            success: false
        });
    }
}

exports.DE = async (req,res,next)=>{
    try {
           const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log(Finding)
        // console.log("Finding in IsOrganizer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }


        const {orgainezerdata} = Finding

        if (!orgainezerdata) {
            return res.status(400).json({
                message: "Organizer data not linked with this user.",
                    success: false,
            });
        }

      const roleInfo = await Orgdata.findById(orgainezerdata);
    if (!roleInfo) {
      return res.status(400).json({
        message: "The user has not filled the Organizer form.",
        success: false,
      });
    }

    if (roleInfo.Role === "Director" && roleInfo.ExperienceLevel === "Experienced") {
      return next();
    }

    return res.status(403).json({
      message: "Access denied: Only Directors with Experienced experience can access this route.",
      success: false,
    });

    } catch (error) {
        console.log(error)
         console.log("Error in Director Experienced middleware:", error.message);
        return res.status(500).json({
             message: "Internal server error in DirectorExperienced middleware.",
            success: false
        });
    }
}

exports.PE = async (req,res,next)=>{
    try {
           const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log(Finding)
        // console.log("Finding in IsOrganizer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }


        const {orgainezerdata} = Finding

        if (!orgainezerdata) {
            return res.status(400).json({
                message: "Organizer data not linked with this user.",
                    success: false,
            });
        }

      const roleInfo = await Orgdata.findById(orgainezerdata);
    if (!roleInfo) {
      return res.status(400).json({
        message: "The user has not filled the Organizer form.",
        success: false,
      });
    }

    if (roleInfo.Role === "Producer" && roleInfo.ExperienceLevel === "Experienced") {
      return next();
    }

    return res.status(403).json({
      message: "Access denied: Only Producer with Experienced experience can access this route.",
      success: false,
    });

    } catch (error) {
        console.log(error)
         console.log("Error in Producer Experienced middleware:", error.message);
        return res.status(500).json({
             message: "Internal server error in ProducerExperienced middleware.",
            success: false
        });
    }
}

exports.PF = async (req,res,next)=>{
    try {
           const Finding = await USER.findOne({ _id: req.USER.id });
        // console.log(Finding)
        // console.log("Finding in IsOrganizer:", Finding);
        if (!Finding) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }


        const {orgainezerdata} = Finding

        if (!orgainezerdata) {
            return res.status(400).json({
                message: "Organizer data not linked with this user.",
                    success: false,
            });
        }

      const roleInfo = await Orgdata.findById(orgainezerdata);
    if (!roleInfo) {
      return res.status(400).json({
        message: "The user has not filled the Organizer form.",
        success: false,
      });
    }

    if (roleInfo.Role === "Producer" && roleInfo.ExperienceLevel === "Fresher") {
      return next();
    }

    return res.status(403).json({
      message: "Access denied: Only Producer with Fresher experience can access this route.",
      success: false,
    });

    } catch (error) {
        console.log(error)
         console.log("Error in Producer Fresher middleware:", error.message);
        return res.status(500).json({
             message: "Internal server error in ProducerFresher middleware.",
            success: false
        });
    }
}