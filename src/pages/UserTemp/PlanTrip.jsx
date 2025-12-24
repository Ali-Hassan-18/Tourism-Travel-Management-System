import React, { useState } from "react";
import "./PlanTrip.css";
import "./CityDetail.jsx";
import heroMap from "../../assets/welcomepage.jpg";

const interestsOptions = [
  { key: "Adventure", label: "Adventure", icon: "🏔️" },
  { key: "Nature", label: "Nature", icon: "🌲" },
  { key: "Culture", label: "Culture", icon: "🏛️" },
  { key: "Shopping", label: "Shopping", icon: "🛍️" },
  { key: "Relaxation", label: "Relaxation", icon: "🌊" },
  { key: "Food", label: "Food & Dining", icon: "🍽️" },
];

const PlanTrip = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);

  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    couples: 0,
    destination: "",
    startDate: "",
    endDate: "",
    travelMode: "Bus",
    email: "",
    phone: "",
    interests: [],
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceived, setShowReceived] = useState(false); 

  const validateStep = () => {
    const e = {};
    if (step === 1 && formData.adults < 1) e.adults = "At least 1 adult is required";
    if (step === 2) {
      if (!formData.destination.trim()) e.destination = "Destination is required";
      if (!formData.startDate) e.startDate = "Start date is required";
      if (!formData.endDate) e.endDate = "End date is required";
      if (formData.startDate && formData.endDate && formData.endDate < formData.startDate)
        e.endDate = "End date cannot be before start date";
    }
    if (step === 3) {
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Enter a valid email";
      if (!formData.phone || formData.phone.length < 7) e.phone = "Enter a valid phone number";
    }
    if (step === 4 && formData.interests.length === 0) e.interests = "Select at least one interest";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["adults", "children", "infants", "couples"].includes(name)) {
      setFormData((s) => ({ ...s, [name]: Math.max(0, parseInt(value || "0", 10)) }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const toggleInterest = (key) => {
    const exists = formData.interests.includes(key);
    setFormData((s) => ({
      ...s,
      interests: exists ? s.interests.filter((i) => i !== key) : [...s.interests, key],
    }));
  };

  const handleFinalContinue = async () => {
  // 1. Prepare data for the C++ backend
  const payload = {
    email: formData.email,
    city: formData.destination,
    title: "Custom Planned Trip",
    category: "Planned",
    total: 0, // Custom trips usually have a pending bill
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // Default map/trip image
    members: formData.adults, // Main count
    kids: formData.children,
    infants: formData.infants,
    couples: formData.couples,
    transport: formData.travelMode,
    travelDate: formData.startDate,
    nights: 0, // C++ will use the dates instead
    endDate: formData.endDate,
    diet: "Interests: " + formData.interests.join(", ") + " | Phone: " + formData.phone
  };

  try {
    const response = await fetch('http://localhost:18080/api/book/detailed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.status === "success") {
      setShowConfirm(false);
      setShowReceived(true);
    }
  } catch (error) {
    alert("C++ Server is offline. Could not save request.");
  }
};

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));
  const handleGenerateClick = () => setShowConfirm(true);

  return (
    <>
      {showConfirm && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2 className="modal-title">Trip Summary</h2>
      
      <div className="summary-row"><strong>Destination:</strong> 
        <span>{formData.destination}</span>
      </div>
      
      <div className="summary-row"><strong>Dates:</strong> 
        <span>{formData.startDate} → {formData.endDate}</span>
      </div>
      
      <div className="summary-row"><strong>Travelers:</strong>
        <span>
          {formData.adults} Adults, {formData.children} Kids, 
          {formData.infants} Infants, {formData.couples} Couples
        </span>
      </div>

      <div className="summary-row"><strong>Contact Info:</strong>
        <span>{formData.email} | {formData.phone}</span>
      </div>
      
      <div className="summary-row"><strong>Travel Mode:</strong> 
        <span>{formData.travelMode}</span>
      </div>
      
      <div className="summary-row"><strong>Interests:</strong>
        <span style={{ fontSize: '0.9rem' }}>{formData.interests.join(", ")}</span>
      </div>

      <div className="modal-actions">
        <button className="btn secondary" onClick={() => setShowConfirm(false)}>Close</button>
        <button className="btn highlight" onClick={handleFinalContinue}>Confirm & Request</button>
      </div>
    </div>
  </div>
)}

      {showReceived && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Request Received</h2>
            <p>Your trip request has been successfully received! We will contact you after 24 hours! 🎉</p>
            <div className="modal-actions">
              <button className="btn highlight" onClick={() => setShowReceived(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showWelcome && (
        <div className="welcome-screen">
          <div className="welcome-map">
            <img src={heroMap} alt="World Map" className="map-background" />
          </div>
          <div className="welcome-content">
            <h1>Plan Trips With <span>Friends</span></h1>
            <p>Discover the Pakistan's North most breathtaking destinations and craft the perfect itinerary together.</p>
            <button className="btn highlight" onClick={() => setShowWelcome(false)}>
              Get Started
            </button>
          </div>
        </div>
      )}

      <div className="plan-trip-outer">
        <div className="plan-trip-card">
          <div className="plan-left">
            <div className="plan-header"><h2>Customize Your Trip</h2></div>
            <div className="step-circles">
              {[1,2,3,4].map((s) => (
                <div key={s} className={`circle ${step === s ? "active" : ""}`}>{s}</div>
              ))}
            </div>

            <form className="plan-form">
              {step === 1 && (
                <section className="form-step grid-2">
                  <div className={`field ${errors.adults ? "error" : ""}`}>
                    <label>Adults</label>
                    <input type="number" name="adults" value={formData.adults} onChange={handleChange} />
                    {errors.adults && <span className="error-msg">{errors.adults}</span>}
                  </div>
                  <div className="field"><label>Children</label><input type="number" name="children" min="0" value={formData.children} onChange={handleChange} /></div>
                  <div className="field"><label>Infants</label><input type="number" name="infants" min="0" value={formData.infants} onChange={handleChange} /></div>
                  <div className="field"><label>Couples</label><input type="number" name="couples" min="0" value={formData.couples} onChange={handleChange} /></div>
                </section>
              )}

              {step === 2 && (
                <section className="form-step grid-2">
                  <div className={`field ${errors.destination ? "error" : ""}`}>
                    <label>Destination</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="City..." />
                    {errors.destination && <span className="error-msg">{errors.destination}</span>}
                  </div>
                  <div className="field">
                    <label>Travel Mode</label>
                    <select name="travelMode" value={formData.travelMode} onChange={handleChange}>
                      <option>Bus</option>
                      <option>Car</option>
                    </select>
                  </div>
                  <div className={`field ${errors.startDate ? "error" : ""}`}>
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className={`field ${errors.endDate ? "error" : ""}`}>
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="form-step grid-2">
                  <div className={`field ${errors.email ? "error" : ""}`} style={{ gridColumn: "span 2" }}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                  <div className={`field ${errors.phone ? "error" : ""}`} style={{ gridColumn: "span 2" }}>
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1..." />
                  </div>
                </section>
              )}

              {step === 4 && (
                <section className="form-step">
                  <div className="prefs-grid">
                    {interestsOptions.map((opt) => (
                      <button type="button" key={opt.key} className={`pref-card ${formData.interests.includes(opt.key) ? "active" : ""}`} onClick={() => toggleInterest(opt.key)}>
                        <span className="pref-icon">{opt.icon}</span>
                        <span className="pref-text">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="form-nav">
                {step > 1 ? <button type="button" className="btn secondary" onClick={prevStep}>Back</button> : <div />}
                {step < 4 ? (
                  <button type="button" className="btn primary" onClick={() => { if (validateStep()) nextStep(); }}>Next Step</button>
                ) : (
                  <button type="button" className="btn highlight" onClick={() => { if (validateStep()) handleGenerateClick() }}>Continue</button>
                )}
              </div>
            </form>
          </div>

          <div className="plan-right">
            <div className="map-wrap">
              <iframe
                title="Google Map"
                className="map-canvas"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.destination)}&z=12&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanTrip;