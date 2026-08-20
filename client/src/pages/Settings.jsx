import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

import {
  FaCog,
  FaBell,
  FaLock,
  FaPalette,
  FaSave,
} from "react-icons/fa";

import Swal from "sweetalert2";

import "./Settings.css";

const API_URL = "https://weddingbloom-production-b2a2.up.railway.app/api";

function Settings() {
  const { setTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    weddingReminders: true,
    vendorUpdates: false,
    darkMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================
     TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =========================
     HEADERS
  ========================= */

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* =========================
     LOAD SETTINGS
  ========================= */

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/settings`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load settings."
        );
      }

      const savedSettings = data.data;

      const loadedSettings = {
        emailNotifications: Boolean(
          savedSettings.email_notifications
        ),

        weddingReminders: Boolean(
          savedSettings.wedding_reminders
        ),

        vendorUpdates: Boolean(
          savedSettings.vendor_updates
        ),

        darkMode: Boolean(
          savedSettings.dark_mode
        ),
      };

      /* =========================
         ONLY LOAD SETTINGS
         
         IMPORTANT:
         Do NOT call setTheme() here.
         Otherwise every time Settings
         page opens, it will force the
         database theme.
      ========================= */

      setSettings(loadedSettings);

    } catch (error) {
      console.error(
        "Settings loading error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to Load Settings",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchSettings();
  }, []);

  /* =========================
     NORMAL TOGGLE
  ========================= */

  const handleToggle = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  /* =========================
     DARK MODE TOGGLE
  ========================= */

  const handleDarkModeToggle = () => {
    setSettings((previous) => {
      const newDarkMode = !previous.darkMode;

      /* Immediately change website theme */
      setTheme(
        newDarkMode
          ? "dark"
          : "light"
      );

      return {
        ...previous,
        darkMode: newDarkMode,
      };
    });
  };

  /* =========================
     SAVE SETTINGS
  ========================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/settings`,
        {
          method: "PUT",
          headers: getHeaders(),

          body: JSON.stringify({
            emailNotifications:
              settings.emailNotifications,

            weddingReminders:
              settings.weddingReminders,

            vendorUpdates:
              settings.vendorUpdates,

            darkMode:
              settings.darkMode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save settings."
        );
      }

      /* Keep selected theme active */
      setTheme(
        settings.darkMode
          ? "dark"
          : "light"
      );

      Swal.fire({
        icon: "success",
        title: "Settings Saved",
        text: "Your settings have been updated successfully.",
        confirmButtonColor: "#b35b6c",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message,
        confirmButtonColor: "#b35b6c",
      });

    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="settings-page">

        <div className="settings-loading">

          <FaCog />

          <h2>
            Loading Settings...
          </h2>

          <p>
            Please wait while your settings
            are being loaded.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="settings-header">

        <div>

          <span className="settings-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Customize your Wedding Bloom
            experience and notification
            preferences.
          </p>

        </div>

        <button
          className="settings-save-btn"
          onClick={handleSave}
          disabled={saving}
        >

          <FaSave />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>


      {/* =========================
          SETTINGS GRID
      ========================= */}

      <div className="settings-grid">


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FaBell />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Control the notifications
                you receive.
              </p>

            </div>

          </div>


          {/* EMAIL NOTIFICATIONS */}

          <div className="settings-option">

            <div>

              <strong>
                Email Notifications
              </strong>

              <span>
                Receive important account
                updates by email.
              </span>

            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.emailNotifications
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleToggle(
                  "emailNotifications"
                )
              }
              aria-label="Toggle email notifications"
            >

              <span></span>

            </button>

          </div>


          {/* WEDDING REMINDERS */}

          <div className="settings-option">

            <div>

              <strong>
                Wedding Reminders
              </strong>

              <span>
                Receive reminders about
                upcoming wedding tasks.
              </span>

            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.weddingReminders
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleToggle(
                  "weddingReminders"
                )
              }
              aria-label="Toggle wedding reminders"
            >

              <span></span>

            </button>

          </div>


          {/* VENDOR UPDATES */}

          <div className="settings-option">

            <div>

              <strong>
                Vendor Updates
              </strong>

              <span>
                Receive updates from
                your saved vendors.
              </span>

            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.vendorUpdates
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleToggle(
                  "vendorUpdates"
                )
              }
              aria-label="Toggle vendor updates"
            >

              <span></span>

            </button>

          </div>

        </section>


        {/* =========================
            APPEARANCE
        ========================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FaPalette />
            </div>

            <div>

              <h2>
                Appearance
              </h2>

              <p>
                Choose how Wedding Bloom
                looks.
              </p>

            </div>

          </div>


          {/* DARK MODE */}

          <div className="settings-option">

            <div>

              <strong>
                Dark Mode
              </strong>

              <span>
                Use a darker interface
                for your workspace.
              </span>

            </div>

            <button
              type="button"
              className={`settings-toggle ${
                settings.darkMode
                  ? "active"
                  : ""
              }`}
              onClick={handleDarkModeToggle}
              aria-label="Toggle dark mode"
            >

              <span></span>

            </button>

          </div>

        </section>


        {/* =========================
            PRIVACY & SECURITY
        ========================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FaLock />
            </div>

            <div>

              <h2>
                Privacy & Security
              </h2>

              <p>
                Manage your account security
                preferences.
              </p>

            </div>

          </div>


          <div className="settings-security-row">

            <div className="settings-security-icon">
              <FaLock />
            </div>

            <div>

              <strong>
                Password & Security
              </strong>

              <span>
                Password and account security
                settings are managed through
                your account.
              </span>

            </div>

          </div>

        </section>


        {/* =========================
            ACCOUNT
        ========================= */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FaCog />
            </div>

            <div>

              <h2>
                Account
              </h2>

              <p>
                General account preferences.
              </p>

            </div>

          </div>


          <div className="settings-account-note">

            <strong>
              Your account settings
            </strong>

            <p>
              Your preferences are securely
              stored with your Wedding Bloom
              account.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Settings;