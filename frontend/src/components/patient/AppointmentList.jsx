// export default AppointmentList;
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
    if (!token || !patient?._id) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/appointment/patient/${patient._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        //console.log("Fetched appointments:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, patient?._id]);

  // Initialize group structure with ALL possible statuses
  const groupedAppointments = {
    pending: [],
    confirmed: [],
    cancelled: [],
    completed: [],
  };

  // Group fetched appointments by status
  appointments.forEach((app) => {
    if (groupedAppointments.hasOwnProperty(app.status)) {
      groupedAppointments[app.status].push(app);
    }
  });

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="appointment-list">
      <h2 className="appointment-title">My Appointments</h2>

      {Object.keys(groupedAppointments).map((status) => (
        <div className="appointment-section" key={status}>
          <h3 className={`section-heading status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)} Appointments
          </h3>

          {groupedAppointments[status].length > 0 ? (
            groupedAppointments[status].map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
              />
            ))
          ) : (
            <p className="empty-message">No {status} appointments.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
