import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";
import { FaCreditCard, FaLock, FaCheckCircle, FaTruck, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import "./Checkout.css";

function Checkout() {
  const { cartItems, subtotal, totalDiscount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card");

  const [customer, setCustomer] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "Lahore",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.city) {
      setError("Please complete all required shipping fields.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cartItems,
          subtotal,
          discount: totalDiscount,
          totalAmount: finalTotal,
          paymentMethod,
          userId: user?.id || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to place order.");
        return;
      }

      // Record payment via existing payment system if order was created
      try {
        await fetch(`${API_URL}/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: data.orderId || 1,
            amount: finalTotal,
            payment_method: paymentMethod,
            payment_status: "Paid",
            transaction_reference: data.orderNumber || "ORDER-" + Date.now(),
            payment_date: new Date().toISOString().slice(0, 10),
          }),
        });
      } catch (pErr) {
        console.warn("Payment recording notice:", pErr);
      }

      clearCart();
      alert(`Order Placed Successfully! Order Number: ${data.orderNumber || "WB-9921"}`);
      navigate("/couple/orders");
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Unable to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <PublicNavbar />

      <div className="checkout-container">
        <h1 className="checkout-title">Complete Your Order</h1>

        {error && <div className="checkout-error-alert">{error}</div>}

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* CUSTOMER & SHIPPING FORM */}
          <div className="checkout-form-section">
            <div className="checkout-card">
              <h2><FaUser /> Customer Information</h2>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={customer.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="0300 1234567"
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Shipping Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    placeholder="Street address, house number, area"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select name="city" value={customer.city} onChange={handleChange}>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="checkout-card margin-top">
              <h2><FaCreditCard /> Select Payment Method</h2>

              <div className="payment-options-grid">
                {[
                  "Credit / Debit Card",
                  "EasyPaisa / JazzCash",
                  "Direct Bank Transfer",
                  "Cash on Delivery",
                ].map((method) => (
                  <label
                    key={method}
                    className={`payment-option-card ${paymentMethod === method ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <div className="payment-option-info">
                      <strong>{method}</strong>
                      <span>Secure, instant order confirmation</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="checkout-summary-section">
            <div className="checkout-card summary-card">
              <h2>Order Summary ({cartItems.length} items)</h2>

              <div className="checkout-items-preview">
                {cartItems.map((item) => (
                  <div className="preview-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="preview-item-info">
                      <strong>{item.name}</strong>
                      <small>Qty: {item.quantity}</small>
                    </div>
                    <span className="preview-item-price">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="summary-line discount">
                  <span>Savings</span>
                  <span>- PKR {totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Delivery</span>
                <span className="free-tag">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line total">
                <span>Final Total</span>
                <span>PKR {finalTotal.toLocaleString()}</span>
              </div>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? "Processing Order..." : "Place Order & Pay"}
              </button>

              <p className="checkout-footer-note">
                <FaLock /> Guaranteed 100% safe & protected transaction
              </p>
            </div>
          </div>
        </form>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Checkout;
