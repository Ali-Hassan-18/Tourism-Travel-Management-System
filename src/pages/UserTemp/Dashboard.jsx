import React, { useState, useEffect, useRef } from "react";
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

  /* ================= CHATBOT STATE ================= */
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm Tourista Assistant. How can I help you?" }
  ]);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatbotOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, chatbotOpen]);

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

  /* ================= SIMPLE BOT LOGIC ================= */
  const botReply = (text) => {
    const msg = text.toLowerCase();
    if (msg.includes("hunza")) return "Hunza Valley is famous for Karimabad, Passu Cones, and Attabad Lake.";
    if (msg.includes("naran")) return "Naran Kaghan is best visited between May and September.";
    if (msg.includes("discount")) return "Currently, a 20% winter discount is available 🎉";
    if (msg.includes("weather")) return "Weather varies by region. Northern areas are cold in winter.";
    if (msg.includes("package")) return "You can explore economical and premium packages from the sidebar.";
    return "I'm still learning 🤖 Please ask about cities, packages, or weather.";
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const response = botReply(userMessage.text);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "homepage": return <Homepage />;
      case "special": return <h2>Special Deals will be displayed here.</h2>;
      case "economical": return <EconomicalPackages />;
      case "premium": return <h2>Premium Packages will be displayed here.</h2>;
      case "plan": return <PlanTrip />;
      default: return <Homepage />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
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
            onClick={() => { setAnnounceOpen(!announceOpen); setChatbotOpen(false); }}
          >
            <FaBell className="announcement-bell" />
            <span className="bell-dot">3</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
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

        {/* SIDEBAR */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul>
            <li className={selectedOption === "homepage" ? "active" : ""} onClick={() => handleMenuClick("homepage")}>
              <FaHome className="sidebar-icon" /> Homepage
            </li>
            <li className={selectedOption === "special" ? "active" : ""} onClick={() => handleMenuClick("special")}>
              <FaTags className="sidebar-icon" /> Special Deals
            </li>
            <li className={selectedOption === "economical" ? "active" : ""} onClick={() => handleMenuClick("economical")}>
              <FaPlane className="sidebar-icon" /> Economical
            </li>
            <li className={selectedOption === "premium" ? "active" : ""} onClick={() => handleMenuClick("premium")}>
              <FaStar className="sidebar-icon" /> Premium
            </li>
            <li className={selectedOption === "plan" ? "active" : ""} onClick={() => handleMenuClick("plan")}>
              <FaMapMarkedAlt className="sidebar-icon" /> Plan Your Trip
            </li>

            {/* 🛑 MOVED TO BOTTOM */}
            <li className={selectedOption === "bookings" ? "active" : ""} onClick={() => handleMenuClick("bookings")}>
              <FaSuitcase className="sidebar-icon" />
              <span className="sidebar-text">My Bookings</span>
            </li>

          </ul>
        </aside>

        {/* ANNOUNCEMENT PANEL */}
        <aside className={`announcement-panel ${announceOpen ? "open" : ""}`}>
          <h2>Announcements</h2>
          {announcements.map((a) => (
            <div key={a.id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.message}</p>
            </div>
          ))}
        </aside>

        {/* ENHANCED CHATBOT PANEL (Matches uploaded image) */}
        <aside className={`announcement-panel chatbot-panel ${chatbotOpen ? "open" : ""}`}>
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-profile-icon">
                <FaRobot />
              </div>
              <div className="header-text">
                <h2>Tourista AI</h2>
                <span className="status-indicator">Online</span>
              </div>
            </div>
          </div>

          <div className="chat-messages-container">
            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                {m.sender === "bot" && (
                  <div className="message-avatar bot-avatar">
                    <FaRobot />
                  </div>
                )}
                <div className={`chat-bubble ${m.sender}`}>
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div className="message-avatar user-avatar">
                    <FaUser />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message-row bot-row">
                <div className="message-avatar bot-avatar">
                  <FaRobot />
                </div>
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
              <button className="chat-send-btn" onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </aside>

        <main className={`dashboard-main ${announceOpen || chatbotOpen ? "panel-open" : ""}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;