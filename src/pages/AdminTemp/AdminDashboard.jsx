import React, { useState, useRef, useEffect } from "react";
import "./AdminDashboard.css";
import {
  FaBars, FaBox, FaUser, FaCog, FaCity, FaBullhorn, FaTimes, FaEdit, FaTrash, 
  FaMapMarkerAlt, FaDollarSign, FaSuitcase, FaUsers, FaMap, FaSyncAlt, FaThLarge
} from "react-icons/fa";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

import ManagePackages from "./ManagePackages";
import ManageUsers from "./ManageUsers";
import AddCity from "./AddCity";
import AdminSettings from "./AdminSettings";
import TripReview from "./TripReview";

// --- FIX: MODAL OUTSIDE TO PREVENT FOCUS LOSS ---
const CustomAlertModal = ({ isOpen, config, inputValue, setInputValue, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-card">
        <div className="modal-header-teal">
          <h3>{config.title}</h3>
          <FaTimes className="close-modal-icon" onClick={onClose} />
        </div>
        <div className="modal-body-content">
          <p className="modal-desc-text">{config.text}</p>
          {config.type === 'edit' && (
            <textarea 
              className="modal-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter message..."
              autoFocus
            />
          )}
        </div>
        <div className="modal-footer-btns">
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button 
            className={`modal-btn confirm ${config.type === 'delete' ? 'danger' : ''}`} 
            onClick={onConfirm}
          >
            {config.type === 'delete' ? 'Delete' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', id: null, text: '', title: '' });
  const [modalInput, setModalInput] = useState("");

  const [stats, setStats] = useState({ revenue: 0, bookings: 0, users: 0, packages: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const bookRes = await fetch("http://localhost:18080/api/admin/all-bookings");
      const bookData = await bookRes.json();
      const confirmedBookings = bookData.filter(b => b.status.toLowerCase() === "confirmed");
      
      const totalRev = confirmedBookings.reduce((sum, b) => sum + b.bill, 0);
      const userRes = await fetch("http://localhost:18080/api/admin/users");
      const userData = await userRes.json();
      const packRes = await fetch("http://localhost:18080/api/packages");
      const packData = await packRes.json();

      setStats({ revenue: totalRev, bookings: bookData.length, users: userData.length, packages: packData.length });

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenue = months.map(m => ({ name: m, revenue: 0 }));
      confirmedBookings.forEach(b => {
        if (b.start_date) {
            const mIdx = parseInt(b.start_date.split('-')[1]) - 1;
            if (mIdx >= 0 && mIdx < 12) monthlyRevenue[mIdx].revenue += b.bill;
        }
      });
      setLineChartData(monthlyRevenue);

      const cats = {};
      bookData.forEach(b => cats[b.cat || "Standard"] = (cats[b.cat || "Standard"] || 0) + 1);
      setBarChartData(Object.keys(cats).map(k => ({ name: k, v: cats[k] })));

      const ints = {};
      bookData.forEach(b => b.interests?.split(',').forEach(i => ints[i.trim()] = (ints[i.trim()] || 0) + 1));
      setPieChartData(Object.keys(ints).map(k => ({ name: k, value: ints[k] })));

      setRecentBookings(bookData.slice().reverse().slice(0, 5));
    } catch (e) { console.error("Sync Error", e); }
    finally { setTimeout(() => setIsRefreshing(false), 500); }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:18080/api/announcements");
      const data = await res.json();
      setAnnouncements(data.map(a => ({ id: a.id, text: a.message, time: a.time })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAnnouncements();
  }, [selectedOption]);

  const openDeleteModal = (id) => {
    setModalConfig({ type: 'delete', id, title: 'Delete Message', text: 'Are you sure you want to delete this announcement?' });
    setModalOpen(true);
  };

  const openEditModal = (id, currentText) => {
    setModalInput(currentText);
    setModalConfig({ type: 'edit', id, title: 'Edit Message', text: 'Update your announcement text:' });
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (modalConfig.type === 'delete') {
      await fetch(`http://localhost:18080/api/admin/announce/delete/${modalConfig.id}`, { method: "DELETE" });
    } else {
      await fetch(`http://localhost:18080/api/admin/announce/edit/${modalConfig.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: modalInput }),
      });
    }
    fetchAnnouncements();
    setModalOpen(false);
  };

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) return;
    await fetch("http://localhost:18080/api/admin/announce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: announcementText }),
    });
    setAnnouncementText("");
    fetchAnnouncements();
  };

  const renderDashboard = () => (
    <div className="dashboard-view">
      <div className="dashboard-header-text">
        <div className="title-row-refresh">
            <h2 className="dashboard-title">Dashboard</h2>
            <button className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`} onClick={fetchDashboardData}><FaSyncAlt /></button>
        </div>
        <p className="dashboard-subtitle">Admin / Overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-bg"><FaDollarSign /></div>
          <div className="stat-info"><p>Total Revenue</p><h3>${stats.revenue.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg"><FaSuitcase /></div>
          <div className="stat-info"><p>Bookings</p><h3>{stats.bookings}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg"><FaUsers /></div>
          <div className="stat-info"><p>Users</p><h3>{stats.users}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg"><FaMap /></div>
          <div className="stat-info"><p>Active Packages</p><h3>{stats.packages}</h3></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>User Interests</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieChartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#008080" : "#d9e6e6"} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Package Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="v" fill="#008080" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-bookings-card">
        <h3>Recent Bookings</h3>
        <table className="bookings-table">
          <thead>
            <tr><th>Booking ID</th><th>User</th><th>City</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recentBookings.map((b, i) => (
              <tr key={i}>
                <td>BK-{b.id}</td>
                <td>{b.email.split('@')[0]}</td>
                <td>{b.city}</td>
                <td>${b.bill}</td>
                <td className={`status-${b.status.toLowerCase()}`}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="revenue-chart-card">
        <h3>Revenue Over 12 Months</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#008080" strokeWidth={4} dot={{ r: 6, fill: "#008080" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      <CustomAlertModal 
        isOpen={modalOpen} config={modalConfig} 
        inputValue={modalInput} setInputValue={setModalInput}
        onClose={() => setModalOpen(false)} onConfirm={handleModalConfirm}
      />
      
      <header className="admin-navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1>Admin Panel</h1>
        </div>
        <div className="navbar-right">
          <FaBullhorn className="announcement-icon" onClick={() => setAnnouncementOpen(true)} />
          <button className="logout-btn" onClick={() => window.location.href = "login"}>Logout</button>
        </div>
      </header>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <ul>
          {/* Updated Dashboard Item with Icon */}
          <li className={selectedOption === "dashboard" ? "active" : ""} onClick={() => setSelectedOption("dashboard")}>
            <FaThLarge className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </li>
          
          <li className={selectedOption === "packages" ? "active" : ""} onClick={() => setSelectedOption("packages")}>
            <FaBox className="sidebar-icon" /><span className="sidebar-text">Manage Packages</span>
          </li>
          <li className={selectedOption === "users" ? "active" : ""} onClick={() => setSelectedOption("users")}>
            <FaUser className="sidebar-icon" /><span className="sidebar-text">Manage Users</span>
          </li>
          <li className={selectedOption === "update-trips" ? "active" : ""} onClick={() => setSelectedOption("update-trips")}>
            <FaMapMarkerAlt className="sidebar-icon" /><span className="sidebar-text">Review Trips</span>
          </li>
          {/* <li className={selectedOption === "add-city" ? "active" : ""} onClick={() => setSelectedOption("add-city")}>
            <FaCity className="sidebar-icon" /><span className="sidebar-text">Add City</span>
          </li> */}
          <li className={selectedOption === "settings" ? "active" : ""} onClick={() => setSelectedOption("settings")}>
            <FaCog className="sidebar-icon" /><span className="sidebar-text">Settings</span>
          </li>
        </ul>
      </aside>

      <main className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        {selectedOption === "dashboard" ? renderDashboard() : 
         selectedOption === "packages" ? <ManagePackages /> :
         selectedOption === "users" ? <ManageUsers /> :
         selectedOption === "add-city" ? <AddCity /> :
         selectedOption === "update-trips" ? <TripReview /> : <AdminSettings />}
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
                    <FaEdit className="edit-icon" onClick={() => openEditModal(a.id, a.text)} />
                    <FaTrash className="delete-icon" onClick={() => openDeleteModal(a.id)} />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div className="announcement-input-container">
          <div className="announcement-input-wrapper">
            <input 
              type="text" placeholder="Post update..." 
              value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAnnouncement()}
            />
            <button className="send-btn" onClick={handleSendAnnouncement}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;