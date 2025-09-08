// routes/traffic.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const TOMTOM_KEY = process.env.TOMTOM_API_KEY;

// Helper: geocode text -> { lat, lon }
async function geocode(place) {
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(place)}.json?key=${TOMTOM_KEY}`;
  const { data } = await axios.get(url);
  if (!data.results || data.results.length === 0) throw new Error("Geocode failed for: " + place);
  return data.results[0].position; // { lat, lon }
}

// POST /api/traffic/check
// body: { currentLocation: "Nairobi CBD", destination: "Westlands" }
router.post("/check", async (req, res) => {
  try {
    const { currentLocation, destination } = req.body;
    if (!currentLocation || !destination) return res.status(400).json({ error: "Missing fields" });

    // 1) geocode both
    const [start, end] = await Promise.all([geocode(currentLocation), geocode(destination)]);

    // 2) get traffic flow near start
    const flowUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${start.lat},${start.lon}`;
    const flowRes = await axios.get(flowUrl);
    const seg = flowRes.data.flowSegmentData || {};

    // 3) if slow, fetch alternatives (TomTom routing)
    let alternatives = [];
    if (seg.currentSpeed != null && seg.currentSpeed < 30) {
      const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lon}:${end.lat},${end.lon}/json?key=${TOMTOM_KEY}&routeType=shortest&maxAlternatives=2`;
      const routeRes = await axios.get(routeUrl);
      alternatives = routeRes.data.routes || [];
    }

    return res.json({
      route: { start, end },
      traffic: {
        currentSpeed: seg.currentSpeed ?? null,
        freeFlowSpeed: seg.freeFlowSpeed ?? null,
        roadClosure: seg.roadClosure ?? false,
        confidence: seg.confidence ?? null
      },
      alternatives
    });
  } catch (err) {
    console.error("POST /api/traffic/check error:", err.response?.data || err.message || err);
    return res.status(500).json({ error: "Failed to fetch traffic data" });
  }
});

module.exports = router;
