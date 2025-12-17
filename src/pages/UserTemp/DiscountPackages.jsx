import React from "react";
import "./EconomicalPackages.css";

const EconomicalPackages = () => {
  return (
    <div className="eco-container">

      {/* ================= HEADER ================= */}
      <div className="eco-header">
        <h2>Pakistan Northern Tour Packages</h2>
        <p>
          Discover the breathtaking beauty of Northern Pakistan through
          carefully planned, affordable, and comfortable travel experiences.
        </p>
      </div>

      {/* ================= WHY CHOOSE US (MOVED UP) ================= */}
      <div className="why-travel-section">

        <div className="why-travel-left">
          <h3 className="section-title">Why Choose Our Pakistan Tours?</h3>

          <div className="why-item">
            <div className="why-number blue">01</div>
            <div>
              <h4>Affordable & Transparent Pricing</h4>
              <p>
                We provide budget-friendly tour packages with clear pricing and
                absolutely no hidden charges.
              </p>
            </div>
          </div>

          <div className="why-item">
            <div className="why-number purple">02</div>
            <div>
              <h4>Experienced Tour Management</h4>
              <p>
                Our professional team ensures safe travel, proper planning, and
                smooth execution throughout your journey.
              </p>
            </div>
          </div>

          <div className="why-item">
            <div className="why-number green">03</div>
            <div>
              <h4>Unforgettable Northern Experiences</h4>
              <p>
                Explore majestic mountains, scenic valleys, and iconic
                destinations that create lifelong memories.
              </p>
            </div>
          </div>

          <button className="explore-btn">Explore All Northern Tours</button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1593693411515-c20261bcad6e"
          alt="Northern Pakistan"
          className="why-main-img"
        />

      </div>

      {/* ================= PACKAGES ================= */}
      <h3 className="section-title">Economical Northern Tour Packages</h3>

      <div className="packages-grid">

        {/* CARD 1 */}
        <div className="package-card">
          <div className="card-image">Hunza Valley</div>
          <div className="card-details">
            <h3>Hunza Valley Escape</h3>
            <div className="card-price">Starting at PKR 45,000 per person</div>
            <ul className="card-features">
              <li>✔ 3 nights premium hotel accommodation</li>
              <li>✔ Comfortable transport with fuel included</li>
              <li>✔ Daily breakfast and guided sightseeing</li>
              <li>✔ Visit Altit & Baltit Forts</li>
            </ul>
            <button className="book-btn">Reserve Your Tour</button>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="package-card">
          <div className="card-image">Skardu</div>
          <div className="card-details">
            <h3>Skardu Adventure Tour</h3>
            <div className="card-price">Starting at PKR 55,000 per person</div>
            <ul className="card-features">
              <li>✔ 4 nights comfortable accommodation</li>
              <li>✔ Private transport with driver</li>
              <li>✔ Visit Shangrila & Upper Kachura Lake</li>
              <li>✔ Scenic mountain photography points</li>
            </ul>
            <button className="book-btn">Reserve Your Tour</button>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="package-card">
          <div className="card-image">Swat Valley</div>
          <div className="card-details">
            <h3>Swat Valley Serenity Tour</h3>
            <div className="card-price">Starting at PKR 38,000 per person</div>
            <ul className="card-features">
              <li>✔ 3 nights hotel accommodation</li>
              <li>✔ Visit Kalam & Malam Jabba</li>
              <li>✔ Safe and comfortable transport</li>
              <li>✔ Ideal for families and groups</li>
            </ul>
            <button className="book-btn">Reserve Your Tour</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EconomicalPackages;
