import "../../styles/PatientDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserMd, FaFileMedical } from "react-icons/fa";
import API from "../../services/api";
function PatientDashboard() {
  const { user , token } = useAuth();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await API.get(
          "/appointment/patient",
          config
        );

        //console.log("Appointments API response:", res.data);

        // If backend returns { appointments: [...] }
        const appointments = Array.isArray(res.data)
          ? res.data
          : res.data.appointments || [];

        setAppointmentCount(appointments.length);

        const futureAppointments = appointments.filter(
          (a) => new Date(a.date) > new Date()
        );
        futureAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextAppointment(futureAppointments[0] || null);

        setReportCount(0); // Change later if you fetch reports
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
if (token) {
  fetchDashboardData();
}
  }, [token]);

  
  return (
    <div className="patient-dashboard">
      <h1>Welcome, {user?.name} 👋</h1>
      <p>This is your patient dashboard. Here's a quick overview:</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>
            <FaCalendarAlt style={{ marginRight: "8px" }} />
            Next Appointment
          </h3>
          {nextAppointment ? (
            <p>
              {nextAppointment.doctor?.name} -{" "}
              {new Date(nextAppointment.date).toLocaleDateString() + " "}
              {nextAppointment.time}
            </p>
          ) : (
            <p>No upcoming appointments</p>
          )}
        </div>

        <div className="card">
          <h3>
            <FaUserMd style={{ marginRight: "8px" }} />
            Total Appointments
          </h3>
          <p>{appointmentCount}</p>
        </div>

        <div className="card">
          <h3>
            <FaFileMedical style={{ marginRight: "8px" }} />
            Uploaded Reports
          </h3>
          <p>{reportCount}</p>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
