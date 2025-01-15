const express = require("express")
const router = express.Router()
const {
  logIn,
  signUp,
  sendOtp,
  changePassword,
  sendResetPasswordLink,
  resetPassword,
} = require("../controllers/auth")
const { auth } = require("../middlewares/auth")


router.post("/log-in", logIn)

router.post("/sign-up", signUp)

router.post("/send-otp", sendOtp)

router.post("/change-password", auth, changePassword)

router.post("/forgot-password/token",sendResetPasswordLink)

router.post("/reset-password",resetPassword)

module.exports = router
