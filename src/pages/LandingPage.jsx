import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { BsArrowRepeat } from "react-icons/bs";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4];

  const testimonials = [
    { text: "Amazing experience! Tourista made my trip unforgettable.", name: "Ayesha Khan" },
    { text: "Highly recommended! Smooth planning and great support.", name: "Hoorain Nouman" },
    { text: "Beautiful routes and perfect safety alerts!", name: "Fatima Malik" },
    { text: "Top-tier travel guidance. Loved every part of it.", name: "Usman Baig" },
    { text: "User-friendly and extremely helpful for family trips.", name: "Zara Sheikh" },
    { text: "Their package suggestions are spot on!", name: "Ahmad" },
    { text: "Very professional and accurate weather alerts.", name: "Kiran Nawaz" },
    { text: "The best travel planning tool I’ve used.", name: "Hamza Tariq" },
    { text: "Smooth, fast, and super helpful features!", name: "Nimra Saleem" },
    { text: "Smart route guidance saved us a lot of time!", name: "Bilal Ahmed" },
    { text: "Their customer service is amazing!", name: "Sana Mushtaq" },
    { text: "Everything was perfect from start to end.", name: "Dawood Khan" }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const total = testimonials.length;
  const visible = 3;

  const handleNext = () => {
    setStartIndex((prev) => (prev + visible) % total);
  };

  const handlePrev = () => {
    setStartIndex((prev) => {
      let newIndex = prev - visible;
      return newIndex < 0 ? total + newIndex : newIndex;
    });
  };

  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const visibleCards = loopedTestimonials.slice(startIndex, startIndex + visible);

  return (
    <div className="landing-page flex flex-col min-h-screen">
      
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="navbar-logo">Tourista</div>
        <div className="navbar-menu">
          <a href="#home">Home</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#packages">Top Rated Packages</a>
          <a href="#why">Why Choose Us</a>
        </div>
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div id="home" className="landing-container">
        {images.map((img, index) => (
          <div
            key={index}
            className="bg-slide"
            style={{
              backgroundImage: `url(${img})`,
              animationDelay: `${index * 5}s`
            }}
          ></div>
        ))}

        <div className="landing-gradient"></div>
        <div className="landing-content">
          <h1 className="title">
            Explore Pakistan <br /> With Smart Guidance
          </h1>
          <p className="subtitle">
            Personalized routes • Premium packages • Weather safety alerts
          </p>

          <div className="btn-group">
            <button className="primary-btn">Explore Packages</button>
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Login / Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ================= TESTIMONIAL SECTION ================= */}
      <div id="testimonials" className="testimonials-section">
        <h2 className="section-title">What Our Travelers Say</h2>

        <div className="testimonial-wrapper">
          <button className="arrow-btn" onClick={handlePrev}>{"<"}</button>

          <div className="testimonial-slider">
            {visibleCards.map((item, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <span className="testimonial-name">{item.name}</span>
                </div>
                <p className="testimonial-text">
                  <span className="quote-mark">“</span>
                  <em>{item.text}</em>
                  <span className="quote-mark">”</span>
                </p>
              </div>
            ))}
          </div>

          <button className="arrow-btn" onClick={handleNext}>{">"}</button>
        </div>
      </div>

{/* ================= WHY CHOOSE US (PREMIUM) ================= */}
<div id="why" className="why-section">
  <h2 className="why-title">Why Travelers Choose Tourista</h2>

  <div className="why-cards">

    {/* Best Price Advantage */}
    <div className="why-card premium-card">
      <div className="why-icon-box premium-icon-box">
        <span className="why-icon premium-icon">💴</span>
      </div>
      <h3 className="why-heading">Budget Friendly Packages</h3>
      <p className="why-text">
        We provide carefully curated premium and economical travel packages 
        for North Pakistan, ensuring unforgettable experiences for every budget.
      </p>
    </div>

    {/* Real-Time Convenience */}
    <div className="why-card premium-card">
      <div className="why-icon-box premium-icon-box">
        <MdOutlineAccessTimeFilled className="why-icon premium-icon" />
      </div>
      <h3 className="why-heading">Personalized Trip Recommendations</h3>
      <p className="why-text">
        Enjoy personalized trip planning based on your preferences
        and real-time weather updates to make every journey seamless and enjoyable.
      </p>
    </div>

 <div className="why-card premium-card">
  <div className="why-icon-box premium-icon-box">
    <BsArrowRepeat className="why-icon premium-icon" />
  </div>
  <h3 className="why-heading">Weather Updates & Announcements</h3>
  <p className="why-text">
    Stay informed with real-time weather alerts and important travel announcements, 
    ensuring a safe and smooth journey throughout your trip.
  </p>
</div>


   {/* Chatbot & Recommendations */}
<div className="why-card premium-card">
  <div className="why-icon-box premium-icon-box">
    <span className="why-icon premium-icon">🤖</span>
  </div>
  <h3 className="why-heading"> Chatbot Recommendations</h3>
  <p className="why-text">
    Get instant personalized travel suggestions, itinerary guidance, and smart recommendations 
    through our  chatbot — making your journey effortless and tailored to you.
  </p>
</div>

  </div>

  <p className="text-center text-gray-500 text-sm mt-6">
    &copy; {new Date().getFullYear()} Tourista. All rights reserved.
  </p>
</div>
</div>
  );
};

export default LandingPage;
