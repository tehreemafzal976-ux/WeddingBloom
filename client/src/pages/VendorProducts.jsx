import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";
import { FaPlus, FaEdit, FaTrash, FaBox, FaTag, FaDollarSign, FaLayerGroup } from "react-icons/fa";
import "./VendorProducts.css";

function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "Wedding Dresses",
    image: "",
    stock: 10,
  });

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      category: "Wedding Dresses",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
      stock: 10,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      original_price: product.original_price || "",
      category: product.category,
      image: product.image || "",
      stock: product.stock || 10,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          original_price: formData.original_price ? Number(formData.original_price) : null,
          vendor_id: user?.id || 1,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchVendorProducts();
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchVendorProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <AppLayout>
      <div className="vendor-products-page">
        <div className="vp-header">
          <div>
            <h1>Manage E-Commerce Products</h1>
            <p>Add and update your wedding dresses, jewelry, decor items, and shop inventory.</p>
          </div>
          <button className="add-prod-btn" onClick={handleOpenAddModal}>
            <FaPlus /> Add New Product
          </button>
        </div>

        {loading ? (
          <div className="vp-loading">Loading products...</div>
        ) : (
          <div className="vp-products-table-wrapper">
            <table className="vp-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Sale Price</th>
                  <th>Original Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={prod.image} alt={prod.name} />
                        <div>
                          <strong>{prod.name}</strong>
                          <small>{prod.description?.slice(0, 45)}...</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="cat-badge">{prod.category}</span></td>
                    <td className="price-td">PKR {Number(prod.price).toLocaleString()}</td>
                    <td className="old-price-td">{prod.original_price ? `PKR ${Number(prod.original_price).toLocaleString()}` : "—"}</td>
                    <td>{prod.stock || 10}</td>
                    <td>
                      <div className="table-actions">
                        <button className="edit-btn" onClick={() => handleOpenEditModal(prod)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="del-btn" onClick={() => handleDelete(prod.id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {modalOpen && (
          <div className="vp-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="vp-modal-card" onClick={(e) => e.stopPropagation()}>
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

              <form onSubmit={handleSubmit} className="vp-form">
                <div className="vp-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="vp-field">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Wedding Dresses">Wedding Dresses</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Mehndi">Mehndi</option>
                    <option value="Photography">Photography</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Catering">Catering</option>
                    <option value="Invitations">Invitations</option>
                    <option value="Wedding Shoes">Wedding Shoes</option>
                  </select>
                </div>

                <div className="vp-row">
                  <div className="vp-field">
                    <label>Sale Price (PKR) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="vp-field">
                    <label>Original Price (for discount display)</label>
                    <input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="vp-field">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="vp-field">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="vp-modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default VendorProducts;
