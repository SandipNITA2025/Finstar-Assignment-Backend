import { env } from "../config/env.config.js";
import Todo from "../models/todo.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import pkg from "validator";

const { isEmpty } = pkg;

class TodoController {
  // GET all todos
  static async index(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const todos = await Todo.find({ userId: user._id })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      res.status(200).json(todos);
    } catch (error) {
      console.log("Failed to fetch todos:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch todos. Please try again." });
    }
  }

  // POST a new todo
  static async store(req, res) {
    try {
      const { title, completed } = req.body;
      const userId = req.cookies.token
        ? jwt.verify(req.cookies.token, env.jwtSecret).userId
        : null;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate title
      if (isEmpty(title)) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }

      const todo = new Todo({ title, completed, userId });
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      console.log("Failed to create todo:", error);
      res
        .status(400)
        .json({ message: "Failed to create todo. Please try again." });
    }
  }

  // PUT update a todo
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;

      const todo = await Todo.findByIdAndUpdate(
        id,
        { title, completed },
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json(todo);
    } catch (error) {
      console.log("Failed to update todo:", error);
      res
        .status(400)
        .json({ message: "Failed to update todo. Please try again." });
    }
  }

  // DELETE a todo
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const todo = await Todo.findByIdAndDelete(id);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.status(204).end();
    } catch (error) {
      console.log("Failed to delete todo:", error);
      res
        .status(400)
        .json({ message: "Failed to delete todo. Please try again." });
    }
  }

  // DELETE all todos
  static async destroyAll(req, res) {
    try {
      await Todo.deleteMany({});
      res.status(204).json({ message: "All data deleted successfully" }).end();
    } catch (error) {
      console.error("Failed to delete all data:", error);
      res
        .status(500)
        .json({ message: "Failed to delete all data. Please try again." });
    }
  }
}

export default TodoController;
