// src/pages/login/Login.jsx
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
      const res = await fetch(
        "https://meetup-backend-my4m.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // save token and redirect
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/allmeetup");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Login</h2>

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
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}
