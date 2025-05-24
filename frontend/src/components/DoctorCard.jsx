
// // import "./DoctorCard.css";

// // function DoctorCard({ doctor }) {
// //   return (
// //     <div className="doctor-card">
// //       <h3>{doctor.name}</h3>
// //       <p>
// //         <strong>Specialization:</strong> {doctor.specialization}
// //       </p>
// //       <p>
// //         <strong>Experience:</strong> {doctor.experience} years
// //       </p>
// //       <p>
// //         <strong>Contact:</strong> {doctor.email || "N/A"}
// //       </p>
// //       <button className="book-btn">Book Appointment</button>
// //     </div>
// //   );
// // }

// // export default DoctorCard;
// import "./DoctorCard.css";

// function DoctorCard({ doctor, onViewDetails, onBookAppointment }) {
//   return (
//     <div className="doctor-card">
//       <h3>{doctor.name}</h3>
//       <p>
//         <strong>Specialization:</strong> {doctor.specialization}
//       </p>
//       <p>
//         <strong>Experience:</strong> {doctor.experience} years
//       </p>
//       <p>
//         <strong>Contact:</strong> {doctor.email || "N/A"}
//       </p>

//       <div style={{ display: "flex", gap: "0.5rem" }}>
//         <button className="book-btn" onClick={() => onBookAppointment(doctor)}>
//           Book Appointment
//         </button>
//         <button className="details-btn" onClick={() => onViewDetails(doctor)}>
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }

// export default DoctorCard;

import "./DoctorCard.css";

function DoctorCard({ doctor, onViewDetails, onBookAppointment }) {
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
        <button className="book-btn" onClick={() => onBookAppointment(doctor)}>
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
