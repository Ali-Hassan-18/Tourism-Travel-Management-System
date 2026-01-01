import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart, FaChevronLeft, FaChevronRight,
  FaSun, FaTree, FaCloud, FaClock, FaCalendarAlt
} from "react-icons/fa";
import "./CityDetail.css";

// Import Azad Kashmir images - FIXED PATHS (no subfolders)
import neelumValleyImg from "../../assets/Neelum-Valley.jpg";
import rattiGaliLakeImg from "../../assets/Ratti-Gali-lake-.jpg";
import pirChinasiImg from "../../assets/Pir-Chinasi .jpg";
import arangKelImg from "../../assets/arang kel.jpg";
import pearlContinentalImg from "../../assets/pearl continental.jpg";
import kashmirLodgeImg from "../../assets/hotel-kashmir-lodge.jpg";
import skyResortImg from "../../assets/sky-resort-muzaffarabad.jpg";
import tobatKashmirImg from "../../assets/tobat kashmir.jpg";

// Import Naran images - FIXED PATHS (no subfolders)
import saifulMulukImg from "../../assets/Saif ul makhlooq.jpg";
import lulusarImg from "../../assets/Lulusar.jpg";
import lalazarImg from "../../assets/lalazar.jpg";
import kiwaiVillageImg from "../../assets/Kiwaii village.jpg";
import hotelOneImg from "../../assets/Hotel One.jpg";
import saraiHotelImg from "../../assets/the Sarai Hotel & Resort Naran.jpg";
import royalHotelImg from "../../assets/royal hotel.jpg";
import bbqTonightImg from "../../assets/Bar B Q tonight restaurant.jpg";
import gatewayRestaurantImg from "../../assets/Gateway restaurant.jpg";

// Import Shogran images - FIXED PATHS (no subfolders)
import siriPayeImg from "../../assets/siri paye lake.jpg";
import makraPeakImg from "../../assets/makra peak.jpg";
import shogranValleyImg from "../../assets/shogran valley.jpg";
import cedarWoodImg from "../../assets/ceder wood resort.jpg";
import arcadianImg from "../../assets/arcadian sprucewoods.jpg";
import lalazarHotelImg from "../../assets/lalazar shogran hotel.jpg";
import pineParkImg from "../../assets/pine park shogran.jpg";

// Import Swat images - FIXED PATHS (no subfolders)
import malamJabbaImg from "../../assets/malam jabba.jpg";
import mahodandLakeImg from "../../assets/mahodand lake.jpg";
import bahrainValleyImg from "../../assets/Bahrain_Valley,_Swat,_KPK.jpg";
import buriUlSavatiImg from "../../assets/burj ul sawat.jpg";
import swatSerenaImg from "../../assets/swat serena hotel.jpg";
import swatViewHotelImg from "../../assets/swat view hotel.jpg";

const getWishlist = () => {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : {};
};

const setWishlist = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

// ONLY YOUR 4 CITIES
const CITIES = ["Azad Kashmir", "Naran", "Shogran", "Swat"];

const CityDetail = () => {
  const { cityName } = useParams();
  const city = decodeURIComponent(cityName);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityName]);

  const [wishlistStatus, setWishlistStatus] = useState(getWishlist());
  const [placeStartIndex, setPlaceStartIndex] = useState(0);
  const [hotelStartIndex, setHotelStartIndex] = useState(0);
  const [restaurantStartIndex, setRestaurantStartIndex] = useState(0);

  // City-specific overview points - ONLY FOR YOUR 4 CITIES
  const getOverviewPoints = (city) => {
    const points = {
      "Azad Kashmir": [
        { icon: <FaTree />, title: "Natural Beauty", desc: "Known for stunning mountain landscapes, lush green valleys, and crystal-clear rivers." },
        { icon: <FaClock />, title: "Culture & History", desc: "Rich Kashmiri cultural heritage and traditional handicrafts." },
        { icon: <FaCloud />, title: "Atmosphere", desc: "Peaceful surroundings with warm Kashmiri hospitality." },
      ],
      "Naran": [
        { icon: <FaTree />, title: "Natural Beauty", desc: "Gateway to Kaghan Valley with alpine scenery, lakes, and waterfalls." },
        { icon: <FaClock />, title: "Culture & History", desc: "Traditional mountain communities and local festivals." },
        { icon: <FaCloud />, title: "Atmosphere", desc: "Fresh mountain air and serene environment for relaxation." },
      ],
      "Shogran": [
        { icon: <FaTree />, title: "Natural Beauty", desc: "Beautiful hill station offering panoramic Himalayan views and pine forests." },
        { icon: <FaClock />, title: "Culture & History", desc: "Local Gujjar culture and traditional lifestyle." },
        { icon: <FaCloud />, title: "Atmosphere", desc: "Tranquil hill station perfect for nature lovers." },
      ],
      "Swat": [
        { icon: <FaTree />, title: "Natural Beauty", desc: "Known as the 'Switzerland of the East' with stunning landscapes." },
        { icon: <FaClock />, title: "Culture & History", desc: "Rich Buddhist heritage and archaeological sites." },
        { icon: <FaCloud />, title: "Atmosphere", desc: "Cultural diversity with warm Pashtun hospitality." },
      ]
    };
    
    return points[city] || [];
  };

  // City-specific best time points - ONLY FOR YOUR 4 CITIES
  const getBestTimePoints = (city) => {
    const points = {
      "Azad Kashmir": [
        { icon: <FaCalendarAlt />, title: "Ideal Season", desc: "March to October for pleasant weather and accessibility." },
        { icon: <FaSun />, title: "Activities", desc: "Perfect for trekking, fishing, and cultural exploration." },
        { icon: <FaTree />, title: "Views", desc: "Lush green valleys and snow-capped peaks at their best." },
      ],
      "Naran": [
        { icon: <FaCalendarAlt />, title: "Ideal Season", desc: "May to September when snow melts and roads are accessible." },
        { icon: <FaSun />, title: "Activities", desc: "Ideal for hiking, boating, and mountain climbing." },
        { icon: <FaTree />, title: "Views", desc: "Alpine meadows and crystal-clear lakes in full glory." },
      ],
      "Shogran": [
        { icon: <FaCalendarAlt />, title: "Ideal Season", desc: "April to October for clear skies and comfortable temperatures." },
        { icon: <FaSun />, title: "Activities", desc: "Great for hiking, horse riding, and photography." },
        { icon: <FaTree />, title: "Views", desc: "Panoramic Himalayan views and dense pine forests." },
      ],
      "Swat": [
        { icon: <FaCalendarAlt />, title: "Ideal Season", desc: "March to November for pleasant weather and site access." },
        { icon: <FaSun />, title: "Activities", desc: "Perfect for skiing, sightseeing, and historical tours." },
        { icon: <FaTree />, title: "Views", desc: "Valley landscapes and historical ruins in ideal conditions." },
      ]
    };
    
    return points[city] || [];
  };

  // City-specific hero backgrounds - ONLY YOUR IMAGES
  const getCityHeroBackground = (city) => {
    const backgrounds = {
      "Azad Kashmir": `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${neelumValleyImg})`,
      "Naran": `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${saifulMulukImg})`,
      "Shogran": `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${shogranValleyImg})`,
      "Swat": `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${malamJabbaImg})`,
    };
    
    return backgrounds[city] || "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('https://source.unsplash.com/1600x900/?mountains,travel')";
  };

  const currentCityIndex = CITIES.findIndex(c => c === city);
  const nextCity = CITIES[(currentCityIndex + 1) % CITIES.length];
  const prevCity = CITIES[(currentCityIndex - 1 + CITIES.length) % CITIES.length];

  const handleCityNavigation = (targetCity) => {
    navigate(`/city/${encodeURIComponent(targetCity)}`);
  };

  const toggleWishlist = (name) => {
    const newWishlistStatus = { ...wishlistStatus };
    if (newWishlistStatus[name]) {
      delete newWishlistStatus[name];
    } else {
      const item = getCityItems(city).find(i => i.name === name);
      newWishlistStatus[name] = {
        city: city,
        isWished: true,
        img: item ? item.img : "https://source.unsplash.com/100x100/?travel"
      };
    }
    setWishlistStatus(newWishlistStatus);
    setWishlist(newWishlistStatus);
  };

  // Get items for specific city - ONLY YOUR 4 CITIES
  const getCityItems = (cityName) => {
    const cityData = {
      "Azad Kashmir": [
        // Tourist Spots
        { name: "Neelum Valley", type: "place", img: neelumValleyImg, desc: "Breathtaking valley with flowing rivers and lush greenery in Azad Kashmir." },
        { name: "Ratti Gali Lake", type: "place", img: rattiGaliLakeImg, desc: "Alpine lake surrounded by snow-capped peaks in Azad Kashmir." },
        { name: "Pir Chinasi", type: "place", img: pirChinasiImg, desc: "Sacred mountain with panoramic views of Muzaffarabad." },
        { name: "Arang Kel", type: "place", img: arangKelImg, desc: "Picturesque village in the clouds of Azad Kashmir." },
        // Hotels
        { name: "Pearl Continental", type: "hotel", img: pearlContinentalImg, desc: "Luxury hotel with mountain views in Azad Kashmir." },
        { name: "Kashmir Lodge", type: "hotel", img: kashmirLodgeImg, desc: "Cozy lodge with traditional Kashmiri hospitality." },
        { name: "Sky Resort", type: "hotel", img: skyResortImg, desc: "Modern resort with all amenities in Muzaffarabad." },
        // Restaurants
        { name: "Tobat Kashmir", type: "restaurant", img: tobatKashmirImg, desc: "Authentic Kashmiri cuisine in Muzaffarabad." },
      ],
      "Naran": [
        // Tourist Spots
        { name: "Saiful Muluk", type: "place", img: saifulMulukImg, desc: "Legendary lake with crystal clear waters in Naran Valley." },
        { name: "Lulusar Lake", type: "place", img: lulusarImg, desc: "Largest lake in Kaghan Valley surrounded by mountains." },
        { name: "Lalazar", type: "place", img: lalazarImg, desc: "Beautiful meadow with wildflowers and mountain views." },
        { name: "Kiwai Village", type: "place", img: kiwaiVillageImg, desc: "Traditional mountain village in Naran." },
        // Hotels
        { name: "Hotel One", type: "hotel", img: hotelOneImg, desc: "Comfortable stay with modern facilities in Naran." },
        { name: "The Sarai Hotel", type: "hotel", img: saraiHotelImg, desc: "Boutique hotel with traditional decor in Kaghan." },
        { name: "Royal Hotel", type: "hotel", img: royalHotelImg, desc: "Affordable accommodation in central Naran." },
        // Restaurants
        { name: "Bar B Q Tonight", type: "restaurant", img: bbqTonightImg, desc: "Famous for grilled meats and kebabs in Naran." },
        { name: "Gateway Restaurant", type: "restaurant", img: gatewayRestaurantImg, desc: "Local cuisine with valley views in Naran." },
      ],
      "Shogran": [
        // Tourist Spots
        { name: "Siri Paye Lake", type: "place", img: siriPayeImg, desc: "High-altitude lake with mirror-like reflections in Shogran." },
        { name: "Makra Peak", type: "place", img: makraPeakImg, desc: "Popular hiking destination with 360° views of Himalayas." },
        { name: "Shogran Valley", type: "place", img: shogranValleyImg, desc: "Main valley with lush meadows and pine forests." },
        // Hotels
        { name: "Cedar Wood Resort", type: "hotel", img: cedarWoodImg, desc: "Wooden cottages amidst pine forests in Shogran." },
        { name: "Arcadian Sprucewoods", type: "hotel", img: arcadianImg, desc: "Luxury resort with mountain views in Shogran." },
        { name: "Lalazar Shogran Hotel", type: "hotel", img: lalazarHotelImg, desc: "Traditional hotel with warm hospitality in Shogran." },
        // Restaurants
        { name: "Pine Park Cafe", type: "restaurant", img: pineParkImg, desc: "Cafe with homemade pastries and tea in Shogran." },
      ],
      "Swat": [
        // Tourist Spots
        { name: "Malam Jabba", type: "place", img: malamJabbaImg, desc: "Famous ski resort and mountain retreat in Swat Valley." },
        { name: "Mahodand Lake", type: "place", img: mahodandLakeImg, desc: "Beautiful lake surrounded by mountains in Swat." },
        { name: "Bahrain Valley", type: "place", img: bahrainValleyImg, desc: "Scenic valley with river and traditional markets." },
        { name: "Burj Ul Savat", type: "place", img: buriUlSavatiImg, desc: "Historical site with archaeological significance in Swat." },
        // Hotels
        { name: "Swat Serena Hotel", type: "hotel", img: swatSerenaImg, desc: "Luxury hotel with traditional Swati architecture." },
        { name: "Swat View Hotel", type: "hotel", img: swatViewHotelImg, desc: "Budget hotel with beautiful valley views." },
        // Restaurants
        { name: "Swat Food Street", type: "restaurant", img: malamJabbaImg, desc: "Local delicacies and traditional Swati dishes." },
      ]
    };
    
    return cityData[cityName] || [];
  };

  const filterItems = (cityName, type) => getCityItems(cityName).filter((item) => item.type === type);

  const handleSectionNav = (type, direction) => {
    let setter, currentIndex, items;
    
    if (type === 'place') { 
      setter = setPlaceStartIndex; 
      currentIndex = placeStartIndex; 
      items = filterItems(city, 'place'); 
    }
    else if (type === 'hotel') { 
      setter = setHotelStartIndex; 
      currentIndex = hotelStartIndex; 
      items = filterItems(city, 'hotel'); 
    }
    else { 
      setter = setRestaurantStartIndex; 
      currentIndex = restaurantStartIndex; 
      items = filterItems(city, 'restaurant'); 
    }
   
    if (direction === 'next' && currentIndex < items.length - 1) setter(currentIndex + 1);
    else if (direction === 'prev' && currentIndex > 0) setter(currentIndex - 1);
  };

  const CardItem = ({ item }) => {
    const isWished = !!wishlistStatus[item.name];
    return (
      <div className="info-card" key={item.name}>
        <div className="card-inner-square">
            <img src={item.img} alt={item.name} onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://source.unsplash.com/600x400/?travel,placeholder";
            }} />
            <button className={`wishlist-button ${isWished ? "wished" : ""}`} onClick={() => toggleWishlist(item.name)}>
                <FaHeart />
            </button>
            <div className="info-card-content">
                <h4>{item.name}</h4>
                <p className="description">{item.desc}</p>
            </div>
        </div>
      </div>
    );
  };

  // If city is not in our 4 cities
  if (!CITIES.includes(city)) {
    return (
      <div className="city-detail">
        <div className="city-hero">
          <h1>{city}</h1>
          <p>City information not available</p>
        </div>
        <div className="error-message">
          <p>This city is not currently available in our database.</p>
          <button onClick={() => navigate("/")} className="back-button">
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="city-detail">
      {/* Hero Section with city-specific background */}
      <div 
        className="city-hero" 
        style={{ 
          background: getCityHeroBackground(city),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1>{city}</h1>
        <p>Explore beauty, culture & unforgettable adventures</p>
      </div>

      {/* Overview Section */}
      <section className="city-section">
        <h2 className="centered-teal-title">Overview</h2>
        <div className="info-points-grid">
          {getOverviewPoints(city).map((p, i) => (
            <div key={i} className="info-point-card">
              <div className="point-icon">{p.icon}</div>
              <div className="point-content">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Time to Visit Section */}
      <section className="city-section">
        <h2 className="centered-teal-title">Best Time to Visit</h2>
        <div className="info-points-grid">
          {getBestTimePoints(city).map((p, i) => (
            <div key={i} className="info-point-card">
              <div className="point-icon">{p.icon}</div>
              <div className="point-content">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tourist Attractions Section */}
      {filterItems(city, 'place').length > 0 && (
        <section className="city-section">
          <h2 className="centered-teal-title">Tourist Attractions</h2>
          <div className="section-navigation-wrapper">
            <button className="section-arrow prev" onClick={() => handleSectionNav('place', 'prev')} disabled={placeStartIndex === 0}>
              <FaChevronLeft />
            </button>
           
            <div className="card-grid-container">
              <div className="card-grid" style={{ transform: `translateX(-${placeStartIndex * 25}%)` }}>
                {filterItems(city, 'place').map(item => <CardItem item={item} key={item.name} />)}
              </div>
            </div>
           
            <button className="section-arrow next" onClick={() => handleSectionNav('place', 'next')} disabled={placeStartIndex >= filterItems(city, 'place').length - 1}>
              <FaChevronRight />
            </button>
          </div>
        </section>
      )}

      {/* Hotels Section */}
      {filterItems(city, 'hotel').length > 0 && (
        <section className="city-section">
          <h2 className="centered-teal-title">Hotels</h2>
          <div className="section-navigation-wrapper">
            <button className="section-arrow prev" onClick={() => handleSectionNav('hotel', 'prev')} disabled={hotelStartIndex === 0}>
              <FaChevronLeft />
            </button>
           
            <div className="card-grid-container">
              <div className="card-grid" style={{ transform: `translateX(-${hotelStartIndex * 25}%)` }}>
                {filterItems(city, 'hotel').map(item => <CardItem item={item} key={item.name} />)}
              </div>
            </div>
           
            <button className="section-arrow next" onClick={() => handleSectionNav('hotel', 'next')} disabled={hotelStartIndex >= filterItems(city, 'hotel').length - 1}>
              <FaChevronRight />
            </button>
          </div>
        </section>
      )}

      {/* Restaurants Section */}
      {filterItems(city, 'restaurant').length > 0 && (
        <section className="city-section">
          <h2 className="centered-teal-title">Top Restaurants</h2>
          <div className="section-navigation-wrapper">
            <button className="section-arrow prev" onClick={() => handleSectionNav('restaurant', 'prev')} disabled={restaurantStartIndex === 0}>
              <FaChevronLeft />
            </button>
           
            <div className="card-grid-container">
              <div className="card-grid" style={{ transform: `translateX(-${restaurantStartIndex * 25}%)` }}>
                {filterItems(city, 'restaurant').map(item => <CardItem item={item} key={item.name} />)}
              </div>
            </div>
           
            <button className="section-arrow next" onClick={() => handleSectionNav('restaurant', 'next')} disabled={restaurantStartIndex >= filterItems(city, 'restaurant').length - 1}>
              <FaChevronRight />
            </button>
          </div>
        </section>
      )}

      {/* Wishlist Section */}
      <section className="wishlist-section">
        <h2>Your Wishlist</h2>
        <div className="wishlist-items-container">
          {Object.keys(wishlistStatus).length > 0 ? (
            Object.entries(wishlistStatus).map(([itemName, itemData]) => (
              <div className="wishlist-item" key={itemName}>
                <img src={itemData.img} alt={itemName} className="wishlist-item-img" />
                <div className="wishlist-item-info">
                  <h4>{itemName}</h4>
                  <p>Saved from {itemData.city}</p>
                </div>
                <button 
                  className="wishlist-remove-btn"
                  onClick={() => toggleWishlist(itemName)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="empty-wishlist">
              <p>Your wishlist is empty</p>
              <p>Click the ♡ button on items to add them here</p>
            </div>
          )}
        </div>
      </section>

      {/* City Navigation Footer */}
      <div className="city-navigation-footer">
        <button className="nav-button prev" onClick={() => handleCityNavigation(prevCity)}>
          <FaChevronLeft /><span>{prevCity}</span>
        </button>
        <button className="nav-button next" onClick={() => handleCityNavigation(nextCity)}>
          <span>{nextCity}</span><FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CityDetail;