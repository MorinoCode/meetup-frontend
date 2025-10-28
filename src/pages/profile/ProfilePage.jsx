// src/pages/profile/ProfilePage.jsx
import "./ProfilePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://meetup-backend-my4m.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnregister(meetupId) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${meetupId}/attend`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert("You have unregistered from this meetup.");
        fetchProfile(); // refresh profile
      } else {
        alert("Failed to unregister. Try again.");
      }
    } catch (err) {
      console.error("Unregister error:", err);
    }
  }

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  const today = new Date();
  const upcoming = profile.history.filter((m) => new Date(m.date) >= today);
  const past = profile.history.filter((m) => new Date(m.date) < today);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="user-info">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      </div>

      {/* 🔹 Upcoming Meetups */}
      <div className="meetup-section">
        <h2>Upcoming Meetups</h2>
        {upcoming.length > 0 ? (
          <div className="meetup-list">
            {upcoming.map((m) => (
              <div key={m.meetup_id} className="meetup-card">
                <h3>{m.title}</h3>
                <p>📅 {m.date.split("T")[0]}</p>
                <div className="buttons">
                  <button onClick={() => navigate(`/meetup/${m.meetup_id}`)}>
                    Read More
                  </button>
                  {/* ✅ disable unregister if date passed */}
                  {new Date(m.date) >= today && (
                    <button onClick={() => handleUnregister(m.meetup_id)}>
                      ❎ Unregister
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming meetups.</p>
        )}
      </div>

      {/* 🔹 Past Meetups */}
      <div className="meetup-section">
        <h2>Past Meetups</h2>
        {past.length > 0 ? (
          <div className="meetup-list">
            {past.map((m) => (
              <div key={m.meetup_id} className="meetup-card">
                <h3>{m.title}</h3>
                <p>📅 {m.date.split("T")[0]}</p>
                {m.rating && <p>⭐ {m.rating}/5</p>}
                {m.comment && <p className="comment">💬 "{m.comment}"</p>}

                <div className="buttons">
                  <button onClick={() => navigate(`/meetup/${m.meetup_id}`)}>
                    Read More
                  </button>

                  {/* ✅ Show Rate & Review button for past meetups */}
                  <button
                    className="review-btn"
                    onClick={() => navigate(`/meetup/${m.meetup_id}`)}
                  >
                    ⭐ Rate & Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No past meetups yet.</p>
        )}
      </div>
    </div>
  );
}
