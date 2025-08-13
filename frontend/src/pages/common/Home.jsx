import "../../styles/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarCheck, FaVideo, FaFileMedical, FaHeartbeat } from "react-icons/fa";
import { MdAccessTime, MdLocationOn } from "react-icons/md";

function Home() {
  const services = [
    {
      icon: <FaUserMd />,
      title: "Expert Doctors",
      description: "Connect with board-certified specialists across all medical fields",
      color: "#3B82F6"
    },
    {
      icon: <FaCalendarCheck />,
      title: "Easy Booking",
      description: "Schedule appointments in seconds with our intuitive booking system",
      color: "#06B6D4"
    },
    {
      icon: <FaVideo />,
      title: "Video Consultations",
      description: "Get medical advice from the comfort of your home",
      color: "#8B5CF6"
    },
    {
      icon: <FaFileMedical />,
      title: "Digital Records",
      description: "Secure storage and easy access to your medical history",
      color: "#10B981"
    }
  ];

  const stats = [
    { number: "500+", label: "Expert Doctors", icon: <FaUserMd /> },
    { number: "10K+", label: "Happy Patients", icon: <FaHeartbeat /> },
    { number: "24/7", label: "Support Available", icon: <MdAccessTime /> },
    { number: "50+", label: "Cities Covered", icon: <MdLocationOn /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "Healthazon made my healthcare journey so much easier. The video consultations saved me hours of travel time.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "As a doctor, I love how this platform connects me with patients who need specialized care efficiently.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      content: "The digital record system is fantastic. All my medical history is organized and easily accessible.",
      rating: 5
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>
              Your Health, <span className="highlight">Our Priority</span>
            </h1>
            <p>
              Experience healthcare reimagined. Connect with expert doctors, 
              schedule appointments instantly, and manage your health journey 
              with cutting-edge technology.
            </p>
            <div className="hero-buttons">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="primary-btn">
                  Get Started Today
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/doctors" className="secondary-btn">
                  Find Doctors
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-image">
              <div className="floating-card card-1">
                <FaUserMd />
                <span>Expert Doctors</span>
              </div>
              <div className="floating-card card-2">
                <FaVideo />
                <span>Video Calls</span>
              </div>
              <div className="floating-card card-3">
                <FaFileMedical />
                <span>Digital Records</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Healthazon?</h2>
            <p>We're revolutionizing healthcare with technology that puts you first</p>
          </motion.div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="service-icon" style={{ backgroundColor: service.color }}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>What Our Users Say</h2>
            <p>Real experiences from patients and doctors</p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your Healthcare Experience?</h2>
            <p>Join thousands of patients and doctors who trust Healthazon for their healthcare needs</p>
            <motion.div 
              className="cta-buttons"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="cta-primary">
                Start Your Journey
              </Link>
              <Link to="/about" className="cta-secondary">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
