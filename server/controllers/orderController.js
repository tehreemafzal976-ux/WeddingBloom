const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");

const createOrder = (req, res) => {
  const { customer, items, subtotal, discount, totalAmount, paymentMethod } = req.body;
  const userId = req.body.userId || req.user?.id || 1;

  if (!customer || !customer.fullName || !customer.address) {
    return res.status(400).json({ success: false, message: "Customer details are required" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "No items in order" });
  }

  const orderData = {
    user_id: userId,
    full_name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    subtotal: subtotal || 0,
    discount: discount || 0,
    total_amount: totalAmount || subtotal || 0,
    payment_method: paymentMethod || "Credit/Debit Card",
    payment_status: "Paid",
    order_status: "Processing",
  };

  orderModel.createOrder(orderData, items, (err, orderResult) => {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(500).json({ success: false, message: "Failed to create order" });
    }

    // Clear cart after successful order creation
    cartModel.clearCart(userId, () => { });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: orderResult.orderId,
      orderNumber: orderResult.orderNumber,
    });
  });
};

const getUserOrders = (req, res) => {
  const userId = req.query.userId || req.user?.id || 1;

  orderModel.getOrdersByUser(userId, (err, orders) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
    return res.status(200).json({ success: true, orders });
  });
};

const getOrderById = (req, res) => {
  const { id } = req.params;

  orderModel.getOrderById(id, (err, order) => {
    if (err) {
      console.error("Error fetching order by ID:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  });
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};
