import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./BookAppointmentForm.css";

const BookAppointmentForm = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (location.state?.doctor) {
      sessionStorage.setItem(
        "selectedDoctor",
        JSON.stringify(location.state.doctor)
      );
      setSelectedDoctor(location.state.doctor);
    } else {
      const saved = sessionStorage.getItem("selectedDoctor");
      if (saved) {
        setSelectedDoctor(JSON.parse(saved));
      }
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    doctor: selectedDoctor?._id || "",
    date: "",
    time: "",
    appointmentType: "offline",
    healthIssue: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      doctor: selectedDoctor?._id || "",
    }));
  }, [selectedDoctor]);

  const patientInfo = JSON.parse(localStorage.getItem("patient")) || {};
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctors"
      )
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("⚠️ Please login again to book an appointment.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/appointment",
        {
          doctor: formData.doctor,
          patient: patientInfo._id,
          appointmentDate: formData.date,
          timeSlot: formData.time,
          appointmentType: formData.appointmentType,
          notes: formData.healthIssue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Appointment booked successfully (Pending Confirmation). You will be notified via email");

      setFormData({
        doctor: selectedDoctor?._id || "",
        date: "",
        time: "",
        appointmentType: "offline",
        healthIssue: "",
      });
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "⚠️ Error while booking appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    return slots;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="booking-form max-w-xl mx-auto p-4 border rounded shadow"
    >
      <h3 className="text-xl font-semibold mb-4">Fill all the details</h3>

      <div className="mb-3">
        <label className="block font-medium mb-1">Patient Name:</label>
        <input
          type="text"
          value={patientInfo.name || ""}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Patient Email:</label>
        <input
          type="email"
          value={patientInfo.email || ""}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {!selectedDoctor && (
        <div className="mb-3">
          <label className="block font-medium mb-1">Select Doctor:</label>
          {loading ? (
            <p>Loading doctors...</p>
          ) : (
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {selectedDoctor && (
        <div className="mb-3">
          <label className="block font-medium mb-1">Doctor:</label>
          <input
            type="text"
            value={`${selectedDoctor.name} (${selectedDoctor.specialization})`}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      )}

      <div className="mb-3">
        <label className="block font-medium mb-1">Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={todayDate}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Time Slot:</label>
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Time Slot --</option>
          {generateTimeSlots().map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Appointment Type:</label>
        <select
          name="appointmentType"
          value={formData.appointmentType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
          <option value="video call">Video Call</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Health Issue / Notes:</label>
        <textarea
          name="healthIssue"
          placeholder="Briefly describe your concern..."
          value={formData.healthIssue}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default BookAppointmentForm;
