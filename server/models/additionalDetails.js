const mongoose = require("mongoose");

const additonalDetails = new mongoose.Schema({
    gender:{
        type : String, 
    },
    dateOfBirth:{
        type:String,
    },
    contactNo:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
});

module.exports = mongoose.model("additionalDetails",additionalDetails)