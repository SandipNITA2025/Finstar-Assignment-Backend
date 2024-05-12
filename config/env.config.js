import dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};

export const env = Object.freeze(_config);
