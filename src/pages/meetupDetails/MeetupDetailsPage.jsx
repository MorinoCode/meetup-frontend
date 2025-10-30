import "./MeetupDetailsPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MeetupDetailsPage() {
  const { id } = useParams();
  const [meetup, setMeetup] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchMeetupDetails();
    fetchReviews();
  }, [id]);

  async function fetchMeetupDetails() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMeetup(data);

      const userId = localStorage.getItem("userId");
      if (data.attendees?.some((a) => String(a.user_id) === userId)) {
        setJoined(true);
      }
    } catch (err) {
      console.error("Error loading details:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}/review`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      if (res.ok) {
        alert("✅ Review submitted!");
        setShowForm(false);
        fetchReviews();
      } else {
        alert("❌ Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!meetup) return <p>Meetup not found.</p>;

  const meetupDate = new Date(meetup.date);
  const isPast = meetupDate < new Date();
  const canReview = joined && isPast;

  return (
    <div className="meetup-details">
      <h1>{meetup.title}</h1>
      <p className="meta">
        📍 {meetup.location} — 🗓️ {meetup.date.split("T")[0]} at ⏰ {meetup.time.slice(0, 5)}
      </p>
      <p>{meetup.description}</p>

      <div className="capacity">
        Capacity: {meetup.capacity} | Joined: {meetup.attendees?.length || 0}
      </div>

      <div className="reviews">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <p>
                <strong>{r.reviewer_username}</strong> rated ⭐ {r.rating}/5
              </p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {canReview && (
        <div className="review-form">
          {!showForm ? (
            <button onClick={() => setShowForm(true)}>⭐ Write a Review</button>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <label>
                Rating:
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts..."
              ></textarea>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
