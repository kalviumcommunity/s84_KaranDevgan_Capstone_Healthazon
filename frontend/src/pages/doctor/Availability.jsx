import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaClock, FaRegSave, FaShieldAlt } from "react-icons/fa";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import "../../styles/DoctorAvailability.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STORAGE_KEY = "healthazon-doctor-availability";

function DoctorAvailability() {
  const { user, setUser, token } = useAuth();
  const [availableDays, setAvailableDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [notes, setNotes] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Check local storage cache
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAvailableDays(parsed.availableDays || []);
        setStartTime(parsed.startTime || "09:00");
        setEndTime(parsed.endTime || "17:00");
        setNotes(parsed.notes || "");
        setLastSavedAt(parsed.lastSavedAt || "");
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. Fetch latest profile from backend database to ensure sync
    const fetchDoctorProfile = async () => {
      if (!token) return;
      try {
        const res = await API.get("/doctor/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.availableTimings) {
          // If availableTimings exists in backend DB and no local cache was set, fallback defaults
          if (!saved) {
            const daysFound = weekdays.filter((w) =>
              res.data.availableTimings.toLowerCase().includes(w.toLowerCase().slice(0, 3))
            );
            if (daysFound.length > 0) setAvailableDays(daysFound);
          }
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile availability:", err);
      }
    };

    fetchDoctorProfile();
  }, [token]);

  const toggleDay = (day) => {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    );
  };

  const availabilityPreview = useMemo(() => {
    if (availableDays.length === 0) return "No days selected yet";
    return `${availableDays.length} day${availableDays.length > 1 ? "s" : ""} selected`;
  }, [availableDays]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availableDays.length === 0) {
      showToast.error("Please select at least one available day.");
      return;
    }

    if (startTime >= endTime) {
      showToast.error("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    const dayAbbrs = availableDays.map((d) => d.slice(0, 3)).join(", ");
    const formattedTimings = `${dayAbbrs} ${startTime}-${endTime}${notes ? ` (${notes})` : ""}`;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await API.put(
        "/doctor/profile",
        { availableTimings: formattedTimings },
        config
      );

      // Save to AuthContext
      setUser((prev) => ({
        ...prev,
        availableTimings: formattedTimings,
        ...(res.data?.doctor || {}),
      }));

      // Cache locally
      const payload = {
        availableDays,
        startTime,
        endTime,
        notes,
        formattedTimings,
        lastSavedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSavedAt(payload.lastSavedAt);

      showToast.success("Availability updated on database and live dashboard!");
    } catch (err) {
      console.error("Failed to save availability:", err);
      showToast.error(err.response?.data?.message || "Failed to update availability on server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="availability-page">
      <motion.div
        className="availability-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="availability-hero-copy">
          <span className="availability-kicker">Practice schedule</span>
          <h2>Set your availability</h2>
          <p>Keep your consultation hours clear, predictable, and easy for patients to book.</p>
        </div>
        <div className="availability-hero-card">
          <FaShieldAlt />
          <div>
            <strong>Local persistence enabled</strong>
            <span>Saved settings stay on this device for review.</span>
          </div>
        </div>
      </motion.div>

      <div className="availability-grid">
        <motion.form
          onSubmit={handleSubmit}
          className="availability-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="section-title-row">
            <FaCalendarCheck />
            <h3>Weekly schedule</h3>
          </div>

          <div className="checkbox-group">
            {weekdays.map((day) => (
              <label key={day} className={availableDays.includes(day) ? "checked" : ""}>
                <input
                  type="checkbox"
                  checked={availableDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>

          <div className="time-inputs">
            <label>
              <span>Start time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>

            <label>
              <span>End time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="notes-field">
            <span>Availability notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional note for your schedule, e.g. teleconsultation only on Fridays."
              rows="4"
            />
          </label>

          <button type="submit" className="save-btn" disabled={isSaving}>
            <FaRegSave />
            {isSaving ? "Saving..." : "Save availability"}
          </button>
        </motion.form>

        <motion.aside
          className="availability-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div className="section-title-row">
            <FaClock />
            <h3>Preview</h3>
          </div>

          <p className="summary-status">{availabilityPreview}</p>

          {availableDays.length > 0 ? (
            <ul>
              {availableDays.map((day) => (
                <li key={day}>
                  <strong>{day}</strong>
                  <span>
                    {startTime} - {endTime}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-summary">Select your weekly availability to show a patient-friendly schedule.</p>
          )}

          {lastSavedAt && (
            <div className="last-saved">
              Last saved: {new Date(lastSavedAt).toLocaleString()}
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

export default DoctorAvailability;
