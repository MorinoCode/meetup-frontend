import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {year} Meetup App. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/t">About</a>
          <a href="/">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
