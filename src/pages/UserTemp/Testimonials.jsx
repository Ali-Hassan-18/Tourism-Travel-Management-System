import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Testimonials.css";

const Testimonials = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pull the logged-in user's name from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = userData ? userData.fullName : "Guest User";

  const submitReview = async () => {
    if (!reviewText.trim()) return;

    const payload = { 
      user: loggedInUser, 
      text: reviewText, 
      rating: rating 
    };

    try {
      const res = await fetch("http://localhost:18080/api/testimonials/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsSubmitted(true);
        setReviewText("");
        setRating(5);
      }
    } catch (err) {
      alert("Feedback could not be saved. Ensure the C++ backend is running!");
    }
  };

  if (isSubmitted) {
    return (
      <div className="testimonial-page text-center" style={{padding: '50px'}}>
        <h2 style={{color: '#008080'}}>Feedback Received!</h2>
        <p>Thank you, {loggedInUser}. Your review has been saved to our records. 🎉</p>
        <button className="btn highlight" onClick={() => setIsSubmitted(false)} style={{marginTop: '20px'}}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="testimonial-page">
      <h2>User Feedback</h2>
      <div className="testimonial-form">
        <textarea 
          placeholder="Share your experience with Tourista..." 
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
        <button className="btn highlight" onClick={submitReview}>Submit Review</button>
      </div>
    </div>
  );
};

export default Testimonials;