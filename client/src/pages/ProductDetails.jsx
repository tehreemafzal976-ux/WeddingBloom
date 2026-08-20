import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";
import { FaStar, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaArrowLeft, FaCheck } from "react-icons/fa";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
        }
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!requireAuth("Please sign up or log in first to add products to your cart.")) return;
    addToCart(product, quantity);
    alert(`Added ${quantity} x "${product.name}" to your cart!`);
  };

  const handleBuyNow = () => {
    if (!requireAuth("Please sign up or log in first to proceed to checkout.")) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleToggleFavorite = () => {
    if (!requireAuth("Please sign up or log in first to save favorites.")) return;
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <PublicNavbar />
        <div className="details-container loading-box">Loading product details...</div>
        <PublicFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <PublicNavbar />
        <div className="details-container empty-box">
          <h2>Product Not Found</h2>
          <Link to="/products" className="back-btn"><FaArrowLeft /> Back to Shop</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div className="product-details-page">
      <PublicNavbar />

      <div className="details-container">
        <button onClick={() => navigate(-1)} className="back-link-btn">
          <FaArrowLeft /> Back to Marketplace
        </button>

        <div className="product-details-grid">
          {/* IMAGE */}
          <div className="details-image-wrapper">
            <img src={product.image} alt={product.name} />
            {discountPercent && (
              <span className="details-discount-badge">{discountPercent}% OFF</span>
            )}
          </div>

          {/* DETAILS */}
          <div className="details-info-box">
            <span className="details-category">{product.category}</span>
            <h1 className="details-title">{product.name}</h1>

            <div className="details-rating-row">
              <div className="stars">
                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
              </div>
              <span>{product.rating || 4.9} (24 customer reviews)</span>
            </div>

            <div className="details-price-row">
              <span className="current-price">PKR {Number(product.price).toLocaleString()}</span>
              {product.original_price && (
                <span className="original-price">PKR {Number(product.original_price).toLocaleString()}</span>
              )}
            </div>

            <p className="details-description">
              {product.description || "Crafted with premium materials and exquisite attention to detail, designed specifically for your unforgettable wedding day."}
            </p>

            <div className="stock-badge in-stock">
              <FaCheck /> In Stock ({product.stock || 10} available)
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="purchase-controls">
              <div className="quantity-selector">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>

              <button className="add-cart-btn-large" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="buy-now-btn-large" onClick={handleBuyNow}>
                Buy Now
              </button>

              <button
                className={`fav-btn-large ${isFavorite ? "active" : ""}`}
                onClick={handleToggleFavorite}
                title="Favorite"
              >
                <FaHeart />
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="trust-badges-grid">
              <div className="trust-item">
                <FaTruck />
                <div>
                  <strong>Fast Nationwide Shipping</strong>
                  <span>Delivered to your doorstep across Pakistan</span>
                </div>
              </div>
              <div className="trust-item">
                <FaShieldAlt />
                <div>
                  <strong>Verified Vendor Quality</strong>
                  <span>100% authentic product guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default ProductDetails;
