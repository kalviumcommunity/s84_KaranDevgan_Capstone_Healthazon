import { useAuth } from "../../context/AuthContext";
import "../../styles/DoctorDashboard.css";
import { useState , useEffect } from "react";
import API from "../../services/api";
function DoctorDashboard() {
  const { user, token } = useAuth();
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        //console.log("Token in dashboard:", token);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 1️⃣ Fetch doctor profile
        const doctorRes = await API.get(
          "/doctor/me",
          config
        );
        
        setAvailability(doctorRes.data.availableTimings || "Not set");

        // 2️⃣ Fetch doctor's appointments
        const apptRes = await API.get(
          "/appointment/doctor",
          config
        );
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
      } catch (err) {
        console.error("Error loading doctor dashboard:", err);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="doctor-dashboard">
      <h2>Welcome, Dr. {user?.name || "Doctor"} 👋</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Appointments</h3>
          <p>{totalAppointments}</p>
        </div>
        <div className="dashboard-card">
          <h3>Upcoming Appointments</h3>
          <p>{upcomingAppointments}</p>
        </div>
        <div className="dashboard-card">
          <h3>Your Availability</h3>
          <p>{availability}</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
