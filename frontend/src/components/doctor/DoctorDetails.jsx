import { motion } from "framer-motion";
import { X } from "lucide-react";
import "./DoctorDetails.css"; // Keep your existing styles if needed

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
        style={{
          maxWidth: "90vw",
          width: "500px",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: "1rem" }}>Doctor Details</h2>

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
          <strong>Age:</strong> {doctor.age || "N/A"}
        </p>
        <p>
          <strong>Fees:</strong> ₹{doctor.fees}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>

        <div style={{ marginTop: "0.5rem" }}>
          <strong>Availability:</strong>
          {Array.isArray(doctor.availability) &&
          doctor.availability.length > 0 ? (
            <ul style={{ paddingLeft: "1rem", marginTop: "0.3rem" }}>
              {doctor.availability.map((slot) => (
                <li key={slot._id}>
                  📅 {slot.day}: ⏰ {slot.from} - {slot.to}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: "0.5rem" }}>No availability provided</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
