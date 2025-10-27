import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Meetup</Link>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/profile">Profile</Link>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
