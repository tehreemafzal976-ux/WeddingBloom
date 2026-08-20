const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true
  }
});

const initializeEcommerceTables = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vendor_id INT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2) NULL,
      category VARCHAR(100) NOT NULL,
      image TEXT,
      stock INT DEFAULT 10,
      rating DECIMAL(3,2) DEFAULT 5.00,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(100) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0.00,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'Card',
      payment_status VARCHAR(50) DEFAULT 'Paid',
      order_status VARCHAR(50) DEFAULT 'Processing',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_image TEXT,
      price DECIMAL(10,2) NOT NULL,
      quantity INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL
    )`
  ];

  queries.forEach((query) => {
    db.query(query, (err) => {
      if (err) {
        console.warn("⚠️ Warning initializing table:", err.message);
      }
    });
  });

  // Ensure favorites supports product_id as well as vendor_id
  db.query("SHOW COLUMNS FROM favorites LIKE 'product_id'", (err, results) => {
    if (!err && results.length === 0) {
      db.query("ALTER TABLE favorites ADD COLUMN product_id INT NULL", (alterErr) => {
        if (alterErr) console.warn("⚠️ Could not add product_id to favorites table:", alterErr.message);
      });
    }
  });
};

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Connection Failed:", err.message);
    return;
  }

  console.log("✅ MySQL Database Connected Successfully!");
  initializeEcommerceTables();
});

module.exports = db;
