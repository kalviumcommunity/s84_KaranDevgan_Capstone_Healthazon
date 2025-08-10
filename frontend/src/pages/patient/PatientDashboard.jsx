import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaFileMedical, 
  FaBell,
  FaHeartbeat,
  FaClock,
  FaStethoscope,
  FaChartLine,
  FaPlus,
  FaSearch,
  FaDownload,
  FaEye,
  FaEdit
} from "react-icons/fa";
import { MdHealthAndSafety, MdAccessTime, MdNotifications } from "react-icons/md";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { showToast } from "../../utils/toast";
import "../../styles/PatientDashboard.css";

function PatientDashboard() {
  const { user, token } = useAuth();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await API.get("/appointment/patient", config);

        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.appointments || [];

        setAppointmentCount(appointments.length);

        const futureAppointments = appointments.filter(
          (a) => new Date(a.date) > new Date()
        );
        futureAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextAppointment(futureAppointments[0] || null);

        // Get recent appointments (last 5)
        const recent = appointments
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentAppointments(recent);

        setReportCount(0); // Change later if you fetch reports
      } catch (err) {
        showToast.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const stats = [
    {
      icon: <FaCalendarAlt />,
      title: "Total Appointments",
      value: appointmentCount,
      color: "#3B82F6",
      description: "All time appointments",
      trend: "+12% this month"
    },
    {
      icon: <FaClock />,
      title: "Next Appointment",
      value: nextAppointment ? "Scheduled" : "None",
      color: "#06B6D4",
      description: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString() : "No upcoming visits",
      trend: nextAppointment ? "In 3 days" : null
    },
    {
      icon: <FaFileMedical />,
      title: "Medical Reports",
      value: reportCount,
      color: "#8B5CF6",
      description: "Uploaded documents",
      trend: "+2 new reports"
    },
    {
      icon: <MdHealthAndSafety />,
      title: "Health Score",
      value: `${healthScore}%`,
      color: "#10B981",
      description: "Your current health",
      trend: "+5% this week"
    }
  ];

  const quickActions = [
    {
      icon: <FaCalendarAlt />,
      title: "Book Appointment",
      description: "Schedule a consultation",
      color: "#3B82F6",
      link: "/patient/book"
    },
    {
      icon: <FaFileMedical />,
      title: "Upload Reports",
      description: "Share medical documents",
      color: "#8B5CF6",
      link: "/patient/reports"
    },
    {
      icon: <FaUserMd />,
      title: "Find Doctors",
      description: "Browse specialists",
      color: "#06B6D4",
      link: "/doctors"
    },
    {
      icon: <FaChartLine />,
      title: "Health Records",
      description: "View your history",
      color: "#10B981",
      link: "/patient/reports"
    }
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      {/* Header Section */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-section">
          <div className="welcome-icon">
            <FaHeartbeat />
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {user?.name} 👋</h1>
            <p>Here's your health overview and upcoming care</p>
          </div>
        </div>
        <div className="header-actions">
          <motion.button
            className="notification-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdNotifications />
            <span className="notification-badge">2</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <p className="stat-description">{stat.description}</p>
              {stat.trend && (
                <div className="stat-trend" style={{ color: stat.color }}>
                  {stat.trend}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Sections */}
      <div className="dashboard-sections">
        {/* Next Appointment Section */}
        <motion.div
          className="next-appointment"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>
              <FaCalendarAlt />
              Next Appointment
            </h2>
            <p>Your upcoming healthcare visit</p>
          </div>
          
          {nextAppointment ? (
            <motion.div
              className="appointment-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="appointment-header">
                <div className="doctor-info">
                  <div className="doctor-avatar">
                    <FaUserMd />
                  </div>
                  <div>
                    <h3> {nextAppointment.doctor?.name || "Doctor"}</h3>
                    <p className="specialty">General Physician</p>
                  </div>
                </div>
                <div className="appointment-time">
                  <div className="date">
                    {new Date(nextAppointment.date).toLocaleDateString()}
                  </div>
                  <div className="time">{nextAppointment.time}</div>
                </div>
              </div>
              <div className="appointment-details">
                <div className="detail-item">
                  <FaClock />
                  <span>Duration: 30 minutes</span>
                </div>
                <div className="detail-item">
                  <FaStethoscope />
                  <span>Type: {nextAppointment.type || "Consultation"}</span>
                </div>
              </div>
              <div className="appointment-actions">
                <button className="btn-primary">
                  <FaEye />
                  View Details
                </button>
                <button className="btn-secondary">
                  <FaEdit />
                  Reschedule
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="empty-appointment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <FaCalendarAlt />
              <h3>No upcoming appointments</h3>
              <p>Schedule your next visit with a healthcare provider</p>
              <Link to="/patient/book" className="btn-primary">
                <FaPlus />
                Book Appointment
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="section-header">
            <h2>
              <FaStethoscope />
              Quick Actions
            </h2>
            <p>Manage your healthcare journey</p>
          </div>
          
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                className="action-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={action.link} className="action-link">
                  <div className="action-icon" style={{ backgroundColor: action.color }}>
                    {action.icon}
                  </div>
                  <div className="action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        className="recent-activity"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="section-header">
          <h2>
            <MdAccessTime />
            Recent Activity
          </h2>
          <p>Your latest healthcare interactions</p>
        </div>
        
        <div className="activity-list">
          {recentAppointments.length > 0 ? (
            recentAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id || index}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="activity-icon">
                  <FaUserMd />
                </div>
                <div className="activity-content">
                  <h4>Appointment with  {appointment.doctor?.name || "Doctor"}</h4>
                  <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                </div>
                <div className="activity-status">
                  <span className={`status ${appointment.status || 'completed'}`}>
                    {appointment.status || 'Completed'}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-activity">
              <FaCalendarAlt />
              <p>No recent activity</p>
              <span>Your healthcare activities will appear here</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default PatientDashboard;
