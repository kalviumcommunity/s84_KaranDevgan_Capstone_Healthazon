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
  FaFilter,
  FaLock,
  FaFileMedical
} from "react-icons/fa";
import { showToast } from "../../utils/toast";
import { isAppointmentTimePassed } from "../../utils/appointmentUtils";
import CompletionModal from "../../components/doctor/CompletionModal";
import PrescriptionModal from "../../components/common/PrescriptionModal";

import PrescriptionCard from "../../components/common/PrescriptionCard";

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
          <button type="button" className="filter-btn" onClick={onFilter}>
            <FaFilter />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onOpenComplete, onViewRx }) {
  const isCompleted = appointment.status?.toLowerCase() === "completed";
  const canComplete = isAppointmentTimePassed(appointment.date, appointment.time);

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
            {appointment.issue && (
              <p className="patient-issue"><strong>Reason:</strong> {appointment.issue}</p>
            )}
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

      {(isCompleted || appointment.prescription || appointment.diagnosis) ? (
        <PrescriptionCard appointment={appointment} isDoctor={true} onEdit={onOpenComplete} />
      ) : (
        <div className="appointment-actions">
          {canComplete ? (
            <button 
              type="button"
              className="complete-btn"
              onClick={() => onOpenComplete(appointment)}
            >
              <FaCheck />
              Complete Consultation
            </button>
          ) : (
            <button 
              type="button"
              className="complete-btn disabled"
              disabled
              title="Appointment time has not arrived yet"
            >
              <FaLock />
              Scheduled for Future
            </button>
          )}
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modals state
  const [activeCompleteAppt, setActiveCompleteAppt] = useState(null);
  const [activeRxAppt, setActiveRxAppt] = useState(null);
  const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);

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
    const normalizedSearch = searchTerm.toLowerCase();
    const filtered = appointments.filter((appt) => {
      const patientEmail = appt.patient?.email?.toLowerCase() || "";
      const issue = appt.issue?.toLowerCase() || "";
      const matchesSearch =
        !normalizedSearch ||
        appt.patient?.name?.toLowerCase().includes(normalizedSearch) ||
        patientEmail.includes(normalizedSearch) ||
        issue.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || appt.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const handleOpenCompleteModal = (appointment) => {
    if (!isAppointmentTimePassed(appointment.date, appointment.time)) {
      showToast.error("You can only mark an appointment as completed after its scheduled date and time.");
      return;
    }
    setActiveCompleteAppt(appointment);
  };

  const handleCompleteSubmit = async (formData) => {
    if (!activeCompleteAppt) return;
    setIsSubmittingComplete(true);

    try {
      const config = {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      };

      const res = await API.put(
        `/appointment/${activeCompleteAppt._id}/status`,
        { 
          status: "completed",
          prescription: formData.prescription,
          investigations: formData.investigations,
          diagnosis: formData.diagnosis,
          notes: formData.notes
        },
        config
      );

      const updatedAppointment = res.data;
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === activeCompleteAppt._id ? { ...appt, ...updatedAppointment, status: "completed" } : appt
        )
      );

      showToast.success("Consultation completed and prescription saved successfully!");
      setActiveCompleteAppt(null);
    } catch (err) {
      console.error("Failed to complete appointment:", err);
      showToast.error(err.response?.data?.message || "Failed to update appointment status");
    } finally {
      setIsSubmittingComplete(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = () => {
    setShowFilterMenu((current) => !current);
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

      {showFilterMenu && (
        <div className="filter-menu">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((item) => (
            <button
              key={item}
              type="button"
              className={statusFilter === item ? 'active' : ''}
              onClick={() => {
                setStatusFilter(item);
                setShowFilterMenu(false);
              }}
            >
              {item === 'all' ? 'All statuses' : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {filteredAppointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onOpenComplete={handleOpenCompleteModal}
              onViewRx={(appt) => setActiveRxAppt(appt)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CompletionModal 
        appointment={activeCompleteAppt}
        isOpen={Boolean(activeCompleteAppt)}
        onClose={() => setActiveCompleteAppt(null)}
        onSubmit={handleCompleteSubmit}
        isSubmitting={isSubmittingComplete}
      />

      <PrescriptionModal
        appointment={activeRxAppt}
        isOpen={Boolean(activeRxAppt)}
        onClose={() => setActiveRxAppt(null)}
      />
    </div>
  );
}

export default DoctorAppointments;
