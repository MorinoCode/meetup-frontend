import "./MeetupDetailsPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MeetupDetailsPage() {
  const { id } = useParams();
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetchMeetupDetails();
  }, [id]);

  async function fetchMeetupDetails() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load meetup details");

      const data = await res.json();
      setMeetup(data);

      // check if user is already attending
      const userId = localStorage.getItem("userId");
      if (data.attendees?.some((a) => String(a.user_id) === userId)) {
        setJoined(true);
      }
    } catch (err) {
      console.error("Error loading details:", err);
      setError("Could not load meetup details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAttend() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}/attend`,
        {
          method: joined ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to update attendance");

      if (joined) {
        alert("❎ You have unregistered from this meetup.");
      } else {
        alert("✅ You have joined this meetup!");
      }

      setJoined(!joined);
      fetchMeetupDetails(); // refresh attendee count
    } catch (err) {
      console.error("Attend error:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  if (loading) return <p className="loading">Loading meetup details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!meetup) return null;

  return (
    <div className="meetup-details">
      <h1>{meetup.title}</h1>
      <p className="info">
        📍 {meetup.location} <br />
        🗓️ {meetup.date} at {meetup.time}
      </p>
      <p className="description">{meetup.description}</p>

      <div className="attendees">
        <p>
          👥 <strong>{meetup.attendees?.length || 0}</strong> people attending
        </p>
        {meetup.attendees?.length > 0 && (
          <ul>
            {meetup.attendees.map((a) => (
              <li key={a.user_id}>• {a.username}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        className={joined ? "unregister-btn" : "join-btn"}
        onClick={handleAttend}
      >
        {joined ? "❎ Unregister" : "Join Meetup"}
      </button>
    </div>
  );
}
