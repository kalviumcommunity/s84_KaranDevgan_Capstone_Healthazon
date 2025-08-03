import "../../styles/AppointmentCard.css";

function AppointmentCard({ data, onComplete, role }) {
  const { patientName, doctorName, date, time, status } = data;

  return (
    <div className="appointment-card">
      <div>
        <h4>{role === "doctor" ? patientName : `Dr. ${doctorName}`}</h4>
        <p>
          {date} at {time}
        </p>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>

      {onComplete && status !== "Completed" && (
        <button onClick={onComplete}>Mark as Completed</button>
      )}
    </div>
  );
}

export default AppointmentCard;
