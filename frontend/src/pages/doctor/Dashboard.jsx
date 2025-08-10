import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { 
  FaUserMd, 
  FaCalendarCheck, 
  FaClock, 
  FaChartLine, 
  FaBell,
  FaStethoscope,
  FaUsers,
  FaCalendarAlt
} from "react-icons/fa";
import { MdHealthAndSafety, MdAccessTime } from "react-icons/md";
import API from "../../services/api";
import "../../styles/DoctorDashboard.css";


function WelcomeHeader({ user }) {
  return (
    <div className="dashboard-header">
      <div className="welcome-section">
        <div className="welcome-icon">
          <FaUserMd />
        </div>
        <div className="welcome-text">
          <h1>Welcome back, {user?.name || "Doctor"} 👋</h1>
          <p>Here's what's happening with your practice today</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, description }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <div className="stat-description">{description}</div>
      </div>
    </div>
  );
}

function AppointmentItem({ appointment, index }) {
  return (
    <div className="appointment-item">
      <div className="appointment-info">
        <div className="patient-name">
          {appointment.patient?.name || "Patient"}
        </div>
        <div className="appointment-details">
          <span className="date">
            {new Date(appointment.date).toLocaleDateString()}
          </span>
          <span className="time">{appointment.time}</span>
          <span className="type">{appointment.type || "Consultation"}</span>
        </div>
      </div>
      <div className="appointment-status">
        <span className={`status ${appointment.status || 'scheduled'}`}>
          {appointment.status || 'Scheduled'}
        </span>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, label, onClick }) {
  return (
    <button className="action-card" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DoctorDashboard() {
  const { user, token } = useAuth();
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [availability, setAvailability] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch doctor profile
        const doctorRes = await API.get("/doctor/me", config);
        setAvailability(doctorRes.data.availableTimings || "Not set");

        // Fetch doctor's appointments
        const apptRes = await API.get("/appointment/doctor", config);
        const appointments = Array.isArray(apptRes.data)
          ? apptRes.data
          : apptRes.data.appointments || [];

        setTotalAppointments(appointments.length);

        // Filter upcoming appointments
        const now = new Date();
        const futureAppointments = appointments.filter(
          (appt) => new Date(appt.date) > now
        );
        setUpcomingAppointments(futureAppointments.length);

        // Get recent appointments (last 5)
        const recent = appointments
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentAppointments(recent);

      } catch (err) {
        console.error("Error loading doctor dashboard:", err);
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
      icon: <FaCalendarCheck />,
      title: "Total Appointments",
      value: totalAppointments,
      color: "#3B82F6",
      description: "All time appointments"
    },
    {
      icon: <FaClock />,
      title: "Upcoming",
      value: upcomingAppointments,
      color: "#06B6D4",
      description: "Scheduled appointments"
    },
    {
      icon: <FaUsers />,
      title: "Patients Seen",
      value: totalAppointments,
      color: "#8B5CF6",
      description: "Total patients treated"
    },
    {
      icon: <MdHealthAndSafety />,
      title: "Availability",
      value: availability || "Not set",
      color: "#10B981",
      description: "Your current schedule"
    }
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <WelcomeHeader user={user} />

      <div className="dashboard-content">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>

        <div className="dashboard-sections">
          <div className="recent-appointments">
            <div className="section-header">
              <h2>
                <FaCalendarAlt />
                Recent Appointments
              </h2>
              <p>Your latest patient interactions</p>
            </div>
            
            <div className="appointments-list">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <AppointmentItem
                    key={appointment._id || index}
                    appointment={appointment}
                    index={index}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <FaCalendarAlt />
                  <p>No recent appointments</p>
                  <span>Your upcoming appointments will appear here</span>
                </div>
              )}
            </div>
          </div>

          <div className="quick-actions">
            <div className="section-header">
              <h2>
                <FaStethoscope />
                Quick Actions
              </h2>
              <p>Manage your practice efficiently</p>
            </div>
            
            <div className="actions-grid">
              <QuickActionCard
                icon={<FaCalendarCheck />}
                label="View Schedule"
                onClick={() => console.log('View Schedule')}
              />
              
              <QuickActionCard
                icon={<FaUsers />}
                label="Patient List"
                onClick={() => console.log('Patient List')}
              />
              
              <QuickActionCard
                icon={<MdAccessTime />}
                label="Set Availability"
                onClick={() => console.log('Set Availability')}
              />
              
              <QuickActionCard
                icon={<FaChartLine />}
                label="Analytics"
                onClick={() => console.log('Analytics')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
