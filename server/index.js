const express = require("express");
const dbConnect = require("./configs/database");
const fileUpload = require("express-fileupload");
const {cdConnect} = require("./utils/fileUploader")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const additionalDetailsRoutes = require("./routes/");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/user");
const sectionRoutes = require("./routes/profile");
const subSectionRoutes = require("./routes/Course");
const ratingandReviewRoutes = require("./routes/Course");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

dbConnect();
cdConnect();

app.listen(process.env.PORT,()=>{
    console.log(`running at PORT ${process.env.PORT}`)
})

app.get("/",(req,res)=>{
    res.send(`<h1>running at PORT ${process.env.PORT}</h1>`)
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/addtionaldetails", additionalDetailsRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subSection", subSectionRoutes);
app.use("/api/v1/ratingAndReview", ratingandReviewRoutes);


