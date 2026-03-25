
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

try {
	const app = express();
	app.use(cors());

	const proxyOptions = {
		changeOrigin: true,
		logLevel: "warn",
		onError: (err, req, res) => {
			console.error("Proxy error:", err?.message || err);
			res.status(503).json({ error: "Service unavailable" });
		}
	};

	app.use(
		"/users",
		createProxyMiddleware({
			target: "http://localhost:4001",
			pathRewrite: { "^/users": "" },
			...proxyOptions
		})
	);

	app.use(
		"/foods",
		createProxyMiddleware({
			target: "http://localhost:4002",
			pathRewrite: { "^/foods": "" },
			...proxyOptions
		})
	);

	// Health check endpoint
	app.get("/health", (req, res) => {
		res.json({ status: "OK" });
	});

	// Error handler
	app.use((err, req, res, next) => {
		console.error("Error:", err?.message || err);
		res.status(500).json({ error: "Internal error" });
	});

	const PORT = 4000;
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
