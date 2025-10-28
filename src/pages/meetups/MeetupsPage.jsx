import "./MeetupsPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MeetupsPage() {
  const [meetups, setMeetups] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinedMeetups, setJoinedMeetups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetups();
  }, []);

  async function fetchMeetups() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();

      // ✅ matcha backend param-namn
      if (search.trim()) params.append("search", search.trim());
      if (dateFilter) params.append("date_filter", dateFilter);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const url = `https://meetup-backend-my4m.onrender.com/meetups?${params.toString()}`;
      console.log("🔍 Fetching meetups from:", url);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Failed to fetch meetups");
      }

      const data = await res.json();
      setMeetups(data);
    } catch (err) {
      console.error("Error loading meetups:", err);
      setError("Could not load meetups.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchMeetups();
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
        alert("❎ You have unregistered from this meetup.");
        setJoinedMeetups((prev) => prev.filter((id) => id !== meetupId));
      } else {
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

      {/* 🔍 Search & Filters */}
      <form onSubmit={handleFilterSubmit} className="filter-bar">
        <input
          type="text"
          placeholder="Title or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <button type="submit">Apply Filters</button>
      </form>

      {loading && <p>Loading meetups...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && meetups.length === 0 && (
        <p className="no-meetups">No meetups found for your filters.</p>
      )}

      <div className="meetup-list">
        {meetups.map((m) => (
          <div key={m.id} className="meetup-card">
            <h2>{m.title}</h2>
            <p className="location">📍 {m.location}</p>
            <p className="datetime">
              {m.date.split("T")[0]} — {m.time.slice(0, 5)}
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
