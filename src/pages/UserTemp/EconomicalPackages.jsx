import React, { useState } from 'react';
import './EconomicalPackages.css';

const EconomicalPackages = () => {
  // Northern Pakistan Data
  const [packages] = useState([
    { id: 1, title: "Skardu Valley Escape", basePrice: 150, location: "Skardu", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2" },
    { id: 2, title: "Hunza Fairy Meadows", basePrice: 120, location: "Hunza", img: "https://images.unsplash.com/photo-1548013146-72479768bbaa" },
    { id: 3, title: "Naran Kaghan Special", basePrice: 95, location: "Kaghan", img: "https://images.unsplash.com/photo-1621255106365-181f62136015" },
    { id: 4, title: "Swat Valley Wonders", basePrice: 110, location: "Swat", img: "https://images.unsplash.com/photo-1627440406023-7a915159021a" },
  ]);

  const [selectedPkg, setSelectedPkg] = useState(null);
  
  // Detailed Booking State
  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    diet: 'Standard',
    transport: 'Bus',
  });

  // Calculate Total based on user selections
  const calculateTotal = () => {
    if (!selectedPkg) return 0;
    let total = selectedPkg.basePrice * bookingForm.members * bookingForm.nights;
    if (bookingForm.diet === 'Non-Veg') total += (15 * bookingForm.members);
    if (bookingForm.transport === 'Private Jeep') total += 60;
    return total;
  };

  const handleBookingConfirm = () => {
    alert(`Successfully Booked ${selectedPkg.title} for ${bookingForm.members} members! Total: $${calculateTotal()}`);
    setSelectedPkg(null);
  };

  return (
    <div className="eco-page-wrapper">
      {/* Top Hero Section */}
      <section className="top-hero-section">
        <div className="points-column">
          <h2 className="section-title">Economical Northern Adventures</h2>
          <p className="section-subtitle">The best way to visit the mountains at an affordable price.</p>
          
          <div className="info-point">
            <span className="point-number">01</span>
            <div className="point-text">
              <h4>Budget-Friendly Exploration</h4>
              <p>Maximize value with our curated routes and local stays.</p>
            </div>
          </div>
          <div className="info-point">
            <span className="point-number">02</span>
            <div className="point-text">
              <h4>Verified Accommodations</h4>
              <p>Comfortable rooms in standard guest houses across the North.</p>
            </div>
          </div>
          <div className="info-point">
            <span className="point-number">03</span>
            <div className="point-text">
              <h4>Get Back to Nature</h4>
              <p>Authentic local experiences at half the market cost.</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800" alt="Northern Pakistan" />
        </div>
      </section>

      {/* Package Grid */}
      <section className="grid-section">
        <h3 className="grid-title">Available Economical Packages</h3>
        <div className="package-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="eco-card">
              <div className="card-image-box">
                <img src={pkg.img} alt={pkg.title} />
              </div>
              <div className="card-content">
                <h4>{pkg.title}</h4>
                <p>📍 {pkg.location}</p>
                <div className="card-pricing">
                  <span className="price-val">${pkg.basePrice}<span>/Person</span></span>
                  <button className="book-trip-btn" onClick={() => setSelectedPkg(pkg)}>Book Trip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Booking Modal */}
      {selectedPkg && (
        <div className="booking-overlay">
          <div className="booking-card">
            <button className="close-modal" onClick={() => setSelectedPkg(null)}>&times;</button>
            <h3>Trip Customization: {selectedPkg.title}</h3>
            
            <div className="form-grid">
              <div className="input-field">
                <label>Number of Members</label>
                <input 
                  type="number" min="1" 
                  value={bookingForm.members} 
                  onChange={(e) => setBookingForm({...bookingForm, members: parseInt(e.target.value) || 1})} 
                />
              </div>

              <div className="input-field">
                <label>Number of Nights</label>
                <input 
                  type="number" min="1" 
                  value={bookingForm.nights} 
                  onChange={(e) => setBookingForm({...bookingForm, nights: parseInt(e.target.value) || 1})} 
                />
              </div>

              <div className="input-field">
                <label>Dietary Plan</label>
                <select 
                  value={bookingForm.diet} 
                  onChange={(e) => setBookingForm({...bookingForm, diet: e.target.value})}
                >
                  <option value="Standard">Standard (Veg + Lentils)</option>
                  <option value="Non-Veg">Non-Veg (+ $15)</option>
                </select>
              </div>

              <div className="input-field">
                <label>Transport Mode</label>
                <select 
                  value={bookingForm.transport} 
                  onChange={(e) => setBookingForm({...bookingForm, transport: e.target.value})}
                >
                  <option value="Bus">Public Transport (Bus)</option>
                  <option value="Jeep">Shared Jeep</option>
                  <option value="Private Jeep">Private Jeep (+ $60)</option>
                </select>
              </div>
            </div>

            <div className="summary-box">
              <p>Estimated Total: <strong>${calculateTotal()}</strong></p>
            </div>

            <button className="final-book-btn" onClick={handleBookingConfirm}>
              Confirm Detailed Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomicalPackages;