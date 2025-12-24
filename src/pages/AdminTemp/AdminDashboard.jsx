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

  // --- API LOGIC: FETCH ALL ANNOUNCEMENTS ---
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:18080/api/announcements");
      const data = await res.json();
      setAnnouncements(data.map(a => ({ 
        id: a.id, 
        text: a.message, 
        time: a.time 
      })));
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // --- API LOGIC: PUSH TO STACK ---
  const handleSendAnnouncement = async () => {
    if (announcementText.trim() === "") return;

    try {
      const res = await fetch("http://localhost:18080/api/admin/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: announcementText }),
      });

      if (res.ok) {
        setAnnouncementText("");
        fetchAnnouncements();
      }
    } catch (err) {
      alert("Error sending announcement to backend.");
    }
  };

  // --- API LOGIC: DELETE FROM STACK ---
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      const res = await fetch(`http://localhost:18080/api/admin/announce/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // --- API LOGIC: EDIT STACK NODE ---
  const handleEditAnnouncement = async (id, currentText) => {
    const newText = prompt("Edit announcement:", currentText);
    if (!newText || newText.trim() === "" || newText === currentText) return;

    try {
      const res = await fetch(`http://localhost:18080/api/admin/announce/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newText }),
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [announcements]);

  const renderContent = () => {
    switch (selectedOption) {
      case "dashboard": return <DashboardAnalytics />;
      case "packages": return <ManagePackages />;
      case "users": return <ManageUsers />;
      case "settings": return <AdminSettings />;
      case "add-city": return <AddCity />;
      default: return <DashboardAnalytics />;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1>Admin Panel</h1>
        </div>
        <div className="navbar-right">
          <FaBullhorn className="announcement-icon" onClick={() => setAnnouncementOpen(true)} />
          <button className="logout-btn" onClick={() => (window.location.href = "/admin/login")}>Logout</button>
        </div>
      </header>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <ul>
          <li className={selectedOption === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>
             <span className="sidebar-text">Dashboard</span>
          </li>
          <li className={selectedOption === "packages" ? "active" : ""} onClick={() => handleMenuClick("packages")}>
            <FaBox className="sidebar-icon" /><span className="sidebar-text">Manage Packages</span>
          </li>
          <li className={selectedOption === "users" ? "active" : ""} onClick={() => handleMenuClick("users")}>
            <FaUser className="sidebar-icon" /><span className="sidebar-text">Manage Users</span>
          </li>
          <li className={selectedOption === "add-city" ? "active" : ""} onClick={() => handleMenuClick("add-city")}>
            <FaCity className="sidebar-icon" /><span className="sidebar-text">Add City</span>
          </li>
          <li className={selectedOption === "settings" ? "active" : ""} onClick={() => handleMenuClick("settings")}>
            <FaCog className="sidebar-icon" /><span className="sidebar-text">Settings</span>
          </li>
        </ul>
      </aside>

      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {renderContent()}
      </main>

      <div className={`announcement-slider ${announcementOpen ? "open" : ""}`}>
        <div className="announcement-header">
          <h3>Broadcast Center</h3>
          <FaTimes className="close-icon" onClick={() => setAnnouncementOpen(false)} />
        </div>

        <div className="announcement-body">
          <div className="announcement-messages">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-message admin-bubble">
                <span className="announcement-text">{a.text}</span>
                <div className="announcement-footer">
                  <small>{a.time}</small>
                  <div className="announcement-icons">
                    <FaEdit className="edit-icon" onClick={() => handleEditAnnouncement(a.id, a.text)} title="Edit" />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteAnnouncement(a.id)} title="Delete" />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="announcement-input">
            <input
              type="text"
              placeholder="Post new update..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAnnouncement()}
            />
            <button onClick={handleSendAnnouncement}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;