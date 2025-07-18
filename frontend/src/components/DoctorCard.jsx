// src/components/DoctorCard.jsx
import "./DoctorCard.css";

function DoctorCard({ doctor, onViewDetails, onBookAppointment }) {
  // Call parent's onBookAppointment handler, passing the doctor
  const handleBook = () => {
    if (onBookAppointment && typeof onBookAppointment === "function") {
      onBookAppointment(doctor);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails && typeof onViewDetails === "function") {
      onViewDetails(doctor);
    } else {
      // Fallback alert if onViewDetails is not passed
      alert(`Doctor Details:\n${doctor.name} - ${doctor.specialization}`);
    }
  };

  return (
    <div className="doctor-card">
      <h3>Dr. {doctor.name}</h3>
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
        <button className="details-btn" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
