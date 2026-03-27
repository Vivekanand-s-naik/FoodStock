const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { proxyOptions } = require("../config/gatewayConfig");

const router = express.Router();

router.use(
	"/users",
	createProxyMiddleware({
		target: "http://localhost:4001",
		pathRewrite: { "^/users": "" },
		...proxyOptions
	})
);

router.use(
	"/books",
	createProxyMiddleware({
		target: "http://localhost:4002",
		pathRewrite: { "^/books": "" },
		...proxyOptions
	})
);

router.use(
	"/orders",
	createProxyMiddleware({
		target: "http://localhost:4003",
		pathRewrite: { "^/orders": "" },
		...proxyOptions
	})
);

router.use(
	"/notifications",
	createProxyMiddleware({
		target: "http://localhost:4004",
		pathRewrite: { "^/notifications": "" },
		...proxyOptions
	})
);

module.exports = router;
