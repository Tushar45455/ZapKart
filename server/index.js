import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet, { crossOriginResourcePolicy } from 'helmet';
import connectDB from './config/connectDB.js';
import { connect } from 'mongoose';
import userRouter from './route/user.route.js';

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = 8080 || process.env.PORT
app.get("/", (requset, responce)=>{
    //server to client
    responce.json({
        message : "Server is running " + PORT
    })

})

app.use('/api/user', userRouter);

connectDB();
app.listen(PORT, () => {
    console.log("Server is running", PORT);
});