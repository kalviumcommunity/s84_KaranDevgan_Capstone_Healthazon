import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
 // Reuse same styles

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patient");
    localStorage.removeItem("token");
    navigate("/patient/login");
  };

  if (!patient) {
    return <p>Loading profile...</p>;
  }

  return (
    <main className="main">
      <h2>Welcome back, {patient.name} 👋</h2>
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=patient"
            alt="Avatar"
            className="profile-avatar"
          />
        </div>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Age:</strong> {patient.age}
        </p>

        <div className="dashboard-section">
          <h3>Your Appointments</h3>
          <p>[Placeholder] Upcoming appointments will be shown here.</p>
        </div>

        <div className="dashboard-section">
          <h3>Health Records</h3>
          <p>[Placeholder] Your health records will appear here.</p>
        </div>

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

export default PatientDashboard;
