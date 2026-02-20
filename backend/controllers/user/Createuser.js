    require('dotenv').config()
    const bcrypt = require('bcrypt')
    const cookie = require('cookie-parser')
    const OTP = require('../../models/otp')
    const USER = require('../../models/user')
    const {uploadDatatoCloudinary} = require('../../utils/imageUploader')
    const mailSender = require('../../utils/mailsender')
    const imageUpdatimTemplate = require('../../templates/userTemplates/imageupdationEmail')
    const otpGenerator = require('otp-generator')
    const updateUsername = require('../../templates/userTemplates/UpdateNametemplate')
    const updateNumber = require('../../templates/userTemplates/Updatenumbertemplate')
    const date = require('date-and-time')
    // const validator = require("validator");

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 14
    exports.Createuser = async(req,res)=>{
        try {
            // console.log("This is the https",http) please keep This line in the code base it is important like an extra requirement 
            const {name,password,email,usertype="Viewer",number,countrycode,otp } = req.body
            if(!name || !password || !email || !number || !countrycode || !otp  ){
                return res.status(400).json({
                    message:"The input Fields are required",
                    success:false
                })
            }

            // console.log("This is the name that is coming",name)
            const Findingemail = await USER.findOne({
                email:email
            })

            const nameFinding = await USER.findOne({userName:name})
            if(nameFinding){
                return res.status(400).json({
                    message:"The username is already been present please take another one",
                    success:false,
                    extra:`email that is using the usernam ${nameFinding.email}`
                })
            }
            if(Findingemail && Findingemail.number !== number){
                return res.status(409).json({
                    message: "The email is already taken and linked to a different number.",
                    success: false,
                    data: `email: ${email}, linked number: ${Findingemail.number}`
                });
            }


            const numberRecord = await USER.findOne({number}).populate("resetPasswordExpires")

            if(numberRecord && numberRecord.email !== email){
                return res.status(409).json({
                    message: "The number is already taken and linked to a different email.",
                    success: false,
                    data: `number: ${number}, linked email: ${numberRecord.email}`
                });
            }

            const otpCreation = await OTP.find({email}).sort({createdAt:-1});

         
if (!otpCreation || otpCreation.length === 0) {
  return res.status(400).json({
    message: "No OTP found for this email.",
    success: false
  });
}

            if (String(otp) !== String(otpCreation[0].otp)){
                return res.status(400).json({
                    message: "The OTP is not correct please try again",
                    success: false
                });
            }

            // now we will hash the password 
            const hasing =  await bcrypt.hash(password,10)
            // console.log("This is the hashed password that is been created",hasing)
            
            const now = new Date()
            const pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
            let ps = date.format(now, pattern);
            const nameChnages = name.split(' ')
            // console.log("This is the name",nameChnages) 
            const Creation = new USER({
                userName:name,
                email:email,    
                password:hasing,
                confirmpass:hasing,
                number:number,
                countrycode: countrycode,
                usertype:usertype,
                createdAt:ps,
                image:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            }) 
            
            await Creation.save()
            nameChnages.join()
            USER.id = Creation._id
            // console.log("This is the user that is been created",Creation)
            return res.status(200).json({
                message:"The data is been created please log in",
                success:true,
                data:Creation
            })
        } catch (error) {
            console.log(error)
            console.log("This is the error message",error.message)
            return res.status(500).json({
                message:"there is an error in the user creation",
                success:false
            })
        }
    }

    // tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 15
// Done
exports.CreateOtp = async(req,res)=>{
    try {
        const {email} = req.body        
        if(!email){
            return res.status(400).json({
                message:"the input Fields are required",
                success:false
            })
        }

        const Finding = await USER.findOne({email})
        if(Finding){
            return res.status(409).json({
                message:"This email is already present please log in",
                success:false,
                data:email
            })
        }

        // Cooldown check — if OTP still exists in DB it means 2 minutes haven't passed yet
        const existingOtp = await OTP.findOne({email}).sort({createdAt: -1})
        if(existingOtp){
            const secondsPassed = Math.floor((Date.now() - new Date(existingOtp.createdAt)) / 1000)
            const secondsRemaining = 120 - secondsPassed
            return res.status(429).json({
                message:`An OTP was already sent. Please wait ${secondsRemaining} second(s) before requesting a new one.`,
                success:false,
                retryAfter: secondsRemaining
            })
        }

        // now we will generate the otp
        const generate = otpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            digits:true,
            upperCaseAlphabets:false,
            specialChars:false
        })

        const saving = await OTP.create({otp:generate,email:email})
        // console.log("The otp is been saved in the database",saving)

        return res.status(200).json({
            message:`The otp is been send on the email address ${email}`,
            success:true,
            data:generate
        })

    } catch (error) {
        console.log(error)
        console.log("This is the error message",error.message)
        return res.status(500).json({
            message:"there is an error in the otp sending code",
            success:false
        })
    }
}

// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 17
// Done
exports.updateUserName = async(req,res)=>{
    try {
        const {newName} = req.body
        const user = req.USER

        if(!newName){
            return res.status(400).json({
                message:"The new name is been required",
                success:false
            })
        }
        const Finding  = await USER.findOne({userName:newName})
        const userFindgin = await USER.findOne({_id:user.id})
        if (!userFindgin) {
            return res.status(404).json({
                message: "User not found or you are not logged in ",
                success: false
            });
        }
        // console.log(userFindgin.lastUsernameUpdate)
        
        if(Finding){
            return res.status(404).json({
                message:"The old and the new username both are the same please take a different one",
                success:false
            })
        }

        const now = new Date()

        const newDate = new Date(userFindgin.lastUsernameUpdate)
        newDate.setDate(newDate.getDate()+30)

        if(userFindgin.lastUsernameUpdate &&(now-new Date(userFindgin.lastUsernameUpdate)) < 30*60*60*1000){
            return res.status(400).json({
                message:`The name can only be changed once in 30 days the next date to change it is ${newDate}`,
                success:false
            })
        }


        let pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);

        let updating = await USER.findByIdAndUpdate(user.id,{userName:newName,lastUsernameUpdate:ps},{new:true})
        // console.log(updating)
        await mailSender(user.email,"Your Username Has Been Updated - Cine Circuit",updateUsername(user.userName,newName))

        return res.status(200).json({
            message:"The username is been updated",
            success:true,
            data:updating
        })

    } catch (error) {
        console.log(error)
        console.log("This is the error message",error.message)
        return res.status(500).json({
            message:"there is an error in the update user name",
            success:false
        })
    }
}


// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 18
exports.updatePassword = async(req,res)=>{
    try {
        const userDetails = await USER.findById(req.USER.id)
        const {newPassword,oldPassword} = req.body

        if(!userDetails){
            return res.status(400).json({
                message:"The user is not logged in please log in ",
                success:false
            })
        }

        if(!newPassword||!oldPassword){
            return res.status(400).json({
                message:"The new password is been required",
                success:false
            })
        }

        if(oldPassword === newPassword){
            return res.status(400).json({
                message:"The old and new passwords both are the same",
                success:false
            })
        } 


        const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "The old passwords do not match the password is not correct",
                success: false,
            });
        }

        const now = new Date()
        const newDate = new Date(userDetails.lastPasswordUpdate)
        newDate.setDate(newDate.getDate()+30)

        if(userDetails.lastPasswordUpdate &&(now-new Date(userDetails.lastPasswordUpdate)) < 30*60*60*1000){
            return res.status(400).json({
                message:`The password can only be changed once in 30 days the next date to change it is ${newDate}`,
                success:false
            })
        }


        let pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);

        const hashing = await bcrypt.hash(newPassword,10)
        const updating = await USER.findByIdAndUpdate(req.USER.id,{password:hashing,confirmpass:hashing,lastPasswordUpdate:ps},{new:true})
        console.log("This is the updating",updating)
        return  res.status(200).json({
            message:"The password is been updated",
            success:true
        })

    } catch (error) {
        console.log(error)
        console.log("This is the error message",error.message)
        return res.status(500).json({
            message:"there is an error update password code",
            success:false
        })
    }
}

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 19
exports.UpdateImage= async(req,res)=>{
    try {

        const displayPicture = req.files.displayPicture
        // console.log(displayPicture)
        const user = req.USER
        const max_upload_size = 10
        const Image_Format = ['png','jpeg','jpg']
        
        

        if(!displayPicture || !req.files || !req.files.displayPicture){
            return res.status(400).json({
                message:"The input image IS been required",
                success:false
            })
        }

        let imageTypes = displayPicture.mimetype.split('/')[1].toLowerCase();

        if(!Image_Format.includes(imageTypes)){
            return res.status(400).json({
                message:`The image type is not valid The valid types are ${Image_Format}`,
                success:false
            })
        }
        
        if(displayPicture.size / (1024*1024) > max_upload_size){
            return res.status(400).json({
                 error: `THe image file or the video fie is too large maximum allowed is ${max_upload_size}mb`
            })
        }


        const userFindgin = await USER.findOne({_id:user.id})
        if (!userFindgin) {
            return res.status(404).json({
                message: "User not found or you are not logged in ",
                success: false
            });
        }


        
        const now = new Date()

        const newDate = new Date(userFindgin.lastImageUpdate)
        newDate.setDate(newDate.getDate()+30)

        if(userFindgin.lastImageUpdate &&(now-new Date(userFindgin.lastImageUpdate)) < 30*24*60*60*1000){
            return res.status(400).json({
                message:`The image can only be changed once in 30 days the next date to change it is ${newDate}`,
                success:false
            })
        }


        let pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);



        const image = await uploadDatatoCloudinary(displayPicture,process.env.CLOUDINARY_FOLDER_NAME,1000,1000)
        // console.log(image)
        const updatinUser = await USER.findByIdAndUpdate(req.USER.id,{image:image.secure_url,lastImageUpdate:ps},{new:true})
        const {email,userName} = updatinUser
        const AlertingUser = await mailSender(email,'Your Profile Image Has Been Updated - Cine Circuit',imageUpdatimTemplate(userName,image.secure_url))
        // console.log("This is the data of the alerting user",AlertingUser)
        // console.log("This is the updates user",updatinUser)
      return res.status(200).json({
    message: "The user image has been updated",
    success: true,
    data: updatinUser
});
    } catch (error) {
        console.log(error)
        console.log("This is the error message",error.message)
        return res.status(500).json({
            message:"there is an error update image code",
            success:false
        })
    }
}

// Done
// tHIS IS THE FUNCTION THAT WILL HELP US SO THAT THE ROUTE IS THE USE ROUTE AND IT IS PRESENTED ON LINIE NO 20
exports.updateNUmber= async(req,res)=>{
    try {
        const {newNumber,code} = req.body
        const Finding = await USER.findOne({number:newNumber})
        const user = req.USER
        if(!newNumber || !code){
            return res.status(400).json({
                message:"The new number IS been required",
                success:false
            })
        }

        if(Finding){
            return res.status(400).json({
                message:"The number is already present pleasee pick another number",
                success:false,
                data:Finding
            })
        }

        const userFindgin = await USER.findOne({_id:user.id})
        if (!userFindgin) {
            return res.status(404).json({
                message: "User not found or you are not logged in ",
                success: false
            });
        }


        
        const now = new Date()

        const newDate = new Date(userFindgin.lastNumberUpdate)
        newDate.setDate(newDate.getDate()+7)

        if(userFindgin.lastNumberUpdate &&(now-new Date(userFindgin.lastNumberUpdate)) < 7*60*60*1000){
            return res.status(400).json({
                message:`The number can only be changed once in 7 days the next date to change it is ${newDate}`,
                success:false
            })
        }


        let pattern = date.compile('ddd, YYYY/MM/DD HH:mm:ss');
        let ps = date.format(now, pattern);
 

        const UPdatingNumber = await USER.findByIdAndUpdate(req.USER.id,{number:newNumber,lastNumberUpdate:ps,countrycode:code},{new:true})
        console.log("THis is the new updated number",UPdatingNumber)
        await mailSender(user.email,"Your Phone Number Has Been Updated - Cine Circuit",updateNumber(userFindgin ? userFindgin.userName : "User",newNumber))
        return res.status(200).json({
            message:"The new number is been updated",
            success:true
        })
    } catch (error) {
        console.log(error)
        console.log("This is the error message",error.message)
        return res.status(500).json({
            message:"there is an error update number code",
            success:false
        })
    }
}

// Done
exports.CurrentLoginUser = async(req,res)=>{
    try {

        const userId = req.USER.id
        if(!userId){
            return res.status(404).json({
                message:"The user is not loged in",
                success:false
            })
        }
        const Finding = await USER.findOne({_id:userId})
        if(!Finding){
            return res.status(404).json({
                message:"The user is not been found",
                success:false
            })
        }
        console.log(Finding)

        return res.status(200).json({
            message:"okay",
            success:true,
            data:Finding
        })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            message:"error in the create user code",
            success:false
        })
    }
}
