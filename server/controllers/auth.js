const user = require("../models/user")
const otp = require("../models/otp")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const additionalDetails = require("../models/additionalDetails");
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

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false

        })

        const otpPayload = { email, otp };

        await otp.create(otpPayload);

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
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
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

        const newOtp = await otp.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (newOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }
        else if (newOtp != otp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        try {
           let hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "error while hashing password"
            })

        }

        const newAdditionalDetails = await additionalDetails.create({
            gender: null,
            dateOfBirth: null,
            About: null,
            contactNumber: null
        })
        const newUser = await user.create({ firstName, lastName, email, contactNumber, password: hashedPassword, accountType, additonalDetails: newAdditionalDetails._id, image: null });
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status().json({
                success: false,
                message: "fill all login details"
            })
            const existingUser = await user.findOne({ email });
            if (!existingUser) {
                res.status(0).json({
                    success: false,
                    message: "user not registered"
                })

                const payload = {
                    email: user.email,
                    id: user._id,
                    role: user.accountType
                }
                if (await bcrypt.compare(password, user.password)) {
                    let token = jwt.sign(payload, process.env.JWT, {
                        expiresIn: "2h"
                    })

                    user.token = token;
                    user.password = undefined;

                    const options = {
                        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }

                    user.cookie("token", token, options).status(200).json({
                        success: true,
                        token, user,
                        message: "logged in succesfully"
                    })

                }
                else {
                    res.status(0).json({
                        status: false,
                        message: "error due to wrong password"
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error while loging in"
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