import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { FaHeart, FaShieldAlt, FaStar, FaUsers } from "react-icons/fa";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <PublicNavbar />

      <div className="about-hero">
        <div className="about-hero-container">
          <span className="about-tag">ABOUT WEDDING BLOOM</span>
          <h1>Empowering Couples & Vendors Across Pakistan</h1>
          <p>
            Wedding Bloom is Pakistan’s leading wedding e-commerce marketplace and wedding planning manager. We bridge the gap between couples planning their dream wedding and verified local vendors.
          </p>
        </div>
      </div>

      <div className="about-body">
        <div className="about-container">
          <div className="about-grid">
            <div className="about-card">
              <FaHeart className="about-icon" />
              <h2>Our Mission</h2>
              <p>To simplify wedding planning into an enjoyable, seamless, and transparent experience for every couple.</p>
            </div>

            <div className="about-card">
              <FaShieldAlt className="about-icon" />
              <h2>Verified Vendors</h2>
              <p>We strictly curate and verify photography, decor, marquee, and catering vendors to ensure 100% excellence.</p>
            </div>

            <div className="about-card">
              <FaStar className="about-icon" />
              <h2>E-Commerce Marketplace</h2>
              <p>Shop authentic bridal wear, Kundan jewelry, handcrafted khussas, and wedding accessories directly with nationwide delivery.</p>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default AboutPage;
