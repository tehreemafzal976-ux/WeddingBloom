import React, { useEffect, useState } from "react";
import {
  FaClipboardCheck,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Swal from "sweetalert2";
import "./Bookings.css";

const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

function Bookings() {
  const [showForm, setShowForm] = useState(false);

  const [bookings, setBookings] = useState([]);

  const [weddings, setWeddings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    wedding_id: "",
    vendor_id: "",
    package_id: "",
    event_id: "",
    booking_date: "",
    service_date: "",
    total_amount: "",
    status: "Pending",
    notes: "",
  });

  // =========================
  // TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // API HEADERS
  // =========================

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // FETCH BOOKINGS
  // =========================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/bookings`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch bookings."
        );
      }

      setBookings(data.data || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Bookings",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH FORM DATA
  // =========================

  const fetchFormData = async () => {
    try {
      const [
        weddingsResponse,
        vendorsResponse,
        packagesResponse,
        eventsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/weddings`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/vendors`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/packages`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/events`, {
          headers: getHeaders(),
        }),
      ]);

      const weddingsData = await weddingsResponse.json();
      const vendorsData = await vendorsResponse.json();
      const packagesData = await packagesResponse.json();
      const eventsData = await eventsResponse.json();

      if (weddingsResponse.ok) {
        setWeddings(weddingsData.data || []);
      }

      if (vendorsResponse.ok) {
        setVendors(vendorsData.data || []);
      }

      if (packagesResponse.ok) {
        setPackages(packagesData.data || []);
      }

      if (eventsResponse.ok) {
        setEvents(eventsData.data || []);
      }
    } catch (error) {
      console.log("Failed to load form data:", error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchBookings();
    fetchFormData();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      wedding_id: "",
      vendor_id: "",
      package_id: "",
      event_id: "",
      booking_date: "",
      service_date: "",
      total_amount: "",
      status: "Pending",
      notes: "",
    });

    setEditingId(null);
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // =========================
  // CREATE / UPDATE BOOKING
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      wedding_id: formData.wedding_id,
      vendor_id: formData.vendor_id,
      package_id: formData.package_id,
      event_id: formData.event_id,
      booking_date: formData.booking_date || null,
      service_date: formData.service_date || null,
      total_amount: formData.total_amount || 0,
      status: formData.status || "Pending",
      notes: formData.notes || null,
    };

    try {
      const url = editingId
        ? `${API_URL}/bookings/${editingId}`
        : `${API_URL}/bookings`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save booking."
        );
      }

      Swal.fire({
        icon: "success",
        title: editingId
          ? "Booking Updated"
          : "Booking Created",
        text: editingId
          ? "Booking updated successfully."
          : "Booking created successfully.",
        confirmButtonColor: "#b35b6c",
      });

      closeForm();
      fetchBookings();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // EDIT BOOKING
  // =========================

  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${id}`,
        {
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch booking."
        );
      }

      const booking = data.data;

      setFormData({
        wedding_id: booking.wedding_id || "",
        vendor_id: booking.vendor_id || "",
        package_id: booking.package_id || "",
        event_id: booking.event_id || "",

        booking_date: booking.booking_date
          ? booking.booking_date.substring(0, 10)
          : "",

        service_date: booking.service_date
          ? booking.service_date.substring(0, 10)
          : "",

        total_amount: booking.total_amount || "",

        status: booking.status || "Pending",

        notes: booking.notes || "",
      });

      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Edit",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Booking?",
      text: "This booking will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b35b6c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete booking."
        );
      }

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Booking deleted successfully.",
        confirmButtonColor: "#b35b6c",
      });

      fetchBookings();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(booking.id || "")
        .toLowerCase()
        .includes(searchText) ||

      String(booking.status || "")
        .toLowerCase()
        .includes(searchText) ||

      String(booking.notes || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "" ||
      String(booking.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =========================
  // HELPERS
  // =========================

  const getWeddingName = (id) => {
    const wedding = weddings.find(
      (item) => Number(item.id) === Number(id)
    );

    return wedding
      ? (
          wedding.name ||
          wedding.title ||
          wedding.wedding_name ||
          `Wedding #${id}`
        )
      : `Wedding #${id}`;
  };

  const getVendorName = (id) => {
    const vendor = vendors.find(
      (item) => Number(item.id) === Number(id)
    );

    return vendor
      ? (
          vendor.business_name ||
          vendor.name ||
          vendor.vendor_name ||
          `Vendor #${id}`
        )
      : `Vendor #${id}`;
  };

  const getPackageName = (id) => {
    const packageItem = packages.find(
      (item) => Number(item.id) === Number(id)
    );

    return packageItem
      ? (
          packageItem.name ||
          packageItem.package_name ||
          `Package #${id}`
        )
      : `Package #${id}`;
  };

  const getEventName = (id) => {
    const event = events.find(
      (item) => Number(item.id) === Number(id)
    );

    return event
      ? (
          event.name ||
          event.title ||
          event.event_name ||
          `Event #${id}`
        )
      : `Event #${id}`;
  };

  return (
    <div className="bookings-page">

      {/* HEADER */}

      <div className="bookings-header">
        <div>
          <span className="bookings-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Bookings</h1>

          <p>
            Keep track of your wedding service
            bookings and scheduled vendors.
          </p>
        </div>

        <button
          className="bookings-primary-btn"
          onClick={openAddForm}
        >
          <FaPlus />
          Add Booking
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="bookings-toolbar">

        <div className="bookings-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="bookings-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="">
            All Bookings
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

      </div>

      {/* BOOKINGS */}

      {loading ? (
        <section className="bookings-empty-card">

          <div className="bookings-empty-icon">
            <FaClipboardCheck />
          </div>

          <h2>Loading bookings...</h2>

          <p>
            Please wait while your bookings
            are being loaded.
          </p>

        </section>
      ) : filteredBookings.length === 0 ? (

        <section className="bookings-empty-card">

          <div className="bookings-empty-icon">
            <FaClipboardCheck />
          </div>

          <h2>
            {bookings.length === 0
              ? "No bookings available"
              : "No matching bookings"}
          </h2>

          <p>
            {bookings.length === 0
              ? "Your vendor bookings will appear here once they are added to your wedding plan."
              : "Try changing your search or status filter."}
          </p>

          {bookings.length === 0 && (
            <button
              className="bookings-empty-btn"
              onClick={openAddForm}
            >
              <FaPlus />
              Add Your First Booking
            </button>
          )}

        </section>
      ) : (

        <section className="bookings-list">

          {filteredBookings.map((booking) => (

            <div
              className="booking-card"
              key={booking.id}
            >

              <div className="booking-card-top">

                <div>

                  <span className="booking-card-label">
                    BOOKING #{booking.id}
                  </span>

                  <h2>
                    {getVendorName(
                      booking.vendor_id
                    )}
                  </h2>

                </div>

                <span
                  className={`booking-status booking-status-${String(
                    booking.status || "Pending"
                  ).toLowerCase()}`}
                >
                  {booking.status || "Pending"}
                </span>

              </div>

              <div className="booking-card-grid">

                <div>
                  <span>Wedding</span>

                  <strong>
                    {getWeddingName(
                      booking.wedding_id
                    )}
                  </strong>
                </div>

                <div>
                  <span>Package</span>

                  <strong>
                    {getPackageName(
                      booking.package_id
                    )}
                  </strong>
                </div>

                <div>
                  <span>Event</span>

                  <strong>
                    {getEventName(
                      booking.event_id
                    )}
                  </strong>
                </div>

                <div>
                  <span>Booking Date</span>

                  <strong>
                    {booking.booking_date
                      ? new Date(
                          booking.booking_date
                        ).toLocaleDateString()
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Service Date</span>

                  <strong>
                    {booking.service_date
                      ? new Date(
                          booking.service_date
                        ).toLocaleDateString()
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>

                  <strong>
                    {booking.total_amount
                      ? `Rs. ${Number(
                          booking.total_amount
                        ).toLocaleString()}`
                      : "Rs. 0"}
                  </strong>
                </div>

              </div>

              {booking.notes && (
                <div className="booking-notes">

                  <span>Notes</span>

                  <p>
                    {booking.notes}
                  </p>

                </div>
              )}

              <div className="booking-card-actions">

                <button
                  className="booking-edit-btn"
                  onClick={() =>
                    handleEdit(booking.id)
                  }
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  className="booking-delete-btn"
                  onClick={() =>
                    handleDelete(booking.id)
                  }
                >
                  <FaTrash />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </section>
      )}

      {/* ADD / EDIT BOOKING MODAL */}

      {showForm && (

        <div className="bookings-modal-overlay">

          <div className="bookings-modal">

            <div className="bookings-modal-header">

              <div>

                <span>
                  BOOKING MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Booking"
                    : "Add Booking"}
                </h2>

              </div>

              <button
                className="bookings-close-btn"
                onClick={closeForm}
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* WEDDING */}

              <div className="bookings-form-group">

                <label>
                  Wedding
                </label>

                <select
                  name="wedding_id"
                  value={formData.wedding_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select wedding
                  </option>

                  {weddings.map((wedding) => (

                    <option
                      key={wedding.id}
                      value={wedding.id}
                    >
                      {wedding.name ||
                        wedding.title ||
                        wedding.wedding_name ||
                        `Wedding #${wedding.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* VENDOR */}

              <div className="bookings-form-group">

                <label>
                  Vendor / Business
                </label>

                <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select vendor
                  </option>

                  {vendors.map((vendor) => (

                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.business_name ||
                        vendor.name ||
                        vendor.vendor_name ||
                        `Vendor #${vendor.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* PACKAGE */}

              <div className="bookings-form-group">

                <label>
                  Package
                </label>

                <select
                  name="package_id"
                  value={formData.package_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select package
                  </option>

                  {packages.map((packageItem) => (

                    <option
                      key={packageItem.id}
                      value={packageItem.id}
                    >
                      {packageItem.name ||
                        packageItem.package_name ||
                        `Package #${packageItem.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* EVENT + BOOKING DATE */}

              <div className="bookings-form-row">

                <div className="bookings-form-group">

                  <label>
                    Event
                  </label>

                  <select
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select event
                    </option>

                    {events.map((event) => (

                      <option
                        key={event.id}
                        value={event.id}
                      >
                        {event.name ||
                          event.title ||
                          event.event_name ||
                          `Event #${event.id}`}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="bookings-form-group">

                  <label>
                    Booking Date
                  </label>

                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* SERVICE DATE + AMOUNT */}

              <div className="bookings-form-row">

                <div className="bookings-form-group">

                  <label>
                    Service Date
                  </label>

                  <input
                    type="date"
                    name="service_date"
                    value={formData.service_date}
                    onChange={handleChange}
                  />

                </div>

                <div className="bookings-form-group">

                  <label>
                    Total Amount
                  </label>

                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />

                </div>

              </div>

              {/* STATUS */}

              <div className="bookings-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              {/* NOTES */}

              <div className="bookings-form-group">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add booking notes..."
                  rows="4"
                />

              </div>

              {/* ACTIONS */}

              <div className="bookings-form-actions">

                <button
                  type="button"
                  className="bookings-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bookings-save-btn"
                >

                  <FaSave />

                  {editingId
                    ? "Update Booking"
                    : "Save Booking"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Bookings;