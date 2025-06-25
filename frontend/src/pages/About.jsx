// src/pages/About.jsx
import "./About.css";

function About() {
  return (
    <main className="about-page">
      <h2>About Healthazon</h2>
      <p>
        Healthazon is a modern healthcare platform designed to bridge the gap
        between patients and doctors. With an easy-to-use appointment booking
        system, digital health record management, and virtual consultation
        features, Healthazon empowers users to take control of their health
        journey — from anywhere.
      </p>

      <h3>Our Vision</h3>
      <p>
        We believe healthcare should be accessible, seamless, and efficient. Our
        goal is to eliminate the hassle of hospital queues and bring expert care
        right to your fingertips.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li>Doctor Appointment Booking (online/offline)</li>
        <li>Google Login/Signup Support</li>
        <li>Patient and Doctor Dashboards</li>
        <li>Medical Record Access</li>
      </ul>
    </main>
  );
}

export default About;
