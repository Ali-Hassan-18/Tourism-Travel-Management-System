import React, { useState, useEffect } from 'react';
import './DiscountPackages.css';

const DiscountPackages = () => {
  const [packages] = useState([
    { 
      id: 1, 
      title: "Skardu Luxury & Budget Mix", 
      originalPrice: 400, 
      discount: 25, // 25% OFF
      location: "Skardu", 
      type: "Premium-Deal",
      img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80",
      features: ["Serena Suite (1 Night)", "Standard Glamping", "Shared Jeep"]
    },
    { 
      id: 2, 
      title: "Hunza Group Special", 
      originalPrice: 200, 
      discount: 30, // 30% OFF
      location: "Hunza", 
      type: "Eco-Deal",
      img: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=600&q=80",
      features: ["shared Transport", "Group Meals Inc.", "Local Guide"]
    },
    { 
      id: 3, 
      title: "Swat Weekend Flash Sale", 
      originalPrice: 180, 
      discount: 15, // 15% OFF
      location: "Swat", 
      type: "Eco-Deal",
      img: "https://images.unsplash.com/photo-1627440406023-7a915159021a?auto=format&fit=crop&w=600&q=80",
      features: ["Hotel stay", "Breakfast Inc.", "Malam Jabba Entry"]
    }
  ]);

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    travelDate: '', 
    foodType: 'Standard Premium',
    transport: 'Shared SUV'
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (selectedPkg) {
      // Calculate Discounted Base Price
      const discountedBase = selectedPkg.originalPrice * (1 - selectedPkg.discount / 100);
      const base = discountedBase * bookingForm.members * bookingForm.nights;
      
      // Add-ons
      const foodAdd = bookingForm.foodType === 'Gourmet/Organic' ? 40 : 0;
      const transportAdd = bookingForm.transport === 'Private Prado' ? 120 : 50;
      
      const totalBill = base + 
                        (foodAdd * bookingForm.members * bookingForm.nights) + 
                        (transportAdd * bookingForm.nights);

      setTotal(totalBill);
    }
  }, [bookingForm, selectedPkg]);

  const handleConfirm = () => {
    if(!bookingForm.travelDate) {
      alert("Please select a travel date.");
      return;
    }
    alert(`Discounted Booking Confirmed for ${selectedPkg.title}!\nTotal Savings Applied: ${selectedPkg.discount}%\nFinal Bill: $${total.toLocaleString()}`);
    setSelectedPkg(null);
  };

  return (
    <div className="disc-container">
      {/* Hero Section */}
      <section className="disc-hero">
        <div className="disc-hero-text">
          <span className="disc-label">LIMITED TIME OFFERS</span>
          <h1>Exclusive Discounted Packages</h1>
          <p>Get premium experiences at economical prices. Save up to 30% on selected Northern tours.</p>
          <div className="disc-mini-feats">
            <div className="d-feat">🔥 <span>Best Price</span></div>
            <div className="d-feat">📍 <span>Top Locations</span></div>
            <div className="d-feat">⏳ <span>Limited Slots</span></div>
          </div>
        </div>
        <div className="disc-hero-visual">
          <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80" alt="Mountain View" />
        </div>
      </section>

      {/* 3-Column Discount Grid */}
      <section className="disc-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="d-card">
            <div className="d-card-img">
              <img src={pkg.img} alt={pkg.title} />
              <div className="d-card-badge">-{pkg.discount}% OFF</div>
            </div>
            <div className="d-card-content">
              <span className={`deal-type ${pkg.type.toLowerCase()}`}>{pkg.type}</span>
              <h3>{pkg.title}</h3>
              <p className="d-loc">📍 {pkg.location}</p>
              <ul className="d-list">
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="d-card-footer">
                <div className="d-price-stack">
                    <span className="old-price">${pkg.originalPrice}</span>
                    <span className="new-price">${(pkg.originalPrice * (1 - pkg.discount/100)).toFixed(0)}</span>
                </div>
                <button className="d-req-btn" onClick={() => setSelectedPkg(pkg)}>Claim Deal</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Discount Booking Modal */}
      {selectedPkg && (
        <div className="p-modal-overlay">
          <div className="p-modal">
            <button className="p-close" onClick={() => setSelectedPkg(null)}>&times;</button>
            <div className="p-modal-header">
              <h2>Confirm Discounted Trip</h2>
              <p>Savings: {selectedPkg.discount}% Applied</p>
            </div>
            <div className="p-form">
              <div className="p-group">
                <label>Arrival Date</label>
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
                <label>Cuisine Style</label>
                <select value={bookingForm.foodType} onChange={(e) => setBookingForm({...bookingForm, foodType: e.target.value})}>
                  <option value="Standard Premium">Standard Premium</option>
                  <option value="Gourmet/Organic">Gourmet (+$40)</option>
                </select>
              </div>
              <div className="p-group" style={{gridColumn: 'span 2'}}>
                <label>Transport Mode</label>
                <select value={bookingForm.transport} onChange={(e) => setBookingForm({...bookingForm, transport: e.target.value})}>
                  <option value="Shared SUV">Shared SUV (Included)</option>
                  <option value="Private Prado">Private Prado (+$120/n)</option>
                </select>
              </div>
            </div>
            <div className="d-total-box">
              <span className="savings-label">YOU ARE SAVING: {selectedPkg.discount}%</span>
              <h3>TOTAL: ${total.toLocaleString()}</h3>
            </div>
            <button className="d-confirm-btn" onClick={handleConfirm}>Book Discounted Trip</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPackages;