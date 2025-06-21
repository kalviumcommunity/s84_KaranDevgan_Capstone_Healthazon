
// src/components/doctor/DoctorAppointmentsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const doctor = JSON.parse(localStorage.getItem("doctor")); // ✅ get doctor ID from storage

  // Fetch appointments for the logged-in doctor
  const fetchAppointments = async () => {
    if (!token || !doctor?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/appointment/doctor/${doctor._id}`, // ✅ correct URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/appointment/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Appointment ${newStatus}`);
      fetchAppointments(); // Refresh after update
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Error updating status");
    }
  };

  return (
    <div>
      <h3>Your Appointments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Patient:</strong> {appointment.patient?.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.appointmentDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appointment.timeSlot}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {appointment.status}
              </span>
            </p>

            {/* Confirm/Cancel only if appointment is pending */}
            {appointment.status === "pending" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() =>
                    handleUpdateStatus(appointment._id, "accepted")
                  }
                >
                  ✅ Confirm
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(appointment._id, "cancelled")
                  }
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
