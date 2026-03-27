const proxyOptions = {
	changeOrigin: true,
	logLevel: "warn",
	onError: (err, req, res) => {
		console.error("Proxy error:", err?.message || err);
		res.status(503).json({ error: "Service unavailable" });
	}
};

module.exports = {
	proxyOptions,
	PORT: process.env.PORT || 4000
};
