const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "Order Service", status: "OK" });
});

// Routes
app.use("/", orderRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
