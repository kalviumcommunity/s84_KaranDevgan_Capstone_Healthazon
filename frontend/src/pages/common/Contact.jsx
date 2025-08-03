import "../../styles/Contact.css";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you shortly.");
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or need support, feel free to
        contact us.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
