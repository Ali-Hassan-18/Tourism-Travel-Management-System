import React, { useState, useEffect } from 'react';
import './PremiumPackages.css';

const PremiumPackages = () => {
  const [packages] = useState([
    { 
      id: 1, 
      title: "Shangrila Royal Villa", 
      basePrice: 450, 
      location: "Skardu", 
      img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
      features: ["Lakeside View", "Private Butler", "Helicopter Safari"]
    },
    { 
      id: 2, 
      title: "Serena Hunza Suite", 
      basePrice: 380, 
      location: "Hunza", 
      img: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=600&q=80",
      features: ["Historical Tour", "Yacht Access", "SUV Transport"]
    },
    { 
      id: 3, 
      title: "Malam Jabba VIP", 
      basePrice: 320, 
      location: "Swat", 
      img: "https://images.unsplash.com/photo-1627440406023-7a915159021a?auto=format&fit=crop&w=600&q=80",
      features: ["Ski Gear Inc.", "Lounge Access", "Spa Therapy"]
    }
  ]);

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    travelDate: '', 
    diet: 'Continental Buffet',
    foodType: 'Standard Premium',
    transport: 'Land Cruiser'
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (selectedPkg) {
      const base = selectedPkg.basePrice * bookingForm.members * bookingForm.nights;
      const dietAdd = bookingForm.diet === 'All-Inclusive Elite' ? 120 : 60;
      const transportAdd = bookingForm.transport === 'Range Rover' ? 300 : 150;
      const foodTypeAdd = bookingForm.foodType === 'Gourmet/Organic' ? 50 : 0;
      
      setTotal(base + (dietAdd * bookingForm.members * bookingForm.nights) + (transportAdd * bookingForm.nights) + (foodTypeAdd * bookingForm.members * bookingForm.nights));
    }
  }, [bookingForm, selectedPkg]);

  const handleConfirm = () => {
    if(!bookingForm.travelDate) {
      alert("Please select a travel date.");
      return;
    }
    alert(`Booking Confirmed for ${selectedPkg.title} on ${bookingForm.travelDate}! Total: $${total.toLocaleString()}`);
    setSelectedPkg(null);
  };

  return (
    <div className="prem-container">
      {/* Hero Section */}
      <section className="prem-hero">
        <div className="prem-hero-text">
          <span className="prem-label">PREMIUM SELECTION</span>
          <h1>Luxury Northern Journeys</h1>
          <p>Experience the peaks with unmatched hospitality and comfort.</p>
          <div className="prem-mini-feats">
            <div className="m-feat">💎 <span>24/7 Concierge</span></div>
            <div className="m-feat">🚙 <span>Luxury Fleet</span></div>
            <div className="m-feat">🍽️ <span>Elite Dining</span></div>
          </div>
        </div>
        <div className="prem-hero-visual">
          <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80" alt="Northern Skies" />
        </div>
      </section>

      {/* 3-Column Grid */}
      <section className="prem-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-card">
            <div className="p-card-img">
              <img src={pkg.img} alt={pkg.title} />
            </div>
            <div className="p-card-content">
              <h3>{pkg.title}</h3>
              <p className="p-loc">📍 {pkg.location}</p>
              <ul className="p-list">
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="p-card-footer">
                <span className="p-price">${pkg.basePrice} <sub>/pp</sub></span>
                <button className="p-req-btn" onClick={() => setSelectedPkg(pkg)}>Request</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Booking Modal */}
      {selectedPkg && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <button className="p-close" onClick={() => setSelectedPkg(null)}>&times;</button>
            <div className="p-modal-header">
              <h2>Luxury Itinerary</h2>
              <p>Booking for: {selectedPkg.title}</p>
            </div>
            <div className="p-form">
              <div className="p-group">
                <label>Departure Date</label>
                <input 
                  type="date" 
                  value={bookingForm.travelDate} 
                  onChange={(e) => setBookingForm({...bookingForm, travelDate: e.target.value})} 
                />
              </div>
              <div className="p-group">
                <label>Guests</label>
                <input type="number" min="1" value={bookingForm.members} onChange={(e) => setBookingForm({...bookingForm, members: e.target.value})} />
              </div>
              <div className="p-group">
                <label>Nights</label>
                <input type="number" min="1" value={bookingForm.nights} onChange={(e) => setBookingForm({...bookingForm, nights: e.target.value})} />
              </div>
              <div className="p-group">
                <label>Dining Plan</label>
                <select value={bookingForm.diet} onChange={(e) => setBookingForm({...bookingForm, diet: e.target.value})}>
                  <option value="Continental Buffet">Continental Buffet</option>
                  <option value="All-Inclusive Elite">All-Inclusive Elite</option>
                </select>
              </div>
              <div className="p-group">
                <label>Cuisine Style</label>
                <select value={bookingForm.foodType} onChange={(e) => setBookingForm({...bookingForm, foodType: e.target.value})}>
                  <option value="Standard Premium">Standard Premium</option>
                  <option value="Gourmet/Organic">Gourmet/Organic (+$50)</option>
                </select>
              </div>
              <div className="p-group">
                <label>Luxury Transport</label>
                <select value={bookingForm.transport} onChange={(e) => setBookingForm({...bookingForm, transport: e.target.value})}>
                  <option value="Land Cruiser">Land Cruiser V8</option>
                  <option value="Range Rover">Range Rover Vogue</option>
                </select>
              </div>
            </div>
            <div className="p-total-box">
              <span>ESTIMATED ELITE BILL</span>
              <h3>${total.toLocaleString()}</h3>
            </div>
            <button className="p-confirm-btn" onClick={handleConfirm}>Confirm Booking</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPackages;