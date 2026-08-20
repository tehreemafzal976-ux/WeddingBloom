import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaWallet,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import "./Expenses.css";

function Expenses() {
  const [showForm, setShowForm] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category_id: "",
    expense_title: "",
    description: "",
    amount: "",
    expense_date: "",
    payment_status: "Pending",
  });

  const [weddingId, setWeddingId] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // GET WEDDING
  // =========================

  const fetchWedding = async () => {
    try {
      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/weddings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch wedding."
        );
      }

      if (data.data && data.data.length > 0) {
        setWeddingId(data.data[0].id);
      }
    } catch (error) {
      console.error("Wedding Fetch Error:", error);
      setError("Unable to load your wedding.");
    }
  };

  // =========================
  // GET CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/expense-categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories."
        );
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Category Fetch Error:", error);

      /*
        If your category route is different,
        we will change this URL according to
        your category routes.
      */
    }
  };

  // =========================
  // GET EXPENSES
  // =========================

  const fetchExpenses = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://weddingbloom-production-b2a2.up.railway.app/api/expenses/wedding/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch expenses."
        );
      }

      setExpenses(data.data || []);
    } catch (error) {
      console.error("Fetch Expenses Error:", error);
      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      await fetchWedding();
      await fetchCategories();
    };

    loadData();
  }, []);

  // Fetch expenses after wedding ID is available
  useEffect(() => {
    if (weddingId) {
      fetchExpenses(weddingId);
    }
  }, [weddingId]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // CREATE EXPENSE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weddingId) {
      setError("Please create a wedding first.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select an expense category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            wedding_id: weddingId,
            category_id: Number(formData.category_id),
            event_id: null,
            vendor_id: null,
            expense_title: formData.expense_title,
            description: formData.description,
            amount: Number(formData.amount),
            expense_date: formData.expense_date,
            payment_status: formData.payment_status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to create expense."
        );
        return;
      }

      // Close modal
      setShowForm(false);

      // Reset form
      setFormData({
        category_id: "",
        expense_title: "",
        description: "",
        amount: "",
        expense_date: "",
        payment_status: "Pending",
      });

      // Reload expenses from database
      await fetchExpenses(weddingId);

    } catch (error) {
      console.error("Create Expense Error:", error);

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // FILTER EXPENSES
  // =========================

  const filteredExpenses = expenses.filter((expense) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      expense.expense_title
        ?.toLowerCase()
        .includes(searchValue) ||
      expense.category_name
        ?.toLowerCase()
        .includes(searchValue) ||
      expense.description
        ?.toLowerCase()
        .includes(searchValue);

    const matchesCategory =
      !categoryFilter ||
      String(expense.category_id) === String(categoryFilter);

    const matchesStatus =
      !statusFilter ||
      expense.payment_status?.toLowerCase() ===
        statusFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });

  // =========================
  // SUMMARY
  // =========================

  const totalAmount = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const pendingAmount = expenses
    .filter(
      (expense) =>
        expense.payment_status?.toLowerCase() === "pending"
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  const paidAmount = expenses
    .filter(
      (expense) =>
        expense.payment_status?.toLowerCase() === "paid"
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  return (
    <div className="expenses-page">

      {/* HEADER */}

      <div className="expenses-header">
        <div>
          <span className="expenses-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Wedding Expenses</h1>

          <p>
            Keep your wedding spending organized
            and under control.
          </p>
        </div>

        <button
          className="expenses-primary-btn"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <FaPlus />
          Add Expense
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="expenses-error">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="expenses-summary">

        <div className="expense-summary-card">
          <div className="expense-summary-icon">
            <FaWallet />
          </div>

          <div>
            <span>Total Expenses</span>
            <strong>
              Rs. {totalAmount.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="expense-summary-card">
          <div className="expense-summary-icon pending">
            <FaClock />
          </div>

          <div>
            <span>Pending Payments</span>
            <strong>
              Rs. {pendingAmount.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="expense-summary-card">
          <div className="expense-summary-icon paid">
            <FaCheckCircle />
          </div>

          <div>
            <span>Paid Expenses</span>
            <strong>
              Rs. {paidAmount.toLocaleString()}
            </strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="expenses-toolbar">

        <div className="expenses-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="expenses-filter"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.category_name}
            </option>
          ))}
        </select>

        <select
          className="expenses-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="pending">
            Pending
          </option>
        </select>

      </div>

      {/* EXPENSE LIST */}

      {loading ? (

        <section className="expenses-empty-card">
          <div className="expenses-empty-icon">
            <FaMoneyBillWave />
          </div>

          <h2>
            Loading expenses...
          </h2>

          <p>
            Fetching your expenses from the database.
          </p>
        </section>

      ) : filteredExpenses.length === 0 ? (

        <section className="expenses-empty-card">

          <div className="expenses-empty-icon">
            <FaMoneyBillWave />
          </div>

          <h2>
            {search ||
            categoryFilter ||
            statusFilter
              ? "No expenses found"
              : "No expenses added yet"}
          </h2>

          <p>
            {search ||
            categoryFilter ||
            statusFilter
              ? "Try changing your search or filters."
              : "Your wedding expenses will appear here. Add your first expense to start tracking your wedding budget."}
          </p>

          {!search &&
            !categoryFilter &&
            !statusFilter && (
              <button
                className="expenses-empty-btn"
                onClick={() => {
                  setError("");
                  setShowForm(true);
                }}
              >
                <FaPlus />
                Add Your First Expense
              </button>
            )}

        </section>

      ) : (

        <section className="expenses-list">

          {filteredExpenses.map((expense) => (

            <article
              className="expense-card"
              key={expense.id}
            >

              <div className="expense-card-icon">
                <FaMoneyBillWave />
              </div>

              <div className="expense-card-info">

                <h3>
                  {expense.expense_title}
                </h3>

                <p>
                  {expense.category_name ||
                    "Uncategorized"}
                </p>

                {expense.description && (
                  <span>
                    {expense.description}
                  </span>
                )}

              </div>

              <div className="expense-card-right">

                <strong>
                  Rs.{" "}
                  {Number(
                    expense.amount || 0
                  ).toLocaleString()}
                </strong>

                <small>
                  {expense.expense_date
                    ? new Date(
                        expense.expense_date
                      ).toLocaleDateString()
                    : ""}
                </small>

                <span
                  className={`expense-status ${
                    expense.payment_status?.toLowerCase()
                  }`}
                >
                  {expense.payment_status}
                </span>

              </div>

            </article>

          ))}

        </section>

      )}

      {/* ADD EXPENSE MODAL */}

      {showForm && (
        <div className="expenses-modal-overlay">

          <div className="expenses-modal">

            <div className="expenses-modal-header">

              <div>
                <span>
                  EXPENSE MANAGEMENT
                </span>

                <h2>
                  Add Wedding Expense
                </h2>
              </div>

              <button
                className="expenses-close-btn"
                onClick={() => {
                  if (!saving) {
                    setShowForm(false);
                  }
                }}
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* TITLE */}

              <div className="expenses-form-group">

                <label>
                  Expense Title
                </label>

                <input
                  type="text"
                  name="expense_title"
                  value={formData.expense_title}
                  onChange={handleChange}
                  placeholder="e.g. Wedding Hall"
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="expenses-form-row">

                <div className="expenses-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.category_name}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* AMOUNT */}

                <div className="expenses-form-group">

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

              </div>

              {/* DATE + STATUS */}

              <div className="expenses-form-row">

                <div className="expenses-form-group">

                  <label>
                    Expense Date
                  </label>

                  <input
                    type="date"
                    name="expense_date"
                    value={formData.expense_date}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="expenses-form-group">

                  <label>
                    Payment Status
                  </label>

                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Paid">
                      Paid
                    </option>

                  </select>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="expenses-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional details..."
                  rows="4"
                />

              </div>

              {/* ACTIONS */}

              <div className="expenses-form-actions">

                <button
                  type="button"
                  className="expenses-cancel-btn"
                  onClick={() => {
                    if (!saving) {
                      setShowForm(false);
                    }
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="expenses-save-btn"
                  disabled={saving}
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Expense"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Expenses;