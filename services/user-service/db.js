const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/user-service";
  await mongoose.connect(mongoURI);
  console.log("MongoDB connected - User Service");
};

module.exports = connectDB;
