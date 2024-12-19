const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/section")
  const { auth, isInstructor} = require("../middleware/auth")

  router.post("/createSection", auth, isInstructor, createSection)
  
  router.post("/updateSection", auth, isInstructor, updateSection)
  
  router.post("/deleteSection", auth, isInstructor, deleteSection)

  module.exports = router