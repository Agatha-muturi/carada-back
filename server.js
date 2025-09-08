// server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors()); // tighten origin in production via options
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

// Routes
app.use("/api/updates", require("./routes/updates"));
app.use("/api/traffic", require("./routes/traffic"));

// Health
app.get("/", (_req, res) => res.send("Car Rada backend is running"));

// Connect DB and start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚦 Backend listening on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message || err);
    process.exit(1);
  });
