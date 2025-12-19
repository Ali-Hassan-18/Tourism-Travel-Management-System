import React, { useState } from "react";
import "./AddCity.css";

const AddCity = () => {
  const [cityName, setCityName] = useState("");
  const [touristSpots, setTouristSpots] = useState("");
  const [restaurants, setRestaurants] = useState("");

  const [cityImages, setCityImages] = useState([]);
  const [touristImages, setTouristImages] = useState([]);
  const [restaurantImages, setRestaurantImages] = useState([]);

  const [cities, setCities] = useState([]);

  const handleImages = (e, setter) => {
    setter(Array.from(e.target.files));
  };

  const handleSaveCity = (e) => {
    e.preventDefault();
    if (!cityName) {
      alert("City name required");
      return;
    }

    setCities([
      ...cities,
      {
        cityName,
        touristSpots: touristSpots.split(",").map((s) => s.trim()),
        restaurants: restaurants.split(",").map((r) => r.trim()),
        cityImages,
        touristImages,
        restaurantImages,
      },
    ]);

    // Reset form
    setCityName("");
    setTouristSpots("");
    setRestaurants("");
    setCityImages([]);
    setTouristImages([]);
    setRestaurantImages([]);
  };

  const renderFileInput = (setter) => (
    <div className="file-input-wrapper">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleImages(e, setter)}
      />
    </div>
  );

  return (
    <div className="mp-outer">
      <div className="mp-card">
        <h2 className="mp-title">Add New City (Pakistan)</h2>

        <form className="mp-form" onSubmit={handleSaveCity}>
          <div className="fld">
            <label>City Name</label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter city name"
              required
            />
          </div>

          <div className="fld">
            <label>City Images</label>
            {renderFileInput(setCityImages)}
          </div>

          <div className="fld">
            <label>Tourist Spots</label>
            <input
              type="text"
              value={touristSpots}
              onChange={(e) => setTouristSpots(e.target.value)}
              placeholder="Naran, Kaghan, Babusar"
            />
          </div>

          <div className="fld">
            <label>Tourist Spot Images</label>
            {renderFileInput(setTouristImages)}
          </div>

          <div className="fld">
            <label>Restaurants</label>
            <input
              type="text"
              value={restaurants}
              onChange={(e) => setRestaurants(e.target.value)}
              placeholder="ABC Restaurant, XYZ Cafe"
            />
          </div>

          <div className="fld">
            <label>Restaurant Images</label>
            {renderFileInput(setRestaurantImages)}
          </div>

          <button className="btn primary" type="submit">
            Save City
          </button>
        </form>
      </div>

      {cities.length > 0 && (
        <div className="mp-card">
          <h3>Added Cities</h3>
          <div className="cities-grid">
            {cities.map((city, idx) => (
              <div key={idx} className="added-city-card">
                <h4 className="city-title">{city.cityName}</h4>

                <div className="image-preview">
                  {city.cityImages.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      className="preview-img"
                      alt=""
                    />
                  ))}
                </div>

                <p>Tourist Spots: {city.touristSpots.join(", ")}</p>

                <div className="image-preview">
                  {city.touristImages.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      className="preview-img"
                      alt=""
                    />
                  ))}
                </div>

                <p>Restaurants: {city.restaurants.join(", ")}</p>

                <div className="image-preview">
                  {city.restaurantImages.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      className="preview-img"
                      alt=""
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCity;