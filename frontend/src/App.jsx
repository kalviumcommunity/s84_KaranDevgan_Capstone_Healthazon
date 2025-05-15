
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";

function App() {
  return (
    <Router>
      <header className="header">
        <h1 className="logo">Healthazon</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="#">Login</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>

      <footer className="footer">© 2025 Healthazon. All rights reserved.</footer>
    </Router>
  );
}

export default App;
