import { motion } from "framer-motion";
import { X } from "lucide-react";
import "./DoctorDetails.css";

export default function DoctorDetailsModal({ doctor, onClose }) {
  if (!doctor) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2>Doctor Details</h2>

        {doctor.profileImage && (
          <img
            src={doctor.profileImage}
            alt="Doctor Profile"
            className="doctor-avatar"
          />
        )}

        <p>
          <strong>Name:</strong> {doctor.name}
        </p>
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p>
          <strong>Experience:</strong> {doctor.experience} years
        </p>
        <p>
          <strong>Fees:</strong> ₹{doctor.fees}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Location:</strong> {doctor.location || "N/A"}
        </p>
        <p>
          <strong>Languages Spoken:</strong>{" "}
          {doctor.languagesSpoken?.length
            ? doctor.languagesSpoken.join(", ")
            : "N/A"}
        </p>

        <div className="availability-section">
          <strong>Availability:</strong>
          {Array.isArray(doctor.availability) &&
          doctor.availability.length > 0 ? (
            <ul>
              {doctor.availability.map((slot) => (
                <li key={slot._id || `${slot.day}-${slot.from}`}>
                  📅 {slot.day}: ⏰ {slot.from} - {slot.to}
                </li>
              ))}
            </ul>
          ) : (
            <p>No availability provided</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
