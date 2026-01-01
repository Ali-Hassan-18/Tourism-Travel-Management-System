import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import heroImg from "../../assets/img5.jpg";

// Import specific images for each city - CORRECTED VERSION
import azadKashmirImg from "../../assets/Neelum-Valley.jpg";
import naranImg from "../../assets/img1.jpg";
import shogranImg from "../../assets/img3.jpg"; // CORRECTED: changed from "pine park shogran.jpg"
import swatImg from "../../assets/img5.jpg";
import hunzaImg from "../../assets/welcomepage.jpg";
import murreeImg from "../../assets/img6.jpg"; 
import skarduImg from "../../assets/Lulusar.jpg"; 
import fairyMeadowsImg from "../../assets/fairy_meadows.jpg"; 
import galiyatImg from "../../assets/img7.jpg";
import bagrotImg from "../../assets/img8.jpg";
import kalashImg from "../../assets/img9.jpg";
import chitralImg from "../../assets/img10.png";
import rattiGaliImg from "../../assets/Ratti-Gali-lake-.jpg";
import deosaiImg from "../../assets/Bahrain_Valley,_Swat,_KPK.jpg";
import hutubiImg from "../../assets/img11.jpg";
import mahodandImg from "../../assets/img12.jpg";
import borithImg from "../../assets/img13.jpg";
import ramaLakeImg from "../../assets/img16.jpg";
import passuImg from "../../assets/img14.jpg";
import naltarImg from "../../assets/img15.jpg";

const Homepage = () => {
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // UPDATED: Your 4 cities FIRST with proper images
    const northernCities = [
        // YOUR 4 CITIES - FIRST with their specific images
        { name: "Azad Kashmir", img: azadKashmirImg, description: "Home to Neelum Valley and breathtaking landscapes." },
        { name: "Naran", img: naranImg, description: "Beautiful valleys with lakes and mountains." },
        { name: "Shogran", img: shogranImg, description: "A scenic plateau surrounded by lush hills." },
        { name: "Swat", img: swatImg, description: "The Switzerland of Pakistan, with rivers and mountains." },
        
        // Other cities with different images
        { name: "Hunza Valley", img: hunzaImg, description: "Famous for breathtaking views and Karimabad fort." },
        { name: "Murree", img: murreeImg, description: "Popular hill station with colonial charm." },
        { name: "Skardu", img: skarduImg, description: "Gateway to the Karakoram Range and majestic peaks." },
        { name: "Fairy Meadows", img: fairyMeadowsImg, description: "Iconic camping site with a view of Nanga Parbat." },
        { name: "Galiyat", img: galiyatImg, description: "Cluster of hill stations with pine forests and resorts." },
        { name: "Bagrot Valley", img: bagrotImg, description: "Less explored valley with stunning scenery." },
        { name: "Kalash Valley", img: kalashImg, description: "Unique culture and colorful festivals of the Kalash people." },
        { name: "Chitral", img: chitralImg, description: "Home of the majestic Trich Mir mountain and traditional heritage." },
        { name: "Ratti Gali Lake", img: rattiGaliImg, description: "High-altitude alpine lake with pristine surroundings." },
        { name: "Deosai Plains", img: deosaiImg, description: "The Land of Giants, famous for wildlife and flat landscapes." },
        { name: "Shogran ", img: hutubiImg, description: "Scenic lake surrounded by mountains and nature trails." },
        { name: "Mahodand ", img: mahodandImg, description: "Popular for boating and surrounded by dense pine forests." },
        { name: "Borith ", img: borithImg, description: "Serene lake near Hunza, perfect for photography." },
        { name: "Nathia Gali", img: ramaLakeImg, description: "Beautiful lake in Skardu region surrounded by meadows." },
        { name: "Passu Cones", img: passuImg, description: "Famous mountain peaks in northern Hunza Valley." },
        { name: "Khaplu", img: naltarImg, description: "Known for ski resort and vibrant natural beauty." },
    ];

    // Filter logic
    const filteredCities = northernCities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleCities = showAll ? filteredCities : filteredCities.slice(0, 8);

    const handleCityClick = (city) => {
        navigate(`/city/${encodeURIComponent(city.name)}`);
    };

    return (
        <div className="homepage-container">

            {/* HERO SECTION */}
            <div className="homepage-hero-wrapper">
                <div
                    className="homepage-hero"
                    style={{ backgroundImage: `url(${heroImg})` }}
                >
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <h1 className="hero-title">Explore Northern Pakistan</h1>
                        </div>
                    </div>
                </div>

                <div className="homepage-search-bar">
                    <input
                        type="text"
                        placeholder="Search for a city..."
                        className="city-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* CITY CARDS */}
            <div className="top-searched-section">
                <h2 className="top-title">Northern Pakistan Cities</h2>
                <p className="top-subtitle">
                    Click on any city to explore detailed information, attractions, and tours.
                </p>

                <div className="top-cards enhanced-cards">
                    {visibleCities.map((city, index) => (
                        <div
                            className="city-card"
                            key={index}
                            onClick={() => handleCityClick(city)}
                        >
                            <div
                                className="city-card-img"
                                style={{ 
                                    backgroundImage: `url(${city.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="city-card-overlay">
                                    <h3>{city.name}</h3>
                                </div>
                            </div>
                            <div className="city-card-content">
                                <p>{city.description}</p>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleCityClick(city); 
                                    }} 
                                    className="explore-btn"
                                >
                                    Explore <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SHOW MORE BUTTON */}
                {searchTerm === "" && northernCities.length > 8 && (
                    <div style={{ marginTop: "40px", textAlign: "center" }}>
                        <button
                            onClick={() => setShowAll(!showAll)}
                            style={{
                                padding: "12px 28px",
                                borderRadius: "30px",
                                border: "1px solid #008080",
                                background: "#008080",
                                color: "#fff",
                                fontSize: "15px",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = "#006666";
                                e.target.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = "#008080";
                                e.target.style.transform = "scale(1)";
                            }}
                        >
                            {showAll ? "Show Less" : "Show More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;