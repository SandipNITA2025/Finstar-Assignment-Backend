// routes/todo.routes.js
import express from "express";
import TodoController from "../controllers/todo.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// middleware:
router.use(authMiddleware);

router.get("/get/:userId", TodoController.index);
router.post("/add", TodoController.store);
router.put("/update/:id", TodoController.update);
router.delete("/delete/:id", TodoController.destroy);
router.delete('/delete-all', TodoController.destroyAll);

export default router;
