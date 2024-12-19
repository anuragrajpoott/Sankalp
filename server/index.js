const express = require("express");
const app = express();
const dbConnect = require("./configs/database");
const {cdConnect} = require("./utils/fileUploader")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

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

// app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

