import { motion, AnimatePresence } from "react";
import { 
  FaTimes, 
  FaPrescription, 
  FaMicroscope, 
  FaClipboardList, 
  FaStethoscope,
  FaFileMedical,
  FaUserMd,
  FaCalendarAlt,
  FaPrint
} from "react-icons/fa";
import { formatDoctorName } from "../../utils/doctorUtils";
import "../../styles/CompletionModal.css";

function PrescriptionModal({ appointment, isOpen, onClose }) {
  if (!isOpen || !appointment) return null;

  const doctorName = formatDoctorName(appointment.doctor?.name || "Doctor");
  const patientName = appointment.patient?.name || "Patient";
  const doctorSpecialty = appointment.doctor?.specialization || "Healthcare Specialist";

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div 
          className="completion-modal-card prescription-view-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header rx-header">
            <div className="header-title">
              <FaFileMedical className="header-icon rx-icon" />
              <div>
                <h2>Medical Prescription & Consultation Summary</h2>
                <p>Issued by {doctorName}</p>
              </div>
            </div>
            <div className="header-actions-row">
              <button type="button" className="print-btn" onClick={handlePrint} title="Print Prescription">
                <FaPrint /> Print
              </button>
              <button type="button" className="close-btn" onClick={onClose} aria-label="Close modal">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="prescription-content">
            <div className="rx-meta-grid">
              <div className="rx-meta-item">
                <span className="rx-meta-label">Patient Name</span>
                <span className="rx-meta-val">{patientName}</span>
              </div>
              <div className="rx-meta-item">
                <span className="rx-meta-label">Doctor</span>
                <span className="rx-meta-val">{doctorName} ({doctorSpecialty})</span>
              </div>
              <div className="rx-meta-item">
                <span className="rx-meta-label">Date of Consultation</span>
                <span className="rx-meta-val">{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
              </div>
              <div className="rx-meta-item">
                <span className="rx-meta-label">Status</span>
                <span className="rx-meta-val status-badge completed">Completed</span>
              </div>
            </div>

            {appointment.issue && (
              <div className="rx-section">
                <h4 className="rx-section-title">
                  <FaStethoscope /> Reason for Visit
                </h4>
                <div className="rx-box issue-box">
                  {appointment.issue}
                </div>
              </div>
            )}

            {appointment.diagnosis && (
              <div className="rx-section">
                <h4 className="rx-section-title">
                  <FaStethoscope /> Clinical Diagnosis
                </h4>
                <div className="rx-box diagnosis-box">
                  {appointment.diagnosis}
                </div>
              </div>
            )}

            {appointment.prescription && (
              <div className="rx-section">
                <h4 className="rx-section-title">
                  <FaPrescription /> Prescribed Medications & Dosage
                </h4>
                <div className="rx-box prescription-box">
                  {appointment.prescription.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {appointment.investigations && (
              <div className="rx-section">
                <h4 className="rx-section-title">
                  <FaMicroscope /> Investigations & Tests Ordered
                </h4>
                <div className="rx-box investigations-box">
                  {appointment.investigations}
                </div>
              </div>
            )}

            {appointment.notes && (
              <div className="rx-section">
                <h4 className="rx-section-title">
                  <FaClipboardList /> Advice & Follow-Up Instructions
                </h4>
                <div className="rx-box notes-box">
                  {appointment.notes}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions rx-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PrescriptionModal;
