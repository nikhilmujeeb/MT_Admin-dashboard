import express from "express";
import Agent from "../models/Agent.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const toPublicAgent = (a) => ({
  _id: a._id,
  name: a.name,
  email: a.email,
  mobile: a.mobile,
  assignedList: a.assignedList,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

router.post("/", protect, requireAdmin, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const exists = await Agent.findOne({ email });
    if (exists) return res.status(400).json({ message: "Agent already exists" });

    const agent = await Agent.create({ name, email, mobile, password });
    return res.status(201).json(toPublicAgent(agent));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", protect, requireAdmin, async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: 1 });
    return res.json(agents.map(toPublicAgent));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    return res.json(toPublicAgent(agent));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    if (name !== undefined) agent.name = name;
    if (email !== undefined) agent.email = email;
    if (mobile !== undefined) agent.mobile = mobile;
    if (password) agent.password = password; 

    await agent.save();
    return res.json(toPublicAgent(agent));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    return res.json({ message: "Agent deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/:id/clear", protect, requireAdmin, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    agent.assignedList = [];
    await agent.save();
    return res.json({ message: "Assigned list cleared" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
