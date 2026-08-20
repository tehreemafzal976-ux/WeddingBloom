import React, { useState } from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import "./ContactPage.css";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <PublicNavbar />

      <div className="contact-hero">
        <div className="contact-hero-container">
          <h1>Get In Touch With Us</h1>
          <p>Have questions about vendor booking, custom packages, or product orders? Our support team is here for you.</p>
        </div>
      </div>

      <div className="contact-body">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-info-card">
              <h2>Contact Information</h2>
              <p>Feel free to reach out via phone, email, or visit our headquarters in Lahore.</p>

              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <strong>Office Address</strong>
                    <span>Gulberg III, Main Boulevard, Lahore, Pakistan</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <FaPhone />
                  <div>
                    <strong>Phone Support</strong>
                    <span>+92 300 1234567 / +92 42 35789000</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <FaEnvelope />
                  <div>
                    <strong>Email Address</strong>
                    <span>support@weddingbloom.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              {submitted ? (
                <div className="contact-success-msg">
                  Thank you! Your message has been received. Our team will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-field">
                    <label>Your Name *</label>
                    <input type="text" placeholder="Enter your full name" required />
                  </div>

                  <div className="form-field">
                    <label>Email Address *</label>
                    <input type="email" placeholder="Enter your email" required />
                  </div>

                  <div className="form-field">
                    <label>Message *</label>
                    <textarea rows="4" placeholder="How can we help your wedding planning?" required></textarea>
                  </div>

                  <button type="submit" className="send-msg-btn">
                    <FaPaperPlane /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default ContactPage;
