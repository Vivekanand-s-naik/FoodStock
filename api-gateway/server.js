const express = require("express");
const cors = require("cors");
const gatewayRoutes = require("./routes/gatewayRoutes");
const { PORT } = require("./config/gatewayConfig");

try {
	const app = express();
	app.use(cors());

	// Mount gateway routes
	app.use("/", gatewayRoutes);

	// Health check endpoint
	app.get("/health", (req, res) => {
		res.json({ status: "OK" });
	});

	// Error handler
	app.use((err, req, res, next) => {
		console.error("Error:", err?.message || err);
		res.status(500).json({ error: "Internal error" });
	});

	const server = app.listen(PORT, "127.0.0.1", () => {
		console.log(`Gateway listening on http://127.0.0.1:${PORT}`);
	});

	// Prevent exit
	server.on("error", (err) => {
		console.error("Server error:", err?.message || err);
	});

	// Handle shutdown signals
	process.on("SIGINT", () => {
		console.log("\nShutting down...");
		server.close(() => {
			process.exit(0);
		});
	});

} catch (err) {
	console.error("FATAL:", err?.message || err);
	console.error("Stack:", err?.stack);
	process.exit(1);
}
