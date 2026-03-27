const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/foodapp-order-service";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected - Order Service");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;
