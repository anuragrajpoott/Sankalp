const SubSection = require("../models/SubSection");
const Section = require("../models/Section")


exports.createSubSection = async (req,res) => {
    try {
        const {sectionId,title,description,timeDuration} = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success:false,
                message:"fill all entries"
            })
        }
        const uploadDetails = await cloudinaryUpload(video,process.env.FOLDER_NAME)
        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url

        })
        const updateSection = await Section.findByIdAndDelete(sectionId,{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true})
        //populate
        res.status(200).json({
            success:true,
            message:"subsection created successfully"
        })

     } catch (error) {
        res.status(400).json({
            success:false,
            message:"subsection creating error"
        })
    }
}

exports.updateSubSection = async(req,res)=>{
    try {
        const {title,subSectionId} = req.body;
        if(!title||!subSectionId){
            return res.status(400).json({
                success:false,
                message:"fill all entries"
            })
        }  
        const newSection = await Course.findByIdAndUpdate(subSectionId,{title},{new:true})
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


exports.deleteSubSection = async(req,res)=>{
    try {
        const {subSectionId} = req.params;
        await Section.findByIdAndDelete(subSectionId);
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