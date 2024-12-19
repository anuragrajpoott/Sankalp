const ratingAndReview = require("../models/ratingAndReview")
const course = require("../models/course")
const mongoose = require("mongoose")

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, courseId } = req.body

    // Check if the user is enrolled in the course

    const courseDetails = await course.findOne({
      _id: courseId,
      studentsEnroled: { $elemMatch: { $eq: userId } },
    })

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      })
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await ratingAndReview.findOne({
      user: userId,
      course: courseId,
    })

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user",
      })
    }

    // Create a new rating and review
    const newRatingAndReview = await ratingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    })

    // Add the rating and review to the course
    await course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: newRatingAndReview,
      },
    })
    await courseDetails.save()

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      newRatingAndReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating rating",
      error: error.message,
    })
  }
}

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId

    const averageRating = await ratingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId({courseId})
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { 
            $avg: "rating"
           },
        },
      },
    ])

    if (averageRating.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: averageRating[0].averageRating,
      })
    }
    return res.status(200).json({ success: true, averageRating: 0 })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the average rating for the course",
      error: error.message,
    })
  }
}


exports.getAllRatingAndReview = async (req, res) => {
  try {
    const allRatingAndReview = await ratingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec()

    res.status(200).json({
      success: true,
      data: allRatingAndReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all the rating and review for the course",
      error: error.message,
    })
  }
}
