import React, { useState, useRef, useEffect } from "react";
import "./AdminDashboard.css";
import {
  FaBars,
  FaBox,
  FaUser,
  FaCog,
  FaCity,
  FaBullhorn,
  FaTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import ManagePackages from "./ManagePackages";
import ManageUsers from "./ManageUsers";
import DashboardAnalytics from "../../components/admin/DashboardAnalytics";
import AddCity from "./AddCity";
import AdminSettings from "./AdminSettings";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const messagesEndRef = useRef(null);

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setSidebarOpen(false);
  };

  const handleSendAnnouncement = () => {
    if (announcementText.trim() !== "") {
      setAnnouncements((prev) => [
        ...prev,
        { text: announcementText, time: new Date() },
      ]);
      setAnnouncementText("");
    }
  };

  const handleDeleteAnnouncement = (index) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditAnnouncement = (index) => {
    const newText = prompt(
      "Edit announcement:",
      announcements[index].text
    );
    if (newText !== null && newText.trim() !== "") {
      setAnnouncements((prev) =>
        prev.map((a, i) => (i === index ? { ...a, text: newText } : a))
      );
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [announcements]);

  const renderContent = () => {
    switch (selectedOption) {
      case "dashboard":
        return <DashboardAnalytics />;
      case "packages":
        return <ManagePackages />;
      case "users":
        return <ManageUsers />;
      case "settings":
        return <AdminSettings/>;
      case "add-city":
        return <AddCity />;
      default:
        return <DashboardAnalytics />;
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <header className="admin-navbar">
        <div className="navbar-left">
          <FaBars
            className="menu-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1>Admin Panel</h1>
        </div>

        <div className="navbar-right">
          <FaBullhorn
            className="announcement-icon"
            onClick={() => setAnnouncementOpen(true)}
          />
          <button
            className="logout-btn"
            onClick={() => (window.location.href = "/admin/login")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <ul>
          <li
            className={selectedOption === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            <span className="sidebar-text">Dashboard</span>
          </li>
          <li
            className={selectedOption === "packages" ? "active" : ""}
            onClick={() => handleMenuClick("packages")}
          >
            <FaBox className="sidebar-icon" />
            <span className="sidebar-text">Manage Packages</span>
          </li>
          <li
            className={selectedOption === "users" ? "active" : ""}
            onClick={() => handleMenuClick("users")}
          >
            <FaUser className="sidebar-icon" />
            <span className="sidebar-text">Manage Users</span>
          </li>
          <li
            className={selectedOption === "add-city" ? "active" : ""}
            onClick={() => handleMenuClick("add-city")}
          >
            <FaCity className="sidebar-icon" />
            <span className="sidebar-text">Add City</span>
          </li>
          <li
            className={selectedOption === "settings" ? "active" : ""}
            onClick={() => handleMenuClick("settings")}
          >
            <FaCog className="sidebar-icon" />
            <span className="sidebar-text">Settings</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {renderContent()}
      </main>

      {/* Announcement Panel */}
      <div className={`announcement-slider ${announcementOpen ? "open" : ""}`}>
        <div className="announcement-header">
          <h3>Announcements</h3>
          <FaTimes
            className="close-icon"
            onClick={() => setAnnouncementOpen(false)}
          />
        </div>

        <div className="announcement-body">
          <div className="announcement-messages">
            {announcements.map((a, i) => (
              <div key={i} className="announcement-message admin-bubble">
                <span>{a.text}</span>
                <div className="announcement-footer">
                  <small>
                    {a.time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                  <div className="announcement-icons">
                    <FaEdit
                      className="edit-icon"
                      onClick={() => handleEditAnnouncement(i)}
                    />
                    <FaTrash
                      className="delete-icon"
                      onClick={() => handleDeleteAnnouncement(i)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="announcement-input">
            <input
              type="text"
              placeholder="Type announcement..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendAnnouncement()
              }
            />
            <button onClick={handleSendAnnouncement}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;