import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { FaSuitcase } from "react-icons/fa";

// Import your page components
import PlanTrip from "./PlanTrip";
import Homepage from "./Homepage";
import EconomicalPackages from "./EconomicalPackages";
import PremiumPackages from "./PremiumPackages";
import DiscountPackages from "./DiscountPackages";
import Testimonials from "./Testimonials";
import MyBookings from "./MyBookings"; 

import {
  FaHome,
  FaTags,
  FaPlane,
  FaStar,
  FaMapMarkedAlt,
  FaBars,
  FaBell,
  FaRobot,
  FaPaperPlane,
  FaUser
} from "react-icons/fa";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("homepage");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announceOpen, setAnnounceOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  // FIXED: Added announcements state
  const [announcements, setAnnouncements] = useState([]); 
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [lastViewedCount, setLastViewedCount] = useState(0);

  // BRANDED LOGOUT STATE
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const triggerLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    // Clear session and redirect
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // FIXED: Polling logic to sync with C++ LIFO Stack
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:18080/api/announcements");
        const data = await res.json();
        
        // Update state with the latest stack from C++
        setAnnouncements(data.map(a => ({ 
          id: a.id, 
          message: a.message, 
          time: a.time 
        })));

        // Check if new announcements arrived to trigger red dot
        if (data.length > lastViewedCount) {
            setHasNewNotifications(true);
        }
      } catch (err) {
        console.error("Fetch failed");
      }
    };

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 5000);
    return () => clearInterval(interval);
  }, [lastViewedCount]);

  const handleAnnounceToggle = () => {
    const isOpening = !announceOpen;
    setAnnounceOpen(isOpening);
    setChatbotOpen(false);
    
    if (isOpening) {
      setHasNewNotifications(false);
      setLastViewedCount(announcements.length);
    }
  };

  /* ================= CHATBOT STATE ================= */
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm Tourista Assistant. How can I help you?" }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatbotOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, chatbotOpen]);

  const handleMenuClick = (option) => {
    setSelectedOption(option);
    setSidebarOpen(false);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:18080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error("Backend Offline");

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { sender: "bot", text: "I'm having trouble connecting to the AI engine." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "homepage": return <Homepage />;
      case "special": return <DiscountPackages onNavigate={setSelectedOption} />;
      case "economical": return <EconomicalPackages onNavigate={setSelectedOption} />;
      case "premium": return <PremiumPackages onNavigate={setSelectedOption} />;
      case "plan": return <PlanTrip onNavigate={setSelectedOption} />;
      case "bookings": return <MyBookings />;
      case "feedback": return <Testimonials />;
      default: return <h2>Select an option from the sidebar</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1>Tourista</h1>
        </div>

        <div className="navbar-right">
          <div 
            className={`bell-wrapper ${chatbotOpen ? "active-nav" : ""}`} 
            onClick={() => { setChatbotOpen(!chatbotOpen); setAnnounceOpen(false); }}
          >
            <FaRobot className="announcement-bell" />
          </div>

          <div 
            className={`bell-wrapper ${announceOpen ? "active-nav" : ""}`} 
            onClick={handleAnnounceToggle}
          >
            <FaBell className="announcement-bell" />
            {hasNewNotifications && announcements.length > 0 && (
                <span className="bell-dot">{announcements.length}</span>
            )}
          </div>

          {/* UPDATED: Now triggers the custom modal */}
          <button className="logout-btn" onClick={triggerLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        {(sidebarOpen || announceOpen || chatbotOpen) && (
          <div className="overlay" onClick={() => { 
            setSidebarOpen(false); 
            setAnnounceOpen(false); 
            setChatbotOpen(false); 
          }}></div>
        )}

        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
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
            <li className={selectedOption === "bookings" ? "active" : ""} onClick={() => handleMenuClick("bookings")}>
              <FaSuitcase className="sidebar-icon" />
              <span className="sidebar-text">My Bookings</span>
            </li>
            <li className={selectedOption === "feedback" ? "active" : ""} onClick={() => handleMenuClick("feedback")}>
              <FaStar className="sidebar-icon" />
              <span className="sidebar-text">Feedback</span>
            </li>
          </ul>
        </aside>

        <aside className={`announcement-panel ${announceOpen ? "open" : ""}`}>
          <h2>Announcements</h2>
          {announcements.length === 0 ? (
            <p className="no-announce">No recent updates.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <p>{a.message}</p>
                <small>{a.time}</small>
              </div>
            ))
          )}
        </aside>

        <aside className={`announcement-panel chatbot-panel ${chatbotOpen ? "open" : ""}`}>
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-profile-icon"><FaRobot /></div>
              <div className="header-text">
                <h2>Tourista AI</h2>
                <span className="status-indicator">Online</span>
              </div>
            </div>
          </div>
          <div className="chat-messages-container">
            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                {m.sender === "bot" && <div className="message-avatar bot-avatar"><FaRobot /></div>}
                <div className={`chat-bubble ${m.sender}`}>{m.text}</div>
                {m.sender === "user" && <div className="message-avatar user-avatar"><FaUser /></div>}
              </div>
            ))}
            {isTyping && (
              <div className="message-row bot-row">
                <div className="message-avatar bot-avatar"><FaRobot /></div>
                <div className="chat-bubble bot typing">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-footer">
            <div className="input-pill-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="chat-send-btn" onClick={sendMessage}><FaPaperPlane /></button>
            </div>
          </div>
        </aside>

        <main className={`dashboard-main ${announceOpen || chatbotOpen ? "panel-open" : ""}`}>
          {renderContent()}
        </main>
      </div>

      {/* BRANDED LOGOUT MODAL */}
      {showLogoutModal && (
          <div className="logout-overlay">
              <div className="logout-modal">
                  <div className="logout-icon-box">
                      <FaUser />
                  </div>
                  <h2>Sign Out?</h2>
                  <p>Are you sure you want to end your session at Tourista?</p>
                  <div className="logout-actions">
                      <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                          Stay Logged In
                      </button>
                      <button className="btn-confirm-logout" onClick={confirmLogout}>
                          Yes, Logout
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;