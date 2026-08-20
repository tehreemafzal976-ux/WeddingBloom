import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStore,
  FaBoxOpen,
  FaTags,
  FaClipboardCheck,
  FaCreditCard,
  FaStar,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose();

    navigate("/login");
  };

  // =========================================
  // MENU SECTIONS
  // =========================================

  const menuSections = [
    {
      title: "Overview",

      items: [
        {
          name: "Marketplace Home",
          path: "/",
          icon: <FaHome />,
        },

        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <FaHome />,
        },

        {
          name: "Weddings",
          path: "/weddings",
          icon: <FaHeart />,
        },
      ],
    },

    {
      title: "E-Commerce",

      items: [
        {
          name: "Shop Products",
          path: "/products",
          icon: <FaBoxOpen />,
        },

        {
          name: "My Orders",
          path: "/orders",
          icon: <FaClipboardCheck />,
        },

        {
          name: "Vendor Products",
          path: "/vendor/products",
          icon: <FaStore />,
        },
      ],
    },

    {
      title: "Planning",

      items: [
        {
          name: "Guests",
          path: "/guests",
          icon: <FaUsers />,
        },

        {
          name: "Events",
          path: "/events",
          icon: <FaCalendarAlt />,
        },

        {
          name: "Expenses",
          path: "/expenses",
          icon: <FaMoneyBillWave />,
        },
      ],
    },

    {
      title: "Vendors & Packages",

      items: [
        {
          name: "Vendors",
          path: "/vendors",
          icon: <FaStore />,
        },

        {
          name: "Packages",
          path: "/packages",
          icon: <FaBoxOpen />,
        },

        {
          name: "Deals",
          path: "/deals",
          icon: <FaTags />,
        },
      ],
    },

    {
      title: "Bookings & Account",

      items: [
        {
          name: "Bookings",
          path: "/bookings",
          icon: <FaClipboardCheck />,
        },

        {
          name: "Payments",
          path: "/payments",
          icon: <FaCreditCard />,
        },

        {
          name: "Reviews",
          path: "/reviews",
          icon: <FaStar />,
        },

        {
          name: "Favorites",
          path: "/favorites",
          icon: <FaHeart />,
        },

        {
          name: "Notifications",
          path: "/notifications",
          icon: <FaBell />,
        },

        {
          name: "Profile",
          path: "/profile",
          icon: <FaUser />,
        },

        {
          name: "Settings",
          path: "/settings",
          icon: <FaCog />,
        },
      ],
    },
  ];

  return (
    <>
      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`sidebar ${isOpen ? "open" : ""
          }`}
      >

        {/* =========================================
            LOGO
        ========================================= */}

        <div className="sidebar-logo">

          <div className="logo-flower">
            ✦
          </div>

          <div className="sidebar-brand">

            <h2>
              Wedding Bloom
            </h2>

            <span>
              Wedding Planner
            </span>

          </div>

        </div>


        {/* =========================================
            NAVIGATION
        ========================================= */}

        <nav className="sidebar-menu">

          {menuSections.map((section) => (

            <div
              className="menu-section"
              key={section.title}
            >

              {/* SECTION TITLE */}

              <p className="menu-section-title">
                {section.title}
              </p>


              {/* SECTION LINKS */}

              {section.items.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""
                    }`
                  }
                >

                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  <span className="sidebar-link-text">
                    {item.name}
                  </span>

                </NavLink>

              ))}

            </div>

          ))}

        </nav>


        {/* =========================================
            BOTTOM SECTION
        ========================================= */}

        <div className="sidebar-bottom">

          {/* LOVE MESSAGE */}

          <div className="sidebar-love">

            <span>
              ♥
            </span>

            <div>

              <strong>
                Plan your perfect day
              </strong>

              <small>
                One beautiful moment at a time.
              </small>

            </div>

          </div>


          {/* LOGOUT BUTTON */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;