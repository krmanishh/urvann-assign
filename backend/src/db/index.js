import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const MONGO_URI = `${process.env.MONGODB_URL}/${DB_NAME}`;

    console.log("🔌 Trying to connect to:", MONGO_URI); // Debug log


    const connectionInstance = await mongoose.connect(MONGO_URI);

    console.log(`MONGODB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
