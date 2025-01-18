const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        const token = req.cookies.token ||
        req.body.token ||
        req.header("Authorization").replace("Bearer ", "");


        if (!token) {
            res.status(401).json({
                success: false,
                message: "token not found"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "invalid token"
            })

        }
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error while auth"
        })


    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            res.status().json({
                success: false,
                message: "you are not student"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status().json({
            success: false,
            message: "error while auth student"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            res.status().json({
                success: false,
                message: "you are not admin"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status().json({
            success: false,
            message: "error while auth admin"
        })
    }
}

exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            res.status().json({
                success: false,
                message: "you are not instructor"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status().json({
            success: false,
            message: "error while auth admin"
        })
    }
}