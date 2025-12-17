import React, { useState } from "react";
import "./PlanTrip.css";
import heroMap from "../../assets/skardu.jpg"; // adjust path based on your folder structure



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
    travelMode: "Flight",
    email: "",
    phone: "",
    interests: [],
  });

  const [showConfirm, setShowConfirm] = useState(false);



  const validateStep = () => {
  const e = {};

  // Step 1: Adults
  if (step === 1) {
    if (formData.adults < 1) {
      e.adults = "At least 1 adult is required";
    }
  }

  // Step 2: Destination & Dates
  if (step === 2) {
    if (!formData.destination.trim()) {
      e.destination = "Destination is required";
    }
    if (!formData.startDate) {
      e.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      e.endDate = "End date is required";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      e.endDate = "End date cannot be before start date";
    }
  }

  // Step 3: Email & Phone
  if (step === 3) {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      e.email = "Enter a valid email";
    }
    if (!formData.phone || formData.phone.length < 7) {
      e.phone = "Enter a valid phone number";
    }
  }

  // Step 4: Interests
  if (step === 4) {
    if (formData.interests.length === 0) {
      e.interests = "Select at least one interest";
    }
  }

  setErrors(e);
  return Object.keys(e).length === 0; // true if valid
};

  // Handlers
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

  const handleFinalContinue = () => {
  setShowConfirm(false);
  console.log("Trip data (frontend only):", formData);
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
            <div className="summary-row">
              <strong>Destination:</strong> <span>{formData.destination || "Not selected"}</span>
            </div>
            <div className="summary-row">
              <strong>Dates:</strong> <span>{formData.startDate} → {formData.endDate}</span>
            </div>
            <div className="summary-row">
              <strong>Travelers:</strong> <span>{formData.adults} Adults, {formData.children} Kids</span>
            </div>
            <div className="summary-row">
              <strong>Mode:</strong> <span>{formData.travelMode}</span>
            </div>
            <div className="summary-row">
              <strong>Interests:</strong> <span>{formData.interests.length} Selected</span>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowConfirm(false)}>Close</button>
              <button className="btn highlight" onClick={handleFinalContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}

{showWelcome && (
  <div className="welcome-screen">
    <div className="welcome-map">
      <img src={heroMap} alt="World Map" className="map-background" />
      <div className="welcome-content">
        <h1>Plan Trips With Friends</h1>
        <p>Travel to the greatest places in the world with your friends</p>
        <button className="btn highlight" onClick={() => setShowWelcome(false)}>
          Get Started
        </button>
      </div>
    </div>
  </div>
)}


      <div className="plan-trip-outer">
        <div className="plan-trip-card">
          <div className="plan-left">
            <div className="plan-header">
              <h2>Customize Your Trip</h2>
            </div>
                   <div className="step-circles">
                      {[1,2,3,4].map((s) => (
                        <div
                          key={s}
                          className={`circle ${step === s ? "active" : ""}`}
                        >
                          {s}
                        </div>
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

                  <div className="field">
                    <label>Children</label>
                    <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Infants</label>
                    <input type="number" name="infants" min="0" value={formData.infants} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Couples</label>
                    <input type="number" name="couples" min="0" value={formData.couples} onChange={handleChange} />
                  </div>
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
                      <option>Flight</option>
                      <option>Train</option>
                      <option>Bus</option>
                      <option>Car</option>
                    </select>
                  </div>
                 <div className={`field ${errors.startDate ? "error" : ""}`}>
                      <label>Start Date</label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                      {errors.startDate && <span className="error-msg">{errors.startDate}</span>}
                       </div>

                <div className={`field ${errors.endDate? "error" : ""}`}>
                      <label>End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        {errors.endDate && <span className="error-msg">{errors.endDate}</span>}
                         </div>

                </section>
              )}

              {step === 3 && (
                <section className="form-step grid-2">
                <div className={`field ${errors.email ? "error" : ""}`} style={{ gridColumn: "span 2" }}>
  <label>Email</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="you@example.com"
  />
  {errors.email && <span className="error-msg">{errors.email}</span>}
</div>

                      <div className={`field ${errors.phone ? "error" : ""}`} style={{ gridColumn: "span 2" }}>
  <label>Phone</label>
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="+1..."
  />
  {errors.phone && <span className="error-msg">{errors.phone}</span>}
</div>


                </section>
              )}

              {step === 4 && (
               <section className="form-step">
  {errors.interests && <span className="error-msg">{errors.interests}</span>}
  <div className="prefs-grid">
    {interestsOptions.map((opt) => (
      <button
        type="button"
        key={opt.key}
        className={`pref-card ${formData.interests.includes(opt.key) ? "active" : ""}`}
        onClick={() => toggleInterest(opt.key)}
      >
        <span className="pref-icon">{opt.icon}</span>
        <span className="pref-text">{opt.label}</span>
      </button>
    ))}
  </div>
</section>

              )}

              <div className="form-nav">
                {step > 1 ? (
                  <button type="button" className="btn secondary" onClick={prevStep}>Back</button>
                ) : <div />}
                {step < 4 ? (
                  <button type="button" className="btn primary" onClick={() => { if (validateStep()) nextStep();}}>Next Step</button>
                ) : (
                  <button type="button" className="btn highlight" onClick={() => { if (validateStep()) handleGenerateClick() }}>
                    Generate Package
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="plan-right">
          <div className="map-wrap">
  <iframe
    title="Google Map"
    className="map-canvas"
    src={`https://www.google.com/maps?q=${encodeURIComponent(
      formData.destination
    )}&z=12&output=embed`}
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