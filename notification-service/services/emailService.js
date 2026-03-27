exports.sendEmail = async (to, subject, text) => {
  console.log(`[EmailService] Sending email to ${to}...`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  // Mocking email send for now
  return { success: true, messageId: "mock-id-123" };
};
