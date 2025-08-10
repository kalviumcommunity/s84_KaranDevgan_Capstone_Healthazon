import { useState } from "react";
import "../../styles/DoctorAvailability.css";
import { showToast } from "../../utils/toast";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function DoctorAvailability() {
  const [availableDays, setAvailableDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      days: availableDays,
      startTime,
      endTime,
    };
    showToast.success("Doctor availability submitted:", data);
  };

  return (
    <div className="availability-page">
      <h2>Set Your Availability</h2>

      <form onSubmit={handleSubmit} className="availability-form">
        <div className="checkbox-group">
          {weekdays.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={availableDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>

        <div className="time-inputs">
          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>

          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Save Availability</button>
      </form>

      <div className="summary">
        <h4>Current Availability:</h4>
        {availableDays.length === 0 ? (
          <p>No days selected</p>
        ) : (
          <ul>
            {availableDays.map((day) => (
              <li key={day}>
                {day}: {startTime} - {endTime}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DoctorAvailability;
