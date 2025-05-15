// pages/Doctors.jsx
import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/doctors") 
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Failed to fetch doctors", err));
  }, []);

  return (
    <main className="main">
      <h2>Meet Our Doctors</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </main>
  );
}

export default Doctors;
