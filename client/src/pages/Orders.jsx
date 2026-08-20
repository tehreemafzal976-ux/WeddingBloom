import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";
import { FaBox, FaCalendarAlt, FaCheckCircle, FaClock, FaTruck, FaChevronRight } from "react-icons/fa";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders?userId=${user?.id || 1}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h1>My Wedding Product Orders</h1>
            <p>Track your purchased bridal dresses, jewelry, decor items, and order status.</p>
          </div>
        </div>

        {loading ? (
          <div className="orders-loading">Loading your orders...</div>
        ) : orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div className="order-number-box">
                    <FaBox className="box-icon" />
                    <div>
                      <strong>Order #{order.order_number}</strong>
                      <span>Placed on {new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="order-badges">
                    <span className="status-badge paid">{order.payment_status || "Paid"}</span>
                    <span className="status-badge processing">{order.order_status || "Processing"}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div className="order-item-row" key={idx}>
                          <img src={item.product_image || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80"} alt={item.product_name} />
                          <div className="order-item-details">
                            <strong>{item.product_name}</strong>
                            <span>Qty: {item.quantity} × PKR {Number(item.price).toLocaleString()}</span>
                          </div>
                          <div className="order-item-total">
                            PKR {Number(item.total_price || item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items-text">Items included in this order</p>
                    )}
                  </div>

                  <div className="order-shipping-info">
                    <small>Shipping Address:</small>
                    <p>{order.full_name} — {order.address}, {order.city} ({order.phone})</p>
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="order-final-total">
                    <span>Total Amount Paid:</span>
                    <strong>PKR {Number(order.total_amount).toLocaleString()}</strong>
                  </div>
                  <button className="view-order-btn" onClick={() => setSelectedOrder(order)}>
                    View Order Details <FaChevronRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="orders-empty-state">
            <FaBox className="empty-box-icon" />
            <h2>No Orders Placed Yet</h2>
            <p>You haven't ordered any wedding products yet. Explore our wedding shop!</p>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details (#{selectedOrder.order_number})</h2>
                <button onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="info-grid">
                  <div>
                    <strong>Customer Name:</strong> {selectedOrder.full_name}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </div>
                  <div>
                    <strong>Payment Method:</strong> {selectedOrder.payment_method}
                  </div>
                  <div>
                    <strong>Order Status:</strong> {selectedOrder.order_status}
                  </div>
                </div>

                <h3>Items</h3>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div className="modal-item" key={idx}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <strong>PKR {Number(item.total_price || item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  ))}
                </div>

                <div className="modal-total-line">
                  <span>Grand Total:</span>
                  <strong>PKR {Number(selectedOrder.total_amount).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Orders;
