import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaArrowLeft, FaShoppingBag, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalDiscount, finalTotal } = useCart();
  const { requireAuth } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!requireAuth("Please sign up or log in first to proceed to checkout.")) return;
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <PublicNavbar />

      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</h1>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-grid">
            {/* ITEM LIST */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <span className="cart-item-cat">{item.category}</span>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-price-unit">
                      PKR {item.price.toLocaleString()} each
                    </div>
                  </div>

                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>

                  <div className="cart-item-total">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} title="Remove Item">
                    <FaTrash />
                  </button>
                </div>
              ))}

              <div className="cart-actions-row">
                <Link to="/products" className="continue-shopping-btn">
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="cart-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Savings & Discounts</span>
                  <span>- PKR {totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-badge">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span>PKR {finalTotal.toLocaleString()}</span>
              </div>

              <button className="checkout-btn" onClick={handleProceedToCheckout}>
                Proceed to Checkout <FaArrowRight />
              </button>

              <div className="cart-security-note">
                <FaShieldAlt /> Secure 256-bit Encrypted Checkout
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart-state">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any wedding products or bridal items yet.</p>
            <Link to="/products" className="shop-now-btn">
              Explore Wedding Shop
            </Link>
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}

export default Cart;
