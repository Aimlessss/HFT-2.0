import mongoose from "mongoose";
import logger from "../asserts/Log";

async function connectDB() : Promise<mongoose.Connection> {
  mongoose.connect('mongodb://localhost:27017/hft_db').then(() => logger.log).catch(err => logger.log(err));
  return Promise.resolve(mongoose.connection);
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
  time: String
})

export const UserToken = mongoose.model("UserToken", userTokenSchema);

export const AddOrder = mongoose.model("AddOrder", addOrderSchema);

export default connectDB;