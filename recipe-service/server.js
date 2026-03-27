const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const recipeRoutes = require("./routes/recipeRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to Database
connectDB();

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "Recipe Service", status: "OK" });
});

// Routes
app.use("/", recipeRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Recipe Service running on port ${PORT}`);
});
