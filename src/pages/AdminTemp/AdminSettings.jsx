import React, { useState } from "react";
import "./AdminSettings.css";
import { FaCheck, FaTimes } from "react-icons/fa";

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Modal State for branded feedback
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  const handleSave = async () => {
    // Validation logic
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerModal("error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerModal("error", "Passwords do not match!");
      return;
    }

    try {
      // API call to C++ Backend
      const response = await fetch("http://localhost:18080/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        triggerModal("success", "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        triggerModal("error", data.message || "Failed to update password.");
      }
    } catch (error) {
      triggerModal("error", "Backend Server is not running.");
    }
  };

  const triggerModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setShowModal(true);
  };

  return (
    <div className="mp-outer">
      <div className="mp-card settings-card">
        <h1 className="mp-title">Admin Settings</h1>

        <div className="mp-form">
          <div className="fld">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="fld">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            Save Changes
          </button>
        </div>
      </div>

      {/* --- BRANDED MODAL (RESTORED TO MATCH TRIP REVIEW STYLE) --- */}
      {showModal && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm-modal-v2">
            <div className={`modal-status-icon ${modalType === "success" ? "confirmed" : "rejected"}`}>
              {modalType === "success" ? <FaCheck /> : <FaTimes />}
            </div>
            <h2>{modalType === "success" ? "Success" : "Error"}</h2>
            <p>{modalMessage}</p>
            <div className="modal-actions-v2">
              <button 
                className={`modal-confirm-btn ${modalType === "success" ? "confirmed" : "rejected"}`} 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;