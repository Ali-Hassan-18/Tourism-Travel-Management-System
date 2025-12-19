import React, { useState, useEffect } from "react";
import "./ManageUsers.css";

const STORAGE_KEY = "touristaUsers";

// Function to load users safely from localStorage and merge with default users
const loadUsersFromLS = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  const defaultUsers = [
    { id: 1, name: "Ayesha Khan", email: "ayesha@example.com", package: "Premium" },
    { id: 2, name: "Usman Baig", email: "usman@example.com", package: null },
    { id: 3, name: "Ali", email: "ali@example.com", package: "Basic" },
    { id: 4, name: "Sara Malik", email: "sara@example.com", package: "Standard" },
    { id: 5, name: "Hassan Raza", email: "hassan@example.com", package: null },
  ];

  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Merge saved users with any default users that are missing
      const merged = [...parsed];
      defaultUsers.forEach((du) => {
        if (!parsed.find((u) => u.id === du.id)) merged.push(du);
      });
      return merged;
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
};

// Save users to localStorage
const saveUsersToLS = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const ManageUsers = () => {
  const [users, setUsers] = useState(loadUsersFromLS());

  useEffect(() => {
    saveUsersToLS(users);
  }, [users]);

  return (
    <div className="mp-outer">
      <div className="mp-card">
        <h2 className="mp-title">Manage Users</h2>

        {users.length === 0 && <p className="mp-empty">No users found.</p>}

        <div className="mp-list">
          {users.map((user) => (
            <div className="mp-package" key={user.id}>
              <div className="mp-body">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Package:</strong> {user.package ? user.package : "Not Availing"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;