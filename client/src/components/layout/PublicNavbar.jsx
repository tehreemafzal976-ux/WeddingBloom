import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  FaStore,
  FaShoppingBag,
  FaList,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import "./PublicNavbar.css";

function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (user?.role === "vendor") return "/vendor-dashboard";
    return "/dashboard";
  };

  return (
    <header className="public-navbar">
      <div className="public-navbar-container">
        {/* LOGO */}
        <Link to="/" className="public-navbar-brand">
          <span className="public-brand-sparkle">✦</span>
          <div className="public-brand-text">
            <span className="brand-name">Wedding Bloom</span>
            <span className="brand-tagline">Marketplace & Planning</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="public-navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} end>
            Home
          </NavLink>
          <NavLink to="/vendors" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Vendors
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Shop Products
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Categories
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Contact
          </NavLink>
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="public-navbar-actions">
          {/* FAVORITES */}
          <Link to="/favorites" className="action-icon-btn" title="Favorites">
            <FaHeart />
          </Link>

          {/* CART */}
          <Link to="/cart" className="action-cart-btn" title="Shopping Cart">
            <FaShoppingCart />
            <span className="cart-text">Cart</span>
            <span className="cart-badge">{totalItemsCount}</span>
          </Link>

          {/* AUTH STATUS */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "W"}
                </div>
                <span className="user-name">{user?.full_name || "My Account"}</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user?.full_name}</strong>
                    <small>{user?.email}</small>
                    <span className="user-role-badge">{user?.role?.toUpperCase()}</span>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <Link to={getDashboardPath()} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaUser /> Profile
                  </Link>
                  <div className="user-dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="auth-btn login-btn">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                <FaUserPlus /> Sign Up
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button className="mobile-toggle-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="mobile-menu-drawer">
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Home
          </NavLink>
          <NavLink to="/vendors" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Vendors
          </NavLink>
          <NavLink to="/products" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Shop Products
          </NavLink>
          <NavLink to="/categories" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Categories
          </NavLink>
          <NavLink to="/favorites" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Favorites
          </NavLink>
          <NavLink to="/cart" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Cart ({totalItemsCount})
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            About Us
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
            Contact
          </NavLink>

          <div className="mobile-auth-divider"></div>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="mobile-auth-btn dashboard">
                Go to Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="mobile-auth-btn logout">
                Log Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="mobile-auth-btn login">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="mobile-auth-btn register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default PublicNavbar;
