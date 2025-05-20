import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("token");
    navigate("/doctor-login");
  };

  if (!doctor) {
    return <p>Loading profile...</p>;
  }

  return (
    <main className="main">
      <h2>Welcome back, {doctor.name} 👋</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
            alt="Avatar"
            className="profile-avatar"
          />
        </div>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p>
          <strong>Experience:</strong> {doctor.experience} years
        </p>
        <p>
          <strong>Fees:</strong> ₹{doctor.fees}
        </p>

        <div className="profile-actions">
          <button className="edit-btn" disabled>
            Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}

export default DoctorDashboard;
