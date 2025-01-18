const express = require("express")
const router = express.Router()
const { auth} = require("../middlewares/auth")
const {
  ChangeProfileImage,
  updateAdditionalDetails,
  changePassword,
  deleteAccount
} = require("../controllers/additionalDetails")

router.put("/changeProfileImage",auth,ChangeProfileImage)
router.put("/updateAdditionalDetails", auth, updateAdditionalDetails)
router.post("/change-password", auth, changePassword)
router.delete("/deleteAccount",auth,deleteAccount)


module.exports = router
