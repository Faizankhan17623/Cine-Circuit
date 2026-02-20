require('dotenv').config();
const date = require('date-and-time');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER = require('../../models/user');
// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 27
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false
            });
        }

        const user = await USER.findOne({ email: email.toLowerCase() })
        
        if (!user) {
            return res.status(404).json({
                message: "Email not found.",
                success: false
            });
        }

            if(user.usertype === 'Organizer'){
                return res.status(400).json({
                    message:"The User is an Orgainezer Please Use The Orgainezer Login",
                    success:false
                })
            }

        const isPasswordValid = await bcrypt.compare(password, user.confirmpass);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Ener The Correct Password",
                success: false
            });
        }

        const { userName, usertype, verified, number, _id,image } = user;
        // console.log(usertype)
        const now = new Date();
        const pattern = date.compile('DD/MM/YYYY HH:mm:ss');
        const lastLoginTime = date.format(now, pattern);

        // Restrict access for "organizer" and "administrator"
            // Allow only "viewer" role to proceed
        await USER.findByIdAndUpdate(_id, { verified: true }, { new: true });
        await USER.findByIdAndUpdate(_id, { $push: { lastlogin: lastLoginTime } } , { new: true });

        const expiry = "7d";  // string is clearer

        const jwtCreation = jwt.sign(
            {  usertype, verified, id: _id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn:expiry , algorithm: 'HS256' }
        );

        user.token = jwtCreation;
        user.password = undefined
        user.id = _id

        // console.log(jwtCreation)
        const options = {
             expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly:true,
            secure: true, 
            sameSite: 'Lax'
        };

        // res.setHeader('token',jwtCreation,options)
        
        res.cookie('token', jwtCreation, options).status(200).json({
            message: "User logged in successfully.",
            success: true,
            token: jwtCreation,
            user
        });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error in login process.",
            success: false
        });
    }
};
