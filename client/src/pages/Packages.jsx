import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaCheck,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import "./Packages.css";

function Packages() {

  const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

  const [showForm, setShowForm] = useState(false);

  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("");


  const [formData, setFormData] = useState({
    vendor_id: "",
    package_name: "",
    description: "",
    price: "",
    duration_hours: "",
    max_guests: "",
    is_active: 1,
  });


  /* =========================
     GET TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================
     FETCH PACKAGES
  ========================= */

  const fetchPackages = async () => {

    try {

      setLoading(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/packages`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (response.ok && data.success) {

        setPackages(data.data || []);

      } else {

        console.error(
          "Failed to fetch packages:",
          data.message
        );

      }

    } catch (error) {

      console.error(
        "Fetch packages error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     LOAD PACKAGES
  ========================= */

  useEffect(() => {

    fetchPackages();

  }, []);


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {

    setFormData({
      vendor_id: "",
      package_name: "",
      description: "",
      price: "",
      duration_hours: "",
      max_guests: "",
      is_active: 1,
    });

  };


  /* =========================
     ADD PACKAGE
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const token = getToken();


      const response = await fetch(
        `${API_URL}/packages`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            vendor_id: formData.vendor_id,

            package_name: formData.package_name,

            description: formData.description,

            price: formData.price,

            duration_hours:
              formData.duration_hours,

            max_guests:
              formData.max_guests,

            is_active:
              formData.is_active,

          }),
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        alert(
          data.message ||
          "Failed to create package."
        );

        return;
      }


      alert("Package created successfully!");


      setShowForm(false);

      resetForm();

      fetchPackages();


    } catch (error) {

      console.error(
        "Create package error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =========================
     DELETE PACKAGE
  ========================= */

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) return;


    try {

      const token = getToken();


      const response = await fetch(
        `${API_URL}/packages/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        alert(
          data.message ||
          "Failed to delete package."
        );

        return;
      }


      alert("Package deleted successfully!");


      fetchPackages();


    } catch (error) {

      console.error(
        "Delete package error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );

    }

  };


  /* =========================
     FILTER PACKAGES
  ========================= */

  const filteredPackages = packages.filter(
    (pkg) => {

      const matchesSearch =
        pkg.package_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        pkg.business_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchesFilter =
        !filter ||
        pkg.category === filter;


      return (
        matchesSearch &&
        matchesFilter
      );

    }
  );


  return (

    <div className="packages-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="packages-header">

        <div>

          <span className="packages-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Wedding Packages
          </h1>

          <p>
            Explore and manage wedding service
            packages for your special day.
          </p>

        </div>


        <button
          className="packages-primary-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >

          <FaPlus />

          Add Package

        </button>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="packages-toolbar">

        <div className="packages-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="packages-filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="">
            All Categories
          </option>

          <option value="Venue">
            Venue
          </option>

          <option value="Catering">
            Catering
          </option>

          <option value="Decoration">
            Decoration
          </option>

          <option value="Photography">
            Photography
          </option>

          <option value="Beauty">
            Beauty
          </option>

          <option value="Other">
            Other
          </option>

        </select>

      </div>


      {/* =========================
          PACKAGES
      ========================= */}

      {loading ? (

        <section className="packages-empty-card">

          <h2>
            Loading packages...
          </h2>

        </section>

      ) : filteredPackages.length === 0 ? (

        <section className="packages-empty-card">

          <div className="packages-empty-icon">

            <FaBoxOpen />

          </div>


          <h2>
            No packages available
          </h2>


          <p>
            Wedding packages will appear here
            once they are added. Create a package
            to organize services and pricing together.
          </p>


          <button
            className="packages-empty-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >

            <FaPlus />

            Add Your First Package

          </button>

        </section>

      ) : (

        <section className="packages-grid">

          {filteredPackages.map((pkg) => (

            <div
              className="package-card"
              key={pkg.id}
            >

              <div className="package-card-top">

                <div className="package-card-icon">

                  <FaBoxOpen />

                </div>


                <span
                  className={
                    pkg.is_active
                      ? "package-status active"
                      : "package-status inactive"
                  }
                >

                  {pkg.is_active
                    ? "Active"
                    : "Inactive"}

                </span>

              </div>


              <h2>
                {pkg.package_name}
              </h2>


              {pkg.business_name && (

                <p className="package-vendor">

                  {pkg.business_name}

                </p>

              )}


              <p className="package-description">

                {pkg.description ||
                  "No description provided."}

              </p>


              <div className="package-price">

                Rs. {Number(pkg.price || 0).toLocaleString()}

              </div>


              <div className="package-details">

                {pkg.duration_hours && (

                  <span>

                    {pkg.duration_hours} hours

                  </span>

                )}


                {pkg.max_guests && (

                  <span>

                    Up to {pkg.max_guests} guests

                  </span>

                )}

              </div>


              <div className="package-card-actions">

                <button
                  className="package-edit-btn"
                  title="Edit package"
                >

                  <FaEdit />

                  Edit

                </button>


                <button
                  className="package-delete-btn"
                  title="Delete package"
                  onClick={() =>
                    handleDelete(pkg.id)
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


      {/* =========================
          ADD PACKAGE MODAL
      ========================= */}

      {showForm && (

        <div className="packages-modal-overlay">

          <div className="packages-modal">

            <div className="packages-modal-header">

              <div>

                <span>
                  PACKAGE MANAGEMENT
                </span>

                <h2>
                  Add Wedding Package
                </h2>

              </div>


              <button
                className="packages-close-btn"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >

                <FaTimes />

              </button>

            </div>


            <form
              onSubmit={handleSubmit}
            >

              {/* VENDOR ID */}

              <div className="packages-form-group">

                <label>
                  Vendor ID
                </label>

                <input
                  type="number"
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  placeholder="Enter vendor ID"
                  required
                />

              </div>


              {/* PACKAGE NAME */}

              <div className="packages-form-group">

                <label>
                  Package Name
                </label>

                <input
                  type="text"
                  name="package_name"
                  value={formData.package_name}
                  onChange={handleChange}
                  placeholder="e.g. Complete Wedding Package"
                  required
                />

              </div>


              {/* PRICE + DURATION */}

              <div className="packages-form-row">

                <div className="packages-form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>


                <div className="packages-form-group">

                  <label>
                    Duration (Hours)
                  </label>

                  <input
                    type="number"
                    name="duration_hours"
                    value={formData.duration_hours}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    min="0"
                    step="0.5"
                  />

                </div>

              </div>


              {/* MAX GUESTS */}

              <div className="packages-form-group">

                <label>
                  Maximum Guests
                </label>

                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  min="0"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="packages-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this package includes..."
                  rows="4"
                />

              </div>


              {/* ACTIVE */}

              <div className="packages-form-group">

                <label>
                  Status
                </label>

                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleChange}
                >

                  <option value={1}>
                    Active
                  </option>

                  <option value={0}>
                    Inactive
                  </option>

                </select>

              </div>


              {/* HINT */}

              <div className="packages-form-hint">

                <FaCheck />

                <span>
                  Package information will be saved
                  to your wedding management system.
                </span>

              </div>


              {/* ACTIONS */}

              <div className="packages-form-actions">

                <button
                  type="button"
                  className="packages-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="packages-save-btn"
                  disabled={saving}
                >

                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Package"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default Packages;