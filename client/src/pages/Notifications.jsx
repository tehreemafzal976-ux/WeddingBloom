import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaSearch,
  FaCheckDouble,
  FaTrash,
  FaTimes,
  FaClock,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api/notifications";

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications.");
      }

      setNotifications(data.data || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load",
        text: "Notifications could not be loaded.",
        confirmButtonColor: "#b35b6c",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
     MARK ONE AS READ
  ========================= */

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: 1 }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification read error:", error);

      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: "Notification could not be marked as read.",
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  /* =========================
     MARK ALL AS READ
  ========================= */

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => Number(notification.is_read) === 0
    );

    if (unreadNotifications.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Already Caught Up",
        text: "All notifications are already marked as read.",
        confirmButtonColor: "#b35b6c",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`${API_URL}/${notification.id}/read`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        )
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: 1,
        }))
      );

      Swal.fire({
        icon: "success",
        title: "All Caught Up!",
        text: "All notifications have been marked as read.",
        confirmButtonColor: "#b35b6c",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Mark all read error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Update",
        text: "Some notifications could not be marked as read.",
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  /* =========================
     DELETE ONE NOTIFICATION
  ========================= */

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Notification?",
      text: "This notification will be permanently removed.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b35b6c",
      cancelButtonColor: "#777",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete notification."
        );
      }

      setNotifications((previous) =>
        previous.filter((notification) => notification.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Notification deleted successfully.",
        confirmButtonColor: "#b35b6c",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete notification error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Notification could not be deleted.",
        confirmButtonColor: "#b35b6c",
      });
    }
  };

  /* =========================
     CLEAR ALL
  ========================= */

  const handleClear = async () => {
    if (notifications.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Nothing to Clear",
        text: "There are no notifications available.",
        confirmButtonColor: "#b35b6c",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Clear All Notifications?",
      text: "All your notifications will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b35b6c",
      cancelButtonColor: "#777",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        notifications.map((notification) =>
          fetch(`${API_URL}/${notification.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
        )
      );

      setNotifications([]);

      Swal.fire({
        icon: "success",
        title: "Notifications Cleared",
        text: "All notifications have been removed.",
        confirmButtonColor: "#b35b6c",
        timer: 1700,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Clear notifications error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Clear",
        text: "Some notifications could not be deleted.",
        confirmButtonColor: "#b35b6c",
      });

      fetchNotifications();
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredNotifications = notifications.filter((notification) => {
    const searchText = search.toLowerCase();

    return (
      notification.title?.toLowerCase().includes(searchText) ||
      notification.message?.toLowerCase().includes(searchText) ||
      notification.notification_type?.toLowerCase().includes(searchText)
    );
  });

  /* =========================
     NOTIFICATION ICON
  ========================= */

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <FaCheckCircle />;

      case "warning":
        return <FaExclamationTriangle />;

      case "reminder":
        return <FaClock />;

      case "info":
        return <FaInfoCircle />;

      default:
        return <FaBell />;
    }
  };

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);

    return notificationDate.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="notifications-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="notifications-header">

        <div>
          <span className="notifications-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Notifications</h1>

          <p>
            Stay updated with important activity and
            wedding planning reminders.
          </p>
        </div>

        <div className="notifications-actions">

          <button
            className="notifications-read-btn"
            onClick={handleMarkAllRead}
          >
            <FaCheckDouble />
            Mark All Read
          </button>

          <button
            className="notifications-clear-btn"
            onClick={handleClear}
          >
            <FaTrash />
            Clear
          </button>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="notifications-toolbar">

        <div className="notifications-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="notifications-search-clear"
              onClick={() => setSearch("")}
              type="button"
            >
              <FaTimes />
            </button>
          )}

        </div>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <section className="notifications-empty-card">

          <div className="notifications-empty-icon">
            <FaBell />
          </div>

          <h2>Loading notifications...</h2>

          <p>
            Please wait while we fetch your latest
            wedding updates.
          </p>

        </section>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}

      {!loading && notifications.length === 0 && (
        <section className="notifications-empty-card">

          <div className="notifications-empty-icon">
            <FaBell />
          </div>

          <h2>No notifications yet</h2>

          <p>
            When there is activity on your wedding plan,
            important updates and reminders will appear here.
          </p>

          <span className="notifications-empty-status">
            You're all caught up!
          </span>

        </section>
      )}


      {/* =========================
          NO SEARCH RESULTS
      ========================= */}

      {!loading &&
        notifications.length > 0 &&
        filteredNotifications.length === 0 && (
          <section className="notifications-empty-card">

            <div className="notifications-empty-icon">
              <FaSearch />
            </div>

            <h2>No matching notifications</h2>

            <p>
              We couldn't find any notifications matching
              "<strong>{search}</strong>".
            </p>

          </section>
        )}


      {/* =========================
          NOTIFICATION LIST
      ========================= */}

      {!loading && filteredNotifications.length > 0 && (
        <section className="notifications-list">

          {filteredNotifications.map((notification) => {

            const isUnread =
              Number(notification.is_read) === 0;

            return (
              <article
                key={notification.id}
                className={`notification-card ${
                  isUnread ? "unread" : "read"
                }`}
              >

                <div
                  className={`notification-icon ${
                    notification.notification_type?.toLowerCase() || "default"
                  }`}
                >
                  {getNotificationIcon(
                    notification.notification_type
                  )}
                </div>


                <div className="notification-content">

                  <div className="notification-top">

                    <div>
                      <h3>{notification.title}</h3>

                      {isUnread && (
                        <span className="notification-new-badge">
                          NEW
                        </span>
                      )}
                    </div>

                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>

                  </div>


                  <p>
                    {notification.message}
                  </p>


                  <div className="notification-footer">

                    <span className="notification-type">
                      {notification.notification_type ||
                        "General"}
                    </span>


                    <div className="notification-card-actions">

                      {isUnread && (
                        <button
                          type="button"
                          className="notification-read-action"
                          onClick={() =>
                            handleMarkRead(notification.id)
                          }
                        >
                          <FaCheckDouble />
                          Mark as Read
                        </button>
                      )}

                      <button
                        type="button"
                        className="notification-delete-action"
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                      >
                        <FaTrash />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </section>
      )}

    </div>
  );
}

export default Notifications;