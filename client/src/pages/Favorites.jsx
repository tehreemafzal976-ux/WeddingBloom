import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaSearch,
  FaTrash,
  FaStore,
  FaSpinner,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Favorites.css";

const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

function Favorites() {
  const [search, setSearch] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // HEADERS
  // =========================

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // FETCH FAVORITES
  // =========================

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/favorites`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch favorites."
        );
      }

      setFavorites(data.data || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Favorites",
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
      const response = await fetch(`${API_URL}/vendors`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch vendors."
        );
      }

      setVendors(data.data || []);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Vendors",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchFavorites();
    fetchVendors();
  }, []);

  // =========================
  // GET VENDOR DETAILS
  // =========================

  const getVendor = (vendorId) => {
    return vendors.find(
      (vendor) =>
        Number(vendor.id) === Number(vendorId)
    );
  };

  // =========================
  // REMOVE FAVORITE
  // =========================

  const handleRemove = async (vendorId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove Favorite?",
      text: "This vendor will be removed from your favorites.",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b35b6c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/favorites/${vendorId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove favorite."
        );
      }

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Vendor removed from favorites.",
        confirmButtonColor: "#b35b6c",
      });

      // Refresh favorites
      fetchFavorites();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Remove Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredFavorites = favorites.filter((favorite) => {
    const vendor = getVendor(favorite.vendor_id);

    if (!vendor) {
      return false;
    }

    const searchText = search.toLowerCase();

    const vendorName =
      vendor.business_name ||
      vendor.name ||
      vendor.vendor_name ||
      "";

    const category =
      vendor.category ||
      vendor.vendor_category ||
      "";

    return (
      vendorName.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // RENDER
  // =========================

  return (
    <div className="favorites-page">

      {/* HEADER */}

      <div className="favorites-header">

        <div>
          <span className="favorites-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Favorites</h1>

          <p>
            Keep track of the vendors and services you
            love for your wedding.
          </p>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="favorites-toolbar">

        <div className="favorites-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search favorite vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>


      {/* LOADING */}

      {loading ? (

        <section className="favorites-empty-card">

          <div className="favorites-empty-icon">
            <FaSpinner className="favorites-spinner" />
          </div>

          <h2>Loading Favorites...</h2>

          <p>
            Please wait while your favorite vendors
            are being loaded.
          </p>

        </section>

      ) : filteredFavorites.length === 0 ? (

        /* EMPTY STATE */

        <section className="favorites-empty-card">

          <div className="favorites-empty-icon">
            <FaHeart />
          </div>

          <h2>
            {favorites.length === 0
              ? "No favorite vendors yet"
              : "No matching favorites"}
          </h2>

          <p>
            {favorites.length === 0
              ? "Vendors and services that you save as favorites will appear here for quick access."
              : "Try searching for a different vendor or category."}
          </p>

          <div className="favorites-empty-hint">
            <FaStore />
            Explore vendors and add your favorites.
          </div>

        </section>

      ) : (

        /* FAVORITES LIST */

        <section className="favorites-list">

          {filteredFavorites.map((favorite) => {

            const vendor = getVendor(
              favorite.vendor_id
            );

            if (!vendor) {
              return null;
            }

            const vendorName =
              vendor.business_name ||
              vendor.name ||
              vendor.vendor_name ||
              `Vendor #${vendor.id}`;

            const category =
              vendor.category ||
              vendor.vendor_category ||
              "Wedding Vendor";

            return (

              <div
                className="favorite-card"
                key={favorite.id}
              >

                {/* ICON */}

                <div className="favorite-card-icon">
                  <FaStore />
                </div>


                {/* DETAILS */}

                <div className="favorite-card-details">

                  <span className="favorite-card-label">
                    FAVORITE VENDOR
                  </span>

                  <h2>
                    {vendorName}
                  </h2>

                  <p>
                    {category}
                  </p>

                </div>


                {/* REMOVE */}

                <button
                  className="favorite-remove-btn"
                  onClick={() =>
                    handleRemove(
                      favorite.vendor_id
                    )
                  }
                >
                  <FaTrash />
                  Remove
                </button>

              </div>

            );
          })}

        </section>

      )}

    </div>
  );
}

export default Favorites;