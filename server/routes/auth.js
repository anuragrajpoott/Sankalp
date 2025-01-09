const express = require("express")
const router = express.Router()
const {
  logIn,
  signUp,
  sendOtp,
  changePassword,
} = require("../controllers/auth")
const { auth } = require("../middlewares/auth")


router.post("/log-in", logIn)

router.post("/sign-up", signUp)

router.post("/send-otp", sendOtp)

router.post("/change-password", auth, changePassword)

module.exports = router
