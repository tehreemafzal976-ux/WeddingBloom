import React, { useEffect, useState } from "react";
import {
FaHeart,
FaPlus,
FaSearch,
FaCalendarAlt,
FaMapMarkerAlt,
FaUsers,
FaTimes,
FaMoneyBillWave,
} from "react-icons/fa";

import "./Weddings.css";

function Weddings() {
const [showForm, setShowForm] = useState(false);

const [weddings, setWeddings] = useState([]);
const [search, setSearch] = useState("");

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const [formData, setFormData] = useState({
wedding_title: "",
wedding_date: "",
venue: "",
total_budget: "",
guest_count: "",
city: "",
});

const token = localStorage.getItem("token");

// =========================
// GET COUPLE WEDDINGS
// =========================

const fetchWeddings = async () => {
try {
setLoading(true);
setError("");

  const response = await fetch(
    "https://weddingbloom-production-b2a2.up.railway.app/api/weddings/my",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(data.message || "Failed to load weddings.");
    return;
  }

  setWeddings(data.data || []);
} catch (error) {
  console.error("Fetch Weddings Error:", error);

  setError(
    "Unable to connect to the server."
  );
} finally {
  setLoading(false);
}

};

// Load weddings when page opens
useEffect(() => {
fetchWeddings();
}, []);

// =========================
// HANDLE INPUT
// =========================

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previous) => ({
  ...previous,
  [name]: value,
}));

setError("");

};

// =========================
// CREATE WEDDING
// =========================

const handleSubmit = async (e) => {
e.preventDefault();

try {
  setSaving(true);
  setError("");

  const response = await fetch(
    "https://weddingbloom-production-b2a2.up.railway.app/api/weddings",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wedding_title: formData.wedding_title,
        wedding_date: formData.wedding_date,
        venue: formData.venue,
        total_budget: formData.total_budget,
        guest_count: formData.guest_count
          ? Number(formData.guest_count)
          : null,
        city: formData.city,
        status: "planning",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.message || "Failed to create wedding."
    );
    return;
  }

  // Close modal
  setShowForm(false);

  // Clear form
  setFormData({
    wedding_title: "",
    wedding_date: "",
    venue: "",
    total_budget: "",
    guest_count: "",
    city: "",
  });

  // Reload real database data
  await fetchWeddings();

} catch (error) {
  console.error("Create Wedding Error:", error);

  setError(
    "Unable to connect to the server."
  );
} finally {
  setSaving(false);
}

};

// =========================
// SEARCH
// =========================

const filteredWeddings = weddings.filter((wedding) => {
const searchValue = search.toLowerCase();

return (
  wedding.wedding_title
    ?.toLowerCase()
    .includes(searchValue) ||
  wedding.venue
    ?.toLowerCase()
    .includes(searchValue) ||
  wedding.city
    ?.toLowerCase()
    .includes(searchValue)
);

});

return (
<div className="weddings-page">

  {/* =========================
      PAGE HEADER
  ========================= */}

  <div className="weddings-header">

    <div>
      <span className="weddings-eyebrow">
        WEDDING BLOOM
      </span>

      <h1>My Weddings</h1>

      <p>
        Create and manage all your wedding plans
        from one beautiful space.
      </p>
    </div>

    <button
      className="weddings-primary-btn"
      onClick={() => {
        setError("");
        setShowForm(true);
      }}
    >
      <FaPlus />
      Create Wedding
    </button>

  </div>


  {/* =========================
      ERROR
  ========================= */}

  {error && (
    <div className="weddings-error">
      {error}
    </div>
  )}


  {/* =========================
      SEARCH
  ========================= */}

  <div className="weddings-toolbar">

    <div className="weddings-search">

      <FaSearch />

      <input
        type="text"
        placeholder="Search weddings..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

    <div className="weddings-toolbar-info">

      <span>
        {weddings.length}{" "}
        {weddings.length === 1
          ? "wedding"
          : "weddings"}
      </span>

    </div>

  </div>


  {/* =========================
      LOADING
  ========================= */}

  {loading ? (
    <section className="weddings-empty-card">

      <div className="weddings-empty-icon">
        💍
      </div>

      <h2>
        Loading your weddings...
      </h2>

      <p>
        Fetching your wedding plans from the database.
      </p>

    </section>
  ) : filteredWeddings.length === 0 ? (

    /* =========================
       EMPTY STATE
    ========================= */

    <section className="weddings-empty-card">

      <div className="weddings-empty-decoration">
        <span>✦</span>
        <FaHeart />
        <span>✦</span>
      </div>

      <div className="weddings-empty-icon">
        💍
      </div>

      <h2>
        {search
          ? "No weddings found"
          : "Your wedding story starts here"}
      </h2>

      <p>
        {search
          ? "Try another search."
          : "You haven't created a wedding yet. Add your wedding details and start planning every beautiful moment."}
      </p>

      {!search && (
        <button
          className="weddings-empty-btn"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <FaPlus />
          Create Your First Wedding
        </button>
      )}

    </section>

  ) : (

    /* =========================
       REAL WEDDINGS
    ========================= */

    <section className="weddings-grid">

      {filteredWeddings.map((wedding) => (

        <article
          className="wedding-card"
          key={wedding.id}
        >

          <div className="wedding-card-top">

            <div className="wedding-card-icon">
              💍
            </div>

            <span className="wedding-status">
              {wedding.status || "planning"}
            </span>

          </div>

          <h2>
            {wedding.wedding_title}
          </h2>

          <div className="wedding-card-details">

            <p>
              <FaCalendarAlt />
              {wedding.wedding_date
                ? new Date(
                    wedding.wedding_date
                  ).toLocaleDateString()
                : "No date"}
            </p>

            <p>
              <FaMapMarkerAlt />
              {wedding.venue || "No venue"}
              {wedding.city
                ? `, ${wedding.city}`
                : ""}
            </p>

            <p>
              <FaUsers />
              {wedding.guest_count || 0} guests
            </p>

            <p>
              <FaMoneyBillWave />
              Budget: {wedding.total_budget}
            </p>

          </div>

        </article>

      ))}

    </section>

  )}


  {/* =========================
      CREATE WEDDING MODAL
  ========================= */}

  {showForm && (
    <div className="weddings-modal-overlay">

      <div className="weddings-modal">

        <div className="weddings-modal-header">

          <div>

            <span>
              NEW WEDDING
            </span>

            <h2>
              Create your wedding
            </h2>

          </div>

          <button
            className="weddings-close-btn"
            onClick={() => {
              if (!saving) {
                setShowForm(false);
              }
            }}
            aria-label="Close"
          >
            <FaTimes />
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="weddings-form-group">

            <label>
              Wedding Name
            </label>

            <div className="weddings-input-wrapper">

              <FaHeart />

              <input
                type="text"
                name="wedding_title"
                value={formData.wedding_title}
                onChange={handleChange}
                placeholder="e.g. Our Wedding"
                required
              />

            </div>

          </div>


          {/* DATE */}

          <div className="weddings-form-group">

            <label>
              Wedding Date
            </label>

            <div className="weddings-input-wrapper">

              <FaCalendarAlt />

              <input
                type="date"
                name="wedding_date"
                value={formData.wedding_date}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* VENUE */}

          <div className="weddings-form-group">

            <label>
              Venue
            </label>

            <div className="weddings-input-wrapper">

              <FaMapMarkerAlt />

              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Wedding venue"
              />

            </div>

          </div>


          {/* CITY */}

          <div className="weddings-form-group">

            <label>
              City
            </label>

            <div className="weddings-input-wrapper">

              <FaMapMarkerAlt />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lahore"
              />

            </div>

          </div>


          {/* BUDGET */}

          <div className="weddings-form-group">

            <label>
              Total Budget
            </label>

            <div className="weddings-input-wrapper">

              <FaMoneyBillWave />

              <input
                type="number"
                name="total_budget"
                value={formData.total_budget}
                onChange={handleChange}
                placeholder="Enter total budget"
                min="0"
                required
              />

            </div>

          </div>


          {/* GUEST COUNT */}

          <div className="weddings-form-group">

            <label>
              Expected Guests
            </label>

            <div className="weddings-input-wrapper">

              <FaUsers />

              <input
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleChange}
                placeholder="Number of guests"
                min="1"
              />

            </div>

          </div>


          {/* ACTIONS */}

          <div className="weddings-form-actions">

            <button
              type="button"
              className="weddings-cancel-btn"
              onClick={() => {
                if (!saving) {
                  setShowForm(false);
                }
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="weddings-save-btn"
              disabled={saving}
            >
              <FaHeart />

              {saving
                ? "Creating..."
                : "Create Wedding"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}

</div>

);
}

export default Weddings;