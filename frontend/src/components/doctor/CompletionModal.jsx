import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, 
  FaPrescription, 
  FaMicroscope, 
  FaClipboardList, 
  FaStethoscope,
  FaCheckCircle,
  FaUser
} from "react-icons/fa";
import "../../styles/CompletionModal.css";

function CompletionModal({ appointment, isOpen, onClose, onSubmit, isSubmitting }) {
  const [diagnosis, setDiagnosis] = useState(appointment?.diagnosis || "");
  const [prescription, setPrescription] = useState(appointment?.prescription || "");
  const [investigations, setInvestigations] = useState(appointment?.investigations || "");
  const [notes, setNotes] = useState(appointment?.notes || "");

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      diagnosis,
      prescription,
      investigations,
      notes,
    });
  };

  const patientName = appointment.patient?.name || "Patient";

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div 
          className="completion-modal-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="header-title">
              <FaCheckCircle className="header-icon" />
              <div>
                <h2>Complete Consultation</h2>
                <p>Provide medical prescription & advice for {patientName}</p>
              </div>
            </div>
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close modal">
              <FaTimes />
            </button>
          </div>

          <div className="patient-summary-banner">
            <div className="summary-item">
              <FaUser />
              <span><strong>Patient:</strong> {patientName}</span>
            </div>
            <div className="summary-item">
              <span><strong>Date & Time:</strong> {new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
            </div>
            {appointment.issue && (
              <div className="summary-item full-width">
                <span><strong>Chief Complaint:</strong> {appointment.issue}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="completion-form">
            <div className="form-group">
              <label>
                <FaStethoscope />
                Diagnosis / Clinical Findings
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Upper Respiratory Tract Infection, Hypertension"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaPrescription />
                Prescription & Dosage (Medications)
              </label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="e.g. 1. Tab Amoxicillin 500mg - 1 capsule thrice daily after meals for 5 days&#10;2. Tab Paracetamol 650mg - 1 tablet SOS for fever"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMicroscope />
                Investigations / Lab Tests Ordered (Optional)
              </label>
              <input
                type="text"
                value={investigations}
                onChange={(e) => setInvestigations(e.target.value)}
                placeholder="e.g. Complete Blood Count (CBC), Chest X-Ray PA View, Lipid Profile"
              />
            </div>

            <div className="form-group">
              <label>
                <FaClipboardList />
                Advice & Follow-Up Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Drink plenty of warm water. Avoid cold foods. Follow up after 5 days if symptoms persist."
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit & Mark Complete"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CompletionModal;
