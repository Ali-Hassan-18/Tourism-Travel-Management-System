import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./ManagePackages.css";

const STORAGE_KEY = "touristaTravelPackages";

// Load packages from localStorage
const loadPackagesFromLS = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
};

// Save packages to localStorage
const savePackagesToLS = (packages) => {
  const serializablePackages = packages.map((pkg) => ({
    ...pkg,
    images: pkg.images || [],
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePackages));
};

const ManagePackages = () => {
  const [packages, setPackages] = useState(loadPackagesFromLS());
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

  useEffect(() => {
    savePackagesToLS(packages);
  }, [packages]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      const previews = fileArray.map((f) => URL.createObjectURL(f));
      setFormData({ ...formData, imageFiles: fileArray, imagePreviews: previews });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "price" && formData.discount) {
        const discountedPrice = Number(value) * (1 - Number(formData.discount) / 100);
        setFormData((prev) => ({ ...prev, discountedPrice: Math.round(discountedPrice) }));
      }
      if (name === "discount" && formData.price) {
        const discountedPrice = Number(formData.price) * (1 - Number(value) / 100);
        setFormData((prev) => ({ ...prev, discountedPrice: Math.round(discountedPrice) }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setIsEditing(false);
    setCurrentPackageId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const discountedPrice =
      formData.discount && formData.price
        ? Math.round(Number(formData.price) * (1 - Number(formData.discount) / 100))
        : Number(formData.price);

    const newPkg = {
      id: isEditing ? currentPackageId : Date.now(),
      type: formData.type,
      city: formData.city,
      stops: formData.stops.split(",").map((x) => x.trim()),
      travelMode: formData.travelMode,
      days: formData.days,
      price: Number(formData.price),
      discount: formData.discount ? Number(formData.discount) : 0,
      discountedPrice: discountedPrice,
      images: formData.imagePreviews,
    };

    if (isEditing) {
      setPackages(packages.map((p) => (p.id === newPkg.id ? newPkg : p)));
    } else {
      setPackages([...packages, newPkg]);
    }

    resetForm();
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setCurrentPackageId(pkg.id);
    setFormData({
      type: pkg.type || "Premium",
      city: pkg.city || "",
      stops: (pkg.stops || []).join(", "),
      travelMode: pkg.travelMode || "",
      days: pkg.days || "",
      price: pkg.price || "",
      discount: pkg.discount || "",
      imageFiles: [],
      imagePreviews: pkg.images || [],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((p) => p.id !== id));
      if (isEditing && currentPackageId === id) resetForm();
    }
  };

  // Custom file input like AddCity
  const renderFileInput = () => (
    <div className="file-input-wrapper">
      <input type="file" accept="image/*" multiple onChange={handleChange} name="imageFiles" />
    </div>
  );

  return (
    <div className="mp-outer">
      <div className="mp-card">
        {/* Page Title */}
        <h1 className="mp-title">{isEditing ? "Edit Package" : "Manage Travel Packages"}</h1>

        {/* Form Card */}
        <div className="admin-card-form">
          <h2 className="card-form-title">{isEditing ? "Edit Package Details" : "Create New Package"}</h2>

          <form onSubmit={handleSubmit} className="package-form-grid">
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="Premium">Premium</option>
              <option value="Economical">Economical</option>
            </select>

            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />

            <input
              type="text"
              name="stops"
              value={formData.stops}
              onChange={handleChange}
              placeholder="Journey Stops (comma separated)"
              required
            />

            <input
              type="text"
              name="travelMode"
              value={formData.travelMode}
              onChange={handleChange}
              placeholder="Mode of Travel"
              required
            />

            <input type="number" name="days" value={formData.days} onChange={handleChange} placeholder="No. of Days" required min="1" />

            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Original Price (PKR)" required min="1000" />

            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount % (optional)"
              min="0"
              max="99"
            />

            {renderFileInput()}

            {formData.imagePreviews.length > 0 && (
              <div className="form-image-preview">
                {formData.imagePreviews.map((img, i) => (
                  <img key={i} src={img} alt="Preview" />
                ))}
              </div>
            )}

            <div className="form-action-buttons">
              {isEditing && (
                <button type="button" className="admin-btn-cancel" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="admin-btn-submit">
                {isEditing ? "Save Changes" : "Add Package"}
              </button>
            </div>
          </form>
        </div>

        {/* Package List */}
        <h2 className="mp-subtitle">Existing Packages ({packages.length})</h2>
        <div className="package-cards-container">
          {packages.length === 0 && <p className="mp-empty">No packages created yet.</p>}

          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <div className="package-images">
                {(pkg.images || []).map((img, i) => (
                  <img key={i} src={img} alt="Package" />
                ))}
              </div>
              <div className="package-details">
                <h3>
                  {pkg.type} Package – {pkg.city}
                </h3>
                <p>
                  <strong>Price:</strong> PKR {pkg.price}
                  {pkg.discount ? ` (Discount: ${pkg.discountedPrice} PKR)` : ""}
                </p>
                <p>
                  <strong>Travel Mode:</strong> {pkg.travelMode}
                </p>
                <p>
                  <strong>Days:</strong> {pkg.days}
                </p>
                <p>
                  <strong>Journey Stops:</strong>
                </p>
                <ul>
                  {(pkg.stops || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <div className="package-actions">
                  <button className="icon-btn edit-btn" onClick={() => handleEdit(pkg)}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn delete-btn" onClick={() => handleDelete(pkg.id)}>
                    <FaTrashAlt />
                  </button>
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