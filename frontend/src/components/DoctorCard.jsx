// src/components/DoctorCard.jsx
import "./DoctorCard.css";

function DoctorCard({ doctor, onViewDetails, onBookAppointment }) {
  // Call parent's onBookAppointment handler, passing the doctor
  const handleBook = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  const handleViewDetails = () => {
    alert(`Doctor Details:\n${doctor.name} - ${doctor.specialization}`);
  };

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

      <div className="doctor-card-buttons">
        <button className="book-btn" onClick={handleBook}>
          Book Appointment
        </button>
        <button className="details-btn" onClick={() => onViewDetails(doctor)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
