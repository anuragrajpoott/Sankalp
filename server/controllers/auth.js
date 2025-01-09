const user = require("../models/user")
const otp = require("../models/otp")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const additionalDetails = require("../models/additionalDetails");
const { mailSender } = require("../utils/mailSender");
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUser = await user.findOne({ email });

        if (checkUser) {
            return res.status(401).json({
                success: false,
                message: "user already exists"
            })
        }

        var newOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false

        })

        await otp.create({ email, otp : newOtp });
   

        res.status(200).json({
            success: true,
            message: "otp sent successfully"

        })


    } catch (error) {
        res.status(404).json({
            success: false,
            message: "error while recieving otp",
            error: console.log(error)
        })

    }
}

exports.signUp = async (req, res) => {
    try {
        const {accountType, firstName, lastName, email, password , newOtp } = req.body;

        if (!firstName || !lastName || !email || !password || !accountType || !newOtp) {
            return res.status(400).json({
                success: false,
                message: "fill all signup details"
            })
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        }

        const existingOtp = await otp.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (existingOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }
        else if (newOtp !== existingOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        const newAdditionalDetails = await additionalDetails.create({
            gender: null,
            dateOfBirth: null,
            About: null,
            contactNumber: null
        })


        let hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({ firstName, lastName, email, password : hashedPassword, accountType, additonalDetails: newAdditionalDetails._id, profileImage: null });
        res.json({
            success: true,
            message: "user registered successfully",
            newUser,
            newAdditionalDetails
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            error: console.error(err),
            message: "error while registring user"
        })

    }

}

exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body
    
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: `Please Fill up All the Log In Required Fields`,
          })
        }
        const existingUser = await user.findOne({ email })

        //populate additonal details
    
        if (!existingUser) {
          return res.status(401).json({
            success: false,
            message: `User is not Registered with Us Please SignUp to Continue`,
          })
        }


    if (await bcrypt.compare(password, existingUser.password)) {
          const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id, accountType: existingUser.accountType },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            }
          )
          existingUser.token = token
          existingUser.password = undefined
          const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          }
          res.cookie("token", token, options).status(200).json({
            success: true,
            existingUser,
            token,
            message: `User Login Success`,
          })

        } else {
          return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
          })
        }


      } catch (error) {
        console.error(error)
        console.log(error)
        return res.status(500).json({
          success: false,
          message: `Login Failure Please Try Again, ${error.message}`,
        })
      }
    }

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "enter email"
            })
        }
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            res.status(0).json({
                success: false,
                message: "useer does not exist"
            })
        }
        if (await bcrypt.compare(oldPassword, user.password)) {
            newHashedPassword = await bcrypt.hash(newPassword, 10);
            await user.create({ password: newHashedPassword });
        }
        res.status(200).json({
            success: true,
            message: "password changed successfully"
        })



    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while resetting password"
        })

    }
}


exports.sendResetPasswordLink = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "enter email"
            })
        }
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            res.status(0).json({
                success: false,
                message: "useer does not exist"
            })
        }


        const token = crypto.randomBytes(20).toString("hex")

        const updatedDetails = await user.findOneAndUpdate(
          { email: email },
          { token: token,},
          { new: true }
        )
    
        const url = process.env.URL + `/forgot-password/${token}`
    
        await mailSender(
          email,
          "Password Reset Link",
          `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )


        res.status(200).json({
            success: true,
            message: "reset password mail sent successfully"
        })



    } catch (error) {
        res.status(400).json({
            success:false,
            message:"error while resetting password"
        })

    }
}


exports.resetPassword = async (req, res) => {
    try {
      const { password, confirmPassword, token } = req.body
  
      if (confirmPassword !== password) {
        return res.json({
          success: false,
          message: "Password and Confirm Password Does not Match",
        })
      }
      const userDetails = await user.findOne({ token: token })
      if (!userDetails) {
        return res.json({
          success: false,
          message: "Token is Invalid",
        })
      }
      if (!(userDetails.token.createdAt + 5*60*1000 > Date.now())) {
        return res.status(403).json({
          success: false,
          message: `Token is Expired, Please Regenerate Your Token`,
        })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.findOneAndUpdate(
        { token: token },
        { password: hashedPassword },
        { new: true }
      )
      res.json({
        success: true,
        message: `Password Reset Successful`,
      })
    } catch (error) {
      return res.json({
        error: error.message,
        success: false,
        message: `Some Error in resetting the Password`,
      })
    }
  }
  