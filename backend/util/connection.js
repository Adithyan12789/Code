// connection.js
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

const db = mongoose.connection;

module.exports = db;
