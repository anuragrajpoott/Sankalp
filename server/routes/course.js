const express = require("express")
const router = express.Router()
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/course")
const { auth, isInstructor} = require("../middleware/auth")

// const {
//   updateCourseProgress,
//   getProgressPercentage,
// } = require("../controllers/courseProgress")

router.post("/createCourse", auth, isInstructor, createCourse)

router.get("/showAllCourses", showAllCourses)

router.post("/getCourseDetails", getCourseDetails)

module.exports = router
