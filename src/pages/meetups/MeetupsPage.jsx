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
    fetchJoinedMeetups();
  }, []);

  async function fetchMeetups() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (dateFilter) params.append("date_filter", dateFilter);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const url = `https://meetup-backend-my4m.onrender.com/meetups?${params.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch meetups");

      const data = await res.json();

      // ✅ اضافه کردن فیلتر فرانت‌اند برای category
      if (search.trim()) {
        const term = search.toLowerCase();

        const filtered = data.filter((m) => {
          return (
            m.title?.toLowerCase().includes(term) ||
            m.description?.toLowerCase().includes(term) ||
            m.location?.toLowerCase().includes(term) ||
            m.category?.toLowerCase().includes(term) // 👈 اضافه شده
          );
        });

        setMeetups(filtered);
      } else {
        setMeetups(data);
      }
    } catch (err) {
      console.error("Error loading meetups:", err);
      setError("Could not load meetups.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchJoinedMeetups() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://meetup-backend-my4m.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const joinedIds = data.history.map((m) => m.meetup_id);
        setJoinedMeetups(joinedIds);
      }
    } catch (err) {
      console.error("Error loading joined meetups:", err);
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

      const data = await res.json();
      if (!res.ok) {
        if (data.message?.includes("full")) {
          alert("❌ This meetup is full!");
        } else {
          alert("❌ Something went wrong.");
        }
        return;
      }

      if (isJoined) {
        alert("❎ You have unregistered from this meetup.");
        setJoinedMeetups((prev) => prev.filter((id) => id !== meetupId));
        setMeetups((prev) =>
          prev.map((m) =>
            m.id === meetupId
              ? { ...m, attendees_count: (m.attendees_count || 1) - 1 }
              : m
          )
        );
      } else {
        alert("✅ You have joined this meetup!");
        setJoinedMeetups((prev) => [...prev, meetupId]);
        setMeetups((prev) =>
          prev.map((m) =>
            m.id === meetupId
              ? { ...m, attendees_count: (m.attendees_count || 0) + 1 }
              : m
          )
        );
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
          placeholder="Search by title, location or category..."
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
        {meetups.map((m) => {
          const isJoined = joinedMeetups.includes(m.id);
          const meetupDate = new Date(m.date);
          const isPast = meetupDate < new Date();
          const attendees = m.attendees_count || 0;
          const capacity = m.capacity || 10;
          const spotsLeft = capacity - attendees;
          const isFull = spotsLeft <= 0;

          return (
            <div key={m.id} className="meetup-card">
              <h2>{m.title}</h2>
              <p className="location">📍 {m.location}</p>
              {m.category && <p className="category">🏷️ {m.category}</p>}
              <p className="datetime">
                {m.date.split("T")[0]} — {m.time.slice(0, 5)}
              </p>

              <p className={`spots ${isFull ? "full" : ""}`}>
                {isFull ? "❌ Full" : `🪑 ${spotsLeft} spots left`}
              </p>

              <div className="buttons">
                <button onClick={() => navigate(`/meetup/${m.id}`)}>
                  Read More
                </button>

                {(() => {
                  if (isJoined && isPast) {
                    return (
                      <button
                        className="review-btn"
                        onClick={() => navigate(`/meetup/${m.id}`)}
                      >
                        ⭐ Review
                      </button>
                    );
                  }

                  if (isJoined) {
                    return (
                      <button
                        className="joined-btn unregister"
                        onClick={() => handleAttend(m.id)}
                      >
                        ❎ Unregister
                      </button>
                    );
                  }

                  return (
                    <button
                      disabled={isFull}
                      onClick={() => handleAttend(m.id)}
                      className={isFull ? "disabled" : ""}
                    >
                      {isFull ? "Full" : "Join"}
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
