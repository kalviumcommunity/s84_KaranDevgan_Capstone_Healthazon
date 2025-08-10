import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaFileMedical, 
  FaStethoscope,
  FaCheck,
  FaArrowLeft,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { MdHealthAndSafety, MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import API from "../../services/api";
import "../../styles/BookAppointment.css";

function BookAppointment() {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [issue, setIssue] = useState("");
  const [reports, setReports] = useState("");
  const [prescription, setPrescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctor");
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        showToast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialization === selectedSpecialty
      );
    }
    
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctorId) {
      showToast.error("Please select a doctor");
      return;
    }
    
    setIsLoading(true);
    
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
      
      await API.post("/appointment/new", data, config);
      
      showToast.success("Appointment booked successfully!");
      navigate("/patient/appointments");
    } catch (err) {
      console.error("Failed to book appointment", err);
      showToast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const specialties = [...new Set(doctors.map(doc => doc.specialization).filter(Boolean))];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="book-appointment">
      {/* Header */}
      <motion.div
        className="booking-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>
        <div className="header-content">
          <h1>Book an Appointment</h1>
          <p>Schedule your consultation with our healthcare specialists</p>
        </div>
      </motion.div>

      <div className="booking-container">
        {/* Doctor Selection Section */}
        <motion.div
          className="doctor-selection"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="section-header">
            <h2>
              <FaUserMd />
              Choose Your Doctor
            </h2>
            <p>Select a healthcare specialist for your consultation</p>
          </div>

          {/* Search and Filter */}
          <div className="search-filters">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <FaFilter />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="doctors-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  className={`doctor-card ${selectedDoctorId === doctor._id ? 'selected' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedDoctorId(doctor._id)}
                >
                  <div className="doctor-avatar">
                    <FaUserMd />
                  </div>
                  <div className="doctor-info">
                    <h3>Dr. {doctor.name}</h3>
                    <p className="specialty">{doctor.specialization || "General Physician"}</p>
                    <p className="experience">{doctor.experience || "5+ years"} experience</p>
                  </div>
                  {selectedDoctorId === doctor._id && (
                    <div className="selected-indicator">
                      <FaCheck />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="no-doctors">
                <FaUserMd />
                <h3>No doctors found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Appointment Details Form */}
        <motion.div
          className="appointment-form"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>
              <FaCalendarAlt />
              Appointment Details
            </h2>
            <p>Fill in your appointment information</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Date Selection */}
              <div className="form-group">
                <label>
                  <FaCalendarAlt />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={getMinDate()}
                  required
                />
              </div>

              {/* Time Selection */}
              <div className="form-group">
                <label>
                  <FaClock />
                  Appointment Time
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Description */}
              <div className="form-group full-width">
                <label>
                  <FaStethoscope />
                  Reason for Visit
                </label>
                <textarea
                  placeholder="Describe your symptoms or reason for appointment..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              {/* Reports */}
              <div className="form-group full-width">
                <label>
                  <FaFileMedical />
                  Medical Reports (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter report file URL or description"
                  value={reports}
                  onChange={(e) => setReports(e.target.value)}
                />
              </div>

              {/* Prescription */}
              <div className="form-group full-width">
                <label>
                  <MdHealthAndSafety />
                  Current Medications (Optional)
                </label>
                <textarea
                  placeholder="List any current medications you're taking..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows="3"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={isLoading || !selectedDoctorId}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Booking Appointment...
                </>
              ) : (
                <>
                  <FaCalendarAlt />
                  Book Appointment
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default BookAppointment;
