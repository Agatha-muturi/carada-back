// models/Traffic.js
import mongoose from "mongoose";

const trafficSchema = new mongoose.Schema({
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  hasTraffic: { type: Boolean, default: false },
  alternativeRoute: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Traffic", trafficSchema);
