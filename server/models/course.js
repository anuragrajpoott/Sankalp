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
        ref: "user"
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "section"
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingAndReview"
    }],
    price: {
        type: Number
    },
    thumbnailImage: {
        type: string
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }
});

module.exports = mongoose.model("course", course)