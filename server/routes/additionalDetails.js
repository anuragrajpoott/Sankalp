const express = require("express")
const router = express.Router()
const { auth} = require("../middlewares/auth")
const {
  updateAdditionalDetails,
  getAdditionalDetails,
} = require("../controllers/additionalDetails")

router.put("/updateAdditionalDetails", auth, updateAdditionalDetails)
router.get("/getAdditionalDetails", auth, getAdditionalDetails)

module.exports = router
