// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import trafficRoutes from "./routes/trafficroutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use(cors({
  origin: "https://carada-front-asp5.vercel.app/", // for testing
}));

// Routes

app.use("/api/traffic", trafficRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Car Rada backend running on http://localhost:${PORT}`));
