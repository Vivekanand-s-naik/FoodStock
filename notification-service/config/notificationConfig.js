module.exports = {
  smtp: {
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password"
  }
};
