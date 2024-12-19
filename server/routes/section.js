const express = require("express")
const router = express.Router()
const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/section")
  const { auth, isInstructor} = require("../middlewares/auth")

  router.post("/createSection", auth, isInstructor, createSection)
  
  router.post("/updateSection", auth, isInstructor, updateSection)
  
  router.post("/deleteSection", auth, isInstructor, deleteSection)

  module.exports = router