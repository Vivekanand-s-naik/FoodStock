const express = require("express");
const cors = require("cors");
const emailService = require("./services/emailService");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory history for notifications
const notifications = [];

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "Notification Service", status: "OK", historyCount: notifications.length });
});

// GET all notifications (for Admin)
app.get("/", (req, res) => {
  res.json(notifications.reverse()); // latest first
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

// Admin alert for orders
app.post("/admin-alert", async (req, res) => {
  try {
    const { orderId, customerName, totalAmount } = req.body;
    const subject = `New Order Placed: #${orderId}`;
    const body = `Customer ${customerName} has placed an order for $${totalAmount}. Please check the dashboard.`;
    
    // In a real app, we'd fetch all admin emails from user-service
    const result = await emailService.sendEmail("admin@foodapp.com", subject, body);
    
    // Store in history
    notifications.push({
      id: Date.now(),
      orderId,
      customerName,
      totalAmount,
      subject,
      body,
      timestamp: new Date()
    });

    res.json({ msg: "Admin notified", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
