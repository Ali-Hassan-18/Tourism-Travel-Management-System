import React, { useState, useEffect } from "react";
import "./AdminSettings.css";

const AdminSettings = () => {
  const [theme, setTheme] = useState("Light Mode");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle dark mode class on body
  useEffect(() => {
    if (theme === "Dark Mode") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Settings saved successfully!");
  };

  return (
    <div className="mp-outer">
      <div className="mp-card settings-card">
        <h2 className="mp-title">Admin Settings</h2>

        <div className="mp-form">
          <div className="fld">
            <label>Website Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>

          <div className="fld">
            <label>Change Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="fld">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="btn primary" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;