import "../../styles/DoctorCard.css";

function DoctorCard({ doctor, isSelected, onSelect }) {
  return (
    <div
      className={`doctor-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(doctor._id)}
    >
      <h4>{doctor.name}</h4>
      <p>{doctor.specialty}</p>
    </div>
  );
}

export default DoctorCard;
