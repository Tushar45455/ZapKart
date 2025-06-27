import mongoose from "mongoose";
import dotenv from 'dotenv'
import morgan from 'morgan';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('please provide MONGO_URI in .env file');
  }
  try {
    await mongoose.connect(uri); // Only pass the string
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Mongodb connect error', error);
    process.exit(1);
  }
};

export default connectDB;

