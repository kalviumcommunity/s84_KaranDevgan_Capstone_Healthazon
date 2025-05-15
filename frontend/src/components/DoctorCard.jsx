// DoctorCard.jsx
import "./DoctorCard.css";

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p>
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p>
        <strong>Experience:</strong> {doctor.experience} years
      </p>
      <p>
        <strong>Contact:</strong> {doctor.email || "N/A"}
      </p>
      <button className="book-btn">Book Appointment</button>
    </div>
  );
}

export default DoctorCard;
