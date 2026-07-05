import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import {
  FaUserMd,
  FaStethoscope,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import API from "../../services/api";
import "../../styles/PublicDoctors.css";

function DoctorsHeader() {
  return (
    <motion.div
      className="doctors-header"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-icon">
        <FaHeartbeat />
      </div>
      <h1>Our Healthcare Professionals</h1>
      <p>
        Connect with experienced doctors and specialists who are committed to
        providing you with the best healthcare experience.
      </p>
    </motion.div>
  );
}

function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  specialties,
}) {
  return (
    <motion.div
      className="search-filters"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search doctors by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-box">
        <FaFilter className="filter-icon" />
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="filter-select"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty, index) => (
            <option key={index} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

function DoctorCard({ doctor, index }) {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!token || !user) {
      showToast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    navigate("/patient/book", {
      state: {
        doctor,
        doctorId: doctor._id,
        source: "public-doctor-card",
      },
    });
  };

  const initials = doctor.name
    ? doctor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <motion.div
      className="doctor-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <div className="doctor-card-header">
        <div className="doctor-avatar-circle">
          <span>{initials}</span>
          <span className="verified-dot" title="Verified Professional">✓</span>
        </div>
        <h3 className="doctor-name">{doctor.name}</h3>
        <span className="specialty-badge">
          {doctor.specialization || "General Physician"}
        </span>
      </div>

      <div className="doctor-card-body">
        <div className="info-item">
          <FaClock className="info-icon" />
          <span><strong>{doctor.experience || 0}</strong> years experience</span>
        </div>
        <div className="info-item">
          <FaMapMarkerAlt className="info-icon text-success" />
          <span className="availability-status">Available Today</span>
        </div>

        <div className="card-rating-row">
          <div className="stars-wrapper">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < 4 ? "star filled" : "star"} />
            ))}
          </div>
          <span className="rating-number">4.8 (98 reviews)</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <Link to={`/doctors/${doctor._id}`} className="view-details-btn">
          View Profile
        </Link>
        <button
          className="book-appointment-btn"
          onClick={handleBookAppointment}
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
}


export default function PublicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get("/doctor");
        setDoctors(res.data);
      } catch {
        showToast.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = [
    ...new Set(doctors.map((doc) => doc.specialization).filter(Boolean)),
  ];
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      !selectedSpecialty || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="doctors-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading our healthcare professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-doctors">
      <div className="doctors-background">
        <div className="doctors-pattern" />
      </div>

      <div className="doctors-content">
        <DoctorsHeader />

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          specialties={specialties}
        />

        <motion.div
          className="doctors-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="stat-item">
            <FaUserMd />
            <span>{doctors.length} Doctors</span>
          </div>
          <div className="stat-item">
            <FaStethoscope />
            <span>{specialties.length} Specialties</span>
          </div>
          <div className="stat-item">
            <FaStar />
            <span>4.8+ Rating</span>
          </div>
        </motion.div>

        {filteredDoctors.length === 0 ? (
          <motion.div
            className="no-doctors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FaUserMd />
            <h3>No doctors found</h3>
            <p>Try adjusting your search criteria or check back later.</p>
          </motion.div>
        ) : (
          <motion.div
            className="doctors-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor._id} doctor={doctor} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
