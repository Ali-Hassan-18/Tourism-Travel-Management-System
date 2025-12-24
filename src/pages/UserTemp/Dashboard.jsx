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

  /* ================= ANNOUNCEMENT & NOTIFICATION LOGIC ================= */
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Winter Discount!", message: "Get 20% off on all trips." },
    { id: 2, title: "Weather Update", message: "Light rain expected tomorrow." },
    { id: 3, title: "New City Added!", message: "Hunza packages are now live." }
  ]);
  
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [lastViewedCount, setLastViewedCount] = useState(0);

  // Re-show red dot if the number of announcements increases
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
    } catch (err) {
      console.error("Fetch failed");
    }
  };

  // 1. Initial fetch
  fetchAnnouncements();

  // 2. Set up Polling (Check every 5 seconds)
  const interval = setInterval(fetchAnnouncements, 5000);

  // 3. Cleanup to prevent memory leaks
  return () => clearInterval(interval);
}, []);

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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.location.href = "/";
    }
  };

  const sendMessage = async () => {
  if (!chatInput.trim()) return;

  // 1. Add the user's message to the chat UI immediately
  const userMessage = { sender: "user", text: chatInput };
  setMessages((prev) => [...prev, userMessage]);
  setChatInput("");
  setIsTyping(true); // Show the "..." typing indicator

  try {
    // 2. Call your C++ Backend Chat API
    const response = await fetch("http://localhost:18080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    });

    if (!response.ok) throw new Error("Backend Offline");

    const data = await response.json();
    
    // 3. Add the AI's real response to the chat
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  } catch (error) {
    // Fallback error message if the C++ server or Ollama is down
    setMessages((prev) => [
      ...prev, 
      { sender: "bot", text: "I'm having trouble connecting to the AI engine. Please ensure the C++ backend and Ollama are running." }
    ]);
  } finally {
    setIsTyping(false); // Hide the typing indicator
  }
};

  const renderContent = () => {
    switch (selectedOption) {
      case "homepage":
        return <Homepage />;
      case "special":
        return <DiscountPackages />;
      case "economical":
        return <EconomicalPackages />;
      case "premium":
        return <PremiumPackages />;
      case "plan":
        return <PlanTrip />;
      case "bookings":
        return <MyBookings />;
      case "chatbot":
        return <h2>Chatbot Assistance coming soon...</h2>;
      case "feedback":
        return <Testimonials />;
      default:
        return <h2>Select an option from the sidebar</h2>;
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
            onClick={handleAnnounceToggle}
          >
            <FaBell className="announcement-bell" />
            {hasNewNotifications && (
              <span className="bell-dot">
                {announcements.length - lastViewedCount > 0 ? announcements.length - lastViewedCount : "!"}
              </span>
            )}
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

        {/* CHATBOT PANEL */}
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
    </div>
  );
};

export default Dashboard;