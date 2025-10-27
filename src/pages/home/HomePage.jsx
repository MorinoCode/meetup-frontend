// src/pages/home/HomePage.jsx
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Meetup!</h1>
        <p>
          Discover, join, and connect with people who share your interests.
          Plan your next adventure or share your passion with others.
        </p>

        <div className="home-buttons">
          <button onClick={() => navigate("/signup")}>Get Started</button>
          <button onClick={() => navigate("/login")}>Log in</button>
        </div>
      </div>

      <section className="info-section">
        <h2>Why use Meetup?</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>🤝 Connect</h3>
            <p>Meet new people with similar interests and make lasting connections.</p>
          </div>
          <div className="info-card">
            <h3>🎯 Discover</h3>
            <p>Explore meetups in your city or online — tailored to your passions.</p>
          </div>
          <div className="info-card">
            <h3>🚀 Grow</h3>
            <p>Join communities that help you learn, grow, and have fun together.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
