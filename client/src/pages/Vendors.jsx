import React, { useEffect, useState } from "react";

import {
  FaStore,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaHeart,
  FaSpinner,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Vendors.css";

function Vendors() {

  // =========================
  // STATES
  // =========================

  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingVendor, setEditingVendor] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [saving, setSaving] = useState(false);


  const [formData, setFormData] = useState({
    business_name: "",
    category_id: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    experience_years: "",
    description: "",
  });


  // =========================
  // TOKEN
  // =========================

  const token = localStorage.getItem("token");

  const [favoriteVendors, setFavoriteVendors] = useState([]);


  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    {
      id: 1,
      name: "Photography",
    },
    {
      id: 2,
      name: "Videography",
    },
    {
      id: 3,
      name: "Catering",
    },
    {
      id: 4,
      name: "Decoration",
    },
    {
      id: 5,
      name: "Makeup",
    },
    {
      id: 6,
      name: "Mehndi",
    },
    {
      id: 7,
      name: "Venue",
    },
    {
      id: 8,
      name: "DJ & Music",
    },
    {
      id: 9,
      name: "Florist",
    },
    {
      id: 10,
      name: "Wedding Dresses",
    },
  ];


  // =========================
  // FETCH VENDORS
  // =========================

 const fetchVendors = async () => {
  try {
    setLoading(true);

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

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

    console.log("Vendors API Response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch vendors."
      );
    }

    const vendorList = data.data || [];

    const vendorsWithCategories = await Promise.all(
      vendorList.map(async (vendor) => {
        try {
          const categoryResponse = await fetch(
            `https://weddingbloom-production-b2a2.up.railway.app/api/vendor-categories/${vendor.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const categoryData = await categoryResponse.json();

          return {
            ...vendor,
            categories: categoryData.data || [],
          };
        } catch (error) {
          console.error(
            `Category fetch error for vendor ${vendor.id}:`,
            error
          );

          return {
            ...vendor,
            categories: [],
          };
        }
      })
    );

    console.log(
      "Final Vendors:",
      vendorsWithCategories
    );

    setVendors(vendorsWithCategories);

  } catch (error) {
    console.error("Fetch Vendors Error:", error);

    Swal.fire({
      icon: "error",
      title: "Unable to load vendors",
      text: error.message,
      confirmButtonColor: "#b76e79",
    });

  } finally {
    setLoading(false);
  }
};

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchVendors();

  }, []);


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {

    setEditingVendor(null);

    setFormData({
      business_name: "",
      category_id: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      experience_years: "",
      description: "",
    });

    setShowForm(true);

  };


  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (vendor) => {

    setEditingVendor(vendor);


    const firstCategory =
      vendor.categories?.length > 0
        ? vendor.categories[0].id
        : "";


    setFormData({
      business_name:
        vendor.business_name || "",

      category_id:
        firstCategory,

      phone:
        vendor.phone || "",

      email:
        vendor.email || "",

      address:
        vendor.address || "",

      city:
        vendor.city || "",

      experience_years:
        vendor.experience_years || "",

      description:
        vendor.description || "",
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

    setEditingVendor(null);

  };


  // =========================
  // ADD CATEGORY TO VENDOR
  // =========================

  const addCategory = async (
    vendorId,
    categoryId
  ) => {

    if (!categoryId) {
      return;
    }


    try {

      const response = await fetch(
        `https://weddingbloom-production-b2a2.up.railway.app/api/vendor-categories/${vendorId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            category_id:
              Number(categoryId),
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add category."
        );

      }

    } catch (error) {

      console.error(
        "Add Category Error:",
        error
      );

    }

  };

  const handleFavorite = async (vendorId) => {
  try {
    const response = await fetch(
      "https://weddingbloom-production-b2a2.up.railway.app/api/favorites",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendor_id: vendorId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to add favorite."
      );
    }

    Swal.fire({
      icon: "success",
      title: "Added to Favorites",
      text: "Vendor added to your favorites.",
      confirmButtonColor: "#b35b6c",
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Unable to Add Favorite",
      text: error.message,
      confirmButtonColor: "#b35b6c",
    });
  }
};


  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setSaving(true);


      const payload = {

        business_name:
          formData.business_name,

        description:
          formData.description,

        phone:
          formData.phone,

        email:
          formData.email,

        address:
          formData.address,

        city:
          formData.city,

        experience_years:
          formData.experience_years
            ? Number(
                formData.experience_years
              )
            : 0,

        profile_image: null,
      };


      // =========================
      // EDIT VENDOR
      // =========================

      if (editingVendor) {

        const response =
          await fetch(
            `https://weddingbloom-production-b2a2.up.railway.app/api/vendors/${editingVendor.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(payload),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to update vendor."
          );

        }


        await fetchVendors();


        setShowForm(false);

        setEditingVendor(null);


        Swal.fire({
          icon: "success",
          title: "Vendor Updated",
          text: "Vendor information updated successfully.",
          confirmButtonColor: "#b35b6c",
        });


      }

      // =========================
      // CREATE VENDOR
      // =========================

      else {

        const response =
          await fetch(
           "https://weddingbloom-production-b2a2.up.railway.app/api/vendors",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(payload),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to create vendor."
          );

        }


        const newVendorId =
          data.data?.id;


        // Attach category
        if (
          newVendorId &&
          formData.category_id
        ) {

          await addCategory(
            newVendorId,
            formData.category_id
          );

        }


        await fetchVendors();


        setShowForm(false);


        Swal.fire({
          icon: "success",
          title: "Vendor Added",
          text: "Vendor added successfully.",
          confirmButtonColor: "#b35b6c",
        });

      }


      setFormData({
        business_name: "",
        category_id: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        experience_years: "",
        description: "",
      });

    } catch (error) {

      console.error(
        "Vendor Submit Error:",
        error
      );


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
  // DELETE VENDOR
  // =========================

  const deleteVendor = async (id) => {

    const result =
      await Swal.fire({

        icon: "warning",

        title: "Delete Vendor?",

        text:
          "This vendor will be permanently removed.",

        showCancelButton: true,

        confirmButtonColor: "#b35b6c",

        cancelButtonColor: "#777",

        confirmButtonText:
          "Yes, delete it",

      });


    if (!result.isConfirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `https://weddingbloom-production-b2a2.up.railway.app/api/vendors/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete vendor."
        );

      }


      setVendors(
        (previous) =>
          previous.filter(
            (vendor) =>
              vendor.id !== id
          )
      );


      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Vendor deleted successfully.",
        confirmButtonColor: "#b35b6c",
      });

    } catch (error) {

      console.error(
        "Delete Vendor Error:",
        error
      );


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

  const filteredVendors =
    vendors.filter((vendor) => {

      const searchText =
        search.toLowerCase();


      const matchesSearch =
        vendor.business_name
          ?.toLowerCase()
          .includes(searchText) ||

        vendor.city
          ?.toLowerCase()
          .includes(searchText);


      const matchesCategory =
        selectedCategory === "" ||

        vendor.categories?.some(
          (category) =>
            category.id ===
            Number(selectedCategory)
        );


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  // =========================
  // RENDER
  // =========================

  return (

    <div className="vendors-page">


      {/* =========================
          HEADER
      ========================= */}

      <div className="vendors-header">

        <div>

          <span className="vendors-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Wedding Vendors
          </h1>

          <p>
            Manage the professionals helping
            you create your perfect wedding day.
          </p>

        </div>


        <button
          className="vendors-primary-btn"
          onClick={openAddForm}
        >

          <FaPlus />

          Add Vendor

        </button>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="vendors-toolbar">

        <div className="vendors-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="vendors-filter"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
        >

          <option value="">
            All Categories
          </option>

          {categories.map(
            (category) => (

              <option
                key={category.id}
                value={category.id}
              >

                {category.name}

              </option>

            )
          )}

        </select>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <section className="vendors-empty-card">

          <FaSpinner className="vendors-spinner" />

          <h2>
            Loading vendors...
          </h2>

          <p>
            Fetching your vendors from the database.
          </p>

        </section>

      ) : filteredVendors.length === 0 ? (

        /* =========================
           EMPTY
        ========================= */

        <section className="vendors-empty-card">

          <div className="vendors-empty-icon">

            <FaStore />

          </div>


          <h2>
            No vendors found
          </h2>


          <p>

            {vendors.length === 0
              ? "Your saved wedding vendors will appear here. Add vendors to keep all their contact details organized in one place."
              : "No vendors match your current search or category filter."}

          </p>


          {vendors.length === 0 && (

            <button
              className="vendors-empty-btn"
              onClick={openAddForm}
            >

              <FaPlus />

              Add Your First Vendor

            </button>

          )}

        </section>

      ) : (

        /* =========================
           VENDOR CARDS
        ========================= */

        <section className="vendors-grid">

          {filteredVendors.map(
            (vendor) => (

              <div
                className="vendor-card"
                key={vendor.id}
              >

                <div className="vendor-card-top">

                  <div className="vendor-icon">

                    <FaStore />

                  </div>


                  <div className="vendor-actions">

                     <button
    onClick={() => handleFavorite(vendor.id)}
    title="Add to favorites"
  >
    <FaHeart />
  </button>

                    <button
                      onClick={() =>
                        openEditForm(vendor)
                      }
                      title="Edit vendor"
                    >

                      <FaEdit />

                    </button>


                    <button
                      onClick={() =>
                        deleteVendor(
                          vendor.id
                        )
                      }
                      title="Delete vendor"
                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>


                <h2>
                  {vendor.business_name}
                </h2>


                <div className="vendor-categories">

                  {vendor.categories?.map(
                    (category) => (

                      <span
                        key={category.id}
                      >

                        {category.category_name}

                      </span>

                    )
                  )}

                </div>


                {vendor.description && (

                  <p className="vendor-description">

                    {vendor.description}

                  </p>

                )}


                <div className="vendor-details">

                  {vendor.phone && (

                    <div>

                      <FaPhone />

                      <span>
                        {vendor.phone}
                      </span>

                    </div>

                  )}


                  {vendor.email && (

                    <div>

                      <FaEnvelope />

                      <span>
                        {vendor.email}
                      </span>

                    </div>

                  )}


                  {(vendor.address ||
                    vendor.city) && (

                    <div>

                      <FaMapMarkerAlt />

                      <span>

                        {vendor.address}

                        {vendor.address &&
                        vendor.city
                          ? ", "
                          : ""}

                        {vendor.city}

                      </span>

                    </div>

                  )}

                </div>


                {vendor.experience_years !==
                  null &&
                  vendor.experience_years !==
                    undefined && (

                    <div className="vendor-experience">

                      {vendor.experience_years}
                      {" "}
                      years experience

                    </div>

                  )}

              </div>

            )
          )}

        </section>

      )}


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (

        <div className="vendors-modal-overlay">

          <div className="vendors-modal">

            <div className="vendors-modal-header">

              <div>

                <span>
                  VENDOR MANAGEMENT
                </span>

                <h2>

                  {editingVendor
                    ? "Edit Wedding Vendor"
                    : "Add Wedding Vendor"}

                </h2>

              </div>


              <button
                className="vendors-close-btn"
                onClick={closeForm}
              >

                <FaTimes />

              </button>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* BUSINESS NAME */}

              <div className="vendors-form-group">

                <label>
                  Vendor / Business Name
                </label>

                <input
                  type="text"
                  name="business_name"
                  value={
                    formData.business_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Elegant Events"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="vendors-form-group">

                <label>
                  Category
                </label>

                <select
                  name="category_id"
                  value={
                    formData.category_id
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >

                        {category.name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* PHONE + EMAIL */}

              <div className="vendors-form-row">

                <div className="vendors-form-group">

                  <label>

                    <FaPhone />

                    Phone

                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Phone number"
                  />

                </div>


                <div className="vendors-form-group">

                  <label>

                    <FaEnvelope />

                    Email

                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Email address"
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="vendors-form-group">

                <label>

                  <FaMapMarkerAlt />

                  Address

                </label>

                <input
                  type="text"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Vendor address"
                />

              </div>


              {/* CITY */}

              <div className="vendors-form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Lahore"
                />

              </div>


              {/* EXPERIENCE */}

              <div className="vendors-form-group">

                <label>
                  Experience (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  name="experience_years"
                  value={
                    formData.experience_years
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. 5"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="vendors-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Add vendor details..."
                  rows="4"
                />

              </div>


              {/* ACTIONS */}

              <div className="vendors-form-actions">

                <button
                  type="button"
                  className="vendors-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="vendors-save-btn"
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

                      {editingVendor
                        ? "Update Vendor"
                        : "Save Vendor"}
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

export default Vendors;