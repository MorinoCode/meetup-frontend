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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="user-info">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="meetup-history">
        <h2>My Meetups</h2>
        {profile.history && profile.history.length > 0 ? (
          <div className="meetup-list">
            {profile.history.map((m) => (
              <div key={m.meetup_id} className="meetup-card">
                <h3>{m.title}</h3>
                <p>📅 {m.date}</p>
                {m.rating && <p>⭐ {m.rating}/5</p>}
                {m.comment && <p className="comment">💬 "{m.comment}"</p>}
                <button onClick={() => navigate(`/meetup/${m.meetup_id}`)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't joined any meetups yet.</p>
        )}
      </div>
    </div>
  );
}
