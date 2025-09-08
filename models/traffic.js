const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST /api/traffic/check
router.post("/check", async (req, res) => {
  try {
    const { currentLocation, destination } = req.body;

    // 🗺️ For now, assume frontend passes coordinates in "lat,lon"
    // Later you can integrate geocoding to turn place names into coords
    const [startLat, startLon] = currentLocation.split(",");
    const [endLat, endLon] = destination.split(",");

    const response = await axios.get(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${startLat},${startLon}&key=${process.env.TOMTOM_API_KEY}`
    );

    const trafficData = response.data;

    res.json({
      route: {
        start: { lat: startLat, lon: startLon },
        end: { lat: endLat, lon: endLon },
      },
      traffic: trafficData.flowSegmentData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Traffic check failed" });
  }
});

module.exports = router;
