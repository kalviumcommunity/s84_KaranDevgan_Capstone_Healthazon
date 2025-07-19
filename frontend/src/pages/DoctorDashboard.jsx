
// src/pages/DoctorDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentsList from "../components/doctor/DoctorAppointmentsList";
//import NotificationBell from "../components/NotificationBell";
import DoctorProfile from "../components/doctor/DoctorProfile";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    fees: "",
    profileImage: "",
    location: "",
    experience: "",
    availableDays: [],
    languagesSpoken: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("doctorToken");
      if (!token) return navigate("/doctor-login");

      try {
        const res = await fetch(
          "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctor/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const { doctor: data } = await res.json();
        setDoctor(data);
        setForm({
          name: data.name || "",
          specialization: data.specialization || "",
          fees: data.fees || "",
          profileImage: data.profileImage || "",
          location: data.location || "",
          experience: data.experience || "",
          availableDays: data.availableDays || [],
          languagesSpoken: data.languagesSpoken || [],
        });
      } catch (error) {
        console.error("Failed to load doctor profile:", error);
        localStorage.removeItem("doctorToken");
        navigate("/doctor-login");
      }
    };

    loadProfile();
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    const values = value.split(",").map((v) => v.trim());
    setForm((f) => ({ ...f, [name]: values }));
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("doctorToken");
    const res = await fetch(
      "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctor/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    setDoctor(data.doctor);
    setIsEditing(false);
    alert("Profile updated");
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    navigate("/doctor-login");
  };

  if (!doctor) return <p>Loading profile...</p>;

  return (
    <main className="main">
      
      <h2>Welcome back, Dr {doctor.name} 👋</h2>
      <div className="tabs">
        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "appointments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
      </div>

      {activeTab === "profile" && (
        <DoctorProfile
          doctor={doctor}
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          saveProfile={saveProfile}
          handleLogout={handleLogout}
        />
      )}

      {activeTab === "appointments" && <DoctorAppointmentsList />}
    </main>
  );
}
