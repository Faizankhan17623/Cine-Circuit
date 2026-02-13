const cloudinary = require('cloudinary').v2
exports.uploadDatatoCloudinary  = async(file,folder,height,quality)=>{
    const options = {folder, resource_type: "auto",}
    if(height){
        options.height = height
    }
    if(quality){
        options.quality = quality
    }
    // options.resource_type = "auto"
    // options.fetch_format= 'auto',
    // options.quality = 'auto'

    const uploadPath = file.tempFilePath || file.path || file.filepath
    // console.log("Theseare allthe options",options)
    return await cloudinary.uploader.upload(uploadPath,options)
}