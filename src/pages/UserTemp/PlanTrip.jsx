import React, { useEffect, useRef, useState } from "react";
import "./PlanTrip.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

  // Map state
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState({ lat: 24.8607, lng: 67.0011 }); // Karachi default
  const [allPOIs, setAllPOIs] = useState([]);
  const [pois, setPois] = useState([]);
  const poiMarkersRef = useRef([]);

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
      center: [coords.lng, coords.lat],
      zoom: 5,
    });

    mapInstance.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Initial city marker
    markerRef.current = new maplibregl.Marker({ color: "cyan" })
      .setLngLat([coords.lng, coords.lat])
      .addTo(mapInstance.current);
  }, []);

  // Fetch city coordinates and POIs
  useEffect(() => {
    if (!formData.destination) return;

    const getCoordsAndPOIs = async () => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${formData.destination}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords({ lat, lng: lon });

        if (mapInstance.current) {
          mapInstance.current.setCenter([lon, lat]);
          mapInstance.current.setZoom(12);
          markerRef.current.setLngLat([lon, lat]);
        }

        // Fetch POIs via Overpass API
        const overpassQuery = `
          [out:json][timeout:25];
          (
            node["tourism"](around:3000,${lat},${lon});
            node["amenity"="restaurant"](around:3000,${lat},${lon});
            node["tourism"="hotel"](around:3000,${lat},${lon});
          );
          out body;
        `;
        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery,
        });
        const poisData = await overpassRes.json();

        setAllPOIs(poisData.elements);
      }
    };

    getCoordsAndPOIs();
  }, [formData.destination]);

  // Update displayed POIs based on zoom
  useEffect(() => {
    if (!mapInstance.current || allPOIs.length === 0) return;

    const updatePOIs = () => {
      const zoom = mapInstance.current.getZoom();
      let maxPOIs = 2;
      if (zoom >= 10 && zoom < 12) maxPOIs = 5;
      if (zoom >= 12) maxPOIs = 8;

      const shuffled = allPOIs.sort(() => 0.5 - Math.random());
      const limitedPOIs = shuffled.slice(0, maxPOIs);
      setPois(limitedPOIs);
    };

    updatePOIs();

    mapInstance.current.on("zoom", updatePOIs);
    return () => mapInstance.current.off("zoom", updatePOIs);
  }, [allPOIs]);

  // Render POI markers with fade effect
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old markers
    poiMarkersRef.current.forEach((m) => m.remove());
    poiMarkersRef.current = [];

    pois.forEach((poi) => {
      const el = document.createElement("div");
      el.className = "poi-marker"; // initial hidden
      el.title = poi.tags?.name || "POI";

      const m = new maplibregl.Marker(el)
        .setLngLat([poi.lon, poi.lat])
        .setPopup(new maplibregl.Popup().setText(poi.tags?.name || "POI"))
        .addTo(mapInstance.current);

      // Fade in after small delay
      setTimeout(() => el.classList.add("visible"), 50);

      poiMarkersRef.current.push(m);
    });
  }, [pois]);

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

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  // Updated: Continue button handler
  const handleFinalContinue = async () => {
    setShowConfirm(false); // Close modal

    try {
      const response = await fetch("https://your-backend-api.com/generate-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Package generated:", data);

      // Optional: handle frontend state update, toast, or redirect here
    } catch (err) {
      console.error("Error generating package:", err);
    }
  };

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

      <div className="plan-trip-outer">
        <div className="plan-trip-card">
          <div className="plan-left">
            <div className="plan-header">
              <h2>Customize Your Trip</h2>
            </div>

            <form className="plan-form">
              {step === 1 && (
                <section className="form-step grid-2">
                  <div className="field">
                    <label>Adults</label>
                    <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} />
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
                  <div className="field">
                    <label>Destination</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="City..." />
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
                  <div className="field">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="form-step grid-2">
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1..." />
                  </div>
                </section>
              )}

              {step === 4 && (
                <section className="form-step">
                  <h3 className="prefs-title">Pick your interests</h3>
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
                  <button type="button" className="btn primary" onClick={nextStep}>Next Step</button>
                ) : (
                  <button type="button" className="btn highlight" onClick={handleGenerateClick}>
                    Generate Package
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="plan-right">
            <div className="map-wrap">
              <div ref={mapContainer} className="map-canvas"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
