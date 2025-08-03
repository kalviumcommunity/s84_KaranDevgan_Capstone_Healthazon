// src/pages/PublicDoctors.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "../../styles/PublicDoctors.css";

function PublicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctor");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="public-doctors">
      <h2>Our Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <h3> {doc.name}</h3>
              <p><strong>Specialization:</strong> {doc.specialization || "N/A"}</p>
              <p><strong>Experience:</strong> {doc.experience || 0} years</p>
              <Link to={`/doctors/${doc._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicDoctors;
