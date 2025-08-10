import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUserMd, 
  FaStethoscope, 
  FaClock, 
  FaStar, 
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHeartbeat,
  FaArrowLeft,
  FaBookmark,
  FaShare
} from "react-icons/fa";
import { MdHealthAndSafety, MdAccessTime } from "react-icons/md";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "../../styles/DoctorDetails.css";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
        showToast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = () => {
    if (!user) {
      showToast.info("Please log in to book an appointment");
      navigate("/login");
    } else {
      navigate("/patient/book", { state: { doctorId: doctor._id } });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Dr. ${doctor.name}`,
        text: `Check out Dr. ${doctor.name} on Healthazon`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="doctor-details-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-not-found">
        <FaUserMd />
        <h2>Doctor not found</h2>
        <p>The doctor you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/doctors")} className="back-btn">
          <FaArrowLeft />
          Back to Doctors
        </button>
      </div>
    );
  }

  const doctorInfo = [
    {
      icon: <FaStethoscope />,
      label: "Specialization",
      value: doctor.specialization || "General Physician"
    },
    {
      icon: <FaClock />,
      label: "Experience",
      value: `${doctor.experience || 0} years`
    },
    {
      icon: <MdAccessTime />,
      label: "Available Timings",
      value: doctor.availableTimings || "Contact for availability"
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: doctor.address || "Contact for location"
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: doctor.email
    },
    {
      icon: <FaPhone />,
      label: "Contact",
      value: doctor.contact || "Contact via email"
    }
  ];

  return (
    <div className="doctor-details">
      <div className="details-background">
        <div className="details-pattern"></div>
      </div>
      
      <div className="details-content">
        <motion.button
          className="back-button"
          onClick={() => navigate("/doctors")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ x: -5 }}
        >
          <FaArrowLeft />
          Back to Doctors
        </motion.button>

        <motion.div
          className="doctor-profile"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="profile-header">
            <div className="doctor-avatar">
              <FaUserMd />
            </div>
            <div className="profile-info">
              <h1>Dr. {doctor.name}</h1>
              <p className="specialty">
                <FaStethoscope />
                {doctor.specialization || "General Physician"}
              </p>
              <div className="rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "star filled" : "star"} />
                  ))}
                </div>
                <span>4.8 (120 reviews)</span>
              </div>
            </div>
            <div className="profile-actions">
              <motion.button
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBookmark />
              </motion.button>
              <motion.button
                className="share-btn"
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShare />
              </motion.button>
            </div>
          </div>

          <div className="profile-details">
            <div className="info-grid">
              {doctorInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="info-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="info-icon">
                    {info.icon}
                  </div>
                  <div className="info-content">
                    <label>{info.label}</label>
                    <span>{info.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="details-sections">
          <motion.div
            className="bio-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>
              <MdHealthAndSafety />
              About Dr. {doctor.name}
            </h2>
            <p>{doctor.bio || "No bio available for this doctor."}</p>
          </motion.div>

          <motion.div
            className="appointment-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2>
              <FaCalendarAlt />
              Book Appointment
            </h2>
            <p>Schedule a consultation with Dr. {doctor.name}</p>
            
            <div className="appointment-features">
              <div className="feature">
                <FaClock />
                <span>30 min consultation</span>
              </div>
              <div className="feature">
                <FaHeartbeat />
                <span>Professional care</span>
              </div>
              <div className="feature">
                <FaStar />
                <span>Highly rated</span>
              </div>
            </div>

            <motion.button
              className="book-appointment-btn"
              onClick={handleBookAppointment}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt />
              Book Appointment
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
