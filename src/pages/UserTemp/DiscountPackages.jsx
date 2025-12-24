import React, { useState, useEffect } from 'react';
import './DiscountPackages.css';

const DiscountPackages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'PKR'
  const [exchangeRate] = useState(280); // 1 USD = 280 PKR

  const [bookingForm, setBookingForm] = useState({
    members: 1,
    nights: 1,
    travelDate: '', 
    foodType: 'Standard Premium',
    transport: 'Shared SUV'
  });

  useEffect(() => {
    fetch('http://localhost:18080/api/packages/Special')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Failed to load discount deals:", err));
  }, []);

  useEffect(() => {
    if (selectedPkg) {
      const base = selectedPkg.basePrice * bookingForm.members * bookingForm.nights;
      const foodAdd = bookingForm.foodType === 'Gourmet/Organic' ? 40 : 0;
      const transportAdd = bookingForm.transport === 'Private Prado' ? 120 : 50;
      
      const totalBill = base + 
                        (foodAdd * bookingForm.members * bookingForm.nights) + 
                        (transportAdd * bookingForm.nights);
      setTotal(totalBill);
    }
  }, [bookingForm, selectedPkg]);

  // Format price based on selected currency ONLY
  const formatPrice = (priceInUSD) => {
    if (currency === 'PKR') {
      const priceInPKR = Math.round(priceInUSD * exchangeRate);
      return `Rs ${priceInPKR.toLocaleString('en-PK')}`;
    } else {
      return `$ ${priceInUSD}`;
    }
  };

  // Format savings amount based on selected currency ONLY
  const formatSavings = (savingsInUSD) => {
    if (currency === 'PKR') {
      const savingsInPKR = Math.round(savingsInUSD * exchangeRate);
      return `Rs ${savingsInPKR.toLocaleString('en-PK')}`;
    } else {
      return `$ ${savingsInUSD.toFixed(0)}`;
    }
  };

  // Calculate discount amount
  const calculateDiscountAmount = (originalPrice, basePrice) => {
    return originalPrice - basePrice;
  };

  const handleConfirm = async () => {
    if(!bookingForm.travelDate) {
      alert("Please select a travel date.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Please login to claim this deal!");
      return;
    }

    // UPDATED: Extracts info according to EACH text box
    const payload = {
      email: userData.email,
      city: selectedPkg.location,
      title: selectedPkg.title,
      category: selectedPkg.category || "Special",
      total: total,
      members: parseInt(bookingForm.members),
      nights: parseInt(bookingForm.nights),   // Dynamic info
      travelDate: bookingForm.travelDate,      // Dynamic info
      transport: bookingForm.transport,
      diet: bookingForm.foodType,
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
          ? `Rs ${Math.round(total * exchangeRate).toLocaleString('en-PK')}`
          : `$ ${total.toLocaleString()}`;
          
        alert(`Booking Confirmed!\nTotal Bill: ${totalFormatted}`);
        setSelectedPkg(null);
      }
    } catch (error) {
      alert("Error connecting to C++ server.");
    }
  };

  return (
    <div className="disc-container">
      <section className="disc-hero">
        <div className="disc-hero-text">
          <span className="disc-label">LIMITED TIME OFFERS</span>
          <h1>Exclusive Discounted Packages</h1>
          <p>Get premium experiences at economical prices. Save up to 30% on selected Northern tours.</p>
          
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

      <section className="disc-grid">
        {packages.map((pkg) => {
          const discountAmount = calculateDiscountAmount(pkg.original_price, pkg.basePrice);
          
          return (
            <div key={pkg.id} className="d-card">
              <div className="d-card-img">
                <img src={pkg.img} alt={pkg.title} />
                <div className="d-card-badge">-{pkg.discount}% OFF</div>
              </div>
              <div className="d-card-content">
                <span className={`deal-type ${(pkg.category || 'Special').toLowerCase()}`}>
                  {pkg.category || 'Special'}
                </span>
                <h3>{pkg.title}</h3>
                <p className="d-loc">📍 {pkg.location}</p>
                
                <div className="d-card-footer">
                  <div className="d-price-stack">
                    <span className="old-price">{formatPrice(pkg.original_price)}</span>
                    <span className="new-price">{formatPrice(pkg.basePrice)}</span>
                    <div className="savings-badge">
                      Save {formatSavings(discountAmount)}
                    </div>
                  </div>
                  <button className="d-req-btn" onClick={() => setSelectedPkg(pkg)}>Claim Deal</button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

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
                <input type="number" min="1" value={bookingForm.members} onChange={(e) => setBookingForm({...bookingForm, members: parseInt(e.target.value) || 1})} />
              </div>
              <div className="p-group">
                <label>Nights</label>
                <input type="number" min="1" value={bookingForm.nights} onChange={(e) => setBookingForm({...bookingForm, nights: parseInt(e.target.value) || 1})} />
              </div>
              <div className="p-group">
                <label>Cuisine Style</label>
                <select value={bookingForm.foodType} onChange={(e) => setBookingForm({...bookingForm, foodType: e.target.value})}>
                  <option value="Standard Premium">Standard Premium</option>
                  <option value="Gourmet/Organic">
                    Gourmet (+{currency === 'PKR' 
                      ? `Rs ${(40 * exchangeRate).toLocaleString()}` 
                      : '$ 40'})
                  </option>
                </select>
              </div>
              <div className="p-group" style={{gridColumn: 'span 2'}}>
                <label>Transport Mode</label>
                <select value={bookingForm.transport} onChange={(e) => setBookingForm({...bookingForm, transport: e.target.value})}>
                  <option value="Shared SUV">Shared SUV (Included)</option>
                  <option value="Private Prado">
                    Private Prado (+{currency === 'PKR' 
                      ? `Rs ${(120 * exchangeRate).toLocaleString()}/n` 
                      : '$ 120/n'})
                  </option>
                </select>
              </div>
            </div>
            <div className="d-total-box">
              <span className="savings-label">
                YOU ARE SAVING: {formatSavings(
                  calculateDiscountAmount(selectedPkg.original_price, selectedPkg.basePrice) * 
                  bookingForm.members * bookingForm.nights
                )}
              </span>
              <h3>TOTAL: {formatPrice(total)}</h3>
            </div>
            <button className="d-confirm-btn" onClick={handleConfirm}>Book Discounted Trip</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPackages;