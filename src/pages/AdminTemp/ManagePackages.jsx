import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./ManagePackages.css";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);

  const [formData, setFormData] = useState({
    type: "Premium",
    city: "",
    stops: "",
    travelMode: "",
    days: "",
    price: "",
    discount: "",
    imageFiles: [],
    imagePreviews: [],
  });

  const fetchPackages = async () => {
  try {
    const res = await fetch("http://localhost:18080/api/packages");
    const data = await res.json();
    setPackages(data.map(p => ({
      id: p.id,
      type: p.category,
      city: p.location,
      // Map 'elite_features' from C++ to 'stops' array in React
      stops: p.elite_features ? p.elite_features.split(",").map(s => s.trim()) : [],
      travelMode: p.mode,
      days: p.days,
      price: p.original_price,
      discount: p.discount,
      discountedPrice: p.basePrice,
      images: [p.img]
    })));
  } catch (err) {
    console.error("Load failed");
  }
};

  useEffect(() => { fetchPackages(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageFiles: fileArray, imagePreviews: [reader.result] });
      };
      if (fileArray[0]) reader.readAsDataURL(fileArray[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: formData.type,
      city: formData.city,
      title: formData.city + " Tour",
      stops: formData.stops || "", // Sends empty string if nothing entered
      travelMode: formData.travelMode,
      days: parseInt(formData.days),
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || 0),
      img: formData.imagePreviews[0] || ""
    };

    const url = isEditing 
      ? `http://localhost:18080/api/admin/packages/edit/${currentPackageId}`
      : `http://localhost:18080/api/admin/packages/add`;

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) { resetForm(); fetchPackages(); }
    } catch (err) { alert("Backend offline."); }
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setCurrentPackageId(pkg.id);
    setFormData({
      type: pkg.type,
      city: pkg.city,
      stops: pkg.stops.join(", "),
      travelMode: pkg.travelMode,
      days: pkg.days,
      price: pkg.price,
      discount: pkg.discount,
      imageFiles: [],
      imagePreviews: pkg.images,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this package?")) {
      try {
        const res = await fetch(`http://localhost:18080/api/admin/packages/delete/${id}`, { method: "DELETE" });
        if (res.ok) fetchPackages();
      } catch (err) { console.error("Delete failed:", err); }
    }
  };

  const resetForm = () => {
    setFormData({ type: "Premium", city: "", stops: "", travelMode: "", days: "", price: "", discount: "", imageFiles: [], imagePreviews: [] });
    setIsEditing(false);
    setCurrentPackageId(null);
  };

  return (
    <div className="mp-outer">
      <div className="mp-card">
        <h1 className="mp-title">{isEditing ? "Edit Package" : "Manage Travel Packages"}</h1>
        <div className="admin-card-form">
          <h2 className="card-form-title">{isEditing ? "Edit Details" : "Create New"}</h2>
          <form onSubmit={handleSubmit} className="package-form-grid">
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="Premium">Premium</option>
              <option value="Economical">Economical</option>
            </select>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
            
            {/* FIX: Removed 'required' to make stops optional */}
            <input type="text" name="stops" value={formData.stops} onChange={handleChange} placeholder="Journey Stops (optional)" />
            
            <input type="text" name="travelMode" value={formData.travelMode} onChange={handleChange} placeholder="Travel Mode" required />
            <input type="number" name="days" value={formData.days} onChange={handleChange} placeholder="No. of Days" required min="1" />
            
            {/* FIX: Removed min="1000" to allow any price */}
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Original Price (PKR)" required />
            
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount %" min="0" max="99" />
            <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={handleChange} /></div>
            
            <div className="form-action-buttons">
              {isEditing && <button type="button" className="admin-btn-cancel" onClick={resetForm}>Cancel</button>}
              <button type="submit" className="admin-btn-submit">{isEditing ? "Save Changes" : "Add Package"}</button>
            </div>
          </form>
        </div>

        <div className="package-cards-container">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <div className="package-images">{pkg.images.map((img, i) => <img key={i} src={img} alt="Trip" />)}</div>
              <div className="package-details">
                <h3>{pkg.type}: {pkg.city}</h3>
                <p><strong>Price:</strong> PKR {pkg.price} {pkg.discount ? `(-${pkg.discount}%)` : ""}</p>
                <p><strong>Travel Mode:</strong> {pkg.travelMode} | <strong>Days:</strong> {pkg.days}</p>
                
                {/* FIX: Shows stops ONLY if they exist */}
                {pkg.stops.length > 0 && (
                  <>
                    <p><strong>Journey Stops:</strong></p>
                    <ul>{pkg.stops.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </>
                )}
                
                <div className="package-actions">
                  <button className="icon-btn edit-btn" onClick={() => handleEdit(pkg)}><FaEdit /></button>
                  <button className="icon-btn delete-btn" onClick={() => handleDelete(pkg.id)}><FaTrashAlt /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePackages;