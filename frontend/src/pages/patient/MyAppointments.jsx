import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaStethoscope,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaArrowLeft,
  FaFilter,
  FaSearch
} from "react-icons/fa";
import { MdAccessTime, MdHistory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import API from "../../services/api";
import "../../styles/MyAppointments.css";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await API.get("/appointment/patient", config);
        setAppointments(res.data);
      } catch (err) {
        showToast.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter((a) => a.date >= today);
  const past = appointments.filter((a) => a.date < today);

  const getFilteredAppointments = () => {
    let filtered = appointments;
    
    if (selectedFilter === "upcoming") {
      filtered = upcoming;
    } else if (selectedFilter === "past") {
      filtered = past;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.issue?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return <FaCheck />;
      case 'pending':
        return <MdAccessTime />;
      case 'cancelled':
        return <FaTimes />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await API.put(`/appointment/${appointmentId}/cancel`, {}, config);
      showToast.success("Appointment cancelled successfully");
      
      // Refresh appointments
      const res = await API.get("/appointment/patient", config);
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      showToast.error("Failed to cancel appointment");
    }
  };

  const handleReschedule = (appointment) => {
    navigate("/patient/book", { 
      state: { 
        selectedDoctor: appointment.doctor?._id,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        issue: appointment.issue
      }
    });
  };

  if (isLoading) {
    return (
      <div className="appointments-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="appointments-page">
      {/* Header */}
      <motion.div
        className="appointments-header"
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
          <h1>My Appointments</h1>
          <p>Manage and track your healthcare appointments</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="appointment-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-icon upcoming">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <div className="stat-value">{upcoming.length}</div>
            <p>Next appointment in {upcoming.length > 0 ? '3 days' : 'No upcoming'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon past">
            <MdHistory />
          </div>
          <div className="stat-content">
            <h3>Past</h3>
            <div className="stat-value">{past.length}</div>
            <p>Completed appointments</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon total">
            <FaStethoscope />
          </div>
          <div className="stat-content">
            <h3>Total</h3>
            <div className="stat-value">{appointments.length}</div>
            <p>All time appointments</p>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search appointments by doctor, specialty, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('upcoming')}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'past' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('past')}
          >
            Past ({past.length})
          </button>
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        className="appointments-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredAppointments.length > 0 ? (
          <div className="appointments-grid">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                className="appointment-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="appointment-header">
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <FaUserMd />
                    </div>
                    <div>
                      <h3> {appointment.doctor?.name || "Doctor"}</h3>
                      <p className="specialty">{appointment.doctor?.specialization || "General Physician"}</p>
                    </div>
                  </div>
                  <div className="status-badge" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                    {getStatusIcon(appointment.status)}
                    <span>{appointment.status || "Pending"}</span>
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock />
                    <span>{appointment.time}</span>
                  </div>
                  {appointment.issue && (
                    <div className="detail-item">
                      <FaStethoscope />
                      <span>{appointment.issue}</span>
                    </div>
                  )}
                </div>

                <div className="appointment-actions">
                  <button className="action-btn view">
                    <FaEye />
                    View Details
                  </button>
                  
                  {appointment.date >= today && appointment.status !== 'cancelled' && (
                    <>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleReschedule(appointment)}
                      >
                        <FaEdit />
                        Reschedule
                      </button>
                      <button 
                        className="action-btn cancel"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        <FaTrash />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-appointments">
            <FaCalendarAlt />
            <h3>No appointments found</h3>
            <p>
              {searchTerm || selectedFilter !== 'all' 
                ? "Try adjusting your search criteria" 
                : "You don't have any appointments yet"
              }
            </p>
            {!searchTerm && selectedFilter === 'all' && (
              <button 
                className="book-appointment-btn"
                onClick={() => navigate("/patient/book")}
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default MyAppointments;
