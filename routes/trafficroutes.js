// routes/trafficRoutes.js
const express = require("express");
const router = express.Router();
const Traffic = require("../models/traffic");
const axios = require("axios");

const ORS_API = process.env.ORS_API_KEY
// ➡️ POST: Submit traffic report
router.post("/", async (req, res) => {
  const { currentLocation, destination } = req.body;

  try {
    let alternativeRoute = null;

    const report = new Traffic({
      currentLocation,
      destination,
      alternativeRoute,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to submit traffic update" });
  }
});

// ➡️ GET: All reports
router.get("/", async (req, res) => {
  try {
    const reports = await Traffic.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

module.exports = router;
