// src/pages/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import DoctorDetailsModal from "../components/doctor/DoctorDetails";
import AppointmentList from "../components/patient/AppointmentList";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || "",
        age: patient.age || "",
        contact: patient.contact || "",
        email: patient.email || "",
      });
    }
  }, [patient]);

  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [availableDay, setAvailableDay] = useState("");
  const [language, setLanguage] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");
    const loadProfile = async () => {
      const token = localStorage.getItem("patientToken");
      if (!token) return navigate("/patient/login");

      const res = await fetch(
        "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/patient/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        localStorage.removeItem("patientToken");
        navigate("/patient/login");
        return;
      }

      const { patient: data } = await res.json();
      setPatient(data);
      setForm({
        name: data.name || "",
        age: data.age || "",
        contact: data.contact || "",
        email: data.email || "",
      });
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setErrorDoctors("");
      try {
        let query = [];
        if (specialization)
          query.push(`specialization=${encodeURIComponent(specialization)}`);
        if (maxFees) query.push(`fees=${encodeURIComponent(maxFees)}`);
        if (location) query.push(`location=${encodeURIComponent(location)}`);
        if (experience)
          query.push(`experience=${encodeURIComponent(experience)}`);
        if (availableDay)
          query.push(`availableDay=${encodeURIComponent(availableDay)}`);
        if (language) query.push(`language=${encodeURIComponent(language)}`);
        const queryString = query.length ? `?${query.join("&")}` : "";

        const token = localStorage.getItem("patientToken");
        const res = await fetch(
          `https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/doctors${queryString}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch doctors");

        const data = await res.json();
        setDoctors(data);
      } catch (e) {
        setErrorDoctors(e.message);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [specialization, maxFees, location, experience, availableDay, language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    console.log("Files ready for upload:", selectedFiles);

    // later: send these files to your backend using FormData
    alert("Health records uploaded successfully! (Frontend only)");
    setSelectedFiles([]);
  };
  const saveProfile = async () => {
    const token = localStorage.getItem("patientToken");

    if (!patient.isGoogleUser && form?.email && form.email !== patient.email) {
      const confirmed = window.confirm(
        `You're changing your email from ${patient.email} to ${form.email}. Are you sure?`
      );
      if (!confirmed) {
        return; // Cancel save
      }
    }

    const res = await fetch(
      "https://s84-karandevgan-capstone-healthazon-1.onrender.com/api/patient/profile",
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

    setPatient(data.patient);
    setForm({
      name: data.patient.name || "",
      age: data.patient.age || "",
      contact: data.patient.contact || "",
      email: data.patient.email || "",
    }); // ✅ sync the form with latest data
    localStorage.setItem("patient", JSON.stringify(data.patient));
    setIsEditing(false);
    alert("Profile updated");
  };

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    navigate("/patient/login");
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
    setShowDetails(false);
  };

  const handleBookAppointment = (doctor) => {
    navigate("/patient/book", { state: { doctor } });
  };

  if (!patient) return <p>Loading profile...</p>;
  return (
    <main className="patient-dashboard">
      <h2 className="dashboard-title">Welcome back, {patient.name} 👋</h2>

      <div className="dashboard-columns">
        {/* ===== Left Column ===== */}
        <div className="dashboard-left">
          {/* Profile Section */}
          <section className="dashboard-section profile-section">
            <div className="profile-card">
              <div className="profile-header">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=patient-${patient._id}`}
                  alt="Avatar"
                  className="profile-avatar"
                />
                <h2 className="profile-name">{patient.name}</h2>
              </div>

              <div className="profile-info">
                <div className="profile-field">
                  <strong>Age:</strong>{" "}
                  {isEditing ? (
                    <input
                      name="age"
                      type="number"
                      min="1"
                      value={form.age}
                      onChange={handleChange}
                    />
                  ) : (
                    patient.age
                  )}
                </div>

                <div className="profile-field">
                  <strong>Contact:</strong>{" "}
                  {isEditing ? (
                    <input
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                    />
                  ) : (
                    patient.contact || "Not provided"
                  )}
                </div>

                <div className="profile-field">
                  <strong>Email:</strong>{" "}
                  {isEditing && !patient.isGoogleUser ? (
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  ) : (
                    patient.email
                  )}
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <button className="edit-btn" onClick={saveProfile}>
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* Appointments */}
          <section className="dashboard-section appointments-section">
            <h3>Your Appointments</h3>
            <AppointmentList />
          </section>

          {/* Health Records */}
          <section className="dashboard-section health-records-section">
            <h3>Health Records</h3>
            <div className="upload-container">
              <input
                type="file"
                id="healthRecordUpload"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="healthRecordUpload" className="upload-label">
                Select Files
              </label>

              {selectedFiles.length > 0 && (
                <div className="file-preview-list">
                  {selectedFiles.map((file, index) => (
                    <div className="file-preview-item" key={index}>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="upload-btn"
                disabled={selectedFiles.length === 0}
                onClick={handleUpload}
              >
                Upload Records
              </button>
            </div>
          </section>
        </div>

        {/* ===== Right Column ===== */}
        <div className="dashboard-right">
          <section className="dashboard-section filter-section">
            <h3>Filter Doctors</h3>
            <div className="filter-grid">
              <label>
                Specialization:
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </label>

              <label>
                Max Fees:
                <input
                  type="number"
                  min="0"
                  value={maxFees}
                  onChange={(e) => setMaxFees(e.target.value)}
                  placeholder="Enter max fees"
                />
              </label>

              <label>
                Location:
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                />
              </label>

              <label>
                Min Experience (yrs):
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Years"
                />
              </label>

              <label>
                Available Day:
                <select
                  value={availableDay}
                  onChange={(e) => setAvailableDay(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </label>

              <label>
                Language:
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. Hindi"
                />
              </label>
            </div>
          </section>

          <section className="dashboard-section doctor-list-section">
            <h3>Doctors</h3>
            {loadingDoctors && <p>Loading doctors...</p>}
            {errorDoctors && <p className="error">{errorDoctors}</p>}
            {!loadingDoctors && doctors.length === 0 && (
              <p>No doctors found.</p>
            )}

            <div className="doctor-cards-container">
              {doctors.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  onViewDetails={handleViewDetails}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDetails && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={handleCloseDetails}
        />
      )}
    </main>
  );
}
