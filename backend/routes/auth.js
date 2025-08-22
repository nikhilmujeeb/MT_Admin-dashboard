import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (process.env.ADMIN_REGISTRATION_ENABLED !== "true") {
      return res.status(403).json({ message: "Admin registration is disabled" });
    }
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ email, password, role: "admin" });
    return res.status(201).json({ message: "Admin registered", user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role },
      });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
