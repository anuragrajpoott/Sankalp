const user = require("../models/user")
const category = require("../models/category")
const course = require("../models/course")
const fileUpload = require("../utils/fileUploader")


exports.createCourse = async (req,res) => {
    try {
        const {courseName,courseDescription,whatWillYouLearn,price,tag}=req.body;
        const thumbnailImage = req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !tag || !thumbnailImage){
            return res.status(400).json({
                success:false,
                message:"fill all course details"
            })

        }
        const userId = req.user.id;
        const InstructorDetails = await user.findById({userId});
        if(!userId){
                return res.status(400).json({
                    success:false,
                    message:"user not found while creating course"
                })
                    } 
        const categoryDetails = await User.findById(category);
        if(!categoryDetails){
              return res.status(400).json({
                            success:false,
                            message:"category not found in course content"
                        })
                    }

                    const newthumbnailImage = await fileUpload(thumbnailImage,process.env.FOLDER_NAME)

                    const newCourse = await course.create({
                        courseName,
                        courseDescription,
                        instructor:InstructorDetails._id,
                        whatWillYouLearn,
                        price,
                        category:categoryDetails._id,
                        thumbnailImage:newthumbnailImage.secure_url
                    })

                    await user.findByIdAndUpdate({id:InstructorDetails._id},{
                        $push:{
                            course:newCourse._id
                        }
                    },{new:true})

                    await user.findByIdAndUpdate({id:categoryDetails._id},{
                      $push:{
                        category:newCourse._id
                      }
                    },{new:true})

                    res.status(200).json({
                        success:true,
                        message:"course created successfully"
                    })




  } catch (error) {
    res.status(400).json({
        success:false,
        message:"error while creating courses",
    })
    }
}


exports.showAllCourses = async (req,res) => {
    try {
        const allCourses = await course.find({});
        res.status(200).json({
            success:true,
            message:"showing all courses",
            allCourses
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while showing courses"
        })
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      if (courseDetails.status === "Draft") {
        return res.status(403).json({
          success: false,
          message: `Accessing a draft course is forbidden`,
        });
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:"error while showing course deails",
        message: error.message,
      })
    }
  }