// models/Update.js
const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema({
  location: { type: String, required: true },
  cause: { type: String, required: true },
  photo: { type: String },            // path e.g. /uploads/xyz.jpg
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Update", UpdateSchema);
