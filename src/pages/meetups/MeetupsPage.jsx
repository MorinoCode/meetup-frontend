// src/pages/meetups/MeetupsPage.jsx
import "./MeetupsPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MeetupsPage() {
  const [meetups, setMeetups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinedMeetups, setJoinedMeetups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetups();
  }, []);

  async function fetchMeetups(query = "") {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query
        ? `https://meetup-backend-my4m.onrender.com/meetups?search=${encodeURIComponent(query)}`
        : `https://meetup-backend-my4m.onrender.com/meetups`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch meetups");
      const data = await res.json();
      setMeetups(data);
    } catch (err) {
      console.error("Error loading meetups:", err);
      setError("Could not load meetups.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchMeetups(search);
  }

  async function handleAttend(meetupId) {
    const token = localStorage.getItem("token");
    const isJoined = joinedMeetups.includes(meetupId);

    try {
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${meetupId}/attend`,
        {
          method: isJoined ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Request failed");

      if (isJoined) {
        // unregistered
        alert("❎ You have unregistered from this meetup.");
        setJoinedMeetups((prev) => prev.filter((id) => id !== meetupId));
      } else {
        // registered
        alert("✅ You have joined this meetup!");
        setJoinedMeetups((prev) => [...prev, meetupId]);
      }
    } catch (err) {
      console.error("Attend/unregister error:", err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="meetups-page">
      <h1>All Meetups</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search meetups by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading meetups...</p>}
      {error && <p className="error">{error}</p>}

      <div className="meetup-list">
        {meetups.map((m) => (
          <div key={m.id} className="meetup-card">
            <h2>{m.title}</h2>
            <p className="location">📍 {m.location}</p>
            <p className="datetime">
              {m.date} — {m.time}
            </p>

            <div className="buttons">
              <button onClick={() => navigate(`/meetup/${m.id}`)}>
                Read More
              </button>

              {joinedMeetups.includes(m.id) ? (
                <button
                  className="joined-btn unregister"
                  onClick={() => handleAttend(m.id)}
                >
                  ❎ Unregister
                </button>
              ) : (
                <button onClick={() => handleAttend(m.id)}>Join</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
