const User = require("../models/user")
const Profile = require("../models/profile");
const { findById } = require("../models/otp");

exports.updateProfile = async(req,res)=>{
    try {
        const {dateOfBirth,contactNumber,gender,about,}= req.body;
        const id= req.user.id;
        if(!contactNumber || !gender || !id || !dateOfBirth || !about){
            return res.status(400).json({
                success:false,
                message:"fill all entries"
            })
        }  
        const profileDetails = await Course.findByIdAndUpdate(id,{
            contactNumber:contactNumber,
            dateOfBirth:dateOfBirth,
            gender:gender,
            about:about
        },{new:true})
        res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while updating profile"
        })
    }
}
//explore how to shchedule deletion
exports.deleteAccount = async(req,res)=>{
    try {
        const id = req.User.id;
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"user not found by id"
            })
        }
        await Profile.findByIdAndDelete({_id:userDetails.additonalDetails})
        await User.findByIdAndDelete({_id:id})
        res.status(200).json({
            success:true,
            message:"profile deleted successfully",
            profileDetails
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while deleting profile"
        })
    }
}


exports.getAllUserDetails = async(req,res)=>{
    try {
        const id = req.user.id;
    const userDetails = await findById(id).populate("additionalDetails").exec();
    res.status(200).json({
        success:true,
        message:"details successfully fetched",
        userDetails
    })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while recieving profile details"
        })
    } 
    

}