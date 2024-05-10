// routes/index.js
import express from "express";
import todoRoutes from "./todo.router.js";
import authRoutes from "./auth.router.js";

const router = express.Router();

router.use("/todos", todoRoutes);
router.use("/auth", authRoutes);

export default router;
