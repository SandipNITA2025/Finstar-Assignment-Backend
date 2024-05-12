import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "validator";
import { env } from "../config/env.config.js";

const { isEmail, isLength } = pkg;

class AuthController {
  // POST a new user
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate email
      if (!isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      // Validate password length
      if (!isLength(password, { min: 6 })) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Login a user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate email
      if (!isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user._id, userName: user.name },
        env.jwtSecret,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  }
}

export default AuthController;
