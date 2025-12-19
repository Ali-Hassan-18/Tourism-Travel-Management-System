import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaHeart, FaChevronLeft, FaChevronRight, 
  FaSun, FaTree, FaCloud, FaClock, FaCalendarAlt, FaStar 
} from "react-icons/fa";
import "./CityDetail.css";

const getWishlist = () => {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : {};
};

const setWishlist = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const MOCK_CITIES = ["Islamabad", "Hunza Valley", "Skardu", "Fairy Meadows", "Murree"];

const CityDetail = () => {
  const { cityName } = useParams();
  const city = decodeURIComponent(cityName);
  const navigate = useNavigate();

  const [wishlistStatus, setWishlistStatus] = useState(getWishlist());
  const [placeStartIndex, setPlaceStartIndex] = useState(0);
  const [hotelStartIndex, setHotelStartIndex] = useState(0);
  const [restaurantStartIndex, setRestaurantStartIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityName]);

  // Enhanced Mock Data with Prices and Packages
  const allItems = [
    { 
      name: "Attabad Lake Tour", 
      type: "place", 
      img: "https://images.unsplash.com/photo-1581791534721-e599343f17c2?auto=format&fit=crop&w=600&q=80", 
      desc: "A turquoise lake famous for boating and mountain reflections.",
      duration: "3 Days / 2 Nights",
      price: "15,000",
      rating: "4.8"
    },
    { 
      name: "Baltit Fort Heritage", 
      type: "place", 
      img: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=600&q=80", 
      desc: "A 700-year-old fort showcasing Hunza’s royal heritage.",
      duration: "Full Day",
      price: "2,500",
      rating: "4.5"
    },
    { 
      name: "Passu Cones Expedition", 
      type: "place", 
      img: "https://images.unsplash.com/photo-1624026676760-43603416ac51?auto=format&fit=crop&w=600&q=80", 
      desc: "Iconic sharp mountain peaks loved by photographers.",
      duration: "2 Days",
      price: "8,500",
      rating: "4.9"
    },
    { 
      name: "Serena Luxury Stay", 
      type: "hotel", 
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", 
      desc: "Premium stay with comfort and scenic mountain beauty.",
      duration: "Per Night",
      price: "22,000",
      rating: "5.0"
    },
    { 
      name: "Eagle’s Nest Lodge", 
      type: "hotel", 
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80", 
      desc: "Best panoramic sunrise and sunset views in the valley.",
      duration: "Per Night",
      price: "12,000",
      rating: "4.7"
    },
    { 
      name: "Mountain View Grill", 
      type: "restaurant", 
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", 
      desc: "Authentic local cuisine with stunning valley views.",
      duration: "Meal for 2",
      price: "3,500",
      rating: "4.6"
    }
  ];

  const overviewPoints = [
    { icon: <FaTree />, title: "Natural Beauty", desc: "Known for snow-capped peaks and crystal-clear lakes." },
    { icon: <FaClock />, title: "Culture", desc: "Home to ancient forts and unique local traditions." },
    { icon: <FaCloud />, title: "Atmosphere", desc: "Offers peaceful surroundings and warm hospitality." },
  ];

  const toggleWishlist = (name) => {
    const newWishlistStatus = { ...wishlistStatus };
    if (newWishlistStatus[name]) {
      delete newWishlistStatus[name];
    } else {
      const item = allItems.find(i => i.name === name);
      newWishlistStatus[name] = { 
        city: city, 
        isWished: true, 
        img: item ? item.img : "" 
      };
    }
    setWishlistStatus(newWishlistStatus);
    setWishlist(newWishlistStatus);
  };

  const handleSectionNav = (type, direction) => {
    const items = allItems.filter(i => i.type === type);
    if (type === 'place') {
      if (direction === 'next' && placeStartIndex < items.length - 1) setPlaceStartIndex(p => p + 1);
      if (direction === 'prev' && placeStartIndex > 0) setPlaceStartIndex(p => p - 1);
    } else if (type === 'hotel') {
      if (direction === 'next' && hotelStartIndex < items.length - 1) setHotelStartIndex(p => p + 1);
      if (direction === 'prev' && hotelStartIndex > 0) setHotelStartIndex(p => p - 1);
    } else {
      if (direction === 'next' && restaurantStartIndex < items.length - 1) setRestaurantStartIndex(p => p + 1);
      if (direction === 'prev' && restaurantStartIndex > 0) setRestaurantStartIndex(p => p - 1);
    }
  };

  const CardItem = ({ item }) => {
    const isWished = !!wishlistStatus[item.name];
    return (
      <div className="package-card" key={item.name}>
        <div className="package-image-wrapper">
          <img src={item.img} alt={item.name} />
          <div className="package-badge">{item.duration}</div>
          <button 
            className={`wishlist-button ${isWished ? "wished" : ""}`} 
            onClick={() => toggleWishlist(item.name)}
          >
            <FaHeart />
          </button>
        </div>
        
        <div className="package-details">
          <div className="package-header">
            <h4>{item.name}</h4>
            <span className="package-rating"><FaStar /> {item.rating}</span>
          </div>
          <p className="package-desc">{item.desc}</p>
          
          <div className="package-footer">
            <div className="price-tag">
              <span className="price-label">Estimation</span>
              <span className="price-value">Rs. {item.price}</span>
            </div>
            <button className="book-now-btn">Book Now</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="city-detail">
      <div className="city-hero">
        <div className="hero-content">
          <h1>{city}</h1>
          <p>Explore beauty, culture & unforgettable adventures</p>
        </div>
      </div>

      <section className="city-section">
        <h2 className="centered-teal-title">Overview</h2>
        <div className="info-points-grid">
          {overviewPoints.map((point, index) => (
            <div key={index} className="info-point-card">
              <div className="point-icon">{point.icon}</div>
              <div className="point-content">
                <h4>{point.title}</h4>
                <p>{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {['place', 'hotel', 'restaurant'].map((type) => {
        const startIndex = type === 'place' ? placeStartIndex : type === 'hotel' ? hotelStartIndex : restaurantStartIndex;
        return (
          <section className="city-section" key={type}>
            <h2 className="centered-teal-title">
              {type === 'place' ? "Tourist Packages" : type === 'hotel' ? "Top Stays" : "Dining Experiences"}
            </h2>
            <div className="card-grid-container">
              <div className="card-grid" style={{ transform: `translateX(-${startIndex * 30}%)` }}>
                {allItems.filter(i => i.type === type).map(item => <CardItem item={item} key={item.name} />)}
              </div>
            </div>
            <div className="section-footer-nav">
              <div className="section-nav-buttons">
                <button className="nav-arrow-button" onClick={() => handleSectionNav(type, 'prev')}><FaChevronLeft /></button>
                <button className="nav-arrow-button" onClick={() => handleSectionNav(type, 'next')}><FaChevronRight /></button>
              </div>
            </div>
          </section>
        );
      })}

      <div className="city-navigation-footer">
        <button className="nav-button prev" onClick={() => navigate(`/city/${encodeURIComponent(MOCK_CITIES[0])}`)}>
          <FaChevronLeft /><span>Previous City</span>
        </button>
        <button className="nav-button next" onClick={() => navigate(`/city/${encodeURIComponent(MOCK_CITIES[1])}`)}>
          <span>Next City</span><FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CityDetail;