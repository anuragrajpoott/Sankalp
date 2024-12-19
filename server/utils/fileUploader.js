const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cdConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key:process.env.CLOUDINARY_KEY,
            api_secret:process.env.CLOUDINARY_SECRET
        })
    } catch (error) {
        console.log(error);
        
    }

}

exports.fileUpload = async (file,folder,quality) => {
    const options = {folder};
    
    if(quality){
        options.quality = quality
     }
     
    options.resourse_type = "auto";
     return await cloudinary.uploader.upload(file.tempFilePath,options);

}




