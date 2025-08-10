import "../../styles/About.css";
import { motion } from "framer-motion";
import { 
  FaHeartbeat, 
  FaUserMd, 
  FaShieldAlt, 
  FaRocket, 
  FaUsers, 
  FaAward,
  FaCheckCircle,
  FaLightbulb,
  FaHandshake,
  FaGlobe
} from "react-icons/fa";
import { MdHealthAndSafety, MdSecurity, MdAccessibility } from "react-icons/md";

function About() {
  const missionData = {
    title: "Our Mission",
    subtitle: "Revolutionizing healthcare through technology",
    description: "We're on a mission to make quality healthcare accessible to everyone, everywhere. By bridging the gap between patients and healthcare professionals, we're creating a world where medical care is just a click away.",
    icon: <FaHeartbeat />
  };

  const values = [
    {
      icon: <FaShieldAlt />,
      title: "Security First",
      description: "Your health data is protected with enterprise-grade encryption and HIPAA compliance standards.",
      color: "#3B82F6"
    },
    {
      icon: <FaUsers />,
      title: "Patient-Centric",
      description: "Every feature is designed with patients in mind, ensuring a seamless healthcare experience.",
      color: "#06B6D4"
    },
    {
      icon: <FaUserMd />,
      title: "Expert Care",
      description: "Connect with board-certified doctors and specialists across all medical disciplines.",
      color: "#8B5CF6"
    },
    {
      icon: <FaAward />,
      title: "Quality Assured",
      description: "Rigorous verification process ensures only qualified healthcare professionals join our platform.",
      color: "#10B981"
    }
  ];

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Easy Booking",
      description: "Schedule appointments in seconds with our intuitive booking system",
      benefits: ["Instant confirmation", "Reminder notifications", "Reschedule flexibility"]
    },
    {
      icon: <MdHealthAndSafety />,
      title: "Digital Records",
      description: "Secure storage and easy access to your complete medical history",
      benefits: ["HIPAA compliant", "24/7 access", "Share with doctors"]
    },
    {
      icon: <FaRocket />,
      title: "Video Consultations",
      description: "Get medical advice from anywhere with our secure video platform",
      benefits: ["HD quality", "Screen sharing", "Recording option"]
    }
  ];

  const stats = [
    { number: "50K+", label: "Patients Served", icon: <FaUsers /> },
    { number: "500+", label: "Expert Doctors", icon: <FaUserMd /> },
    { number: "99.9%", label: "Uptime", icon: <FaShieldAlt /> },
    { number: "24/7", label: "Support", icon: <MdAccessibility /> }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      description: "Board-certified cardiologist with 15+ years of experience in digital health innovation.",
      expertise: "Cardiology, Digital Health"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Technology",
      description: "Former tech lead at leading healthcare startups, passionate about making healthcare accessible.",
      expertise: "Healthcare Tech, AI/ML"
    },
    {
      name: "Dr. Emily Watson",
      role: "Clinical Director",
      description: "Specialist in telemedicine with expertise in remote patient monitoring and care coordination.",
      expertise: "Telemedicine, Patient Care"
    }
  ];

  return (
    <div className="about-container">

      <motion.section 
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>
              About <span className="highlight">Healthazon</span>
            </h1>
            <p className="hero-subtitle">
              Your trusted digital healthcare partner — built to simplify the process 
              of finding and consulting with doctors, whether online or in person.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      
      <section className="mission-section">
        <div className="container">
          <motion.div
            className="mission-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mission-icon">
              {missionData.icon}
            </div>
            <h2>{missionData.title}</h2>
            <h3>{missionData.subtitle}</h3>
            <p>{missionData.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Core Values</h2>
            <p>These principles guide everything we do at Healthazon</p>
          </motion.div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="value-icon" style={{ backgroundColor: value.color }}>
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>What We Offer</h2>
            <p>Comprehensive healthcare solutions designed for modern needs</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="feature-benefits">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="team-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Leadership</h2>
            <p>Experienced professionals dedicated to transforming healthcare</p>
          </motion.div>
          
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="member-avatar">
                  <FaUsers />
                </div>
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
                <div className="expertise">
                  <span>{member.expertise}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="vision-section">
        <div className="container">
          <motion.div
            className="vision-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="vision-icon">
              <FaLightbulb />
            </div>
            <h2>Our Vision for the Future</h2>
            <p>
              We're working toward AI-powered diagnostics, prescription uploads, 
              and real-time symptom analysis to make Healthazon even more intelligent 
              and helpful. Our goal is to create a comprehensive healthcare ecosystem 
              that anticipates your needs and provides proactive care.
            </p>
            <div className="vision-features">
              <div className="vision-feature">
                <FaGlobe />
                <span>Global Healthcare Access</span>
              </div>
              <div className="vision-feature">
                <FaHandshake />
                <span>AI-Powered Diagnostics</span>
              </div>
              <div className="vision-feature">
                <MdHealthAndSafety />
                <span>Preventive Care Focus</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
