import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.config.js";
import router from "./routers/index.js";
import connectDB from "./db/index.js";

const app = express();

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database connection
connectDB();

// routes
app.use("/api", router);

// port listen
app.listen(env.port, () => {
  console.log("Server is running on port: " + env.port);
});
