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
          `http://localhost:3000/api/appointment/patient/${patient._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, patient?._id]);

  const groupedAppointments = {
    pending: [],
    cancelled: [],
    accepted: [],
  };

  appointments.forEach((app) => {
    if (groupedAppointments[app.status]) {
      groupedAppointments[app.status].push(app);
    }
  });

  if (loading) return <p>Loading appointments...</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div className="appointment-list">
      {["pending", "cancelled", "accepted"].map((status) =>
        groupedAppointments[status].length > 0 ? (
          <div className="appointment-section" key={status}>
            <h4>{status.charAt(0).toUpperCase() + status.slice(1)} Appointments</h4>
            {groupedAppointments[status].map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        ) : null
      )}
    </div>
  );
};

export default AppointmentList;