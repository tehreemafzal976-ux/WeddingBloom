const cartModel = require("../models/cartModel");

const getCart = (req, res) => {
  const userId = req.query.userId || req.user?.id || 1;

  cartModel.getCartByUser(userId, (err, results) => {
    if (err) {
      console.error("Error getting cart:", err);
      return res.status(500).json({ success: false, message: "Failed to get cart" });
    }
    return res.status(200).json({ success: true, items: results });
  });
};

const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.body.userId || req.user?.id || 1;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  cartModel.addToCart(userId, productId, quantity || 1, (err, result) => {
    if (err) {
      console.error("Error adding to cart:", err);
      return res.status(500).json({ success: false, message: "Failed to add to cart" });
    }
    return res.status(200).json({ success: true, message: "Added to cart successfully" });
  });
};

const updateCartQuantity = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  cartModel.updateCartQuantity(id, quantity, (err, result) => {
    if (err) {
      console.error("Error updating cart quantity:", err);
      return res.status(500).json({ success: false, message: "Failed to update cart" });
    }
    return res.status(200).json({ success: true, message: "Cart updated" });
  });
};

const removeFromCart = (req, res) => {
  const { id } = req.params;

  cartModel.removeFromCart(id, (err, result) => {
    if (err) {
      console.error("Error removing from cart:", err);
      return res.status(500).json({ success: false, message: "Failed to remove item" });
    }
    return res.status(200).json({ success: true, message: "Item removed from cart" });
  });
};

const clearCart = (req, res) => {
  const userId = req.query.userId || req.body.userId || req.user?.id || 1;

  cartModel.clearCart(userId, (err, result) => {
    if (err) {
      console.error("Error clearing cart:", err);
      return res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
    return res.status(200).json({ success: true, message: "Cart cleared" });
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
