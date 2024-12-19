
const express = require("express")
const router = express.Router()
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/subSection")
  const { auth, isInstructor} = require("../middleware/auth")

  router.post("/updateSubSection", auth, isInstructor, updateSubSection)
 
  router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

  router.post("/createSubSection", auth, isInstructor, createSubSection)

  module.exports = router