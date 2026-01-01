import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { BsArrowRepeat } from "react-icons/bs";

// ================= LOCAL IMAGE IMPORTS =================
import hunzaImg from "../assets/hunza.jpg";
import fairyMeadowsImg from "../assets/fairy_meadows.jpg";
import naltarImg from "../assets/naltar.jpg";
import kaghanImg from "../assets/kaghan.jpg";
import skarduImg from "../assets/skardu.jpg";
import khunjerabImg from "../assets/khunjareeb.jpg";
import neelumImg from "../assets/neelum.jpg";
import swatKalamImg from "../assets/Swat-Kalam-Lake.jpg";
import babusarImg from "../assets/Babusar-top.jpg";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

import "./LandingPage.css";

// ================= DUMMY PACKAGE DATA =================
const DUMMY_PACKAGES = [
  { title: "Heavenly Hunza & Gilgit", originalPrice: 85000, discountedPrice: 69999, image: hunzaImg, rating: "4.9", reviews: "3.9k" },
  { title: "Fairy Meadows Trek", originalPrice: 45000, discountedPrice: 38999, image: fairyMeadowsImg, rating: "4.8", reviews: "2.1k" },
  { title: "Naltar Valley Escapade", originalPrice: 62000, discountedPrice: 54999, image: naltarImg, rating: "4.7", reviews: "1.6k" },
  { title: "Kaghan Valley & Saif ul Malook", originalPrice: 51000, discountedPrice: 42999, image: kaghanImg, rating: "4.8", reviews: "1.9k" },
  { title: "Skardu: Shigar Fort Retreat", originalPrice: 95000, discountedPrice: 79999, image: skarduImg, rating: "4.8", reviews: "1.2k" },
  { title: "Khunjerab Pass Expedition", originalPrice: 70000, discountedPrice: 59999, image: khunjerabImg, rating: "4.8", reviews: "1.4k" },
  { title: "Neelum Valley Delight", originalPrice: 55000, discountedPrice: 48999, image: neelumImg, rating: "4.9", reviews: "2.7k" },
  { title: "Swat & Kalam Luxury Tour", originalPrice: 68000, discountedPrice: 56999, image: swatKalamImg, rating: "4.8", reviews: "2.4k" },
  { title: "Babusar Top Adventure", originalPrice: 40000, discountedPrice: 32999, image: babusarImg, rating: "4.7", reviews: "1.1k" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const images = [img1, img2, img3, img4];

  // ================= TESTIMONIALS =================
  const testimonials = [
    { text: "Amazing experience! Tourista made my trip unforgettable.", name: "Ayesha Khan", rating: 5, date: "2024-11-10" },
    { text: "Highly recommended! Smooth planning and great support.", name: "Hoorain Nouman", rating: 4, date: "2024-10-02" },
    { text: "Beautiful routes and perfect safety alerts!", name: "Fatima Malik", rating: 5, date: "2024-12-01" },
    { text: "Top-tier travel guidance. Loved every part of it.", name: "Usman Baig", rating: 4.5, date: "2024-09-18" },
    { text: "User-friendly and extremely helpful for family trips.", name: "Zara Sheikh", rating: 5, date: "2024-08-22" },
    { text: "Their package suggestions are spot on!", name: "Ahmad", rating: 4, date: "2024-06-10" },
    { text: "Very professional and accurate weather alerts.", name: "Kiran Nawaz", rating: 5, date: "2024-11-29" },
    { text: "The best travel planning tool I’ve used.", name: "Hamza Tariq", rating: 5, date: "2024-07-04" },
    { text: "Smooth, fast, and super helpful features!", name: "Nimra Saleem", rating: 4.5, date: "2024-10-12" },
    { text: "Smart route guidance saved us a lot of time!", name: "Bilal Ahmed", rating: 4, date: "2024-05-28" },
    { text: "Their customer service is amazing!", name: "Sana Mushtaq", rating: 5, date: "2024-11-15" },
    { text: "Everything was perfect from start to end.", name: "Dawood Khan", rating: 4.5, date: "2024-12-02" },
  ];

  // ================= TESTIMONIAL CAROUSEL =================
  const [startIndex, setStartIndex] = useState(0);
  const visible = 3;
  const total = testimonials.length;

  const handleNext = () => setStartIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setStartIndex((prev) => (prev - 1 + total) % total);

  const visibleCards = Array.from({ length: visible }, (_, i) => testimonials[(startIndex + i) % total]);

  // ================= DISCOUNTED PACKAGES CAROUSEL =================
  const [pkgIndex, setPkgIndex] = useState(0);
  const pkgVisible = 3;
  const pkgTotal = DUMMY_PACKAGES.length;

  const handlePkgNext = () => setPkgIndex((prev) => (prev + 1) % pkgTotal);
  const handlePkgPrev = () => setPkgIndex((prev) => (prev - 1 + pkgTotal) % pkgTotal);

  const visiblePackages = Array.from({ length: pkgVisible }, (_, i) => DUMMY_PACKAGES[(pkgIndex + i) % pkgTotal]);



  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="landing-page flex flex-col min-h-screen">
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="navbar-logo">Tourista</div>
        <div className="navbar-menu">
          <a href="#home">Home</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#packages">Discounted Packages</a>
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
              animationDelay: `${index * 5}s`,
            }}
          ></div>
        ))}
        <div className="landing-gradient"></div>
        <div className="landing-content">
          <h1 className="title">Explore Pakistan <br /> With Smart Guidance</h1>
          <p className="subtitle">Personalized routes • Premium packages • Weather safety alerts</p>
        </div>
      </div>

      {/* ================= TESTIMONIAL SECTION ================= */}
      <div id="testimonials" className="testimonials-section">
        <h2 className="section-title">What Our Travelers Say</h2>
        <div className="testimonial-wrapper">
          <button className="arrow-btn" onClick={handlePrev}>{"<"}</button>
          <div className="testimonial-slider">
            {visibleCards.map((item, index) => {
              const initial = item.name?.charAt(0)?.toUpperCase();
              return (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-avatar">{initial}</div>
                  <h3 className="traveler-name">{item.name}</h3>
                  <div className="stars">
                    {Array.from({ length: Math.floor(item.rating) }).map((_, i) => <span key={i}>★</span>)}
                    {item.rating % 1 !== 0 && <span>☆</span>}
                  </div>
                  <p className="testimonial-date">{new Date(item.date).toLocaleDateString()}</p>
                  <p className="testimonial-text">
                    <span className="quote-mark">“</span>
                    <em>{item.text}</em>
                    <span className="quote-mark">”</span>
                  </p>
                </div>
              );
            })}
          </div>
          <button className="arrow-btn" onClick={handleNext}>{">"}</button>
        </div>
      </div>

      {/* ================= DISCOUNTED PACKAGES SECTION ================= */}
      <div id="packages" className="packages-section">
        <h2 className="section-title">Discounted Packages</h2>
        <div className="testimonial-wrapper">
          <button className="arrow-btn" onClick={handlePkgPrev}>{"<"}</button>
          <div className="testimonial-slider">
            {visiblePackages.map((pkg, index) => (
              <div key={index} className="package-card">
                <img src={pkg.image} alt={pkg.title} className="package-img" />
                <h3 className="package-title">{pkg.title}</h3>
                <div className="price-box">
                  <span className="old-price">Rs {pkg.originalPrice}</span>
                  <span className="new-price">Rs {pkg.discountedPrice}</span>
                </div>
                <div className="rating-box">
                  <span className="star">⭐</span>
                  <span className="rating">{pkg.rating}</span>
                  <span className="reviews">({pkg.reviews} Reviews)</span>
                </div>
                <button className="view-btn" onClick={() => setShowPopup(true)}>View Details</button>
              </div>
            ))}
          </div>
          <button className="arrow-btn" onClick={handlePkgNext}>{">"}</button>
        </div>
      </div>

      {/* ================= POPUP MODAL ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3 className="popup-title">Login Required</h3>
            <p className="popup-text">To view detailed package information, please login first.</p>
            <div className="popup-buttons">
              <button className="popup-login-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="popup-close-btn" onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= WHY CHOOSE US ================= */}
      <div id="why" className="why-section">
        <h2 className="why-title">Why Travelers Choose Tourista</h2>
        <div className="why-cards">
          <div className="why-card premium-card">
            <div className="why-icon-box premium-icon-box"><span className="why-icon premium-icon">💴</span></div>
            <h3 className="why-heading">Budget Friendly Packages</h3>
            <p className="why-text">We provide carefully curated premium and economical travel packages for North Pakistan, ensuring unforgettable experiences for every budget.</p>
          </div>
          <div className="why-card premium-card">
            <div className="why-icon-box premium-icon-box"><MdOutlineAccessTimeFilled className="why-icon premium-icon" /></div>
            <h3 className="why-heading">Personalized Trip Recommendations</h3>
            <p className="why-text">Enjoy personalized trip planning based on your preferences and real-time weather updates to make every journey seamless and enjoyable.</p>
          </div>
          <div className="why-card premium-card">
            <div className="why-icon-box premium-icon-box"><BsArrowRepeat className="why-icon premium-icon" /></div>
            <h3 className="why-heading">Weather Updates & Announcements</h3>
            <p className="why-text">Stay informed with real-time weather alerts and important travel announcements, ensuring a safe and smooth journey throughout your trip.</p>
          </div>
          <div className="why-card premium-card">
            <div className="why-icon-box premium-icon-box"><span className="why-icon premium-icon">🤖</span></div>
            <h3 className="why-heading">Chatbot Recommendations</h3>
            <p className="why-text">Get instant personalized travel suggestions, itinerary guidance, and smart recommendations through our chatbot — making your journey effortless and tailored to you.</p>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">&copy; {new Date().getFullYear()} Tourista. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;