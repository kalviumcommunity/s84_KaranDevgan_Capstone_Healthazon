// src/pages/DoctorAppointments.jsx
import React from "react";
import DoctorAppointmentsList from "../components/doctor/DoctorAppointmentsList";

export default function DoctorAppointments() {
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        📅 Appointments
      </h1>
      <DoctorAppointmentsList />
    </div>
  );
}
