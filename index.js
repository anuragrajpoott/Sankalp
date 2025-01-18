const express = require("express");
const dbConnect = require("./server/configs/database");
const fileUpload = require("express-fileupload");
const {cdConnect} = require("./server/utils/fileUploader")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./server/routes/auth");
const additionalDetailsRoutes = require("./server/routes/additionalDetails");
const courseRoutes = require("./server/routes/course");
const categoryRoutes = require("./server/routes/category");
const sectionRoutes = require("./server/routes/section");
const subSectionRoutes = require("./server/routes/subSection");
const ratingandReviewRoutes = require("./server/routes/ratingAndReview");
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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/additionalDetails", additionalDetailsRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subSection", subSectionRoutes);
app.use("/api/v1/ratingAndReview", ratingandReviewRoutes);

app.get("/",(req,res)=>{
    res.send(`<h1>running at PORT ${process.env.PORT}</h1>`)
})



