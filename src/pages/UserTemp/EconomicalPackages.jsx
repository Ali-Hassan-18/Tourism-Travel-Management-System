import React, { useState, useEffect } from 'react';
import './EconomicalPackages.css';

const EconomicalPackages = () => {
  const [packages, setPackages] = useState([]); 
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'PKR'
  const [exchangeRate] = useState(280); // 1 USD = 280 PKR
  
  // Fetch from C++ Doubly Linked List
  useEffect(() => {
    fetch('http://localhost:18080/api/packages/Economical')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Failed to load packages:", err));
  }, []);
  
  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    travelDate: '', 
    diet: 'Standard',
    transport: 'Bus',
  });

  // Format price based on selected currency ONLY
  const formatPrice = (priceInUSD) => {
    if (currency === 'PKR') {
      const priceInPKR = Math.round(priceInUSD * exchangeRate);
      return `Rs ${priceInPKR.toLocaleString('en-PK')}`;
    } else {
      return `$ ${priceInUSD}`;
    }
  };

  const calculateTotal = () => {
    if (!selectedPkg) return 0;
    let total = selectedPkg.basePrice * bookingForm.members * bookingForm.nights;
    if (bookingForm.diet === 'Non-Veg') total += (15 * bookingForm.members);
    if (bookingForm.transport === 'Private Jeep') total += 60;
    return total;
  };

  const handleBookingConfirm = async () => {
    if(!bookingForm.travelDate) {
      alert("Please select a travel date.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Please login to book a trip!");
      return;
    }

    // UPDATED: Full dynamic payload from text boxes
    const payload = {
      email: userData.email,
      city: selectedPkg.location,
      title: selectedPkg.title,
      category: "Economical",
      total: calculateTotal(),
      members: parseInt(bookingForm.members),
      nights: parseInt(bookingForm.nights),   // Dynamic info
      travelDate: bookingForm.travelDate,      // Dynamic info
      transport: bookingForm.transport,
      diet: bookingForm.diet,
      img: selectedPkg.img
    };

    try {
      const response = await fetch('http://localhost:18080/api/book/detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.status === "success") {
        const totalFormatted = currency === 'PKR' 
          ? `Rs ${Math.round(calculateTotal() * exchangeRate).toLocaleString('en-PK')}`
          : `$ ${calculateTotal()}`;
          
        alert(`Successfully Booked ${selectedPkg.title}! Total: ${totalFormatted}`);
        setSelectedPkg(null);
      }
    } catch (error) {
      alert("Could not connect to backend server.");
    }
  };

  return (
    <div className="eco-page-wrapper">
      <section className="top-hero-section">
        <div className="points-column">
          <h2 className="section-title">Economical Northern Adventures</h2>
          <p className="section-subtitle">The best way to visit the mountains at an affordable price.</p>
          
          {/* Currency Filter Added */}
          <div className="currency-filter">
            <div className="currency-filter-row">
              <span className="currency-label">Display prices in:</span>
              <div className="currency-toggle-buttons">
                <button 
                  className={`currency-toggle-btn ${currency === 'USD' ? 'active' : ''}`}
                  onClick={() => setCurrency('USD')}
                >
                  USD ($)
                </button>
                <button 
                  className={`currency-toggle-btn ${currency === 'PKR' ? 'active' : ''}`}
                  onClick={() => setCurrency('PKR')}
                >
                  PKR (Rs)
                </button>
              </div>
            </div>
            <div className="exchange-rate-info">
              Exchange Rate: 1 USD = Rs {exchangeRate.toLocaleString()}
            </div>
          </div>
          
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
                  <span className="price-val">{formatPrice(pkg.basePrice)}<span>/Person</span></span>
                  <button className="book-trip-btn" onClick={() => setSelectedPkg(pkg)}>Book Trip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPkg && (
        <div className="booking-overlay">
          <div className="booking-card">
            <button className="close-modal" onClick={() => setSelectedPkg(null)}>&times;</button>
            <h3>Trip Customization: {selectedPkg.title}</h3>
            
            <div className="form-grid">
              {/* NEW: Date Picker Field */}
              <div className="input-field">
                <label>Arrival Date</label>
                <input 
                  type="date" 
                  value={bookingForm.travelDate} 
                  onChange={(e) => setBookingForm({...bookingForm, travelDate: e.target.value})} 
                />
              </div>

              <div className="input-field">
                <label>Guests</label>
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
                  <option value="Non-Veg">
                    Non-Veg (+{currency === 'PKR' 
                      ? ` Rs ${(15 * exchangeRate).toLocaleString()}` 
                      : ' $15'})
                  </option>
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
                  <option value="Private Jeep">
                    Private Jeep (+{currency === 'PKR' 
                      ? ` Rs ${(60 * exchangeRate).toLocaleString()}` 
                      : ' $60'})
                  </option>
                </select>
              </div>
            </div>

            <div className="summary-box">
              <p>Estimated Total: <strong>{formatPrice(calculateTotal())}</strong></p>
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