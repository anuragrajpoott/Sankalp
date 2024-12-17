const mongoose = require("mongoose");

const course = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number
    },
    thumbnail: {
        type: string
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});

module.exports = mongoose.model("course", course)