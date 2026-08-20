
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaPhone,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    role: "couple",

    full_name: "",
    email: "",
    phone: "",

    business_name: "",
    category_id: "",
    address: "",
    city: "",
    experience_years: "",
    description: "",

    password: "",
    confirm_password: "",
  });

  // =========================
  // HANDLE CHANGE
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
  // SELECT ROLE
  // =========================

  const selectRole = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setError("");
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      formData.role === "vendor" &&
      !formData.business_name.trim()
    ) {
      setError("Business name is required for vendor accounts.");
      return;
    }

    if (
      formData.role === "vendor" &&
      !formData.category_id
    ) {
      setError("Please select a vendor category.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        business_name: formData.business_name,
        category_id: formData.category_id,
        address: formData.address,
        city: formData.city,
        experience_years: formData.experience_years ? Number(formData.experience_years) : 0,
        description: formData.description,
      };

      const primaryUrl = (import.meta.env.VITE_API_URL || "https://weddingbloom-production-b2a2.up.railway.app/api") + "/auth/register";
      const fallbackUrl = "https://weddingbloom-production-b2a2.up.railway.app/api/auth/register";

      let response;
      try {
        response = await fetch(primaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e1) {
        response = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      if (formData.role === "vendor") {
        alert("Vendor account created successfully!");
      } else {
        alert("Couple account created successfully!");
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* =========================
            BRAND PANEL
        ========================= */}

        <div className="register-brand-panel">

          <div className="register-brand-logo">
            ✦
          </div>

          <span className="register-brand-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Create your
            <br />
            beautiful story.
          </h1>

          <p>
            Start organizing your wedding details,
            guests, events, budget, and vendors
            all in one beautiful place.
          </p>

          <div className="register-brand-heart">
            ♥
          </div>

        </div>


        {/* =========================
            FORM PANEL
        ========================= */}

        <div className="register-form-panel">

          <div className="register-form-header">

            <span className="register-mobile-logo">
              ✦
            </span>

            <h2>Create Account</h2>

            <p>
              Join Wedding Bloom and start planning
              your perfect day.
            </p>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* =========================
                ACCOUNT TYPE
            ========================= */}

            <div className="register-role-section">

              <label>
                Are you registering as?
              </label>

              <div className="register-role-options">

                {/* COUPLE */}

                <button
                  type="button"
                  className={
                    formData.role === "couple"
                      ? "register-role-option active"
                      : "register-role-option"
                  }
                  onClick={() => selectRole("couple")}
                >

                  <span className="register-role-icon">
                    💍
                  </span>

                  <strong>
                    Couple
                  </strong>

                  <small>
                    Plan your wedding
                  </small>

                </button>


                {/* VENDOR */}

                <button
                  type="button"
                  className={
                    formData.role === "vendor"
                      ? "register-role-option active"
                      : "register-role-option"
                  }
                  onClick={() => selectRole("vendor")}
                >

                  <span className="register-role-icon">
                    <FaStore />
                  </span>

                  <strong>
                    Vendor
                  </strong>

                  <small>
                    Offer wedding services
                  </small>

                </button>

              </div>

            </div>


            {/* =========================
                FULL NAME
            ========================= */}

            <div className="register-field">

              <label htmlFor="full_name">
                Full Name
              </label>

              <div className="register-input">

                <FaUser />

                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* =========================
                EMAIL
            ========================= */}

            <div className="register-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input">

                <FaEnvelope />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* =========================
                VENDOR FIELDS
            ========================= */}

            {formData.role === "vendor" && (
              <>

                {/* BUSINESS NAME */}

                <div className="register-field">

                  <label htmlFor="business_name">
                    Business Name
                  </label>

                  <div className="register-input">

                    <FaStore />

                    <input
                      id="business_name"
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="e.g. Elegant Events"
                      required
                    />

                  </div>

                </div>


                {/* PHONE */}

                <div className="register-field">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <div className="register-input">

                    <FaPhone />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />

                  </div>

                </div>


                {/* CATEGORY */}

                <div className="register-field">

                  <label htmlFor="category_id">
                    Vendor Category
                  </label>

                  <div className="register-input">

                    <FaStore />

                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select category
                      </option>

                      <option value="1">
                        Photography
                      </option>

                      <option value="2">
                        Videography
                      </option>

                      <option value="3">
                        Catering
                      </option>

                      <option value="4">
                        Decoration
                      </option>

                      <option value="5">
                        Makeup
                      </option>

                      <option value="6">
                        Mehndi
                      </option>

                      <option value="7">
                        Venue
                      </option>

                      <option value="8">
                        DJ & Music
                      </option>

                      <option value="9">
                        Florist
                      </option>

                      <option value="10">
                        Wedding Dresses
                      </option>

                    </select>

                  </div>

                </div>


                {/* CITY */}

                <div className="register-field">

                  <label htmlFor="city">
                    City
                  </label>

                  <div className="register-input">

                    <FaMapMarkerAlt />

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Lahore"
                      required
                    />

                  </div>

                </div>


                {/* ADDRESS */}

                <div className="register-field">

                  <label htmlFor="address">
                    Business Address
                  </label>

                  <div className="register-input">

                    <FaMapMarkerAlt />

                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter business address"
                    />

                  </div>

                </div>


                {/* EXPERIENCE */}

                <div className="register-field">

                  <label htmlFor="experience_years">
                    Experience (Years)
                  </label>

                  <div className="register-input">

                    <input
                      id="experience_years"
                      type="number"
                      min="0"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                    />

                  </div>

                </div>


                {/* DESCRIPTION */}

                <div className="register-field">

                  <label htmlFor="description">
                    Business Description
                  </label>

                  <div className="register-input">

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about your services..."
                      rows="4"
                    />

                  </div>

                </div>

              </>
            )}


            {/* =========================
                PASSWORD
            ========================= */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input">

                <FaLock />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>


            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <div className="register-field">

              <label htmlFor="confirm_password">
                Confirm Password
              </label>

              <div className="register-input">

                <FaLock />

                <input
                  id="confirm_password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <p className="register-error">
                {error}
              </p>
            )}


            {/* =========================
                SUBMIT
            ========================= */}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <FaArrowRight />
              )}

            </button>

          </form>


          {/* =========================
              LOGIN
          ========================= */}

          <div className="register-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;