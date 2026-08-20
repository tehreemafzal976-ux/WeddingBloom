import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { FaChevronRight } from "react-icons/fa";
import "./CategoriesPage.css";

function CategoriesPage() {
  const categories = [
    { name: "Wedding Dresses", icon: "👗", desc: "Bridal Lehengas, Groom Sherwanis, Gowns & Sarees", img: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80" },
    { name: "Jewelry", icon: "💎", desc: "Gold Plated Kundan, Freshwater Pearls, Diamond Sets", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
    { name: "Makeup", icon: "💄", desc: "Celebrity Bridal HD Makeup, Airbrush & Party Looks", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
    { name: "Mehndi", icon: "✨", desc: "Organic Rajasthani Henna Cones & Bridal Designers", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" },
    { name: "Photography", icon: "📷", count: "60+ Studios", desc: "Cinematic Wedding Films, Drone & Signature Albums", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
    { name: "Decoration", icon: "🌸", desc: "Stage Flowers, Velvet Draping, Fairy Lights & Marquees", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
    { name: "Catering", icon: "🍲", desc: "Authentic Mughlai, Live BBQ & International Buffets", img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" },
    { name: "Invitations", icon: "💌", desc: "Gold Foil Acrylic Cards, Wax Seals & Digital Invites", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
    { name: "Wedding Shoes", icon: "👠", desc: "Handcrafted Zardozi Khussas & Bridal Heels", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="categories-page-wrapper">
      <PublicNavbar />

      <div className="cat-page-banner">
        <div className="banner-container">
          <h1>Explore Wedding Categories</h1>
          <p>Browse top categories to discover vendors, packages, and shop wedding products.</p>
        </div>
      </div>

      <div className="cat-page-body">
        <div className="cat-page-container">
          <div className="cat-page-grid">
            {categories.map((cat, idx) => (
              <div className="cat-big-card" key={idx}>
                <div className="cat-card-img">
                  <img src={cat.img} alt={cat.name} />
                  <span className="cat-badge-emoji">{cat.icon}</span>
                </div>
                <div className="cat-card-content">
                  <h2>{cat.name}</h2>
                  <p>{cat.desc}</p>

                  <div className="cat-card-links">
                    <Link to={`/products?category=${encodeURIComponent(cat.name)}`}>
                      Shop Products <FaChevronRight />
                    </Link>
                    <Link to={`/vendors?category=${encodeURIComponent(cat.name)}`}>
                      Browse Vendors <FaChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default CategoriesPage;
