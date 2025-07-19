import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link , useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import BookAppointmentPage from "./pages/BookAppointmentPage";
// public shared components
import Navbar from './components/Navbar'

// Doctor Auth
import DoctorLogin from "./components/doctor/DoctorLogin";
import DoctorRegister from "./components/doctor/DoctorRegister";

//Patient Auth + Dashboard
import LoginPatient from "./components/patient/LoginPatient";
import RegisterPatient from "./components/patient/RegisterPatient";
import PatientDashboard from "./pages/PatientDashboard";


// Doctor Pages
import DoctorDashboard from "./pages/DoctorDashboard";

const clientId =
  "379685038550-ke9d9mj6a8oj0k1c4evshmp2uh826itu.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {" "}
      {/*  Wrap Router */}
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

          <Route path="/patient/login" element={<LoginPatient />} />
          <Route
            path="/patient/forgot-password"
            element={<PatientForgotPassword />}
          />
          <Route path="/patient/register" element={<RegisterPatient />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />

          <Route path="/patient/book" element={<BookAppointmentPage />} />
        </Routes>

        <footer className="footer">
          © 2025 Healthazon. All rights reserved.
        </footer>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

