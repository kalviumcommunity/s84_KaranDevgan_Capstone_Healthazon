import "../../styles/DoctorAppointments.css";
import { useState, useEffect } from "react";
import API from "../../services/api.js";
import { useAuth } from "../../context/AuthContext";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaCheck, 
  FaSpinner,
  FaCalendarCheck,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { showToast } from "../../utils/toast";

function AppointmentsHeader({ appointmentsCount, onSearch, onFilter }) {
  return (
    <div className="appointments-header">
      <div className="header-content">
        <div className="header-info">
          <div className="header-icon">
            <FaCalendarAlt />
          </div>
          <div className="header-text">
            <h1>My Appointments</h1>
            <p>{appointmentsCount} appointments scheduled</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn" onClick={onFilter}>
            <FaFilter />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onComplete }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <div className="patient-section">
          <div className="patient-avatar">
            <FaUser />
          </div>
          <div className="patient-details">
            <h3>{appointment.patient?.name || 'Unknown Patient'}</h3>
            <div className="appointment-meta">
              <span className="date-time">
                <FaCalendarAlt className="meta-icon" />
                {formatDate(appointment.date)}
              </span>
              <span className="date-time">
                <FaClock className="meta-icon" />
                {formatTime(appointment.time)}
              </span>
            </div>
          </div>
        </div>
        <div className="appointment-status">
          <span 
            className="status-badge" 
            style={{ backgroundColor: getStatusColor(appointment.status) }}
          >
            {appointment.status || 'Pending'}
          </span>
        </div>
      </div>
      {appointment.status?.toLowerCase() !== 'completed' && (
        <div className="appointment-actions">
          <button 
            className="complete-btn"
            onClick={() => onComplete(appointment._id)}
          >
            <FaCheck />
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <FaSpinner className="spinner-icon" />
      </div>
      <p>Loading appointments...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FaCalendarCheck />
      </div>
      <h3>No appointments scheduled</h3>
      <p>Your appointment list is empty. New appointments will appear here.</p>
    </div>
  );
}

function DoctorAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await API.get("/appointment/doctor", config);
        const appointmentData = res.data.appointments || [];
        setAppointments(appointmentData);
        setFilteredAppointments(appointmentData);
      } catch (err) {
        console.error("Failed to fetch doctor appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = appointments.filter(appt =>
        appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchTerm, appointments]);

  const handleComplete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await API.put(
        `/appointment/${id}/status`,
        { status: "Completed" },
        config
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err) {
      showToast.error("Failed to update appointment status:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = () => {
    console.log('Filter functionality coming soon');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="doctor-appointments">
      <AppointmentsHeader 
        appointmentsCount={appointments.length}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
      
      {filteredAppointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
