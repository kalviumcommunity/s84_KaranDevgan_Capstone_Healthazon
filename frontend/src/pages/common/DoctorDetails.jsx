import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/DoctorDetails.css";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ check login status
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = () => {
    if (!user) {
      alert("Please log in to book an appointment");
      navigate("/login");
    } else {
      navigate("/patient/book", { state: { doctorId: doctor._id } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="doctor-details">
      <h2> {doctor.name}</h2>
      <p>
        <strong>Email:</strong> {doctor.email}
      </p>
      <p>
        <strong>Specialization:</strong> {doctor.specialization || "N/A"}
      </p>
      <p>
        <strong>Experience:</strong> {doctor.experience || 0} years
      </p>
      <p>
        <strong>Bio:</strong> {doctor.bio || "No bio available"}
      </p>
      <p>
        <strong>Available Timings:</strong> {doctor.availableTimings || "N/A"}
      </p>
      <p>
        <strong>Contact:</strong> {doctor.contact || "N/A"}
      </p>
      <p>
        <strong>Address:</strong> {doctor.address || "N/A"}
      </p>

      {/* Book Appointment Button */}
      <button className="book-btn" onClick={handleBookAppointment}>
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorDetails;
