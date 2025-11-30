import React, { useState } from "react";
import "./Dashboard.css";
import PlanTrip from "./PlanTrip";

import { FaHome, FaPlane, FaStar, FaCloudSun, FaRobot, FaMapMarkedAlt, FaBars } from "react-icons/fa";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("homepage");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setSidebarOpen(false); // auto-close sidebar
  };

 const renderContent = () => {
  switch (selectedOption) {
    case "homepage":
      return <h2>Welcome to Tourista!</h2>;
    case "economical":
      return <h2>Economical Packages will be displayed here.</h2>;
    case "premium":
      return <h2>Premium Packages will be displayed here.</h2>;
    case "plan":
      return <PlanTrip />; // render the step-based planner
    case "weather":
      return <h2>Weather Update coming soon...</h2>;
    case "chatbot":
      return <h2>Chatbot Assistance coming soon...</h2>;
    default:
      return <h2>Select an option from the sidebar</h2>;
  }
};

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <FaBars
            className="menu-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1>Tourista</h1>
        </div>
        <button
          className="logout-btn"
          onClick={() => (window.location.href = "/")}
        >
          Logout
        </button>
      </header>

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        {/* Overlay */}
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li
              className={selectedOption === "homepage" ? "active" : ""}
              onClick={() => handleMenuClick("homepage")}
            >
              <FaHome className="sidebar-icon" />
              <span className="sidebar-text">Homepage</span>
            </li>
            <li
              className={selectedOption === "economical" ? "active" : ""}
              onClick={() => handleMenuClick("economical")}
            >
              <FaPlane className="sidebar-icon" />
              <span className="sidebar-text">Economical</span>
            </li>
            <li
              className={selectedOption === "premium" ? "active" : ""}
              onClick={() => handleMenuClick("premium")}
            >
              <FaStar className="sidebar-icon" />
              <span className="sidebar-text">Premium</span>
            </li>
            <li
              className={selectedOption === "plan" ? "active" : ""}
              onClick={() => handleMenuClick("plan")}
            >
              <FaMapMarkedAlt className="sidebar-icon" />
              <span className="sidebar-text">Plan Trip</span>
            </li>
            <li
              className={selectedOption === "weather" ? "active" : ""}
              onClick={() => handleMenuClick("weather")}
            >
              <FaCloudSun className="sidebar-icon" />
              <span className="sidebar-text">Weather</span>
            </li>
            <li
              className={selectedOption === "chatbot" ? "active" : ""}
              onClick={() => handleMenuClick("chatbot")}
            >
              <FaRobot className="sidebar-icon" />
              <span className="sidebar-text">Chatbot</span>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className={`dashboard-main ${sidebarOpen ? "sidebar-open" : ""}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
