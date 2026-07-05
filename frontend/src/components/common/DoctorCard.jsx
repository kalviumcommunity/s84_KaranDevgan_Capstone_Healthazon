import "../../styles/DoctorCard.css";
import { FaCheckCircle } from "react-icons/fa";

function DoctorCard({ doctor, isSelected, onSelect }) {
  const specialtyName = doctor.specialization || doctor.specialty || "General Physician";
  const initials = doctor.name
    ? doctor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <div
      className={`doctor-card-item ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect && onSelect(doctor)}
    >
      <div className="card-avatar-wrapper">
        <div className="card-avatar">{initials}</div>
        <FaCheckCircle className="verified-icon" />
      </div>
      <div className="card-info">
        <h4 className="card-name">{doctor.name}</h4>
        <span className="card-specialty">{specialtyName}</span>
        {doctor.experience && (
          <span className="card-exp">{doctor.experience} yrs experience</span>
        )}
      </div>
    </div>
  );
}

export default DoctorCard;
