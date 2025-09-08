// routes/updates.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Update = require("../models/update");

const router = express.Router();

// ensure uploads folder exists when deployed (Render will create ephemeral FS but it's fine for demo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, safe);
  }
});
const upload = multer({ storage });

// POST /api/updates
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { location, cause } = req.body;
    if (!location || !cause) return res.status(400).json({ error: "location and cause required" });

    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const u = await Update.create({ location, cause, photo });
    res.status(201).json(u);
  } catch (err) {
    console.error("POST /api/updates error:", err);
    res.status(500).json({ error: "Failed to save update" });
  }
});

// GET /api/updates
router.get("/", async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    console.error("GET /api/updates error:", err);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

module.exports = router;
