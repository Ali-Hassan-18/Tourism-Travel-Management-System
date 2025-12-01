import React from "react";
import "./Homepage.css";
import { FaSearch } from "react-icons/fa";

// Make sure your image is in src/assets/img5.jpg
import heroImg from "../../assets/img5.jpg";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <div
        className="homepage-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Let’s explore North Pakistan</h1>
          </div>
        </div>
      </div>

      {/* Search Bar positioned overlapping bottom of hero */}
      <div className="homepage-search-bar">
        <input
          type="text"
          placeholder="Search for a city..."
          className="city-input"
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default Homepage;
