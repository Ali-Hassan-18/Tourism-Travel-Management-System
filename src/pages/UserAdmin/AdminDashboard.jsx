import React, { useState } from "react";
import "../AdminTemp/AdminDashboard.css"; 
import AdminHomepage from "./AdminHomepage"; 
import "../AdminTemp/AdminDiscountPackages"

import {
  FaHome,
  FaTags,
  FaPlane,
  FaStar,
  FaMapMarkedAlt,
  FaBullhorn, // Icon for Announcements
  FaBars
} from "react-icons/fa";
import AdminDiscountPackages from "../AdminTemp/AdminDiscountPackages";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("homepage");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      case "homepage":
        // 🛑 Admin Homepage Placeholder
        return <AdminHomepage />; 
      case "special":
        return <AdminDiscountPackages/>;
      case "economical":
        return <h2>Admin: Manage Economical Packages here.</h2>;
      case "premium":
        return <h2>Admin: Manage Premium Packages here.</h2>;
      case "plan":
        return <h2>Admin: View User Trip Plans here.</h2>;
      case "announcements":
        // 🛑 New Announcements Management View
        return <h2>Admin: Create and manage system announcements here.</h2>;
      default:
        return <h2>Admin: Select an option from the sidebar</h2>;
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
          <h1>Tourista - Admin</h1> {/* 🛑 Changed Title for Admin */}
        </div>

    
        <div className="navbar-right">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </header>

      <div className="dashboard-body">

        {/* Overlay when sidebar is open */}
        {sidebarOpen && (
          <div
            className="overlay"
            onClick={() => {
              setSidebarOpen(false);
            }}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li className={selectedOption === "homepage" ? "active" : ""} onClick={() => handleMenuClick("homepage")}>
              <FaHome className="sidebar-icon" />
              <span className="sidebar-text">Admin Home</span>
            </li>

            <li className={selectedOption === "special" ? "active" : ""} onClick={() => handleMenuClick("special")}>
              <FaTags className="sidebar-icon" />
              <span className="sidebar-text">Manage Special</span>
            </li>

            <li className={selectedOption === "economical" ? "active" : ""} onClick={() => handleMenuClick("economical")}>
              <FaPlane className="sidebar-icon" />
              <span className="sidebar-text">Manage Economical</span>
            </li>

            <li className={selectedOption === "premium" ? "active" : ""} onClick={() => handleMenuClick("premium")}>
              <FaStar className="sidebar-icon" />
              <span className="sidebar-text">Manage Premium</span>
            </li>

            <li className={selectedOption === "plan" ? "active" : ""} onClick={() => handleMenuClick("plan")}>
              <FaMapMarkedAlt className="sidebar-icon" />
              <span className="sidebar-text">View User Plans</span>
            </li>

            {/* 🛑 NEW ADMIN OPTION: Announcements */}
            <li className={selectedOption === "announcements" ? "active" : ""} onClick={() => handleMenuClick("announcements")}>
              <FaBullhorn className="sidebar-icon" />
              <span className="sidebar-text">Announcements</span>
            </li>
          </ul>
        </aside>

    

        {/* Main Content */}
       <main className="dashboard-main"> {/* No panel-open class needed */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;