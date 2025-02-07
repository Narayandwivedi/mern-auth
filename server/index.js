const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const {connectToDb} = require("./config/mongodb")

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

// load .env variable ---> this line will load .env variable
dotenv.config();

const app = express();
const port = process.env.port


// middlewares
app.use(cookieParser())
app.use(express.json());
app.use(cors({credentials:true}))
app.use(express.urlencoded({extended:false}))

// routes

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);

// app

app.listen(port,()=>{
    console.log(`port is activated at port no: ${port}`);
    
})

// db

connectToDb()