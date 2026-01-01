import React, { useState, useEffect } from "react";

import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

import "./AddCity.css";



const AddCity = () => {

  const [cityName, setCityName] = useState("");

  const [cityImage, setCityImage] = useState("");

  const [touristSpots, setTouristSpots] = useState("");

  const [restaurants, setRestaurants] = useState("");

  const [cities, setCities] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [oldName, setOldName] = useState("");



  // Smart Alert State

  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });



  const fetchCities = async () => {

    try {

      const res = await fetch("http://localhost:18080/api/cities");

      const data = await res.json();

      setCities(data);

    } catch (err) { console.error("Load failed"); }

  };



  useEffect(() => { fetchCities(); }, []);



  const handleImage = (e, setter) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => setter(reader.result);

    if (file) reader.readAsDataURL(file);

  };



  const handleSaveCity = async (e) => {

    e.preventDefault();

    const payload = {

      cityName,

      cityImage,

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

      setAlert({ show: true, type: "success", msg: isEditing ? "City updated!" : "New city added!" });

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

    window.scrollTo({ top: 0, behavior: "smooth" });

  };



  const handleDelete = async (name) => {

    const res = await fetch(`http://localhost:18080/api/admin/cities/delete/${name}`, { method: "DELETE" });

    if (res.ok) {

        setAlert({ show: true, type: "success", msg: `${name} deleted.` });

        fetchCities();

    }

  };



  const resetForm = () => {

    setCityName(""); setCityImage(""); setTouristSpots(""); setRestaurants("");

    setIsEditing(false);

  };



  return (

    <div className="mp-outer">

      <div className="mp-card">

        <h2 className="mp-title">{isEditing ? "Edit City" : "Add New City (Pakistan)"}</h2>

        <form className="mp-form" onSubmit={handleSaveCity}>

          {/* CITY SECTION */}

          <div className="fld">

            <label>City Name</label>

            <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} required />

          </div>

          <div className="fld">

            <label>City Image</label>

            <div className="file-input-wrapper"><input type="file" onChange={(e) => handleImage(e, setCityImage)} /></div>

          </div>



          {/* TOURIST SPOTS SECTION */}

          <div className="fld">

            <label>Tourist Spot Names</label>

            <input type="text" value={touristSpots} placeholder="Enter spot names separated by commas" onChange={(e) => setTouristSpots(e.target.value)} />

          </div>

          <div className="fld">

            <label>Tourist Spot Image</label>

            <div className="file-input-wrapper"><input type="file" /></div>

          </div>



          {/* RESTAURANTS SECTION */}

          <div className="fld">

            <label>Restaurant Names</label>

            <input type="text" value={restaurants} placeholder="Enter restaurant names separated by commas" onChange={(e) => setRestaurants(e.target.value)} />

          </div>

          <div className="fld">

            <label>Restaurant Image</label>

            <div className="file-input-wrapper"><input type="file" /></div>

          </div>



          <div className="form-action-buttons">

            <button className="admin-btn-submit" type="submit">{isEditing ? "Save Changes" : "Save City"}</button>

            {isEditing && <button className="admin-btn-cancel" type="button" onClick={resetForm}>Cancel</button>}

          </div>

        </form>

      </div>



      <h3 className="mp-subtitle">Registered Cities ({cities.length})</h3>

      {/* RESTORED LINEAR DISPLAY */}

      <div className="package-cards-container horizontal-row">

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



      {/* SMART ALERT MODAL */}

      {alert.show && (

        <div className="admin-confirm-overlay">

          <div className="admin-confirm-modal-v2">

            <div className={`modal-status-icon ${alert.type === "success" ? "confirmed" : "rejected"}`}>

              {alert.type === "success" ? <FaCheck /> : <FaTimes />}

            </div>

            <h2>{alert.type === "success" ? "Success" : "Error"}</h2>

            <p>{alert.msg}</p>

            <button className="modal-confirm-btn confirmed" onClick={() => setAlert({ ...alert, show: false })}>

              Continue

            </button>

          </div>

        </div>

      )}

    </div>

  );

};



export default AddCity;