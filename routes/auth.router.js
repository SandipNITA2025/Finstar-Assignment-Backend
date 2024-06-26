// routes/todo.routes.js
import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
