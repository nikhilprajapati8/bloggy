import express  from "express";
const app = express();
import ConnectToDb from "./db/connectToDb.js";
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";
import blogRoute from "./routes/blogRoute.js"
const Port = process.env.PORT || 8080
import {v2 as cloudinary} from 'cloudinary';
dotenv.config();

          

ConnectToDb();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

 app.get("/",(req,res)=>{
  res.send("The server is running")
 })

app.use("/users",userRoute)
app.use("/blogs",blogRoute)

app.listen(Port,(req,res)=>{
    console.log(`app listening on port ${Port}`)
})