// pages/Doctors.jsx
import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctors"
    )
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="main">
      <h2>Meet Our Doctors</h2>
      <div className="doctor-list-container">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </main>
  );
}

export default Doctors;
