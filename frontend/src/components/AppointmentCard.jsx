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
    <div className="appointment-card">
      <div className="appointment-header">
        <h3 className="doctor-name">
          Dr {doctor?.name}
          <span className="specialization"> ({doctor?.specialization})</span>
        </h3>

        <span className={`status-badge status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
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
          <p className="issue-text">
            <strong>Issue:</strong> {healthIssue}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
