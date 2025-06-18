import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('please provide MONGO_URI in .env file');
}

async function connectDB() {
    try {
        await mongoose.connect(process.env)
        console.log("connect DB")
    }  catch(error){
        console.log("Mongodb connect error",error)
        process.exit(1);
    }
    }

    export default connectDB;