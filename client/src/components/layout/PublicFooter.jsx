import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaPinterest } from "react-icons/fa";
import "./PublicFooter.css";

function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-container">
        {/* BRAND COL */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="footer-sparkle">✦</span>
            <h2>Wedding Bloom</h2>
          </div>
          <p className="footer-about">
            Pakistan's premier wedding e-commerce & management marketplace. Discover top photography, caterers, venues, bridal wear, and manage your wedding effortlessly.
          </p>
          <div className="footer-socials">
            <a href="#instagram" aria-label="Instagram"><FaInstagram /></a>
            <a href="#facebook" aria-label="Facebook"><FaFacebook /></a>
            <a href="#pinterest" aria-label="Pinterest"><FaPinterest /></a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>Marketplace</h3>
          <ul>
            <li><Link to="/products">Shop Wedding Collection</Link></li>
            <li><Link to="/vendors">Explore Wedding Vendors</Link></li>
            <li><Link to="/categories">Wedding Categories</Link></li>
            <li><Link to="/favorites">My Favorites</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div className="footer-col">
          <h3>Popular Categories</h3>
          <ul>
            <li><Link to="/products?category=Wedding Dresses">Bridal & Groom Wear</Link></li>
            <li><Link to="/vendors?category=Photography">Photography & Video</Link></li>
            <li><Link to="/products?category=Jewelry">Jewelry & Accessories</Link></li>
            <li><Link to="/vendors?category=Decoration">Stage & Floral Decor</Link></li>
            <li><Link to="/vendors?category=Catering">Catering & Food Services</Link></li>
          </ul>
        </div>

        {/* CONTACT & NEWSLETTER */}
        <div className="footer-col contact-col">
          <h3>Contact Us</h3>
          <p><FaMapMarkerAlt /> Gulberg III, Lahore, Pakistan</p>
          <p><FaPhone /> +92 300 1234567</p>
          <p><FaEnvelope /> support@weddingbloom.com</p>

          <div className="newsletter-box">
            <h4>Get Exclusive Deals</h4>
            <div className="newsletter-input-group">
              <input type="email" placeholder="Enter your email" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© 2026 Wedding Bloom. All Rights Reserved. Crafted with <FaHeart className="heart-icon" /> for perfect weddings.</p>
          <div className="footer-legal">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
