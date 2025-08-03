import "../../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <h1>About Healthazon</h1>
      <p className="intro">
        Healthazon is your trusted digital healthcare partner — built to
        simplify the process of finding and consulting with doctors, whether
        online or in person.
      </p>

      <section className="about-section">
        <h2>🌟 Our Mission</h2>
        <p>
          We aim to bridge the gap between patients and healthcare professionals
          through a smart and secure platform. Whether you're at home,
          traveling, or in need of quick medical advice, Healthazon brings
          quality care right to your fingertips.
        </p>
      </section>

      <section className="about-section">
        <h2>🩺 For Patients</h2>
        <ul>
          <li>Book appointments easily</li>
          <li>Upload reports for pre-analysis</li>
          <li>Choose in-person or video consultation</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>👨‍⚕️ For Doctors</h2>
        <ul>
          <li>Set your own availability</li>
          <li>Manage appointments efficiently</li>
          <li>Access patient reports in advance</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>🔒 Privacy & Security</h2>
        <p>
          All your medical data is encrypted and stored securely. We respect
          your privacy and follow standard healthcare compliance protocols.
        </p>
      </section>

      <section className="about-section">
        <h2>📈 Future Scope</h2>
        <p>
          We're working toward AI-powered diagnostics, prescription uploads, and
          real-time symptom analysis to make Healthazon even more intelligent
          and helpful.
        </p>
      </section>
    </div>
  );
}

export default About;
