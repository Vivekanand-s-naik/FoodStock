const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/user/:userId", orderController.getOrdersByUser);

module.exports = router;
