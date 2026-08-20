const productModel = require("../models/productModel");

const getProducts = (req, res) => {
  const filters = {
    category: req.query.category,
    search: req.query.search,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    sort: req.query.sort,
  };

  productModel.getAllProducts(filters, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
    return res.status(200).json({ success: true, products: results });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;

  productModel.getProductById(id, (err, results) => {
    if (err) {
      console.error("Error fetching product by ID:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product: results[0] });
  });
};

const getProductsByVendor = (req, res) => {
  const { vendorId } = req.params;

  productModel.getProductsByVendor(vendorId, (err, results) => {
    if (err) {
      console.error("Error fetching vendor products:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch vendor products" });
    }
    return res.status(200).json({ success: true, products: results });
  });
};

const createProduct = (req, res) => {
  const productData = req.body;

  if (!productData.name || !productData.price || !productData.category) {
    return res.status(400).json({ success: false, message: "Name, price, and category are required" });
  }

  productModel.createProduct(productData, (err, result) => {
    if (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ success: false, message: "Failed to create product" });
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: result.insertId,
    });
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  productModel.updateProduct(id, productData, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ success: false, message: "Failed to update product" });
    }

    return res.status(200).json({ success: true, message: "Product updated successfully" });
  });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  productModel.deleteProduct(id, (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ success: false, message: "Failed to delete product" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  });
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByVendor,
  createProduct,
  updateProduct,
  deleteProduct,
};
