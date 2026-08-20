
import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Reviews.css";

function Reviews() {
  // =========================
  // STATES
  // =========================

  const [reviews, setReviews] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const [formData, setFormData] = useState({
    vendor_id: "",
    booking_id: "",
    rating: "",
    review_text: "",
  });

  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  // =========================
  // FETCH REVIEWS
  // =========================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/reviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reviews."
        );
      }

      setReviews(data.data || []);
    } catch (error) {
      console.error("Fetch Reviews Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load reviews",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH VENDORS
  // =========================

  const fetchVendors = async () => {
    try {
      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/vendors",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch vendors."
        );
      }

      setVendors(data.data || []);
    } catch (error) {
      console.error("Fetch Vendors Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load vendors",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    if (token) {
      fetchReviews();
      fetchVendors();
    }
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
  // OPEN FORM
  // =========================

  const openForm = () => {
    setFormData({
      vendor_id: "",
      booking_id: "",
      rating: "",
      review_text: "",
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

    setFormData({
      vendor_id: "",
      booking_id: "",
      rating: "",
      review_text: "",
    });
  };

  // =========================
  // ADD REVIEW
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        vendor_id: Number(formData.vendor_id),
        booking_id: Number(formData.booking_id),
        rating: Number(formData.rating),
        review_text: formData.review_text,
      };

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/reviews",
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
          data.message || "Failed to create review."
        );
      }

      await fetchReviews();

      closeForm();

      Swal.fire({
        icon: "success",
        title: "Review Added",
        text: "Your review was added successfully.",
        confirmButtonColor: "#b35b6c",
      });
    } catch (error) {
      console.error("Add Review Error:", error);

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
  // DELETE REVIEW
  // =========================

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Review?",
      text: "This review will be permanently removed.",
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
        `https://weddingbloom-production-b2a2.up.railway.app/api/reviews/${id}`,
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
          data.message || "Failed to delete review."
        );
      }

      setReviews((previous) =>
        previous.filter((review) => review.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Review deleted successfully.",
        confirmButtonColor: "#b35b6c",
      });
    } catch (error) {
      console.error("Delete Review Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // FILTER REVIEWS
  // =========================

  const filteredReviews = reviews.filter((review) => {
    const searchText = search.toLowerCase();

    const vendor = vendors.find(
      (item) => item.id === review.vendor_id
    );

    const vendorName =
      vendor?.business_name?.toLowerCase() || "";

    const reviewText =
      review.review_text?.toLowerCase() || "";

    const matchesSearch =
      vendorName.includes(searchText) ||
      reviewText.includes(searchText);

    const matchesRating =
      selectedRating === "" ||
      Number(review.rating) === Number(selectedRating);

    return matchesSearch && matchesRating;
  });

  // =========================
  // GET VENDOR NAME
  // =========================

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(
      (item) => item.id === vendorId
    );

    return vendor
      ? vendor.business_name
      : `Vendor #${vendorId}`;
  };

  // =========================
  // STAR DISPLAY
  // =========================

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={
              star <= Number(rating)
                ? "review-star-filled"
                : "review-star-empty"
            }
          />
        ))}
      </div>
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="reviews-page">

      {/* HEADER */}

      <div className="reviews-header">

        <div>
          <span className="reviews-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Reviews</h1>

          <p>
            Share and manage your experiences with wedding
            vendors and services.
          </p>
        </div>

        <button
          className="reviews-primary-btn"
          onClick={openForm}
        >
          <FaPlus />
          Add Review
        </button>

      </div>


      {/* TOOLBAR */}

      <div className="reviews-toolbar">

        <div className="reviews-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="reviews-filter"
          value={selectedRating}
          onChange={(e) =>
            setSelectedRating(e.target.value)
          }
        >

          <option value="">
            All Ratings
          </option>

          <option value="5">
            5 Stars
          </option>

          <option value="4">
            4 Stars
          </option>

          <option value="3">
            3 Stars
          </option>

          <option value="2">
            2 Stars
          </option>

          <option value="1">
            1 Star
          </option>

        </select>

      </div>


      {/* LOADING */}

      {loading ? (

        <section className="reviews-empty-card">

          <FaSpinner className="vendors-spinner" />

          <h2>
            Loading reviews...
          </h2>

          <p>
            Fetching your reviews from the database.
          </p>

        </section>

      ) : filteredReviews.length === 0 ? (

        /* EMPTY STATE */

        <section className="reviews-empty-card">

          <div className="reviews-empty-icon">
            <FaStar />
          </div>

          <h2>
            No reviews available
          </h2>

          <p>
            {reviews.length === 0
              ? "Your vendor reviews will appear here once you add your first review."
              : "No reviews match your current search or rating filter."}
          </p>

          {reviews.length === 0 && (
            <button
              className="reviews-empty-btn"
              onClick={openForm}
            >
              <FaPlus />
              Write Your First Review
            </button>
          )}

        </section>

      ) : (

        /* REVIEWS */

        <section className="reviews-grid">

          {filteredReviews.map((review) => (

            <div
              className="review-card"
              key={review.id}
            >

              <div className="review-card-header">

                <div>

                  <h2>
                    {getVendorName(
                      review.vendor_id
                    )}
                  </h2>

                  {renderStars(
                    review.rating
                  )}

                </div>

                <button
                  className="review-delete-btn"
                  onClick={() =>
                    deleteReview(review.id)
                  }
                  title="Delete review"
                >
                  <FaTrash />
                </button>

              </div>


              <p className="review-text">
                {review.review_text}
              </p>


              <div className="review-booking">

                Booking #{review.booking_id}

              </div>

            </div>

          ))}

        </section>

      )}


      {/* ADD REVIEW MODAL */}

      {showForm && (

        <div className="reviews-modal-overlay">

          <div className="reviews-modal">

            <div className="reviews-modal-header">

              <div>

                <span>
                  REVIEW MANAGEMENT
                </span>

                <h2>
                  Add Review
                </h2>

              </div>


              <button
                className="reviews-close-btn"
                onClick={closeForm}
              >
                <FaTimes />
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              {/* VENDOR */}

              <div className="reviews-form-group">

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
                      {vendor.business_name}
                    </option>

                  ))}

                </select>

              </div>


              {/* BOOKING ID */}

              <div className="reviews-form-group">

                <label>
                  Booking ID
                </label>

                <input
                  type="number"
                  name="booking_id"
                  value={formData.booking_id}
                  onChange={handleChange}
                  placeholder="Enter booking ID"
                  min="1"
                  required
                />

              </div>


              {/* RATING */}

              <div className="reviews-form-group">

                <label>
                  Rating
                </label>

                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select rating
                  </option>

                  <option value="5">
                    5 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="1">
                    1 Star
                  </option>

                </select>

              </div>


              {/* REVIEW */}

              <div className="reviews-form-group">

                <label>
                  Your Review
                </label>

                <textarea
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  placeholder="Write about your experience..."
                  rows="5"
                  required
                />

              </div>


              {/* ACTIONS */}

              <div className="reviews-form-actions">

                <button
                  type="button"
                  className="reviews-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="reviews-save-btn"
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
                      Save Review
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

export default Reviews;
