import "./MyMeetupsPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyMeetupsPage() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyMeetups();
  }, []);

  async function fetchMyMeetups() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const res = await fetch("https://meetup-backend-my4m.onrender.com/meetups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch meetups");

      const data = await res.json();
      // فقط اون‌هایی که کاربر ساخته
      const myMeetups = data.filter((m) => String(m.creator_id) === String(userId));
      setMeetups(myMeetups);
    } catch (err) {
      console.error("Error loading meetups:", err);
      setError("Could not load your meetups.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(meetupId) {
    if (!window.confirm("Are you sure you want to delete this meetup?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${meetupId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.message || "Failed to delete meetup."}`);
        return;
      }

      alert("✅ Meetup deleted successfully!");
      setMeetups((prev) => prev.filter((m) => m.id !== meetupId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Something went wrong while deleting meetup.");
    }
  }

  return (
    <div className="mymeetups-page">
      <h1>My Meetups</h1>

      {loading && <p>Loading your meetups...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && meetups.length === 0 && (
        <p className="no-meetups">You haven’t created any meetups yet.</p>
      )}

      <div className="meetup-list">
        {meetups.map((m) => (
          <div key={m.id} className="meetup-card">
            <h2>{m.title}</h2>
            {m.category && <p className="category">🏷️ {m.category}</p>}

            <div className="details">
              <p><strong>📅 Date:</strong> {m.date.split("T")[0]}</p>
              <p><strong>🕒 Time:</strong> {m.time?.slice(0, 5)}</p>
              <p><strong>📍 Location:</strong> {m.location}</p>
              <p><strong>🪑 Capacity:</strong> {m.capacity}</p>
              <p><strong>👥 Joined:</strong> {m.attendees_count || 0}</p>
            </div>

            <div className="buttons">
              <button onClick={() => navigate(`/meetup/${m.id}`)}>Read More</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(m.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
