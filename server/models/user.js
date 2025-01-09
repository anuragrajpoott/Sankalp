const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        trim: true,
        
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    profileImage:{
        type:String,
    }, 
    additonalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"additionalDetails"
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    }],
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgress"
    }],
    otp:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"otp"
    },
    token: {
        type: String,
        createdAt: Date.now()
    },
});

module.exports = mongoose.model("user",user)