import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import Agent from "../models/Agent.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const allowedMimes = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!allowedMimes.has(file.mimetype)) {
    return cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post("/", protect, requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const clearExisting = String(req.query.clearExisting || "false").toLowerCase() === "true";
  const filePath = req.file.path;

  const cleanupAndRespond = (status, body) => {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch {}
    return res.status(status).json(body);
  };

  try {
    let items = [];

    const handleItems = async (records) => {
      if (!records.length) return cleanupAndRespond(400, { message: "File contains no rows" });

      const first = records[0];
      const needed = ["FirstName", "Phone", "Notes"];
      const missing = needed.filter((k) => !(k in first));
      if (missing.length) {
        return cleanupAndRespond(400, { message: `Invalid file format. Missing columns: ${missing.join(", ")}` });
      }

      items = records.map((r) => ({
        firstname: r.FirstName ?? "",
        phone: r.Phone ?? "",
        notes: r.Notes ?? "",
      }));

      const agents = await Agent.find().sort({ createdAt: 1 }).limit(5);
      if (agents.length < 5) {
        return cleanupAndRespond(400, { message: "Need at least 5 agents to distribute" });
      }

      if (clearExisting) {
        await Promise.all(
          agents.map(async (a) => {
            a.assignedList = [];
            await a.save();
          })
        );
      }

      let i = 0;
      for (const item of items) {
        const agent = agents[i % 5];
        agent.assignedList.push(item);
        await agent.save();
        i++;
      }

      return cleanupAndRespond(200, { message: "File processed and tasks distributed", count: items.length });
    };

    if (req.file.mimetype === "text/csv") {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          await handleItems(rows);
        })
        .on("error", (err) => {
          return cleanupAndRespond(400, { message: `CSV parse error: ${err.message}` });
        });
    } else {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      await handleItems(data);
    }
  } catch (err) {
    return cleanupAndRespond(500, { message: err.message });
  }
});

export default router;
