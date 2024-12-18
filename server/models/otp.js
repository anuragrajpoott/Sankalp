const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otp = new mongoose.Schema({
    email: {
        type: String
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 * 1000
    }
});

// async function sendVerificationEmail(email, otp) {
//     try {
//         const mailResponce = await mailSender(email, "verification email form sankalp", otp)
//     } catch (error) {
//         console.log(error)

//     }
// }

otp.pre("save", async function (next) {
    // await sendVerificationEmail(this.email, this.otp);
    try {
        // const mailResponce = 
        await mailSender(email, "verification email form sankalp", otp)
    } catch (error) {
        console.log(error)

    }
    next();
})

module.exports = mongoose.model("otp", otp)