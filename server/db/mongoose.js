import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log('DB connection failed:',error);
        process.exit(1);
    }
}