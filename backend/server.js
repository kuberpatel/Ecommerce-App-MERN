import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';


// App Config
const app =  express()
const port = process.env.PORT || 3000
connectDB();
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('server running on PORT :'+ port))