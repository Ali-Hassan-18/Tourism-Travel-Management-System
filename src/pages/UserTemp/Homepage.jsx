import React from "react";
import "./Homepage.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import heroImg from "../../assets/img5.jpg";
import murreeImg from "../../assets/khunjareeb.jpg";
import naranImg from "../../assets/kaghan.jpg";
import hunzaImg from "../../assets/khunjareeb.jpg";
import swatImg from "../../assets/khunjareeb.jpg"; // make sure to have images in assets
import shogranImg from "../../assets/skardu.jpg";
import azadKashmirImg from "../../assets/Swat-Kalam-Lake.jpg";

const handleCityClick = (city) => {
    alert(`You clicked on ${city.name}. Show details here.`);
};

const Homepage = () => {
    const northernCities = [
        { name: "Hunza Valley", img: hunzaImg, description: "Famous for breathtaking views and Karimabad fort." },
        { name: "Naran Kaghan", img: naranImg, description: "Beautiful valleys with lakes and mountains." },
        { name: "Murree", img: murreeImg, description: "Popular hill station with colonial charm." },
        { name: "Swat", img: swatImg, description: "The Switzerland of Pakistan, with rivers and mountains." },
        { name: "Shogran", img: shogranImg, description: "A scenic plateau surrounded by lush hills." },
        { name: "Azad Kashmir", img: azadKashmirImg, description: "Home to Neelum Valley and breathtaking landscapes." },
        { name: "Skardu", img: hunzaImg, description: "Gateway to the Karakoram Range and majestic peaks." },
        { name: "Fairy Meadows", img: naranImg, description: "Iconic camping site with a view of Nanga Parbat." },
        { name: "Galiyat", img: murreeImg, description: "Cluster of hill stations with pine forests and resorts." },
        { name: "Bagrot Valley", img: shogranImg, description: "Less explored valley with stunning scenery." },
       { name: "Kalash Valley", img: hunzaImg, description: "Unique culture and colorful festivals of the Kalash people." },
        { name: "Chitral", img: naranImg, description: "Home of the majestic Trich Mir mountain and traditional heritage." },
        { name: "Ratti Gali Lake", img: shogranImg, description: "High-altitude alpine lake with pristine surroundings." },
        { name: "Deosai Plains", img: murreeImg, description: "The Land of Giants, famous for wildlife and flat landscapes." },
        { name: "Hutubi Lake", img: hunzaImg, description: "Scenic lake surrounded by mountains and nature trails." },
        { name: "Mahodand Lake", img: naranImg, description: "Popular for boating and surrounded by dense pine forests." },
        { name: "Borith Lake", img: shogranImg, description: "Serene lake near Hunza, perfect for photography." },
        { name: "Rama Lake", img: murreeImg, description: "Beautiful lake in Skardu region surrounded by meadows." },
        { name: "Passu Cones", img: hunzaImg, description: "Famous mountain peaks in northern Hunza Valley." },
        { name: "Naltar Valley", img: naranImg, description: "Known for ski resort and vibrant natural beauty." },
      
    ];

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
                    />
                    <button className="search-btn">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* ================= CITY DETAIL CARDS ================= */}
            <div className="top-searched-section">
                <h2 className="top-title">Northern Pakistan Cities</h2>
                <p className="top-subtitle">
                    Click on any city to explore detailed information, attractions, and tours.
                </p>

                <div className="top-cards enhanced-cards">
                    {northernCities.map((city, index) => (
                        <div
                            className="city-card"
                            key={index}
                            onClick={() => handleCityClick(city)}
                        >
                            <div
                                className="city-card-img"
                                style={{ backgroundImage: `url(${city.img})` }}
                            >
                                <div className="city-card-overlay">
                                    <h3>{city.name}</h3>
                                </div>
                            </div>
                            <div className="city-card-content">
                                <p>{city.description}</p>
                                <button onClick={() => handleCityClick(city)} className="explore-btn">
                                    Explore <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
