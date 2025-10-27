// src/pages/meetupDetails/MeetupDetailsPage.jsx
import "./MeetupDetailsPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MeetupDetailsPage() {
  const { id } = useParams();
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReviewId, setUserReviewId] = useState(null); // track user's review

  useEffect(() => {
    fetchMeetupDetails();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function fetchReviews() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}/review`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);

        // check if user already has a review
        const userId = localStorage.getItem("userId");
        const existing = data.find(
          (r) => String(r.reviewer_username) === localStorage.getItem("username")
        );
        if (existing) {
          setUserReviewId(existing.id);
          setRating(existing.rating);
          setComment(existing.comment);
        }
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
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
      fetchMeetupDetails();
    } catch (err) {
      console.error("Attend error:", err);
      alert("Something went wrong. Please try again.");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const body = JSON.stringify({ rating, comment });

      const res = await fetch(
        `https://meetup-backend-my4m.onrender.com/meetups/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      if (res.ok) {
        alert(userReviewId ? "✅ Review updated!" : "✅ Review submitted!");
        setShowReviewForm(false);
        fetchReviews();
      } else {
        alert("❌ Failed to submit review.");
      }
    } catch (err) {
      console.error("Review submit error:", err);
    }
  }

  if (loading) return <p className="loading">Loading meetup details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!meetup) return null;

  const meetupDate = new Date(meetup.date);
  const now = new Date();
  const canReview = joined && meetupDate < now; // only past meetups you attended

  const userHasReview = reviews.some(
    (r) => r.reviewer_username === localStorage.getItem("username")
  );

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

      {/* ⭐ Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <p>
                <strong>{r.reviewer_username}</strong> rated ⭐ {r.rating}/5
              </p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {canReview && (
        <div className="review-form-container">
          {!showReviewForm ? (
            <button onClick={() => setShowReviewForm(true)} className="review-btn">
              {userHasReview ? "✏️ Edit Review" : "⭐ Rate & Review"}
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <label>
                Rating:
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="0">Select</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="review-buttons">
                <button type="submit">
                  {userHasReview ? "Update Review" : "Submit Review"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
