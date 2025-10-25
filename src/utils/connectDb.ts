import mongoose from "mongoose";
import logger from "../asserts/Log";

async function connectDB(): Promise<mongoose.Connection> {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hft_db", {
      serverSelectionTimeoutMS: 5000, // Optional, shorter fail time
    });

    logger.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    logger.log("❌ MongoDB connection error: " + err);
    throw err;
  }
}

const userTokenSchema = new mongoose.Schema({
  access_token: String,
  createdAt: { type: Date, default: Date.now },
});

const addOrderSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  sl: Number,
  type: String,
  time: String,
});

export const UserToken = mongoose.model("UserToken", userTokenSchema);
export const AddOrder = mongoose.model("AddOrder", addOrderSchema);

export default connectDB;
