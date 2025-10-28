import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://meetup-backend-my4m.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();

      if (data) {
        setMessage("✅ Account created successfully! Redirecting...");
        // wait 1 second before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage("⚠️ Email already exists or invalid input.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-card">
        <h2>Create an Account</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {message && <p className="signup-message">{message}</p>}
      </form>
    </div>
  );
}
