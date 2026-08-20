import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const primaryUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/auth/login";
      const fallbackUrl = "https://weddingbloomai-production.up.railway.app/api/auth/login";

      let response;
      try {
        response = await fetch(primaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      } catch (e1) {
        response = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      }

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {

        setError(data.message || "Invalid email or password.");
        return;
      }

      console.log("LOGIN RESPONSE:", data);
      console.log("TOKEN FROM BACKEND:", data.token);
      console.log("USER FROM BACKEND:", data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("TOKEN AFTER SAVE:", localStorage.getItem("token"));
      console.log("USER AFTER SAVE:", localStorage.getItem("user"));

      if (data.user.role === "couple") {
        navigate("/");
        return;
      }

      if (data.user.role === "vendor") {
        navigate("/vendor-dashboard");
        return;
      }

      setError("Invalid account role.");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* BRAND SIDE */}

        <div className="auth-brand-panel">

          <div className="auth-brand-logo">
            ✦
          </div>

          <span className="auth-brand-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Your beautiful
            <br />
            day starts here.
          </h1>

          <p>
            Plan, organize, and manage every beautiful
            detail of your wedding journey in one place.
          </p>

          <div className="auth-brand-heart">
            ♥
          </div>

        </div>


        {/* FORM SIDE */}

        <div className="auth-form-panel">

          <div className="auth-form-header">

            <span className="auth-mobile-logo">
              ✦
            </span>

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue planning your perfect day.
            </p>

          </div>


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="auth-input">

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


            {/* PASSWORD */}

            <div className="auth-field">

              <div className="auth-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="auth-forgot-btn"
                >
                  Forgot password?
                </button>

              </div>

              <div className="auth-input">

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
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


            {/* ERROR */}

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}

              {!loading && <FaArrowRight />}
            </button>

          </form>


          {/* REGISTER */}

          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;