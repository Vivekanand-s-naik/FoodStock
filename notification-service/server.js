const express = require("express");
const cors = require("cors");
const emailService = require("./services/emailService");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "Notification Service", status: "OK" });
});

// Route to send notification
app.post("/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const result = await emailService.sendEmail(to, subject, body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
