const USER = require('../../models/user')
const TheatreCreation = require('../../models/TheatrerRequest')
// This is the function that is present in the admin route on line no 73            
// This is the route that will geet all the verified user details
exports.GetAllUsersDetailsVerified = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Viewer",verified:true})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
// This is the function that is present in the admin route on line no 74            
// THis is the route that will get all the unverified user details
exports.GetAllUsersDetailsVerifiedfalse = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Viewer"})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This is the function that is present in the admin route on line no 75
// This is the route that will get all the verified orgainezer details
exports.GetAllOrganizerDetailsVerified = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Organizer",verified:true})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


// This is the route that will get all the unverified orgainezer details
// This is the function that is present in the admin route on line no 76
exports.GetAllOrganizerDetailsVerifiedfalse = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Organizer"})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}




// This vis the route that will get all the verified theatrere details
// This is the function that is present in the admin route on line no 77
exports.GetAllTheatrerDetailsVerified = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Theatrer",verified:true})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
// This is the function that is present in the admin route on line no 78
// This is the route that will get all the unverified theatrere details
exports.GetAllTheatrerDetailsVerifiedfalse = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Theatrer"})
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


// This is the function that is present in the admin route on line no 79
exports.OrgainesersVerifylength = async (req, res) => {
    try {
        const Finding = await USER.find({usertype:"Organizer",verified:false})
        console.log(Finding.length);
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding.length ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This is the function that is present in the admin route on line no 80
exports.Theatrelength = async (req, res) => {
    try {
        const Finding = await TheatreCreation.find({})
        console.log(Finding.length);
        if(!Finding || Finding.length === 0) return res.status(404).json({ message: "No users found" });
        return res.status(200).json({ message: "Users found", data: Finding.length ,success:true});
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
