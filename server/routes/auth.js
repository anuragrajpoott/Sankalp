const express = require("express")
const router = express.Router()
const {
  logIn,
  signUp,
  sendOtp,
  changePassword,
  sendResetPasswordLink,
  resetPassword,
  contactUs,
} = require("../controllers/auth")
const { auth } = require("../middlewares/auth")


router.post("/log-in", logIn)

router.post("/sign-up", signUp)

router.post("/send-otp", sendOtp)

router.post("/forgot-password/token",sendResetPasswordLink)

router.post("/reset-password",resetPassword)

router.post("/contact",contactUs)

module.exports = router
