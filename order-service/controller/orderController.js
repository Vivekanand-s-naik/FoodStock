const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, customerName = "A User" } = req.body;
    
    // 1. Check and Update Recipe Quantities
    for (const item of items) {
      const qtyRes = await fetch(`http://localhost:4002/${item.recipeId}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: -item.quantity })
      });
      
      if (!qtyRes.ok) {
        const errorData = await qtyRes.json();
        return res.status(400).json({ error: `Failed to update quantity for ${item.name}: ${errorData.error}` });
      }
    }

    // 2. Save Order
    const order = new Order({ userId, items, totalAmount });
    await order.save();

    // 3. Notify Admin
    try {
      await fetch("http://localhost:4004/admin-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          customerName: customerName,
          totalAmount: totalAmount
        })
      });
    } catch (notifErr) {
      console.error("Failed to notify admin:", notifErr.message);
      // Don't fail the order if notification fails
    }

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
