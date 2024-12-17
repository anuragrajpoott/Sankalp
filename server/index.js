const express = require("express");
const app = express();
const dbConnect = require("./configs/database");
require("dotenv").config();

app.use(express.json());

app.listen(process.env.PORT,()=>{
    console.log(`running at PORT ${process.env.PORT}`)
})

app.get("/",(req,res)=>{
     res.send(`<h1>running at PORT ${process.env.PORT}</h1>`)
})

dbConnect();

