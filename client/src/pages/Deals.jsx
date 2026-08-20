import React, { useEffect, useState } from "react";
import {
  FaTags,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaPercent,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Deals.css";

function Deals() {

  const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

  const [showForm, setShowForm] = useState(false);

  const [deals, setDeals] = useState([]);

  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingDeal, setEditingDeal] = useState(null);

  const [formData, setFormData] = useState({
    package_id: "",
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });


  // =========================
  // GET DEALS
  // =========================

  const fetchDeals = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/deals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setDeals(data.data);
      }

    } catch (error) {

      console.error("Fetch Deals Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to fetch deals.",
      });

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // GET PACKAGES
  // =========================

  const fetchPackages = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPackages(data.data);
      }

    } catch (error) {

      console.error("Fetch Packages Error:", error);

    }
  };


  useEffect(() => {

    fetchDeals();
    fetchPackages();

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
      package_id: "",
      title: "",
      description: "",
      discount_percentage: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });

    setEditingDeal(null);

  };


  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {

    resetForm();

    setShowForm(true);

  };


  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (deal) => {

    setEditingDeal(deal);

    setFormData({
      package_id: deal.package_id || "",
      title: deal.title || "",
      description: deal.description || "",
      discount_percentage: deal.discount_percentage || "",
      start_date: deal.start_date
        ? deal.start_date.substring(0, 10)
        : "",
      end_date: deal.end_date
        ? deal.end_date.substring(0, 10)
        : "",
      is_active: deal.is_active === 1 || deal.is_active === true,
    });

    setShowForm(true);

  };


  // =========================
  // CREATE / UPDATE DEAL
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.package_id) {

      Swal.fire({
        icon: "warning",
        title: "Package Required",
        text: "Please select a package.",
      });

      return;

    }


    try {

      const token = localStorage.getItem("token");

      const url = editingDeal
        ? `${API_URL}/deals/${editingDeal.id}`
        : `${API_URL}/deals`;

      const method = editingDeal ? "PUT" : "POST";


      const response = await fetch(url, {

        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          package_id: Number(formData.package_id),
          title: formData.title,
          description: formData.description,
          discount_percentage: Number(
            formData.discount_percentage
          ),
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_active: formData.is_active,
        }),

      });


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message || "Failed to save deal."
        );

      }


      await Swal.fire({
        icon: "success",
        title: editingDeal
          ? "Deal Updated!"
          : "Deal Created!",
        text: editingDeal
          ? "Deal has been updated successfully."
          : "Deal has been created successfully.",
        confirmButtonColor: "#b35b6c",
      });


      setShowForm(false);

      resetForm();

      fetchDeals();


    } catch (error) {

      console.error("Save Deal Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save deal.",
      });

    }

  };


  // =========================
  // DELETE DEAL
  // =========================

  const handleDelete = async (id) => {

    const result = await Swal.fire({

      icon: "warning",

      title: "Delete Deal?",

      text: "This deal will be permanently deleted.",

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#b35b6c",

    });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/deals/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message || "Failed to delete deal."
        );

      }


      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Deal deleted successfully.",
        confirmButtonColor: "#b35b6c",
      });


      fetchDeals();


    } catch (error) {

      console.error("Delete Deal Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete deal.",
      });

    }

  };


  // =========================
  // SEARCH
  // =========================

  const filteredDeals = deals.filter((deal) => {

    const search = searchTerm.toLowerCase();

    return (
      deal.title?.toLowerCase().includes(search) ||
      deal.description?.toLowerCase().includes(search)
    );

  });


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();

  };


  return (

    <div className="deals-page">


      {/* =========================
          HEADER
      ========================= */}

      <div className="deals-header">

        <div>

          <span className="deals-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Wedding Deals
          </h1>

          <p>
            Discover and manage special offers for your
            wedding services.
          </p>

        </div>


        <button
          className="deals-primary-btn"
          onClick={openAddForm}
        >

          <FaPlus />

          Add Deal

        </button>

      </div>



      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="deals-toolbar">

        <div className="deals-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

      </div>



      {/* =========================
          DEALS LIST
      ========================= */}

      {loading ? (

        <section className="deals-empty-card">

          <h2>
            Loading deals...
          </h2>

        </section>

      ) : filteredDeals.length === 0 ? (

        <section className="deals-empty-card">

          <div className="deals-empty-icon">

            <FaTags />

          </div>

          <h2>
            No deals available
          </h2>

          <p>
            Special offers and discounts from your
            wedding vendors will appear here once
            they are added.
          </p>

          <button
            className="deals-empty-btn"
            onClick={openAddForm}
          >

            <FaPlus />

            Add Your First Deal

          </button>

        </section>

      ) : (

        <div className="deals-grid">

          {filteredDeals.map((deal) => (

            <div
              className="deal-card"
              key={deal.id}
            >


              {/* DISCOUNT */}

              <div className="deal-discount">

                <FaPercent />

                {deal.discount_percentage}%

              </div>


              {/* TITLE */}

              <h2>
                {deal.title}
              </h2>


              {/* PACKAGE */}

              <p className="deal-package">

                Package:{" "}

                <strong>
                  {deal.package_name ||
                    `Package #${deal.package_id}`}
                </strong>

              </p>


              {/* DESCRIPTION */}

              {deal.description && (

                <p className="deal-description">
                  {deal.description}
                </p>

              )}


              {/* DATES */}

              <div className="deal-dates">

                <div>

                  <FaCalendarAlt />

                  <span>
                    {formatDate(deal.start_date)}
                  </span>

                </div>

                <span>→</span>

                <div>

                  <FaCalendarAlt />

                  <span>
                    {formatDate(deal.end_date)}
                  </span>

                </div>

              </div>


              {/* STATUS */}

              <div className="deal-status">

                {deal.is_active
                  ? "Active"
                  : "Inactive"}

              </div>


              {/* ACTIONS */}

              <div className="deal-actions">

                <button
                  onClick={() =>
                    handleEdit(deal)
                  }
                >

                  <FaEdit />

                  Edit

                </button>


                <button
                  onClick={() =>
                    handleDelete(deal.id)
                  }
                >

                  <FaTrash />

                  Delete

                </button>

              </div>

            </div>

          ))}

        </div>

      )}



      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (

        <div className="deals-modal-overlay">

          <div className="deals-modal">


            {/* HEADER */}

            <div className="deals-modal-header">

              <div>

                <span>
                  DEAL MANAGEMENT
                </span>

                <h2>
                  {editingDeal
                    ? "Edit Wedding Deal"
                    : "Add Wedding Deal"}
                </h2>

              </div>


              <button
                className="deals-close-btn"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >

                <FaTimes />

              </button>

            </div>



            <form onSubmit={handleSubmit}>


              {/* PACKAGE */}

              <div className="deals-form-group">

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


                  {packages.map((pkg) => (

                    <option
                      key={pkg.id}
                      value={pkg.id}
                    >

                      {pkg.package_name}

                    </option>

                  ))}

                </select>

              </div>



              {/* TITLE */}

              <div className="deals-form-group">

                <label>
                  Deal Title
                </label>


                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Summer Wedding Discount"
                  required
                />

              </div>



              {/* DISCOUNT */}

              <div className="deals-form-group">

                <label>

                  <FaPercent />

                  Discount Percentage

                </label>


                <input
                  type="number"
                  name="discount_percentage"
                  value={
                    formData.discount_percentage
                  }
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />

              </div>



              {/* DATES */}

              <div className="deals-form-row">


                <div className="deals-form-group">

                  <label>
                    Start Date
                  </label>


                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />

                </div>



                <div className="deals-form-group">

                  <label>
                    End Date
                  </label>


                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>



              {/* DESCRIPTION */}

              <div className="deals-form-group">

                <label>
                  Description
                </label>


                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the deal..."
                  rows="4"
                />

              </div>



              {/* ACTIVE */}

              <div className="deals-active-row">

                <label>

                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        is_active:
                          e.target.checked,
                      }))
                    }
                  />

                  <span>
                    Deal is active
                  </span>

                </label>

              </div>



              {/* ACTIONS */}

              <div className="deals-form-actions">

                <button
                  type="button"
                  className="deals-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="deals-save-btn"
                >

                  <FaSave />

                  {editingDeal
                    ? "Update Deal"
                    : "Save Deal"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );
}

export default Deals;