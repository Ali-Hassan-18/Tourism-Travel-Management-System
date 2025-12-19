import React, { useState } from "react";
import "./Dashboard.css";

// Import your page components
import PlanTrip from "./PlanTrip";
import Homepage from "./Homepage";
import EconomicalPackages from "./EconomicalPackages";
import PremiumPackages from "./PremiumPackages";
import DiscountPackages from "./DiscountPackages";
import MyBookings from "./MyBookings"; 

import {
  FaHome,
  FaTags,
  FaPlane,
  FaStar,
  FaMapMarkedAlt,
  FaRobot,
  FaBars,
  FaBell,
  FaSuitcase 
} from "react-icons/fa";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("homepage");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announceOpen, setAnnounceOpen] = useState(false);

  // TEMP ANNOUNCEMENTS
  const announcements = [
    { id: 1, title: "Winter Discount!", message: "Get 20% off on all trips." },
    { id: 2, title: "Weather Update", message: "Light rain expected tomorrow." },
    { id: 3, title: "New City Added!", message: "Hunza packages are now live." }
  ];

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.location.href = "/";
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "homepage": return <Homepage />;
      case "special": return <DiscountPackages />;
      case "economical": return <EconomicalPackages />;
      case "premium": return <PremiumPackages />;
      case "plan": return <PlanTrip />;
      case "bookings": return <MyBookings />;
      case "chatbot": return <h2>Chatbot Assistance coming soon...</h2>;
      default: return <h2>Select an option from the sidebar</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Navbar */}
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1>Tourista</h1>
        </div>

        <div className="navbar-right">
          <div className="bell-wrapper" onClick={() => setAnnounceOpen(!announceOpen)}>
            <FaBell className="announcement-bell" />
            <span className="bell-dot">3</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        
        {(sidebarOpen || announceOpen) && (
          <div className="overlay" onClick={() => { setSidebarOpen(false); setAnnounceOpen(false); }}></div>
        )}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li className={selectedOption === "homepage" ? "active" : ""} onClick={() => handleMenuClick("homepage")}>
              <FaHome className="sidebar-icon" />
              <span className="sidebar-text">Homepage</span>
            </li>

            <li className={selectedOption === "special" ? "active" : ""} onClick={() => handleMenuClick("special")}>
              <FaTags className="sidebar-icon" />
              <span className="sidebar-text">Special Deals</span>
            </li>

            <li className={selectedOption === "economical" ? "active" : ""} onClick={() => handleMenuClick("economical")}>
              <FaPlane className="sidebar-icon" />
              <span className="sidebar-text">Economical</span>
            </li>

            <li className={selectedOption === "premium" ? "active" : ""} onClick={() => handleMenuClick("premium")}>
              <FaStar className="sidebar-icon" />
              <span className="sidebar-text">Premium</span>
            </li>

            <li className={selectedOption === "plan" ? "active" : ""} onClick={() => handleMenuClick("plan")}>
              <FaMapMarkedAlt className="sidebar-icon" />
              <span className="sidebar-text">Plan Your Trip</span>
            </li>

            <li className={selectedOption === "chatbot" ? "active" : ""} onClick={() => handleMenuClick("chatbot")}>
              <FaRobot className="sidebar-icon" />
              <span className="sidebar-text">Chatbot</span>
            </li>

            {/* 🛑 MOVED TO BOTTOM */}
            <li className={selectedOption === "bookings" ? "active" : ""} onClick={() => handleMenuClick("bookings")}>
              <FaSuitcase className="sidebar-icon" />
              <span className="sidebar-text">My Bookings</span>
            </li>

          </ul>
        </aside>

        <aside className={`announcement-panel ${announceOpen ? "open" : ""}`}>
          <h2>Announcements</h2>
          {announcements.map((a) => (
            <div key={a.id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.message}</p>
            </div>
          ))}
        </aside>

        <main className={`dashboard-main ${announceOpen ? "panel-open" : ""}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;