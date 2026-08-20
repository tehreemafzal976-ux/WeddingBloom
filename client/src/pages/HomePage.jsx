import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";
import {
  FaStore,
  FaShoppingBag,
  FaTag,
  FaStar,
  FaHeart,
  FaCalendarCheck,
  FaChevronRight,
  FaCheckCircle,
  FaSearch,
  FaGift,
  FaPercent,
  FaArrowRight,
} from "react-icons/fa";
import "./HomePage.css";

function HomePage() {
  const { requireAuth, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Seed initial database content if needed
        fetch(`${API_URL}/seed`).catch(() => { });

        const [prodRes, vendRes, packRes, dealRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/vendors`),
          fetch(`${API_URL}/packages`),
          fetch(`${API_URL}/deals`),
        ]);

        if (prodRes.ok) {
          const pData = await prodRes.json();
          if (pData.products) setProducts(pData.products);
        }
        if (vendRes.ok) {
          const vData = await vendRes.json();
          if (Array.isArray(vData)) setVendors(vData);
          else if (vData.vendors) setVendors(vData.vendors);
        }
        if (packRes.ok) {
          const pkData = await packRes.json();
          if (Array.isArray(pkData)) setPackages(pkData);
          else if (pkData.packages) setPackages(pkData.packages);
        }
        if (dealRes.ok) {
          const dData = await dealRes.json();
          if (Array.isArray(dData)) setDeals(dData);
          else if (dData.deals) setDeals(dData.deals);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: "Wedding Dresses", icon: "👗", count: "120+ Items", img: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80" },
    { name: "Jewelry", icon: "💎", count: "85+ Sets", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
    { name: "Makeup", icon: "💄", count: "40+ Artists", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80" },
    { name: "Mehndi", icon: "✨", count: "25+ Designers", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80" },
    { name: "Photography", icon: "📷", count: "60+ Studios", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80" },
    { name: "Decoration", icon: "🌸", count: "50+ Venues", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
    { name: "Catering", icon: "🍲", count: "30+ Services", img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80" },
    { name: "Invitations", icon: "💌", count: "100+ Designs", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80" },
  ];

  const promotionalDeals = [
    {
      id: 1,
      title: "Bridal Couture Flash Sale",
      category: "Wedding Dresses",
      originalPrice: 320000,
      offerPrice: 250000,
      discountPercent: 22,
      badge: "HOT DEAL",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Signature Stage & Floral Decor",
      category: "Decoration",
      originalPrice: 220000,
      offerPrice: 180000,
      discountPercent: 18,
      badge: "20% OFF",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Luxury HD Photography Package",
      category: "Photography",
      originalPrice: 120000,
      offerPrice: 95000,
      discountPercent: 21,
      badge: "LIMITED TIME",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleProtectedAction = (actionCallback, message) => {
    if (!requireAuth(message)) return;
    actionCallback();
  };

  const handleAddToCart = (product) => {
    handleProtectedAction(() => {
      addToCart(product);
      alert(`Added "${product.name}" to your cart!`);
    }, "Please sign up or log in first to add products to your cart.");
  };

  const handleBookNow = (item) => {
    handleProtectedAction(() => {
      navigate(`/vendors`);
    }, "Please sign up or log in first to book vendor packages.");
  };

  return (
    <div className="homepage-wrapper">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">✦ THE PREMIER WEDDING MARKETPLACE</span>
            <h1>Everything You Need for Your Perfect Wedding</h1>
            <p>
              Discover top vendors, shop bridal couture & jewelry, compare photography & decor deals, and manage your entire wedding journey in one place.
            </p>
            <div className="hero-cta-buttons">
              <Link to="/vendors" className="hero-btn primary-btn">
                <FaStore /> Explore Vendors
              </Link>
              <Link to="/products" className="hero-btn secondary-btn">
                <FaShoppingBag /> Shop Wedding Collection
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>500+</strong>
                <span>Verified Vendors</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>1,200+</strong>
                <span>Wedding Products</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>4.9 ★</strong>
                <span>Couple Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL OFFERS */}
      <section className="promo-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">EXCLUSIVE OFFERS</span>
              <h2>Wedding Season Discounts & Deals</h2>
            </div>
            <Link to="/products" className="section-link">
              View All Offers <FaChevronRight />
            </Link>
          </div>

          <div className="promo-grid">
            {promotionalDeals.map((deal) => (
              <div className="promo-card" key={deal.id}>
                <div className="promo-image-wrapper">
                  <img src={deal.image} alt={deal.title} />
                  <span className="promo-badge">{deal.badge}</span>
                </div>
                <div className="promo-body">
                  <span className="promo-category">{deal.category}</span>
                  <h3>{deal.title}</h3>
                  <div className="promo-price-row">
                    <span className="original-price">PKR {deal.originalPrice.toLocaleString()}</span>
                    <span className="offer-price">PKR {deal.offerPrice.toLocaleString()}</span>
                    <span className="discount-tag">{deal.discountPercent}% OFF</span>
                  </div>
                  <button
                    className="promo-btn"
                    onClick={() =>
                      handleProtectedAction(
                        () => navigate("/products"),
                        "Please sign up or log in first to view exclusive deals."
                      )
                    }
                  >
                    View Deal <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEDDING CATEGORIES */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">BROWSE BY CATEGORY</span>
            <h2>Explore Wedding Marketplace</h2>
            <p className="section-subtitle">Find everything from bridal dresses to marquee decorations and photography</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} key={idx} className="category-card">
                <div className="category-image-bg">
                  <img src={cat.img} alt={cat.name} />
                  <div className="category-overlay"></div>
                </div>
                <div className="category-content">
                  <span className="category-emoji">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VENDOR PACKAGES */}
      <section className="packages-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">FEATURED PACKAGES</span>
              <h2>Popular Vendor Services & Packages</h2>
            </div>
            <Link to="/vendors" className="section-link">
              Browse All Packages <FaChevronRight />
            </Link>
          </div>

          <div className="packages-grid">
            {packages.length > 0 ? (
              packages.slice(0, 3).map((pkg) => (
                <div className="package-card" key={pkg.id}>
                  <div className="package-header">
                    <span className="vendor-name-tag">{pkg.business_name || "Premium Vendor"}</span>
                    <h3>{pkg.package_name}</h3>
                    <p className="package-desc">{pkg.description}</p>
                  </div>
                  <div className="package-price-box">
                    <span className="price-label">Package Price</span>
                    <strong className="package-price">PKR {Number(pkg.price).toLocaleString()}</strong>
                  </div>
                  <div className="package-features">
                    <span>✓ Duration: {pkg.duration_hours || 8} Hours</span>
                    <span>✓ Guest Capacity: Up to {pkg.max_guests || 500}</span>
                    <span>✓ High Definition Coverage</span>
                  </div>
                  <div className="package-actions">
                    <button className="pkg-btn secondary" onClick={() => handleBookNow(pkg)}>
                      View Package
                    </button>
                    <button className="pkg-btn primary" onClick={() => handleBookNow(pkg)}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Fallback cards if database initially populating
              [
                { id: 1, name: "Premium Photography Package", price: 85000, vendor: "Elegant Moments Photography" },
                { id: 2, name: "Grand Stage & Marquee Decor", price: 175000, vendor: "Grand Imperial Marquee" },
                { id: 3, name: "Bridal HD Airbrush Makeup", price: 45000, vendor: "Glamour by Sana Studio" },
              ].map((pkg) => (
                <div className="package-card" key={pkg.id}>
                  <div className="package-header">
                    <span className="vendor-name-tag">{pkg.vendor}</span>
                    <h3>{pkg.name}</h3>
                    <p className="package-desc">Complete coverage with high-end equipment, professional team, and fast delivery.</p>
                  </div>
                  <div className="package-price-box">
                    <span className="price-label">Special Offer Price</span>
                    <strong className="package-price">PKR {pkg.price.toLocaleString()}</strong>
                  </div>
                  <div className="package-features">
                    <span>✓ Verified Quality Guarantee</span>
                    <span>✓ Flexible Schedule</span>
                    <span>✓ Custom Requests Included</span>
                  </div>
                  <div className="package-actions">
                    <button className="pkg-btn primary" onClick={() => handleBookNow(pkg)}>
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">SHOP ONLINE</span>
              <h2>Featured Wedding Collection</h2>
            </div>
            <Link to="/products" className="section-link">
              Visit Shop <FaChevronRight />
            </Link>
          </div>

          <div className="products-grid">
            {products.length > 0
              ? products.slice(0, 4).map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image-box">
                    <img src={product.image} alt={product.name} />
                    {product.original_price && product.original_price > product.price && (
                      <span className="product-discount-badge">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-cat">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <FaStar className="star" /> <span>{product.rating || 4.9}</span>
                    </div>
                    <div className="product-price-row">
                      <span className="curr-price">PKR {Number(product.price).toLocaleString()}</span>
                      {product.original_price && (
                        <span className="old-price">PKR {Number(product.original_price).toLocaleString()}</span>
                      )}
                    </div>
                    <div className="product-card-actions">
                      <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button
                        className="view-details-btn"
                        onClick={() =>
                          handleProtectedAction(
                            () => navigate(`/products/${product.id}`),
                            "Please sign up or log in first to view full product details."
                          )
                        }
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
              : null}
          </div>
        </div>
      </section>

      {/* FEATURED VENDORS */}
      <section className="vendors-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">TOP RATED</span>
              <h2>Featured Wedding Vendors</h2>
            </div>
            <Link to="/vendors" className="section-link">
              View All Vendors <FaChevronRight />
            </Link>
          </div>

          <div className="vendors-grid">
            {(vendors.length > 0 ? vendors.slice(0, 3) : [
              { id: 1, business_name: "Elegant Moments Photography", city: "Lahore", rating: 4.9, profile_image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
              { id: 2, business_name: "Grand Imperial Marquee", city: "Lahore", rating: 4.8, profile_image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
              { id: 3, business_name: "Glamour by Sana Studio", city: "Islamabad", rating: 4.9, profile_image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
            ]).map((vendor) => (
              <div className="vendor-card" key={vendor.id}>
                <div className="vendor-img-box">
                  <img src={vendor.profile_image} alt={vendor.business_name} />
                  <span className="vendor-city-badge">📍 {vendor.city || "Pakistan"}</span>
                </div>
                <div className="vendor-details">
                  <h3>{vendor.business_name}</h3>
                  <div className="vendor-rating">
                    <FaStar className="star" /> <strong>{vendor.rating || 4.9}</strong> <span>(40+ reviews)</span>
                  </div>
                  <p className="vendor-desc">Premier verified vendor offering bespoke wedding services and competitive packages.</p>
                  <div className="vendor-footer-actions">
                    <button className="vendor-btn view" onClick={() => handleBookNow(vendor)}>
                      View Profile
                    </button>
                    <button className="vendor-btn book" onClick={() => handleBookNow(vendor)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="section-container text-center">
          <span className="section-eyebrow">EASY PLANNING</span>
          <h2>How Wedding Bloom Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Explore & Discover</h3>
              <p>Browse verified vendors, compare packages, and shop bridal wear and accessories.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select & Book</h3>
              <p>Sign up, book packages with transparent prices, and add products directly to your cart.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Manage Your Day</h3>
              <p>Track expenses, guests, events, payments, and orders from your dedicated dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Plan Your Dream Wedding?</h2>
          <p>Create your free couple or vendor account today and start discovering the best deals across Pakistan.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">
              Create Free Account
            </Link>
            <Link to="/login" className="cta-btn secondary">
              Log In
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export default HomePage;
