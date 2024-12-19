const express = require("express")
const router = express.Router()
const { auth} = require("../middleware/auth")
const {
  updateAdditonalDetails,
  getAdditionalDetails,
} = require("../controllers/additinalDetails")

router.put("/updateAdditionalDetails", auth, updateAdditonalDetails)
router.get("/getAdditionalDetails", auth, getAdditionalDetails)

module.exports = router
