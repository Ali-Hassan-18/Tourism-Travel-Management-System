import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./AddCity.css";

const AddCity = () => {
  const [cityName, setCityName] = useState("");
  const [touristSpots, setTouristSpots] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [cityImage, setCityImage] = useState("");
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [oldName, setOldName] = useState("");

  const fetchCities = async () => {
    try {
      const res = await fetch("http://localhost:18080/api/cities");
      const data = await res.json();
      setCities(data);
    } catch (err) { console.error("Load failed"); }
  };

  useEffect(() => { fetchCities(); }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setCityImage(reader.result); // Stores image data as string
    if (file) reader.readAsDataURL(file);
  };

  const handleSaveCity = async (e) => {
    e.preventDefault();
    const payload = {
      cityName,
      cityImage: cityImage,
      touristSpots: touristSpots.split(",").map(s => s.trim()),
      restaurants: restaurants.split(",").map(r => r.trim())
    };

    const url = isEditing 
      ? `http://localhost:18080/api/admin/cities/edit/${oldName}` 
      : "http://localhost:18080/api/admin/cities/add";

    const res = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resetForm();
      fetchCities();
    }
  };

  const handleEdit = (city) => {
    setIsEditing(true);
    setOldName(city.cityName);
    setCityName(city.cityName);
    setCityImage(city.image);
    setTouristSpots(city.touristSpots.join(", "));
    setRestaurants(city.restaurants.join(", "));
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    const res = await fetch(`http://localhost:18080/api/admin/cities/delete/${name}`, { method: "DELETE" });
    if (res.ok) fetchCities();
  };

  const resetForm = () => {
    setCityName(""); setTouristSpots(""); setRestaurants(""); setCityImage("");
    setIsEditing(false);
  };

  return (
    <div className="mp-outer">
      <div className="mp-card">
        <h2 className="mp-title">{isEditing ? "Edit City" : "Add New City (Pakistan)"}</h2>
        <form className="mp-form" onSubmit={handleSaveCity}>
          <div className="fld">
            <label>City Name</label>
            <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} required />
          </div>
          <div className="fld">
            <label>City Image</label>
            <div className="file-input-wrapper"><input type="file" onChange={handleImage} /></div>
          </div>
          <div className="fld">
            <label>Tourist Spots</label>
            <input type="text" value={touristSpots} onChange={(e) => setTouristSpots(e.target.value)} />
          </div>
          <div className="fld">
            <label>Restaurants</label>
            <input type="text" value={restaurants} onChange={(e) => setRestaurants(e.target.value)} />
          </div>
          <div className="form-action-buttons">
            <button className="admin-btn-submit" type="submit">{isEditing ? "Save Changes" : "Save City"}</button>
            {isEditing && <button className="admin-btn-cancel" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <h3 className="mp-subtitle">Registered Cities ({cities.length})</h3>
      <div className="package-cards-container">
        {cities.map((city, idx) => (
          <div key={idx} className="package-card">
            <img src={city.image} alt={city.cityName} className="pkg-img-preview" />
            <div className="package-details">
              <h3>{city.cityName}</h3>
              <p><strong>Spots:</strong> {city.touristSpots.join(", ")}</p>
              <div className="package-actions">
                <button onClick={() => handleEdit(city)} className="edit-btn"><FaEdit /></button>
                <button onClick={() => handleDelete(city.cityName)} className="delete-btn"><FaTrashAlt /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddCity;