import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Guests.css";

function Guests() {
  const [showForm, setShowForm] = useState(false);

  const [guests, setGuests] = useState([]);
  const [weddings, setWeddings] = useState([]);

  const [selectedWedding, setSelectedWedding] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [editingGuest, setEditingGuest] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    number_of_guests: 1,
    rsvp: "pending",
  });

  const token = localStorage.getItem("token");

  const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";


  // =========================
  // GET WEDDINGS
  // =========================

  const fetchWeddings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/weddings/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setWeddings(data.data);

        if (data.data.length > 0) {
          setSelectedWedding(data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Fetch weddings error:", error);
    }
  };


  // =========================
  // GET GUESTS
  // =========================

  const fetchGuests = async (weddingId) => {
    if (!weddingId) return;

    try {
      const response = await fetch(
        `${API_URL}/guests/wedding/${weddingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setGuests(data.data);
      }
    } catch (error) {
      console.error("Fetch guests error:", error);
    }
  };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchWeddings();
  }, []);


  useEffect(() => {
    if (selectedWedding) {
      fetchGuests(selectedWedding);
    }
  }, [selectedWedding]);


  // =========================
  // INPUT CHANGE
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
    setEditingGuest(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      relationship: "",
      number_of_guests: 1,
      rsvp: "pending",
    });

    setShowForm(true);
  };


  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWedding) {
      Swal.fire({
        icon: "warning",
        title: "Create a wedding first",
        text: "Please create a wedding before adding guests.",
      });

      return;
    }

    try {
      const guestData = {
        wedding_id: selectedWedding,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        relationship: formData.relationship,
        number_of_guests: Number(formData.number_of_guests),
        invitation_status: formData.rsvp,
      };

      const url = editingGuest
        ? `${API_URL}/guests/${editingGuest.id}`
        : `${API_URL}/guests`;

      const method = editingGuest ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(guestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      Swal.fire({
        icon: "success",
        title: editingGuest
          ? "Guest Updated"
          : "Guest Added",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      setShowForm(false);
      setEditingGuest(null);

      await fetchGuests(selectedWedding);

    } catch (error) {
      console.error("Guest save error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (guest) => {
    setEditingGuest(guest);

    setFormData({
      name: guest.full_name || "",
      email: guest.email || "",
      phone: guest.phone || "",
      relationship: guest.relationship || "",
      number_of_guests: guest.number_of_guests || 1,
      rsvp: guest.invitation_status || "pending",
    });

    setShowForm(true);
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete guest?",
      text: "This guest will be permanently removed.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b35b6c",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/guests/${id}`,
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
          data.message || "Failed to delete guest."
        );
      }

      setGuests((previous) =>
        previous.filter((guest) => guest.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: data.message,
        timer: 1300,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };


  // =========================
  // FILTER
  // =========================

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      guest.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      guest.phone
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      !filterStatus ||
      guest.invitation_status === filterStatus;

    return matchesSearch && matchesStatus;
  });


  // =========================
  // COUNTS
  // =========================

  const totalGuests = guests.reduce(
    (total, guest) =>
      total + Number(guest.number_of_guests || 1),
    0
  );

  const invitedGuests = guests.filter(
    (guest) =>
      guest.invitation_status === "pending"
  ).length;

  const confirmedGuests = guests.filter(
    (guest) =>
      guest.invitation_status === "confirmed"
  ).length;


  return (
    <div className="guests-page">

      {/* HEADER */}

      <div className="guests-header">

        <div>
          <span className="guests-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Guest List</h1>

          <p>
            Keep track of your guests, invitations,
            and RSVP responses.
          </p>
        </div>

        <button
          className="guests-primary-btn"
          onClick={openAddForm}
        >
          <FaPlus />
          Add Guest
        </button>

      </div>


      {/* WEDDING SELECT */}

      {weddings.length > 0 && (
        <div style={{ marginBottom: "20px" }}>

          <select
            value={selectedWedding}
            onChange={(e) =>
              setSelectedWedding(e.target.value)
            }
            className="guests-filter"
          >
            {weddings.map((wedding) => (
              <option
                key={wedding.id}
                value={wedding.id}
              >
                {wedding.wedding_title}
              </option>
            ))}
          </select>

        </div>
      )}


      {/* SUMMARY */}

      <div className="guests-summary">

        <div className="guest-summary-card">

          <div className="guest-summary-icon">
            <FaUsers />
          </div>

          <div>
            <span>Total Guests</span>
            <strong>{totalGuests}</strong>
          </div>

        </div>


        <div className="guest-summary-card">

          <div className="guest-summary-icon invited">
            <FaEnvelope />
          </div>

          <div>
            <span>Pending</span>
            <strong>{invitedGuests}</strong>
          </div>

        </div>


        <div className="guest-summary-card">

          <div className="guest-summary-icon confirmed">
            <FaCheck />
          </div>

          <div>
            <span>Confirmed</span>
            <strong>{confirmedGuests}</strong>
          </div>

        </div>

      </div>


      {/* TOOLBAR */}

      <div className="guests-toolbar">

        <div className="guests-search">

          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search guests..."
          />

        </div>

        <select
          className="guests-filter"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
        >
          <option value="">
            All RSVP Status
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="declined">
            Declined
          </option>

        </select>

      </div>


      {/* GUEST LIST */}

      {filteredGuests.length > 0 ? (

        <section className="guests-list">

          {filteredGuests.map((guest) => (

            <div
              className="guest-card"
              key={guest.id}
            >

              <div className="guest-card-icon">
                <FaUsers />
              </div>

              <div className="guest-card-info">

                <h3>{guest.full_name}</h3>

                <p>
                  {guest.relationship || "Guest"}
                </p>

                <div className="guest-card-contact">

                  {guest.email && (
                    <span>
                      <FaEnvelope />
                      {guest.email}
                    </span>
                  )}

                  {guest.phone && (
                    <span>
                      <FaPhone />
                      {guest.phone}
                    </span>
                  )}

                </div>

              </div>

              <div className="guest-card-right">

                <span
                  className={`guest-rsvp ${guest.invitation_status}`}
                >
                  {guest.invitation_status}
                </span>

                <span className="guest-count">
                  {guest.number_of_guests || 1} guest(s)
                </span>

                <div className="guest-card-actions">

                  <button
                    onClick={() =>
                      handleEdit(guest)
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(guest.id)
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </section>

      ) : (

        <section className="guests-empty-card">

          <div className="guests-empty-icon">
            <FaUserPlus />
          </div>

          <h2>
            {guests.length === 0
              ? "No guests added yet"
              : "No guests found"}
          </h2>

          <p>
            {guests.length === 0
              ? "Your guest list will appear here once you start adding people to your wedding."
              : "Try changing your search or RSVP filter."}
          </p>

          {guests.length === 0 && (
            <button
              className="guests-empty-btn"
              onClick={openAddForm}
            >
              <FaPlus />
              Add Your First Guest
            </button>
          )}

        </section>

      )}


      {/* MODAL */}

      {showForm && (

        <div className="guests-modal-overlay">

          <div className="guests-modal">

            <div className="guests-modal-header">

              <div>

                <span>
                  GUEST MANAGEMENT
                </span>

                <h2>
                  {editingGuest
                    ? "Edit Guest"
                    : "Add Guest"}
                </h2>

              </div>

              <button
                className="guests-close-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <FaTimes />
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="guests-form-group">

                <label>
                  Guest Name
                </label>

                <div className="guests-input-wrapper">

                  <FaUsers />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter guest name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="guests-form-group">

                <label>
                  Email Address
                </label>

                <div className="guests-input-wrapper">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="guest@example.com"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="guests-form-group">

                <label>
                  Phone Number
                </label>

                <div className="guests-input-wrapper">

                  <FaPhone />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                  />

                </div>

              </div>


              {/* RELATIONSHIP */}

              <div className="guests-form-group">

                <label>
                  Relationship
                </label>

                <div className="guests-input-wrapper">

                  <FaUsers />

                  <input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    placeholder="e.g. Friend, Cousin, Uncle"
                  />

                </div>

              </div>


              {/* NUMBER */}

              <div className="guests-form-group">

                <label>
                  Number of Guests
                </label>

                <div className="guests-input-wrapper">

                  <FaUsers />

                  <input
                    type="number"
                    name="number_of_guests"
                    value={formData.number_of_guests}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                </div>

              </div>


              {/* RSVP */}

              <div className="guests-form-group">

                <label>
                  RSVP Status
                </label>

                <select
                  name="rsvp"
                  value={formData.rsvp}
                  onChange={handleChange}
                  className="guests-select"
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="declined">
                    Declined
                  </option>

                </select>

              </div>


              <div className="guests-form-actions">

                <button
                  type="button"
                  className="guests-cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="guests-save-btn"
                >
                  <FaUserPlus />

                  {editingGuest
                    ? "Update Guest"
                    : "Add Guest"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Guests;