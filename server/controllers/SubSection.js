const subSection = require("../models/subSection");
const section = require("../models/section")


exports.createSubSection = async (req,res) => {
    try {
        const {sectionId,title,description,timeDuration} = req.body;
        const video = req.files.videoFile;
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success:false,
                message:"fill all subSection entries"
            })
        }
        const uploadVideo = await fileUpload(video,process.env.FOLDER_NAME)
        const subSectionDetails = await subSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:uploadVideo.secure_url

        })
        const updateSection = await section.findByIdAndDelete(sectionId,{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true})

        res.status(200).json({
            success:true,
            message:"subsection created successfully",
            updateSection,
            subSectionDetails
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
        const updatedSubSection = await Course.findByIdAndUpdate(subSectionId,{
            title
        },{new:true})
        res.status(200).json({
            success:true,
            message:"section updated successfully",
            updatedSubSection
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
        await section.findByIdAndDelete(subSectionId);
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