import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Healthazon. All rights reserved.</p>
      <p>
        <a href="/about">About</a> | <a href="/contact">Contact</a>
      </p>
    </footer>
  );
}

export default Footer;
