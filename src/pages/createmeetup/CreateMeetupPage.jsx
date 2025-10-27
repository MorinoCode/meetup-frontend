// src/pages/createmeetup/CreateMeetupPage.jsx
import "./CreateMeetupPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateMeetupPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // används för host

      const res = await fetch("https://meetup-backend-my4m.onrender.com/meetups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          date,
          time,
          host_id: userId, // nytt fält i backend
        }),
      });

      if (!res.ok) throw new Error("Failed to create meetup");

      alert("✅ Meetup created successfully!");
      navigate("/allmeetup");
    } catch (err) {
      console.error("Error creating meetup:", err);
      setError("Could not create meetup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-meetup-page">
      <h1>Create New Meetup</h1>

      <form className="create-meetup-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your meetup..."
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>

        <div className="date-time-row">
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label>
            Time:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Meetup"}
        </button>
      </form>
    </div>
  );
}
