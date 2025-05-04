import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Healthazon</h1>
        <nav>
          <a href="#">Home</a>
          <a href="#">Doctors</a>
          <a href="#">Login</a>
        </nav>
      </header>

      <main className="main">
        <h2>Your Health, Just a Click Away</h2>
        <p>
          Book appointments, consult with doctors online or offline, and manage
          your medical records—all from one place.
        </p>
        <div className="buttons">
          <button className="primary">Book Appointment</button>
          <button className="secondary">Learn More</button>
        </div>
      </main>

      <footer className="footer">
        © 2025 Healthazon. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
