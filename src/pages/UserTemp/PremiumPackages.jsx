import React, { useState, useEffect } from 'react';
import './PremiumPackages.css';
import { FaCheckCircle, FaCalendarAlt, FaCrown, FaGem } from 'react-icons/fa';

const PremiumPackages = ({ onNavigate }) => {
  // 1. Dynamic State from C++ Backend
  const [packages, setPackages] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [total, setTotal] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);
  const [currency, setCurrency] = useState('USD'); 
  const [exchangeRate] = useState(280); 

  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    travelDate: '', 
    diet: 'Continental Buffet',
    foodType: 'Standard Premium',
    transport: 'Land Cruiser'
  });

  // 2. Fetch "Premium" Tier from Doubly Linked List 
  useEffect(() => {
    fetch('http://localhost:18080/api/packages/Premium')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Failed to load premium packages:", err));
  }, []);

  // 3. Dynamic Price Calculation matching your Elite logic
  useEffect(() => {
    if (selectedPkg) {
      const base = selectedPkg.basePrice * bookingForm.members * bookingForm.nights;
      const dietAdd = bookingForm.diet === 'All-Inclusive Elite' ? 120 : 60;
      const transportAdd = bookingForm.transport === 'Range Rover' ? 300 : 150;
      const foodTypeAdd = bookingForm.foodType === 'Gourmet/Organic' ? 50 : 0;
      
      setTotal(base + (dietAdd * bookingForm.members * bookingForm.nights) + 
              (transportAdd * bookingForm.nights) + 
              (foodTypeAdd * bookingForm.members * bookingForm.nights));
    }
  }, [bookingForm, selectedPkg]);

  // Format price based on selected currency
  const formatPrice = (priceInUSD) => {
    if (currency === 'PKR') {
      const priceInPKR = Math.round(priceInUSD * exchangeRate);
      return `Rs ${priceInPKR.toLocaleString('en-PK')}`;
    }
    return `$ ${priceInUSD.toLocaleString()}`;
  };

  // 4. Submit Dynamic Metadata to C++
  const handleConfirm = async () => {
    if(!bookingForm.travelDate) {
      alert("Please select a travel date.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Please login to book a premium trip!");
      return;
    }

    const payload = {
      email: userData.email,
      city: selectedPkg.location,
      title: selectedPkg.title,
      category: "Premium",
      total: total,
      members: parseInt(bookingForm.members),
      nights: parseInt(bookingForm.nights),
      travelDate: bookingForm.travelDate,
      transport: bookingForm.transport,
      diet: `Plan: ${bookingForm.diet}, Style: ${bookingForm.foodType}`,
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
        setSuccessDetails({
          title: selectedPkg.title,
          total: total,
          date: bookingForm.travelDate
        });
        setSelectedPkg(null);
        setShowSuccess(true);
      }
    } catch (error) {
      alert("Server connection error.");
    }
  };

  return (
    <div className="prem-container">
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

          {/* CURRENCY CONVERTER - Using original design classes */}
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
        </div>
        <div className="prem-hero-visual">
          <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80" alt="Northern Skies" />
        </div>
      </section>

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
                {(pkg.features || ["VIP Lounge", "Private Guide", "Luxury Suite"]).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="p-card-footer">
                <span className="p-price">{formatPrice(pkg.basePrice)} <sub>/pp</sub></span>
                <button className="p-req-btn" onClick={() => setSelectedPkg(pkg)}>Request</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* LUXURY CUSTOMIZATION MODAL - DESIGN PRESERVED */}
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
                <input type="date" value={bookingForm.travelDate} onChange={(e) => setBookingForm({...bookingForm, travelDate: e.target.value})} />
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
              <h3>{formatPrice(total)}</h3>
            </div>
            <button className="p-confirm-btn" onClick={handleConfirm}>Confirm Booking</button>
          </div>
        </div>
      )}

      {/* NEW SUCCESS MODAL - AFTER BOOKING THING */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon-wrap" style={{background: '#fef3c7', color: '#d4af37'}}>
              <FaCrown />
            </div>
            <h2>Elite Journey Confirmed!</h2>
            <p>Your premium request has been successfully synchronized with the Tourista database.</p>
            
            <div className="success-summary">
              <div className="s-row"><FaGem style={{color: '#d4af37'}}/> <span>{successDetails?.title}</span></div>
              <div className="s-row"><FaCalendarAlt /> <span>Arrival: {successDetails?.date}</span></div>
              <div className="s-bill" style={{color: '#1e3a8a'}}>Final Bill: {formatPrice(successDetails?.total || 0)}</div>
            </div>

            <div className="success-actions">
              <button className="view-bookings-btn" style={{background: '#1e3a8a'}} onClick={() => onNavigate('bookings')}>
                View My Bookings
              </button>
              <button className="close-success-btn" onClick={() => setShowSuccess(false)}>
                Great!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPackages;