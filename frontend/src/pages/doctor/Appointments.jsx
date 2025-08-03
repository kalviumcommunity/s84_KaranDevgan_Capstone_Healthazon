import "../../styles/DoctorAppointments.css";
import { useState , useEffect } from "react";
import API from "../../services/api.js";
import { useAuth } from "../../context/AuthContext";
import AppointmentCard from "../../components/common/AppointmentCard.jsx"; 

function DoctorAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await API.get(
          "/appointment/doctor",
          config
        );
        setAppointments(res.data.appointments || []);
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
      console.error("Failed to update appointment status:", err);
    }
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }
  return (
    <div className="doctor-appointments">
      <h2>Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              data={{
                id: appt._id,
                patientName: appt.patient?.name,
                date: appt.date,
                time: appt.time,
                status: appt.status,
              }}
              role="doctor"
              onComplete={() => handleComplete(appt._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
