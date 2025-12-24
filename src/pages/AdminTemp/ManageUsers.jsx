import React, { useState, useEffect } from "react";
import "./ManageUsers.css";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:18080/api/admin/users");
      const data = await res.json();
      setUsers(data); 
    } catch (err) {
      console.error("Failed to fetch users from C++ backend.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <p className="mp-empty">No users found matching your search.</p>
        ) : (
          <div className="mp-list">
            {filteredUsers.map((user, index) => (
              <div className="mp-package" key={index}>
                <div className="mu-user-info">
                  <div className="mu-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="mp-body">
                    <h3>{user.name}</h3>
                    <p className="mu-email">{user.email}</p>
                  </div>
                </div>
                
                <div className="mu-status">
                  <span className="mu-label">Packages:</span>
                  <span className={`mu-badge ${user.trips > 0 ? 'active' : 'inactive'}`}>
                    {user.trips} Trips
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;