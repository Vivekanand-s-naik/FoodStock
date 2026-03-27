const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to Database
connectDB();

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "User Service", status: "OK" });
});

// Routes
app.use("/", userRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
