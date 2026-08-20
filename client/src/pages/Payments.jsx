
import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Payments.css";

function Payments() {
  // =========================
  // STATES
  // =========================

  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_method: "",
    payment_status: "Pending",
    transaction_reference: "",
    payment_date: "",
  });

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  // =========================
  // API URL
  // =========================

  const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

  // =========================
  // FETCH PAYMENTS
  // =========================

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch payments."
        );
      }

      setPayments(data.data || []);
    } catch (error) {
      console.error("Fetch Payments Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load payments",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // FETCH BOOKINGS
  // =========================

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch bookings."
        );
      }

      setBookings(data.data || []);
    } catch (error) {
      console.error("Fetch Bookings Error:", error);

      /*
        We don't show an error popup here because
        the payment page can still load even if
        bookings are unavailable.
      */
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchPayments(),
        fetchBookings(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingPayment(null);

    setFormData({
      booking_id: "",
      amount: "",
      payment_method: "",
      payment_status: "Pending",
      transaction_reference: "",
      payment_date: "",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (payment) => {
    setEditingPayment(payment);

    setFormData({
      booking_id: payment.booking_id || "",
      amount: payment.amount || "",
      payment_method: payment.payment_method || "",
      payment_status:
        payment.payment_status || "Pending",
      transaction_reference:
        payment.transaction_reference || "",
      payment_date:
        payment.payment_date
          ? payment.payment_date.substring(0, 10)
          : "",
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingPayment(null);
  };

  // =========================
  // SUBMIT PAYMENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        booking_id: Number(formData.booking_id),
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        transaction_reference:
          formData.transaction_reference || null,
        payment_date: formData.payment_date,
      };

      // =========================
      // UPDATE PAYMENT
      // =========================

      if (editingPayment) {
        const response = await fetch(
          `${API_URL}/payments/${editingPayment.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update payment."
          );
        }

        await fetchPayments();

        setShowForm(false);
        setEditingPayment(null);

        Swal.fire({
          icon: "success",
          title: "Payment Updated",
          text: "Payment information updated successfully.",
          confirmButtonColor: "#b35b6c",
        });
      }

      // =========================
      // CREATE PAYMENT
      // =========================

      else {
        const response = await fetch(
          `${API_URL}/payments`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to create payment."
          );
        }

        await fetchPayments();

        setShowForm(false);

        Swal.fire({
          icon: "success",
          title: "Payment Added",
          text: "Payment added successfully.",
          confirmButtonColor: "#b35b6c",
        });
      }

      setFormData({
        booking_id: "",
        amount: "",
        payment_method: "",
        payment_status: "Pending",
        transaction_reference: "",
        payment_date: "",
      });
    } catch (error) {
      console.error("Payment Submit Error:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE PAYMENT
  // =========================

  const deletePayment = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Payment?",
      text: "This payment record will be permanently removed.",
      showCancelButton: true,
      confirmButtonColor: "#b35b6c",
      cancelButtonColor: "#777",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/payments/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete payment."
        );
      }

      setPayments((previous) =>
        previous.filter(
          (payment) => payment.id !== id
        )
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Payment deleted successfully.",
        confirmButtonColor: "#b35b6c",
      });
    } catch (error) {
      console.error("Delete Payment Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // GET BOOKING NAME
  // =========================

  const getBookingName = (bookingId) => {
    const booking = bookings.find(
      (item) => Number(item.id) === Number(bookingId)
    );

    if (!booking) {
      return `Booking #${bookingId}`;
    }

    return (
      booking.title ||
      booking.event_name ||
      booking.booking_name ||
      `Booking #${booking.id}`
    );
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredPayments = payments.filter(
    (payment) => {
      const searchText = search.toLowerCase();

      const bookingName = getBookingName(
        payment.booking_id
      ).toLowerCase();

      const method =
        payment.payment_method
          ?.toLowerCase() || "";

      const reference =
        payment.transaction_reference
          ?.toLowerCase() || "";

      const matchesSearch =
        bookingName.includes(searchText) ||
        method.includes(searchText) ||
        reference.includes(searchText);

      const matchesStatus =
        selectedStatus === "" ||
        payment.payment_status?.toLowerCase() ===
          selectedStatus.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =========================
  // RENDER
  // =========================

  return (
    <div className="payments-page">

      {/* HEADER */}

      <div className="payments-header">

        <div>
          <span className="payments-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Payments</h1>

          <p>
            Track payments made for your wedding
            bookings and services.
          </p>
        </div>

        <button
          className="payments-primary-btn"
          onClick={openAddForm}
        >
          <FaPlus />
          Add Payment
        </button>

      </div>


      {/* TOOLBAR */}

      <div className="payments-toolbar">

        <div className="payments-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          className="payments-filter"
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value)
          }
        >

          <option value="">
            All Payments
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Refunded">
            Refunded
          </option>

        </select>

      </div>


      {/* LOADING */}

      {loading ? (

        <section className="payments-empty-card">

          <FaSpinner className="vendors-spinner" />

          <h2>
            Loading payments...
          </h2>

          <p>
            Fetching your payment records from
            the database.
          </p>

        </section>

      ) : filteredPayments.length === 0 ? (

        /* EMPTY STATE */

        <section className="payments-empty-card">

          <div className="payments-empty-icon">
            <FaCreditCard />
          </div>

          <h2>
            No payments available
          </h2>

          <p>
            {payments.length === 0
              ? "Your payment records will appear here once payments are added to your wedding plan."
              : "No payments match your current search or status filter."}
          </p>

          {payments.length === 0 && (
            <button
              className="payments-empty-btn"
              onClick={openAddForm}
            >
              <FaPlus />
              Add Your First Payment
            </button>
          )}

        </section>

      ) : (

        /* PAYMENT CARDS */

        <section className="payments-grid">

          {filteredPayments.map(
            (payment) => (

              <div
                className="payment-card"
                key={payment.id}
              >

                <div className="payment-card-top">

                  <div className="payment-icon">
                    <FaCreditCard />
                  </div>

                  <div className="payment-actions">

                    <button
                      onClick={() =>
                        openEditForm(payment)
                      }
                      title="Edit payment"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        deletePayment(payment.id)
                      }
                      title="Delete payment"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>


                <h2>
                  {getBookingName(
                    payment.booking_id
                  )}
                </h2>


                <div className="payment-amount">
                  Rs.{" "}
                  {Number(
                    payment.amount || 0
                  ).toLocaleString()}
                </div>


                <div className="payment-details">

                  <div className="payment-detail">

                    <FaCreditCard />

                    <span>
                      {payment.payment_method}
                    </span>

                  </div>


                  <div className="payment-detail">

                    <FaCalendarAlt />

                    <span>
                      {payment.payment_date
                        ? new Date(
                            payment.payment_date
                          ).toLocaleDateString()
                        : "No date"}
                    </span>

                  </div>


                  {payment.transaction_reference && (
                    <div className="payment-detail">

                      <FaMoneyBillWave />

                      <span>
                        Ref:{" "}
                        {
                          payment.transaction_reference
                        }
                      </span>

                    </div>
                  )}

                </div>


                <span
                  className={`payment-status ${
                    payment.payment_status
                      ?.toLowerCase()
                  }`}
                >
                  {payment.payment_status}
                </span>

              </div>

            )
          )}

        </section>

      )}


      {/* ADD / EDIT PAYMENT MODAL */}

      {showForm && (

        <div className="payments-modal-overlay">

          <div className="payments-modal">

            <div className="payments-modal-header">

              <div>

                <span>
                  PAYMENT MANAGEMENT
                </span>

                <h2>
                  {editingPayment
                    ? "Edit Payment"
                    : "Add Payment"}
                </h2>

              </div>


              <button
                className="payments-close-btn"
                onClick={closeForm}
              >
                <FaTimes />
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              {/* BOOKING */}

              <div className="payments-form-group">

                <label>
                  Booking / Service
                </label>

                <select
                  name="booking_id"
                  value={formData.booking_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select booking
                  </option>

                  {bookings.map(
                    (booking) => (

                      <option
                        key={booking.id}
                        value={booking.id}
                      >
                        {booking.title ||
                          booking.event_name ||
                          booking.booking_name ||
                          `Booking #${booking.id}`}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* AMOUNT */}

              <div className="payments-form-row">

                <div className="payments-form-group">

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>


                {/* DATE */}

                <div className="payments-form-group">

                  <label>
                    Payment Date
                  </label>

                  <input
                    type="date"
                    name="payment_date"
                    value={
                      formData.payment_date
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PAYMENT METHOD */}

              <div className="payments-form-group">

                <label>
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={
                    formData.payment_method
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select payment method
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Card">
                    Card
                  </option>

                  <option value="Online">
                    Online Payment
                  </option>

                </select>

              </div>


              {/* PAYMENT STATUS */}

              <div className="payments-form-group">

                <label>
                  Payment Status
                </label>

                <select
                  name="payment_status"
                  value={
                    formData.payment_status
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Refunded">
                    Refunded
                  </option>

                </select>

              </div>


              {/* TRANSACTION REFERENCE */}

              <div className="payments-form-group">

                <label>
                  Transaction Reference
                </label>

                <input
                  type="text"
                  name="transaction_reference"
                  value={
                    formData.transaction_reference
                  }
                  onChange={handleChange}
                  placeholder="e.g. TXN-12345"
                />

              </div>


              {/* ACTIONS */}

              <div className="payments-form-actions">

                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="payments-save-btn"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <FaSpinner />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />

                      {editingPayment
                        ? "Update Payment"
                        : "Save Payment"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Payments;
