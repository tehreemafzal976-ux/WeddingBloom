import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaMapMarkerAlt,
  FaClock,
  FaPlus,
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [weddings, setWeddings] = useState([]);
  const [events, setEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH WEDDINGS
  // =========================================

  const fetchWeddings = async () => {
    const response = await fetch(
      "https://weddingbloom-production-b2a2.up.railway.app/api/weddings/my",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to load wedding information."
      );
    }

    return data.data || [];
  };

  // =========================================
  // FETCH EVENTS
  // =========================================

  const fetchEvents = async (weddingId) => {
    const response = await fetch(
      `https://weddingbloom-production-b2a2.up.railway.app/api/events/wedding/${weddingId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to load events."
      );
    }

    return data.data || [];
  };

  // =========================================
  // FETCH EXPENSES
  // =========================================

  const fetchExpenses = async (weddingId) => {
    const response = await fetch(
      `https://weddingbloom-production-b2a2.up.railway.app/api/expenses/wedding/${weddingId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to load expenses."
      );
    }

    return data.data || [];
  };

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/login");
        return;
      }

      // Get weddings
      const weddingData = await fetchWeddings();

      setWeddings(weddingData);

      // No wedding yet
      if (weddingData.length === 0) {
        setEvents([]);
        setExpenses([]);
        return;
      }

      // First/current wedding
      const currentWeddingId =
        weddingData[0].id;

      // Get events and expenses
      const [eventData, expenseData] =
        await Promise.all([
          fetchEvents(currentWeddingId),
          fetchExpenses(currentWeddingId),
        ]);

      setEvents(eventData);
      setExpenses(expenseData);
    } catch (error) {
      console.error(
        "Dashboard Data Error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // =========================================
  // CURRENT WEDDING
  // =========================================

  const currentWedding =
    weddings.length > 0
      ? weddings[0]
      : null;

  // =========================================
  // TOTAL EXPENSE
  // =========================================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total +
      Number(expense.amount || 0),
    0
  );

  // =========================================
  // DAYS REMAINING
  // =========================================

  const getDaysRemaining = () => {
    if (!currentWedding?.wedding_date) {
      return null;
    }

    const today = new Date();

    const weddingDate = new Date(
      currentWedding.wedding_date
    );

    today.setHours(0, 0, 0, 0);
    weddingDate.setHours(0, 0, 0, 0);

    const difference =
      weddingDate.getTime() -
      today.getTime();

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  };

  const daysRemaining =
    getDaysRemaining();

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "No wedding date";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="dashboard-page">

      {/* =====================================
          WELCOME
      ===================================== */}

      <section className="dashboard-welcome">

        <div>

          <span className="dashboard-eyebrow">
            WELCOME TO WEDDING BLOOM
          </span>

          <h1>
            Hello,{" "}
            {user?.full_name || "there"}.
            <br />
            Let's plan your perfect day.
          </h1>

          <p>
            Manage every beautiful part of your
            wedding journey from one place.
          </p>

        </div>

        <div className="dashboard-welcome-icon">
          <FaHeart />
        </div>

      </section>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* =====================================
          REAL STATS
      ===================================== */}

      <section className="dashboard-stats">

        {/* WEDDINGS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <FaHeart />
          </div>

          <div>

            <span>
              Weddings
            </span>

            <strong>
              {loading
                ? "..."
                : weddings.length}
            </strong>

          </div>

        </div>


        {/* GUESTS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <FaUsers />
          </div>

          <div>

            <span>
              Expected Guests
            </span>

            <strong>
              {loading
                ? "..."
                : currentWedding?.guest_count ??
                  "—"}
            </strong>

          </div>

        </div>


        {/* EVENTS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <FaCalendarAlt />
          </div>

          <div>

            <span>
              Events
            </span>

            <strong>
              {loading
                ? "..."
                : events.length}
            </strong>

          </div>

        </div>


        {/* EXPENSES */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <FaMoneyBillWave />
          </div>

          <div>

            <span>
              Expenses
            </span>

            <strong>
              {loading
                ? "..."
                : `Rs. ${totalExpenses.toLocaleString()}`}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          WEDDING OVERVIEW
      ===================================== */}

      {loading ? (

        <section className="dashboard-panel dashboard-loading-panel">

          <div className="dashboard-panel-icon">
            <FaHeart />
          </div>

          <h2>
            Loading your wedding...
          </h2>

          <p>
            Fetching your wedding information
            from the database.
          </p>

        </section>

      ) : currentWedding ? (

        <section className="dashboard-wedding-card">

          <div className="dashboard-wedding-main">

            <div className="dashboard-wedding-icon">
              💍
            </div>

            <div>

              <span className="dashboard-card-eyebrow">
                YOUR WEDDING
              </span>

              <h2>
                {currentWedding.wedding_title}
              </h2>

              <p>
                <FaCalendarAlt />

                {formatDate(
                  currentWedding.wedding_date
                )}
              </p>

              {(currentWedding.venue ||
                currentWedding.city) && (

                <p>

                  <FaMapMarkerAlt />

                  {currentWedding.venue || ""}

                  {currentWedding.venue &&
                  currentWedding.city
                    ? ", "
                    : ""}

                  {currentWedding.city || ""}

                </p>

              )}

            </div>

          </div>


          {/* COUNTDOWN */}

          <div className="dashboard-wedding-countdown">

            <span>

              {daysRemaining === null
                ? "WEDDING DATE"
                : daysRemaining > 0
                ? "DAYS TO GO"
                : daysRemaining === 0
                ? "TODAY"
                : "WEDDING DATE PASSED"}

            </span>


            {daysRemaining !== null && (

              <strong>

                {daysRemaining > 0
                  ? daysRemaining
                  : daysRemaining === 0
                  ? "♥"
                  : "—"}

              </strong>

            )}


            {daysRemaining > 0 && (

              <small>
                days remaining
              </small>

            )}

          </div>

        </section>

      ) : (

        /* =====================================
           NO WEDDING
        ===================================== */

        <section className="dashboard-panel dashboard-empty-panel">

          <div className="dashboard-panel-icon">
            <FaHeart />
          </div>

          <span className="dashboard-card-eyebrow">
            LET'S BEGIN
          </span>

          <h2>
            Your wedding story starts here
          </h2>

          <p>
            Create your wedding project first.
            Once it's created, your real wedding
            information will appear on your dashboard.
          </p>

          <button
            type="button"
            className="dashboard-create-btn"
            onClick={() =>
              navigate("/weddings")
            }
          >

            <FaPlus />

            Create Your Wedding

            <FaArrowRight />

          </button>

        </section>

      )}


      {/* =====================================
          QUICK ACCESS
      ===================================== */}

      <section className="dashboard-content-grid">


        {/* QUICK ACCESS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span>
                PLANNING
              </span>

              <h2>
                Quick Access
              </h2>

            </div>

          </div>


          <div className="dashboard-quick-links">

            <button
              type="button"
              onClick={() =>
                navigate("/weddings")
              }
            >

              <FaHeart />

              <span>
                My Weddings
              </span>

              <FaArrowRight />

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/guests")
              }
            >

              <FaUsers />

              <span>
                Guests
              </span>

              <FaArrowRight />

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/events")
              }
            >

              <FaCalendarAlt />

              <span>
                Events
              </span>

              <FaArrowRight />

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/expenses")
              }
            >

              <FaMoneyBillWave />

              <span>
                Expenses
              </span>

              <FaArrowRight />

            </button>

          </div>

        </div>


        {/* =====================================
            WEDDING STATUS
        ===================================== */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span>
                YOUR PLAN
              </span>

              <h2>
                Wedding Status
              </h2>

            </div>

          </div>


          {currentWedding ? (

            <div className="dashboard-status-content">


              <div className="dashboard-status-row">

                <span>
                  Wedding
                </span>

                <strong>
                  {currentWedding.wedding_title}
                </strong>

              </div>


              <div className="dashboard-status-row">

                <span>
                  Status
                </span>

                <strong className="dashboard-status-badge">

                  {currentWedding.status ||
                    "planning"}

                </strong>

              </div>


              <div className="dashboard-status-row">

                <span>
                  Budget
                </span>

                <strong>

                  {currentWedding.total_budget
                    ? `Rs. ${Number(
                        currentWedding.total_budget
                      ).toLocaleString()}`
                    : "—"}

                </strong>

              </div>


              <div className="dashboard-status-row">

                <span>
                  Guests
                </span>

                <strong>
                  {currentWedding.guest_count ??
                    "—"}
                </strong>

              </div>


              <div className="dashboard-status-row">

                <span>
                  Events
                </span>

                <strong>
                  {loading
                    ? "..."
                    : events.length}
                </strong>

              </div>


              <div className="dashboard-status-row">

                <span>
                  Expenses
                </span>

                <strong>

                  {loading
                    ? "..."
                    : `Rs. ${totalExpenses.toLocaleString()}`}

                </strong>

              </div>

            </div>

          ) : (

            <div className="dashboard-status-empty">

              <FaClock />

              <p>
                Your wedding planning information
                will appear here after you create
                your wedding.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;