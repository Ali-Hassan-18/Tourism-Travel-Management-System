import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "./ManageUsers.css";

const STORAGE_KEY = "touristaUsers";

const loadUsersFromLS = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [
    { id: 1, name: "Ayesha Khan", email: "ayesha@example.com", package: "Premium" },
    { id: 2, name: "Usman Baig", email: "usman@example.com", package: null },
    { id: 3, name: "Ali", email: "ali@example.com", package: "Basic" },
  ];
};

const saveUsersToLS = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const ManageUsers = () => {
  const [users, setUsers] = useState(loadUsersFromLS());

  useEffect(() => {
    saveUsersToLS(users);
  }, [users]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

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

              <div className="mp-btn-row">
                <button className="btn delete" onClick={() => handleDelete(user.id)}>
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;