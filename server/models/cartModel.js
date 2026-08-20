const db = require("../config/db");

const getCartByUser = (userId, callback) => {
  const sql = `
    SELECT
      c.id AS cart_id,
      c.quantity,
      c.product_id,
      p.name,
      p.price,
      p.original_price,
      p.image,
      p.category,
      p.stock
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.id DESC
  `;
  db.query(sql, [userId], callback);
};

const addToCart = (userId, productId, quantity, callback) => {
  // Check if item already in cart
  const checkSql = `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`;
  db.query(checkSql, [userId, productId], (err, results) => {
    if (err) return callback(err);

    if (results && results.length > 0) {
      const newQty = results[0].quantity + (quantity || 1);
      const updateSql = `UPDATE cart_items SET quantity = ? WHERE id = ?`;
      db.query(updateSql, [newQty, results[0].id], callback);
    } else {
      const insertSql = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      db.query(insertSql, [userId, productId, quantity || 1], callback);
    }
  });
};

const updateCartQuantity = (cartId, quantity, callback) => {
  if (quantity <= 0) {
    const deleteSql = `DELETE FROM cart_items WHERE id = ?`;
    return db.query(deleteSql, [cartId], callback);
  }
  const sql = `UPDATE cart_items SET quantity = ? WHERE id = ?`;
  db.query(sql, [quantity, cartId], callback);
};

const removeFromCart = (cartId, callback) => {
  const sql = `DELETE FROM cart_items WHERE id = ?`;
  db.query(sql, [cartId], callback);
};

const clearCart = (userId, callback) => {
  const sql = `DELETE FROM cart_items WHERE user_id = ?`;
  db.query(sql, [userId], callback);
};

module.exports = {
  getCartByUser,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
