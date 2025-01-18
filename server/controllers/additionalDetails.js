const user = require("../models/user")
const additionalDetails = require("../models/additionalDetails");
const {fileUpload} = require("../utils/fileUploader")
const {passwordUpdated} = require("../mailTemplates/passwordUpdate")
const bcrypt = require("bcrypt")
const {mailSender} = require("../utils/mailSender")

exports.ChangeProfileImage = async (req,res) => {
    try {
        const profileImage = req.files.profileImage
        const userId = req.user.id
        const image = await fileUpload(
          profileImage,
          process.env.FOLDER_NAME,
          1000,
          1000
        )
     
      const updatedProfile = await user.findByIdAndUpdate(userId,{
              profileImage:image.secure_url
      },{new:true})
     
      res.send({
          success: true,
          message: `Image Updated successfully`,
          updatedProfile
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}

exports.updateAdditionalDetails = async(req,res)=>{
    try {
        const {dateOfBirth,countryCode,contactNumber,gender,about}= req.body;
        
        const userId = req.user.id

        const userDetails = await user.findById(userId)

        const additionalDetailsId = userDetails.additionalDetails

        const newAdditionalDetails = await additionalDetails.findByIdAndUpdate(additionalDetailsId,
        {
         dateOfBirth : dateOfBirth,
         contactNumber : `${countryCode} ${contactNumber}`,
         gender:gender,
         about:about
        },
        {new:true})

        if(!countryCode || !contactNumber || !gender || !dateOfBirth || !about){
            return res.status(400).json({
                success:false,
                message:"fill all additonal entries"
            })
        }  
        
        res.status(200).json({
            success:true,
            message:"additonal details updated successfully",
            newAdditionalDetails
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            success:false,
            message:`error while updating additional details...${error}`
        })
    }
}


exports.changePassword = async (req, res) => {
    try {
       
        const existingUser = await user.findById(req.user.id)

        const { oldPassword, newPassword } = req.body
    
      
        if(await bcrypt.compare(
            oldPassword,
            existingUser.password
          )) {
            return res
            .status(401)
            .json({ success: false, message: "The password is incorrect" })
          }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const newUserDetails = await user.findByIdAndUpdate(
          req.user.id,
          { password: hashedPassword },
          { new: true }
        )
    
        try {
          const mailResponse = await mailSender(
            existingUser.email,
            "Password for your account has been updated",
            passwordUpdated(
              existingUser.email,
              `Password updated successfully for ${existingUser.firstName} ${existingUser.lastName}`
            )
          )
          console.log("Email sent successfully:", mailResponse)
        } catch (error) {
          console.error("Error occurred while sending email:", error)
          return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
          })
        }
    
        return res
          .status(200)
          .json({ success: true,newUserDetails, message: "Password updated successfully" })
      } catch (error) {
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while updating password",
          error: error.message,
        })
      }
}

exports.deleteAccount = async(req,res)=>{
    try {
        const id = req.user.id;
        const userDetails = await user.findById({_id:id})
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"user not found by id"
            })
        }
        await additionalDetails.findByIdAndDelete({_id:userDetails.additionalDetails})
        await user.findByIdAndDelete({_id:id})
        res.status(200).json({
            success:true,
            message:"profile deleted successfully",
        })
    } catch (error) {
      console.log(error)
        res.status(400).json({
            success:false,
            message:"error while deleting profile"
        })
    }
}

//explore how to shchedule deletion