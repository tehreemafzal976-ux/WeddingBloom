const db = require("../config/db");

const createOrder = (orderData, items, callback) => {
  const orderNumber = "WB-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

  const sqlOrder = `
    INSERT INTO orders
    (order_number, user_id, full_name, email, phone, address, city, subtotal, discount, total_amount, payment_method, payment_status, order_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlOrder,
    [
      orderNumber,
      orderData.user_id,
      orderData.full_name,
      orderData.email,
      orderData.phone,
      orderData.address,
      orderData.city,
      orderData.subtotal,
      orderData.discount || 0.0,
      orderData.total_amount,
      orderData.payment_method || "Card",
      orderData.payment_status || "Paid",
      orderData.order_status || "Processing",
    ],
    (err, result) => {
      if (err) return callback(err);

      const orderId = result.insertId;

      if (!items || items.length === 0) {
        return callback(null, { orderId, orderNumber });
      }

      const itemValues = items.map((item) => [
        orderId,
        item.product_id || item.id,
        item.name || item.product_name || "Wedding Product",
        item.image || item.product_image || "",
        item.price,
        item.quantity,
        (item.price * item.quantity).toFixed(2),
      ]);

      const sqlItems = `
        INSERT INTO order_items
        (order_id, product_id, product_name, product_image, price, quantity, total_price)
        VALUES ?
      `;

      db.query(sqlItems, [itemValues], (itemErr) => {
        if (itemErr) {
          console.error("Error creating order items:", itemErr);
        }
        return callback(null, { orderId, orderNumber });
      });
    }
  );
};

const getOrdersByUser = (userId, callback) => {
  const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`;
  db.query(sql, [userId], (err, orders) => {
    if (err) return callback(err);
    if (!orders || orders.length === 0) return callback(null, []);

    // Get items for all user orders
    const orderIds = orders.map((o) => o.id);
    const itemsSql = `SELECT * FROM order_items WHERE order_id IN (?)`;

    db.query(itemsSql, [orderIds], (itemErr, items) => {
      if (itemErr) return callback(null, orders);

      const ordersWithItems = orders.map((order) => ({
        ...order,
        items: items.filter((item) => item.order_id === order.id),
      }));

      return callback(null, ordersWithItems);
    });
  });
};

const getOrderById = (id, callback) => {
  const sqlOrder = `SELECT * FROM orders WHERE id = ?`;
  db.query(sqlOrder, [id], (err, orders) => {
    if (err) return callback(err);
    if (!orders || orders.length === 0) return callback(null, null);

    const order = orders[0];
    const sqlItems = `SELECT * FROM order_items WHERE order_id = ?`;
    db.query(sqlItems, [id], (itemErr, items) => {
      order.items = items || [];
      return callback(null, order);
    });
  });
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
};
