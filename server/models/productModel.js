const db = require("../config/db");

// CREATE PRODUCT
const createProduct = (productData, callback) => {
  const sql = `
    INSERT INTO products
    (vendor_id, name, description, price, original_price, category, image, stock, rating, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      productData.vendor_id || null,
      productData.name,
      productData.description || "",
      productData.price,
      productData.original_price || null,
      productData.category,
      productData.image || "",
      productData.stock || 10,
      productData.rating || 5.0,
      productData.is_active !== undefined ? productData.is_active : 1,
    ],
    callback
  );
};

// GET ALL PRODUCTS
const getAllProducts = (filters, callback) => {
  let sql = `SELECT * FROM products WHERE is_active = 1`;
  const params = [];

  if (filters.category && filters.category !== "All") {
    sql += ` AND category = ?`;
    params.push(filters.category);
  }

  if (filters.search) {
    sql += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`;
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (filters.minPrice) {
    sql += ` AND price >= ?`;
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    sql += ` AND price <= ?`;
    params.push(filters.maxPrice);
  }

  if (filters.sort === "price-low") {
    sql += ` ORDER BY price ASC`;
  } else if (filters.sort === "price-high") {
    sql += ` ORDER BY price DESC`;
  } else if (filters.sort === "rating") {
    sql += ` ORDER BY rating DESC`;
  } else {
    sql += ` ORDER BY id DESC`;
  }

  db.query(sql, params, callback);
};

// GET PRODUCTS BY VENDOR
const getProductsByVendor = (vendorId, callback) => {
  const sql = `SELECT * FROM products WHERE vendor_id = ? ORDER BY id DESC`;
  db.query(sql, [vendorId], callback);
};

// GET PRODUCT BY ID
const getProductById = (id, callback) => {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.query(sql, [id], callback);
};

// UPDATE PRODUCT
const updateProduct = (id, productData, callback) => {
  const sql = `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?,
      original_price = ?,
      category = ?,
      image = ?,
      stock = ?,
      is_active = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      productData.name,
      productData.description,
      productData.price,
      productData.original_price,
      productData.category,
      productData.image,
      productData.stock,
      productData.is_active,
      id,
    ],
    callback
  );
};

// DELETE PRODUCT
const deleteProduct = (id, callback) => {
  const sql = `DELETE FROM products WHERE id = ?`;
  db.query(sql, [id], callback);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByVendor,
  getProductById,
  updateProduct,
  deleteProduct,
};
