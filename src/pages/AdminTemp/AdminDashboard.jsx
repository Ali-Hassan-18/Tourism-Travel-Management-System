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
  FaHome,
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
    if (!announcementText.trim()) return;
    setAnnouncements((prev) => [
      ...prev,
      { text: announcementText, time: new Date() },
    ]);
    setAnnouncementText("");
  };

  const handleDeleteAnnouncement = (index) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditAnnouncement = (index) => {
    const updated = prompt("Edit announcement", announcements[index].text);
    if (updated?.trim()) {
      setAnnouncements((prev) =>
        prev.map((a, i) => (i === index ? { ...a, text: updated } : a))
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [announcements]);

  const renderContent = () => {
    switch (selectedOption) {
      case "dashboard":
        return <DashboardAnalytics />;
      case "packages":
        return <ManagePackages />;
      case "users":
        return <ManageUsers />;
      case "add-city":
        return <AddCity />;
      case "settings":
        return <AdminSettings />;
      default:
        return <DashboardAnalytics />;
    }
  };

  return (
    <div className="admin-container">
      {/* NAVBAR */}
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
            onClick={() => (window.location.href = "/pages/LandingPage.jsx")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li
            className={selectedOption === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            <FaHome /> Dashboard
          </li>

          <li
            className={selectedOption === "packages" ? "active" : ""}
            onClick={() => handleMenuClick("packages")}
          >
            <FaBox /> Manage Packages
          </li>

          <li
            className={selectedOption === "users" ? "active" : ""}
            onClick={() => handleMenuClick("users")}
          >
            <FaUser /> Manage Users
          </li>

          <li
            className={selectedOption === "add-city" ? "active" : ""}
            onClick={() => handleMenuClick("add-city")}
          >
            <FaCity /> Add City
          </li>

          <li
            className={selectedOption === "settings" ? "active" : ""}
            onClick={() => handleMenuClick("settings")}
          >
            <FaCog /> Settings
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {renderContent()}
      </main>

      {/* ANNOUNCEMENTS */}
      <div className={`announcement-slider ${announcementOpen ? "open" : ""}`}>
        <div className="announcement-header">
          <h3>Announcements</h3>
          <FaTimes onClick={() => setAnnouncementOpen(false)} />
        </div>

        <div className="announcement-body">
          {announcements.map((msg, i) => (
            <div key={i} className="announcement-message">
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span>
                  {msg.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="announcement-actions">
                <button onClick={() => handleEditAnnouncement(i)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteAnnouncement(i)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="announcement-input">
          <input
            placeholder="Type announcement..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendAnnouncement()}
          />
          <button onClick={handleSendAnnouncement}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;