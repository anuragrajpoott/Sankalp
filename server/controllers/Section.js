const Section = require("../models/Section");
const Course = require("../models/Course")

exports.createSection = async (req,res) => {
   try {
    const {sectionName,sectionDescription,courseId} = req.body;
    if(!sectionName||!sectionDescription){
        return res.status(400).json({
            success:false,
            message:"fill all entries"
        })
    }
    const newSection = await Section.create({sectionName})
    const updatedCourseDetails = await Course.findByIdAndUpdate({courseId},{
        $push:{
            courseContent:newSection._id
        }
    },{new:true})

    //populate something...

    res.status(200).json({
        success:true,
        message:"section created successfully",
        updatedCourseDetails
    })
   } catch (error) {
    res.status(400).json({
        success:false,
        message:"error while creating Section"
    })
    
   }
}


exports.updateSection = async(req,res)=>{
    try {
        const {sectionName,sectionId} = req.body;
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"fill all entries"
            })
        }  
        const newSection = await Course.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        res.status(200).json({
            success:true,
            message:"section updated successfully",
            newSection
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while updating Section"
        })
    }
}


exports.deleteSection = async(req,res)=>{
    try {
        const {sectionId} = req.params;
        await Section.findByIdAndDelete(sectionId);
        res.status(200).json({
            success:true,
            message:"section deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while deleting Section"
        })
    }
}