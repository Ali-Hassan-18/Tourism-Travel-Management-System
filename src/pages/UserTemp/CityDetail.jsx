import React, { useState, useEffect } from "react"; // Added useEffect here
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaHeart, FaChevronLeft, FaChevronRight, 
  FaSun, FaTree, FaCloud, FaClock, FaCalendarAlt 
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

  // --- ADD THIS BLOCK ---
  // This ensures the page scrolls to the top whenever the component mounts
  // or whenever the cityName (route) changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityName]);
  // ----------------------

  const [wishlistStatus, setWishlistStatus] = useState(getWishlist());
  const [placeStartIndex, setPlaceStartIndex] = useState(0);
  const [hotelStartIndex, setHotelStartIndex] = useState(0);
  const [restaurantStartIndex, setRestaurantStartIndex] = useState(0);

  const overviewPoints = [
    { icon: <FaTree />, title: "Natural Beauty", desc: "Known for snow-capped peaks, crystal-clear lakes, and lush valleys." },
    { icon: <FaClock />, title: "Culture & History", desc: "Home to ancient forts and communities with unique traditions." },
    { icon: <FaCloud />, title: "Atmosphere", desc: "Offers peaceful surroundings and warm hospitality attracting travelers." },
  ];

  const bestTimePoints = [
    { icon: <FaCalendarAlt />, title: "Ideal Season", desc: "April to October is the peak time for pleasant weather and accessibility." },
    { icon: <FaSun />, title: "Activities", desc: "Perfect for hiking, trekking, and sightseeing due to clear skies." },
    { icon: <FaTree />, title: "Views", desc: "The natural foliage and high-altitude views are at their best." },
  ];

  const currentCityIndex = MOCK_CITIES.findIndex(c => c === city);
  const nextCity = MOCK_CITIES[(currentCityIndex + 1) % MOCK_CITIES.length];
  const prevCity = MOCK_CITIES[(currentCityIndex - 1 + MOCK_CITIES.length) % MOCK_CITIES.length];

  const handleCityNavigation = (targetCity) => {
    navigate(`/city/${encodeURIComponent(targetCity)}`);
  };

  const toggleWishlist = (name) => {
    const newWishlistStatus = { ...wishlistStatus };
    if (newWishlistStatus[name]) {
      delete newWishlistStatus[name];
    } else {
      const item = allItems.find(i => i.name === name);
      newWishlistStatus[name] = { 
        city: city, 
        isWished: true, 
        img: item ? item.img : "https://source.unsplash.com/100x100/?travel" 
      };
    }
    setWishlistStatus(newWishlistStatus);
    setWishlist(newWishlistStatus);
  };

  const allItems = [
    { name: "Attabad Lake", type: "place", img: "https://source.unsplash.com/600x400/?attabad,lake", desc: "A turquoise lake famous for boating and mountain reflections." },
    { name: "Baltit Fort", type: "place", img: "https://source.unsplash.com/600x400/?baltit,fort", desc: "A 700-year-old fort showcasing Hunza’s royal heritage." },
    { name: "Passu Cones", type: "place", img: "https://source.unsplash.com/600x400/?passu,cones", desc: "Iconic sharp mountain peaks loved by photographers." },
    { name: "Karimabad", type: "place", img: "https://source.unsplash.com/600x400/?karimabad", desc: "The cultural heart of Hunza with markets and cafes." },
    { name: "Naltar Valley", type: "place", img: "https://source.unsplash.com/600x400/?naltar,valley", desc: "Lush green valley known for its potato farms and tranquil lakes." },
    { name: "Eagle’s Nest Hotel", type: "hotel", img: "https://source.unsplash.com/600x400/?mountain,hotel", desc: "Best panoramic sunrise and sunset views in Hunza." },
    { name: "Serena Inn", type: "hotel", img: "https://source.unsplash.com/600x400/?luxury,resort", desc: "Premium stay with comfort and scenic beauty." },
    { name: "Valley Lodge", type: "hotel", img: "https://source.unsplash.com/600x400/?guesthouse,mountain", desc: "Cozy and budget-friendly accommodation." },
    { name: "Mountain View Restaurant", type: "restaurant", img: "https://source.unsplash.com/600x400/?restaurant,mountains", desc: "Local cuisine with stunning valley views." },
    { name: "Hunza Food Pavilion", type: "restaurant", img: "https://source.unsplash.com/600x400/?pakistani,food", desc: "Authentic Hunza dishes and traditional flavors." },
    { name: "Cafe De Hunza", type: "restaurant", img: "https://source.unsplash.com/600x400/?cafe,coffee", desc: "Relaxing cafe with desserts and coffee." },
  ];

  const filterItems = (type) => allItems.filter((item) => item.type === type);

  const handleSectionNav = (type, direction) => {
    let setter, currentIndex, items;
    if (type === 'place') { setter = setPlaceStartIndex; currentIndex = placeStartIndex; items = filterItems('place'); }
    else if (type === 'hotel') { setter = setHotelStartIndex; currentIndex = hotelStartIndex; items = filterItems('hotel'); }
    else { setter = setRestaurantStartIndex; currentIndex = restaurantStartIndex; items = filterItems('restaurant'); }
    
    if (direction === 'next' && currentIndex < items.length - 1) setter(currentIndex + 1);
    else if (direction === 'prev' && currentIndex > 0) setter(currentIndex - 1);
  };

  const CardItem = ({ item }) => {
    const isWished = !!wishlistStatus[item.name];
    return (
      <div className="info-card" key={item.name}>
        <div className="card-inner-square"> 
            <img src={item.img} alt={item.name} />
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

  return (
    <div className="city-detail">
      <div className="city-hero">
        <h1>{city}</h1>
        <p>Explore beauty, culture & unforgettable adventures</p>
      </div>

      <section className="city-section">
        <h2 className="centered-teal-title">Overview</h2>
        <div className="info-points-grid">
          {overviewPoints.map((p, i) => (
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

      <section className="city-section">
        <h2 className="centered-teal-title">Best Time to Visit</h2>
        <div className="info-points-grid">
          {bestTimePoints.map((p, i) => (
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

      {['place', 'hotel', 'restaurant'].map((type) => {
        const startIndex = type === 'place' ? placeStartIndex : type === 'hotel' ? hotelStartIndex : restaurantStartIndex;
        return (
          <section className="city-section" key={type}>
            <h2 className="centered-teal-title">
              {type === 'place' ? "Tourist Attractions" : type === 'hotel' ? "Hotels" : "Top Restaurants"}
            </h2>
            
            <div className="section-navigation-wrapper">
              <button className="section-arrow prev" onClick={() => handleSectionNav(type, 'prev')} disabled={startIndex === 0}>
                <FaChevronLeft />
              </button>
              
              <div className="card-grid-container">
                <div className="card-grid" style={{ transform: `translateX(-${startIndex * 25}%)` }}>
                  {filterItems(type).map(item => <CardItem item={item} key={item.name} />)}
                </div>
              </div>
              
              <button className="section-arrow next" onClick={() => handleSectionNav(type, 'next')} disabled={startIndex >= filterItems(type).length - 1}>
                <FaChevronRight />
              </button>
            </div>
          </section>
        );
      })}

      <section className="city-section">
        <div className="wishlist-header-wrapper">
            <h2>My Wishlist <FaHeart className="wishlist-header-icon" /> ({Object.keys(wishlistStatus).length})</h2>
        </div>
        <div className="wishlist-display">
            {Object.keys(wishlistStatus).length === 0 ? (
                <div className="wishlist-empty-card"><p>Your wishlist is empty.</p></div>
            ) : (
                Object.keys(wishlistStatus).map(key => (
                    <div key={key} className="wishlist-item-card">
                        <img src={wishlistStatus[key].img} alt={key} className="wishlist-item-img" />
                        <div className="wishlist-item-info"><h4>{key}</h4><p>{wishlistStatus[key].city}</p></div>
                        <button className="wishlist-remove-btn" onClick={() => toggleWishlist(key)}>Remove</button>
                    </div>
                ))
            )}
        </div>
      </section>

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