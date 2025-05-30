import React from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  const {
    doctor,
    appointmentDate,
    timeSlot,
    appointmentType,
    status,
    healthIssue,
  } = appointment;

  const formattedDate = new Date(appointmentDate).toLocaleDateString();

  return (
    <div className={`appointment-card ${status}`}>
      <div className="appointment-header">
        <div>
          <h3 className="doctor-name">
            {doctor?.name}
            <span className="specialization"> ({doctor?.specialization})</span>
          </h3>
        </div>
        <span className="status">{status}</span>
      </div>

      <div className="appointment-details">
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Time:</strong> {timeSlot}
        </p>
        <p>
          <strong>Type:</strong> {appointmentType}
        </p>
        {healthIssue && (
          <p>
            <strong>Issue:</strong> {healthIssue}
          </p>
        )}
      </div>
      {/* <p className={`status-label ${appointment.status}`}>
        Status: {appointment.status}
      </p> */}
    </div>
  );
};

export default AppointmentCard;
