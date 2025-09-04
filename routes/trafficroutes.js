// routes/trafficRoutes.js
const express = require("express");
const router = express.Router();
const Traffic = require("../models/traffic");
const axios = require("axios");

const ORS_API = "https://api.openrouteservice.org/v2/directions/driving-car";

// ➡️ POST: Submit traffic report
router.post("/", async (req, res) => {
  const { currentLocation, destination, hasTraffic } = req.body;

  try {
    let alternativeRoute = null;

    if (hasTraffic) {
      // Example: Convert addresses into coordinates (in real app you'd use geocoding)
      // For now let's simulate Nairobi coords
      const start = [36.8219, -1.2921]; // current location (lng, lat)
      const end = [36.9062, -1.2806];   // destination (lng, lat)

      const response = await axios.post(
        ORS_API,
        {
          coordinates: [start, end],
        },
        {
          headers: {
            Authorization: process.env.ORS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      alternativeRoute = response.data;
    }

    const report = new Traffic({
      currentLocation,
      destination,
      hasTraffic,
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
