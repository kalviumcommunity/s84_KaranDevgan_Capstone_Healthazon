// src/components/doctor/DoctorAppointmentsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import "./DoctorAppointmentsList.css";

export default function DoctorAppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("doctorToken");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const fetchAppointments = async () => {
    if (!token || !doctor?._id) return;

    try {
      const res = await axios.get(
        `https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/appointment/doctor/${doctor._id}`,
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
  }, [token]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/appointment/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Error updating status");
    }
  };

  const groupedAppointments = {
    pending: [],
    confirmed: [],
    cancelled: [],
    completed: [],
  };

  appointments.forEach((app) => {
    if (groupedAppointments.hasOwnProperty(app.status)) {
      groupedAppointments[app.status].push(app);
    }
  });

  return (
    <div className="doctor-appointments-container">
      <h3>Your Appointments</h3>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <div className="appointments-sections">
          {Object.keys(groupedAppointments).map((status) => (
            <div key={status} className="appointments-section">
              <h4 className={`section-heading status-${status}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} Appointments
              </h4>
              <div className="appointment-grid">
                {groupedAppointments[status].length > 0 ? (
                  groupedAppointments[status].map((appointment) => (
                    <DoctorAppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onStatusChange={handleUpdateStatus}
                    />
                  ))
                ) : (
                  <p className="empty-message">No {status} appointments.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
