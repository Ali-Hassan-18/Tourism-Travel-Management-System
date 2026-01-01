import React, { useState, useEffect } from "react";
import "./ManageUsers.css";
import { FaSearch, FaCommentAlt, FaTimes } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New State for Reviews
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:18080/api/admin/users");
      const data = await res.json();
      setUsers(data); 
    } catch (err) {
      console.error("Failed to fetch users.");
    }
  };

  const fetchReviews = async (user) => {
  try {
    const res = await fetch(`http://localhost:18080/api/admin/user-reviews/${user.email}`);
    
    // Safety check: ensure the server responded
    if (!res.ok) {
      console.error("Server error or user not found.");
      return;
    }

    const data = await res.json();
    
    // Only show modal if we successfully retrieved the user's history
    setReviews(data);
    setSelectedUser(user);
    setShowModal(true); 
    
  } catch (err) {
    console.error("Network error: Failed to fetch user reviews.");
  }
};

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mp-outer">
      <div className="mp-card">
        <div className="mu-header">
          <h2 className="mp-title">Registered Users</h2>
          <div className="mu-search-wrapper">
            <FaSearch className="mu-search-icon" />
            <input
              type="text"
              className="mu-search-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="mp-empty">No users found.</p>
        ) : (
          <div className="mp-list">
            {filteredUsers.map((user, index) => (
              <div className="mp-package" key={index}>
                <div className="mu-user-info">
                  <div className="mu-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="mp-body">
                    <h3>{user.name}</h3>
                    <p className="mu-email">{user.email}</p>
                  </div>
                </div>
                
                <div className="mu-status">
                  <button className="mu-badge active" onClick={() => fetchReviews(user)} style={{cursor: 'pointer', border: 'none'}}>
                    <FaCommentAlt style={{marginRight: '8px'}} /> See Reviews
                  </button>
                  <span className="mu-badge inactive">
                    {user.trips} Trips
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SMART REVIEW MODAL --- */}
      {showModal && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-modal-v2">
            <div className="modal-header-row">
                <h2>Reviews by {selectedUser.name}</h2>
                <button className="close-x" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            
            <div className="reviews-list-container">
              {reviews.length > 0 ? (
                reviews.map((rev, i) => (
                  <div key={i} className="review-item-card">
                    <div className="rev-meta">
                        <strong>{rev.date}</strong> | <span>Rating: {rev.rating}/5</span>
                    </div>
                    <p>"{rev.text}"</p>
                    <span className="status-tag confirmed">Verified Testimonial</span>
                  </div>
                ))
              ) : (
                <p className="empty-msg">No testimonials found for this user.</p>
              )}
            </div>

            <button className="modal-confirm-btn confirmed" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;