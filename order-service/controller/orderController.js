const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const order = new Order({ userId, items, totalAmount });
    await order.save();
    res.json({ msg: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
