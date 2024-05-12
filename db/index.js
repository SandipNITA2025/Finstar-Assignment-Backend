import mongoose from "mongoose";
import { env } from "../config/env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoURI);
    console.log(`Mongo server run on ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectDB;
