import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/common/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import PublicDoctors from "./pages/common/PublicDoctors.jsx";
import DoctorDetails from "./pages/common/DoctorDetails.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";
// Patient related imports
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientLayout from "./layouts/PatientLayout";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import Reports from "./pages/patient/Reports";
import Profile from "./pages/patient/Profile";
// Doctor related imports
import CompleteDoctorProfile from "./pages/doctor/CompleteDoctorProfile.jsx";
import Dashboard from "./pages/doctor/Dashboard";
import DoctorLayout from "./layouts/DoctorLayout";
import Appointments from "./pages/doctor/Appointments";
import Availability from "./pages/doctor/Availability";
import DoctorProfile from "./pages/doctor/Profile.jsx";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<PublicDoctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/complete-doctor-profile"
          element={<CompleteDoctorProfile />}
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="availability" element={<Availability />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
