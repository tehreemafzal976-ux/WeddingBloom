import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaPlus,
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import Swal from "sweetalert2";
import "./Events.css";

function Events() {
  const [showForm, setShowForm] = useState(false);

  const [events, setEvents] = useState([]);
  const [weddings, setWeddings] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedWedding, setSelectedWedding] = useState("");

  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // FETCH WEDDINGS
  // =========================

  const fetchWeddings = async () => {
    try {
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
        throw new Error(data.message || "Failed to load weddings.");
      }

      setWeddings(data.data || []);

      // Automatically select first wedding
      if (data.data && data.data.length > 0) {
        setSelectedWedding(String(data.data[0].id));
      }
    } catch (error) {
      console.error("Fetch Weddings Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load your weddings.",
      });
    }
  };

  // =========================
  // FETCH EVENTS
  // =========================

  const fetchEvents = async (weddingId) => {
    if (!weddingId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

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
        throw new Error(data.message || "Failed to load events.");
      }

      setEvents(data.data || []);
    } catch (error) {
      console.error("Fetch Events Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load events.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchWeddings();
  }, []);

  // =========================
  // LOAD EVENTS WHEN WEDDING CHANGES
  // =========================

  useEffect(() => {
    if (selectedWedding) {
      fetchEvents(selectedWedding);
    }
  }, [selectedWedding]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE EVENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWedding) {
      Swal.fire({
        icon: "warning",
        title: "No Wedding Selected",
        text: "Please create a wedding first.",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "https://weddingbloom-production-b2a2.up.railway.app/api/events",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            wedding_id: Number(selectedWedding),
            event_name: formData.event_name,
            event_date: formData.event_date,
            start_time: formData.start_time || null,
            end_time: formData.end_time || null,
            venue: formData.venue,
            description: formData.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create event."
        );
      }

      // Close modal
      setShowForm(false);

      // Reset form
      setFormData({
        event_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        venue: "",
        description: "",
      });

      // Reload events from database
      await fetchEvents(selectedWedding);

      Swal.fire({
        icon: "success",
        title: "Event Added!",
        text: "Your wedding event was saved successfully.",
        confirmButtonColor: "#b35b6c",
      });
    } catch (error) {
      console.error("Create Event Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: error.message || "Unable to save event.",
        confirmButtonColor: "#b35b6c",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredEvents = events.filter((event) => {
    const searchValue = search.toLowerCase();

    return (
      event.event_name
        ?.toLowerCase()
        .includes(searchValue) ||
      event.venue
        ?.toLowerCase()
        .includes(searchValue) ||
      event.description
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  // =========================
  // OPEN FORM
  // =========================

  const openForm = () => {
    if (!selectedWedding) {
      Swal.fire({
        icon: "warning",
        title: "Create a Wedding First",
        text: "You need to create a wedding before adding events.",
        confirmButtonColor: "#b35b6c",
      });

      return;
    }

    setShowForm(true);
  };

  return (
    <div className="events-page">

      {/* HEADER */}

      <div className="events-header">

        <div>
          <span className="events-eyebrow">
            WEDDING BLOOM
          </span>

          <h1>Wedding Events</h1>

          <p>
            Organize every important moment of your
            wedding celebration in one place.
          </p>
        </div>

        <button
          className="events-primary-btn"
          onClick={openForm}
        >
          <FaPlus />
          Add Event
        </button>

      </div>


      {/* WEDDING SELECTOR */}

      {weddings.length > 0 && (
        <div className="events-wedding-selector">

          <label>
            Wedding
          </label>

          <select
            value={selectedWedding}
            onChange={(e) =>
              setSelectedWedding(e.target.value)
            }
          >
            {weddings.map((wedding) => (
              <option
                key={wedding.id}
                value={wedding.id}
              >
                {wedding.wedding_title}
              </option>
            ))}
          </select>

        </div>
      )}


      {/* SUMMARY */}

      <div className="events-summary">

        <div className="event-summary-card">

          <div className="event-summary-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <span>Total Events</span>
            <strong>{events.length}</strong>
          </div>

        </div>


        <div className="event-summary-card">

          <div className="event-summary-icon scheduled">
            <FaClock />
          </div>

          <div>
            <span>Scheduled</span>
            <strong>{events.length}</strong>
          </div>

        </div>


        <div className="event-summary-card">

          <div className="event-summary-icon locations">
            <FaMapMarkerAlt />
          </div>

          <div>
            <span>Locations</span>
            <strong>
              {
                new Set(
                  events
                    .map((event) => event.venue)
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>

        </div>

      </div>


      {/* SEARCH */}

      <div className="events-toolbar">

        <div className="events-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* EVENTS */}

      {loading ? (

        <section className="events-empty-card">

          <div className="events-empty-icon">
            <FaCalendarAlt />
          </div>

          <h2>
            Loading events...
          </h2>

          <p>
            Fetching your wedding events.
          </p>

        </section>

      ) : filteredEvents.length === 0 ? (

        <section className="events-empty-card">

          <div className="events-empty-icon">
            <FaCalendarAlt />
          </div>

          <h2>
            {search
              ? "No events found"
              : "No events added yet"}
          </h2>

          <p>
            {search
              ? "Try another search."
              : "Start planning your wedding ceremonies, functions, and special moments by adding your first event."}
          </p>

          {!search && (
            <button
              className="events-empty-btn"
              onClick={openForm}
            >
              <FaPlus />
              Add Your First Event
            </button>
          )}

        </section>

      ) : (

        <section className="events-list">

          {filteredEvents.map((event) => (

            <article
              className="event-card"
              key={event.id}
            >

              <div className="event-card-icon">
                <FaCalendarAlt />
              </div>

              <div className="event-card-info">

                <h3>
                  {event.event_name}
                </h3>

                <p>
                  {event.event_date
                    ? new Date(
                        event.event_date
                      ).toLocaleDateString()
                    : "No date"}
                </p>

                <div className="event-card-details">

                  {event.start_time && (
                    <span>
                      <FaClock />
                      {event.start_time}
                      {event.end_time
                        ? ` - ${event.end_time}`
                        : ""}
                    </span>
                  )}

                  {event.venue && (
                    <span>
                      <FaMapMarkerAlt />
                      {event.venue}
                    </span>
                  )}

                </div>

                {event.description && (
                  <p className="event-description">
                    {event.description}
                  </p>
                )}

              </div>

            </article>

          ))}

        </section>

      )}


      {/* ADD EVENT MODAL */}

      {showForm && (

        <div className="events-modal-overlay">

          <div className="events-modal">

            <div className="events-modal-header">

              <div>

                <span>
                  EVENT MANAGEMENT
                </span>

                <h2>
                  Add Wedding Event
                </h2>

              </div>

              <button
                className="events-close-btn"
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

              {/* EVENT NAME */}

              <div className="events-form-group">

                <label>
                  Event Name
                </label>

                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="e.g. Mehndi Night"
                  required
                />

              </div>


              {/* DATE */}

              <div className="events-form-row">

                <div className="events-form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="events-form-group">

                  <label>
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* END TIME */}

              <div className="events-form-group">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                />

              </div>


              {/* VENUE */}

              <div className="events-form-group">

                <label>
                  Location / Venue
                </label>

                <div className="events-input-wrapper">

                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Event venue"
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="events-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about this event..."
                  rows="4"
                />

              </div>


              {/* ACTIONS */}

              <div className="events-form-actions">

                <button
                  type="button"
                  className="events-cancel-btn"
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
                  className="events-save-btn"
                  disabled={saving}
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Event"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Events;