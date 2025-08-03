import "../../styles/BookAppointment.css";
import { useState, useEffect } from "react";
import DoctorCard from "../../components/common/DoctorCard";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BookAppointment() {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [issue, setIssue] = useState("");
  const [reports, setReports] = useState("");
  const [prescription, setPrescription] = useState("");

  const [doctors, setDoctors] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctor"); // public endpoint for all doctors
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        doctor: selectedDoctorId,
        date: appointmentDate,
        time: appointmentTime,
        issue,
        reports,
        prescription,
      };
      console.log("Appointment data being sent : " , data);
      await API.post(
        "/appointment/new",
        data,
        config
      );

      alert("Appointment booked successfully!");
      navigate("/patient/appointments");
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="book-appointment">
      <h2>Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        {/* Doctor Dropdown */}
        <label>Choose Doctor</label>
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          required
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.specialization || "Specialty N/A"})
            </option>
          ))}
        </select>

        {/* Doctor Cards */}
        <div className="doctor-cards">
          {doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              isSelected={selectedDoctorId === doc._id}
              onSelect={(id) => setSelectedDoctorId(id)}
            />
          ))}
        </div>

        <label>Select Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />
        

        <label>Select Time:</label>
        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />

        <label>Issue / Reason for Appointment:</label>
        <input
          type="text"
          placeholder="e.g., Stomach ache, Fever..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />

        <label>Reports (optional - file URL or name):</label>
        <input
          type="text"
          placeholder="Enter report file URL or name"
          value={reports}
          onChange={(e) => setReports(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment;
