import "../../styles/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="home-container">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>
          Welcome to <span className="brand">Healthazon</span>
        </h1>
        <p>
          Your one-stop platform for online health consultations and
          appointments.
        </p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </motion.div>
      </motion.section>

      <section className="features">
        {[
          {
            title: "📅 Book Appointments",
            desc: "Choose from experienced doctors and schedule visits online or offline.",
          },
          {
            title: "📤 Upload Reports",
            desc: "Attach images or PDFs of your medical records for better consultation.",
          },
          {
            title: "📹 Video Consultation",
            desc: "Prefer not to travel? Connect with doctors through secure video calls.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="feature-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export default Home;
