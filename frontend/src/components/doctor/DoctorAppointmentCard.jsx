// components/doctor/DoctorAppointmentCard.jsx
import React from "react";
import "./DoctorAppointmentCard.css";

const DoctorAppointmentCard = ({ appointment, onStatusChange }) => {
  const handleChange = (e) => {
    const newStatus = e.target.value;
    onStatusChange(appointment._id, newStatus);
  };

  const { patient, appointmentDate, timeSlot, type, status } = appointment;

  return (
    <div className="doctor-appointment-card">
      <h4><strong>Patient : </strong>{patient?.name}</h4>
      <p>
        <strong>Date:</strong> {new Date(appointmentDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {timeSlot}
      </p>
      <p>
        <strong>Type:</strong> {type}
      </p>

      <label>
        <strong>Status:</strong>{" "}
        <select value={status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </label>
    </div>
  );
};

export default DoctorAppointmentCard;
