const express = require("express")
const router = express.Router()
const {
  logIn,
  signUp,
  sendOtp,
  changePassword,
} = require("../controllers/auth")
const { auth } = require("../middleware/auth")


router.post("/logIn", logIn)

router.post("/signUp", signUp)

router.post("/sendOtp", sendOtp)

router.post("/changePassword", auth, changePassword)

module.exports = router
