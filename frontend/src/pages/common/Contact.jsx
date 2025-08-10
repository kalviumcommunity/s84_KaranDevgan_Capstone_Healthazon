import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser, 
  FaComments,
  FaPaperPlane,
  FaHeartbeat
} from "react-icons/fa";
import { showToast } from "../../utils/toast";
import "../../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    setTimeout(() => {
      showToast.success("Message sent successfully! We'll get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      value: "support@healthazon.com",
      description: "Get in touch via email"
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Speak with our team"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      value: "123 Healthcare Ave, Medical District",
      description: "Our main office location"
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      value: "Mon-Fri: 9AM-6PM",
      description: "Available for support"
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-background">
        <div className="contact-pattern"></div>
      </div>
      
      <div className="contact-content">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <FaHeartbeat />
          </div>
          <h1>Get in Touch</h1>
          <p>
            Have questions about our healthcare platform? We're here to help. 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="contact-sections">
          <motion.div
            className="contact-info-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Contact Information</h2>
            <p>Multiple ways to reach our healthcare support team</p>
            
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="contact-info-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="info-icon">
                    {info.icon}
                  </div>
                  <div className="info-content">
                    <h3>{info.title}</h3>
                    <div className="info-value">{info.value}</div>
                    <p>{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact-form-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>We'd love to hear from you. Fill out the form below.</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="input-wrapper">
                  <FaComments className="input-icon" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject of your message"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="textarea-wrapper">
                  <FaComments className="input-icon" />
                  <textarea
                    name="message"
                    placeholder="Your message here..."
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-textarea"
                  />
                </div>
              </motion.div>

              <motion.div
                className="form-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
