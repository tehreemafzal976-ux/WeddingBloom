import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserPlus, FaSignInAlt, FaTimes, FaHeart } from "react-icons/fa";
import "./AuthPromptModal.css";

function AuthPromptModal() {
  const { authModalOpen, authModalMessage, closeAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!authModalOpen) return null;

  const handleSignUp = () => {
    closeAuthModal();
    navigate("/register");
  };

  const handleLogin = () => {
    closeAuthModal();
    navigate("/login");
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Close">
          <FaTimes />
        </button>

        <div className="auth-modal-icon-wrapper">
          <FaHeart className="auth-modal-heart-icon" />
        </div>

        <h2>Join Wedding Bloom</h2>

        <p className="auth-modal-note">
          {authModalMessage || "Please sign up or log in first to book vendor packages, shop wedding products, or access your planning dashboard."}
        </p>

        <div className="auth-modal-actions">
          <button className="auth-modal-btn primary" onClick={handleSignUp}>
            <FaUserPlus /> Sign Up Free
          </button>
          <button className="auth-modal-btn secondary" onClick={handleLogin}>
            <FaSignInAlt /> Log In
          </button>
        </div>

        <p className="auth-modal-footer-note">
          Already have an account? Log in to continue your wedding journey.
        </p>
      </div>
    </div>
  );
}

export default AuthPromptModal;
