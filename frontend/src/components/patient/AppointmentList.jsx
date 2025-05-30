
import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCard from "../AppointmentCard";
import "./AppointmentList.css";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const patient = JSON.parse(localStorage.getItem("patient"));

  useEffect(() => {
    if (!token || !patient?._id) return;

    axios
      .get(`http://localhost:3000/api/appointment/patient/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to fetch appointments", err))
      .finally(() => setLoading(false));
  }, [token, patient]);

  // Separate appointments by status
  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  );
  const confirmedAppointments = appointments.filter(
    (app) => app.status === "confirmed"
  );
  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  );

  if (loading) return <p>Loading appointments...</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
 
    <div className="appointment-list">

      {loading && <p>Loading appointments...</p>}

      {!loading && appointments.length === 0 && <p>No appointments yet.</p>}

      {!loading && pendingAppointments.length > 0 && (
        <div className="appointment-section">
          <h4>Pending Appointments</h4>
          {pendingAppointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}

      {!loading && confirmedAppointments.length > 0 && (
        <div className="appointment-section">
          <h4>Confirmed Appointments</h4>
          {confirmedAppointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}

      {!loading && completedAppointments.length > 0 && (
        <div className="appointment-section">
          <h4>Completed Appointments</h4>
          {completedAppointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
