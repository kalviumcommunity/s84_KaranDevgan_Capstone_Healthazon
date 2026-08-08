import { 
  FaPrescription, 
  FaMicroscope, 
  FaClipboardList, 
  FaStethoscope, 
  FaPrint,
  FaFileMedical,
  FaEdit
} from "react-icons/fa";
import { formatDoctorName } from "../../utils/doctorUtils";
import "../../styles/PrescriptionCard.css";

function PrescriptionCard({ appointment, onEdit, isDoctor = false }) {
  if (!appointment) return null;

  const {
    prescription,
    investigations,
    diagnosis,
    notes,
    doctor,
    patient,
    date,
    time
  } = appointment;

  const doctorName = formatDoctorName(doctor?.name || "Doctor");
  const patientName = patient?.name || "Patient";
  const doctorSpecialty = doctor?.specialization || "Healthcare Specialist";

  const handlePrint = (e) => {
    e.stopPropagation();
    window.print();
  };

  return (
    <div className="prescription-card-container">
      <div className="prescription-card-header">
        <div className="rx-title-group">
          <div className="rx-badge-icon">
            <FaFileMedical />
          </div>
          <div>
            <h4 className="rx-card-heading">Medical Prescription & Consultation Record</h4>
            <p className="rx-card-subheading">
              Issued by {doctorName} ({doctorSpecialty}) for {patientName}
            </p>
          </div>
        </div>
        <div className="rx-card-actions">
          <button 
            type="button" 
            className="rx-print-btn" 
            onClick={handlePrint}
            title="Print or Save PDF"
          >
            <FaPrint /> Print Rx
          </button>
          {isDoctor && onEdit && (
            <button 
              type="button" 
              className="rx-edit-btn" 
              onClick={() => onEdit(appointment)}
              title="Edit Prescription & Notes"
            >
              <FaEdit /> Edit Rx
            </button>
          )}
        </div>
      </div>

      <div className="prescription-card-body">
        {diagnosis && (
          <div className="rx-card-section">
            <div className="rx-section-label">
              <FaStethoscope className="icon-diagnosis" />
              <span>Diagnosis / Assessment</span>
            </div>
            <div className="rx-section-content diagnosis-text">
              {diagnosis}
            </div>
          </div>
        )}

        {prescription && (
          <div className="rx-card-section">
            <div className="rx-section-label">
              <FaPrescription className="icon-rx" />
              <span>Prescribed Medications & Dosage</span>
            </div>
            <div className="rx-section-content prescription-text">
              {prescription.split("\n").map((line, idx) => (
                <div key={idx} className="rx-med-line">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {investigations && (
          <div className="rx-card-section">
            <div className="rx-section-label">
              <FaMicroscope className="icon-investigation" />
              <span>Investigations & Lab Tests Ordered</span>
            </div>
            <div className="rx-section-content investigation-text">
              {investigations}
            </div>
          </div>
        )}

        {notes && (
          <div className="rx-card-section">
            <div className="rx-section-label">
              <FaClipboardList className="icon-notes" />
              <span>Doctor's Advice & Follow-Up Instructions</span>
            </div>
            <div className="rx-section-content notes-text">
              {notes}
            </div>
          </div>
        )}

        {!prescription && !diagnosis && !investigations && !notes && (
          <div className="rx-card-empty">
            <p>Consultation marked as completed. Detailed medical notes pending.</p>
          </div>
        )}
      </div>

      <div className="prescription-card-footer">
        <span>Consultation Date: {new Date(date).toLocaleDateString()} at {time}</span>
        <span className="rx-verified-badge">✓ Verified Prescription</span>
      </div>
    </div>
  );
}

export default PrescriptionCard;
