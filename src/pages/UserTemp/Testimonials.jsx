import React, { useState } from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import "./Testimonials.css";


const loggedInUser = "Malaika"; // simulate logged-in user

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  const getDate = () => {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;

    if (isEditing) {
      setReviews((prev) =>
        prev.map((r) =>
          r.user === loggedInUser
            ? { ...r, text: reviewText, rating, date: getDate() }
            : r
        )
      );
      setIsEditing(false);
    } else {
      setReviews([
        {
          user: loggedInUser,
          text: reviewText,
          rating,
          date: getDate(),
        },
        ...reviews,
      ]);
    }

    setReviewText("");
    setRating(5);
  };

  const editReview = (r) => {
    setReviewText(r.text);
    setRating(r.rating);
    setIsEditing(true);
  };

  const deleteReview = () => {
    setReviews((prev) => prev.filter((r) => r.user !== loggedInUser));
  };

  return (
    <div className="testimonial-page">
      <h2>User Feedback</h2>

      {/* ADD / EDIT REVIEW */}
      <div className="testimonial-form">
        <textarea
          placeholder="Share your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <div className="rating-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              className={`star ${n <= rating ? "active" : ""}`}
              onClick={() => setRating(n)}
            />
          ))}
        </div>

        <button onClick={submitReview}>
          {isEditing ? "Update Review" : "Submit Review"}
        </button>
      </div>

      {/* DISPLAY REVIEWS */}
      <div className="testimonial-list">
        {reviews.map((r, i) => (
          <div key={i} className="testimonial-card">
            <p className="review-text">"{r.text}"</p>

            <div className="review-footer">
              <span className="review-user">{r.user}</span>
              <span className="review-stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>

            <div className="review-date">
              Posted on: {r.date}
            </div>

            {r.user === loggedInUser && (
              <div className="review-actions">
                <FaEdit onClick={() => editReview(r)} />
                <FaTrash onClick={deleteReview} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
