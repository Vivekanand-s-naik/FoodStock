
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const proxyOptions = {
	changeOrigin: true,
	logLevel: "warn",
	onError: (err, req, res) => {
		console.error("Proxy error:", err);
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

app.listen(4000, () => console.log("Gateway running on 4000"));
