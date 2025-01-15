const mongoose = require("mongoose");


const token = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 * 1000
    }
});


module.exports = mongoose.model("token", token)