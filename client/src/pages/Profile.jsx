import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import Swal from "sweetalert2";

import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please login again.",
        });

        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile.");
      }

      const userProfile = {
        full_name: data.data.full_name || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
        bio: data.data.bio || "",
      };

      setProfile(userProfile);
      setFormData(userProfile);

    } catch (error) {
      console.log("Profile fetch error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Load Profile",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };


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
  // EDIT
  // =========================

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };


  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };


  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "Please login again.",
        });

        return;
      }

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      // Update frontend state
      setProfile(formData);
      setFormData(formData);
      setIsEditing(false);

      // Update localStorage user if it exists
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
          })
        );
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#b35b6c",
      });

    } catch (error) {
      console.log("Profile update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });

    } finally {
      setSaving(false);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="profile-page">

        <div className="profile-loading">
          <div className="profile-loader"></div>

          <p>Loading your profile...</p>
        </div>

      </div>
    );
  }


  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>

          <span className="profile-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account
            details.
          </p>

        </div>

        {!isEditing && (
          <button
            className="profile-edit-btn"
            onClick={handleEdit}
          >
            <FaEdit />
            Edit Profile
          </button>
        )}

      </div>


      {/* PROFILE CARD */}

      <section className="profile-card">

        {/* PROFILE TOP */}

        <div className="profile-card-top">

          <div className="profile-avatar">

            <FaUser />

          </div>


          <div className="profile-card-info">

            <span className="profile-card-label">
              ACCOUNT PROFILE
            </span>

            <h2>
              {profile.full_name || "Your Name"}
            </h2>

            <p>
              {profile.email || "Your email address"}
            </p>

          </div>

        </div>


        {/* FORM */}

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <div className="profile-form-grid">

            {/* FULL NAME */}

            <div className="profile-field">

              <label>Full Name</label>

              <div className="profile-input-wrapper">

                <FaUser />

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>Email Address</label>

              <div className="profile-input-wrapper">

                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={!isEditing}
                  required
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>Phone Number</label>

              <div className="profile-input-wrapper">

                <FaPhone />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                />

              </div>

            </div>

          </div>


          {/* BIO */}

          <div className="profile-field profile-bio-field">

            <label>About You</label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              rows="5"
              disabled={!isEditing}
            />

          </div>


          {/* ACTIONS */}

          {isEditing && (
            <div className="profile-actions">

              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </form>

      </section>

    </div>
  );
}

export default Profile;