import React, { useState, useEffect } from "react";
import "./ReviewTrip.css";
import { 
  FaCheck, FaTimes, FaEye, FaCalendarAlt, FaUsers, 
  FaChild, FaBaby, FaHeart, FaSearch, FaUserFriends, 
  FaMapMarkerAlt, FaClock, FaUser, FaPhone, FaEnvelope,
  FaSortAmountDown, FaSortAmountUp
} from "react-icons/fa";

const TripReview = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);
  
  // Filtering and Sorting State
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // "price_asc" or "price_desc"
  
  // Custom Modal State
  const [confirmAction, setConfirmAction] = useState(null); // { id, status, title }

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  // 1. BACKEND SYNC: Fetch using Search and Sort logic
  const fetchProcessedBookings = async () => {
    try {
      // Calling the processed route for backend-side Search/Sort
      const url = `http://localhost:18080/api/admin/bookings/process?q=${searchQuery}&sort=${sortOrder}`;
      const res = await fetch(url);
      const data = await res.json();
      
      const formattedData = data.map(b => ({
        id: b.id,
        userName: b.email.split('@')[0],
        userEmail: b.email,
        destination: b.city,
        location: b.title,
        bill: b.bill,
        status: b.status.toLowerCase(),
        adults: b.adults,
        children: b.kids
      }));

      // Filter locally for status badge stats while Search/Sort is backend-driven
      let finalDisplay = formattedData;
      if (statusFilter !== "all") {
        finalDisplay = formattedData.filter(t => t.status === statusFilter);
      }

      setTrips(finalDisplay);
      
      // Update Stats based on full database fetch
      const statRes = await fetch("http://localhost:18080/api/admin/all-bookings");
      const statData = await statRes.json();
      setStats({
        total: statData.length,
        pending: statData.filter(t => t.status.toLowerCase() === "pending").length,
        approved: statData.filter(t => ["confirmed", "approved"].includes(t.status.toLowerCase())).length,
        rejected: statData.filter(t => t.status.toLowerCase() === "rejected").length
      });
    } catch (err) {
      console.error("Backend processing sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProcessedBookings();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sortOrder, statusFilter]);

  // 2. MODAL LOGIC: Replaces window.confirm
  const handleUpdateStatus = async () => {
    if (!confirmAction) return;

    try {
      const res = await fetch(`http://localhost:18080/api/admin/update-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookingId: confirmAction.id, 
          status: confirmAction.status 
        })
      });
      
      if (res.ok) {
        setConfirmAction(null);
        setExpandedTripId(null);
        fetchProcessedBookings(); // Refresh UI
      }
    } catch (err) {
      console.error("Update failed.");
    }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getStatusBadge = (status, small = false) => {
  // SAFETY: If the status looks like a phone number (contains digits), default to 'Pending'
  const validStatuses = ["pending", "confirmed", "approved", "rejected"];
  const safeStatus = validStatuses.includes(status?.toLowerCase()) ? status.toLowerCase() : "pending";

  const className = small ? `trip-badge-small ${safeStatus}` : `trip-badge ${safeStatus}`;
  return <span className={className}>{safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}</span>;
};

  if (loading) return <div className="trip-review-container"><h1>Loading Tourista Database...</h1></div>;

  return (
    <div className="trip-review-container">
      <div className="trip-review-header">
        <h1>Trip Plan Review</h1>
        <p>Administrative control for user-submitted plans</p>
      </div>

      <div className="trip-review-stats">
        <div className="stat-card"><p>Total</p><h3>{stats.total}</h3></div>
        <div className="stat-card"><p>Pending</p><h3>{stats.pending}</h3></div>
        <div className="stat-card"><p>Approved</p><h3>{stats.approved}</h3></div>
        <div className="stat-card"><p>Rejected</p><h3>{stats.rejected}</h3></div>
      </div>

      <div className="trip-filters">
        <div className="filter-group">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="none">Default (Queue Order)</option>
            <option value="date_newest">Date: Newest First</option>
            <option value="date_oldest">Date: Oldest First</option>
          </select>
        </div>

        <div className="trip-search-wrapper">
          <FaSearch className="trip-search-icon" />
          <input 
            type="text" 
            className="trip-search-input" 
            placeholder="Search email or city..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="trip-cards-container">
        {trips.map(trip => (
          expandedTripId === trip.id ? (
            /* EXPANDED VIEW */
            <div key={trip.id} className="trip-card-expanded">
              <button className="close-expanded-btn" onClick={() => setExpandedTripId(null)}><FaTimes /></button>
              <div className="trip-header-expanded">
                <div className="trip-user-expanded">
                  <div className="trip-avatar-expanded">{getInitials(trip.userName)}</div>
                  <div className="user-details-expanded">
                    <h3>{trip.userName}</h3>
                    <p className="user-contact"><FaEnvelope /> {trip.userEmail}</p>
                  </div>
                </div>
                <div className="trip-status">{getStatusBadge(trip.status)}</div>
              </div>

              <div className="trip-section">
                <div className="trip-details-grid">
                  <div className="detail-item"><div className="detail-label">City</div><div className="detail-value">{trip.destination}</div></div>
                  <div className="detail-item"><div className="detail-label">Package</div><div className="detail-value">{trip.location}</div></div>
                  <div className="detail-item"><div className="detail-label">Est. Bill</div><div className="detail-value" style={{color: '#008080'}}>${trip.bill}</div></div>
                </div>
              </div>

              {/* RESTORED: Green and Red Action Buttons */}
              <div className="trip-actions-expanded">
                {trip.status.toLowerCase() === "pending" ? (
                  <>
                    <button 
                      className="approve-btn-action" 
                      onClick={() => setConfirmAction({
                        id: trip.id, 
                        status: 'confirmed', 
                        title: trip.title 
                      })}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button 
                      className="reject-btn-action" 
                      onClick={() => setConfirmAction({
                        id: trip.id, 
                        status: 'rejected', 
                        title: trip.title 
                      })}
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                ) : (
                  <button 
                    className="action-btn-expanded view-details-btn" 
                    onClick={() => setExpandedTripId(null)}
                  >
                    <FaEye /> Close Details
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* COMPACT VIEW */
            <div key={trip.id} className="trip-card-compact" onClick={() => setExpandedTripId(trip.id)}>
              <div className="trip-card-header-compact">
                <div className="trip-location">
                  <FaMapMarkerAlt className="location-icon" />
                  <div className="location-text">
                    <h3>{trip.destination}</h3>
                    <p>{trip.location}</p>
                  </div>
                </div>
                
                {/* FIXED: Replacing the phone number with the dynamic Status Badge */}
                <div className="trip-status-compact">
                  {getStatusBadge(trip.status, true)}
                </div>
              </div>

              <div className="trip-footer-compact">
                <div className="user-info-compact">
                  <span>{trip.userEmail}</span>
                </div>
                <div className="travelers-count-compact">
                  <FaUsers /> <span>{trip.adults + (trip.children || 0)} travelers</span>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* --- BRANDED CONFIRMATION MODAL --- */}
      {confirmAction && (
      <div className="admin-confirm-overlay">
        <div className="admin-confirm-modal-v2">
          <div className={`modal-status-icon ${confirmAction.status}`}>
            {confirmAction.status === 'confirmed' ? <FaCheck /> : <FaTimes />}
          </div>
          
          <h2>{confirmAction.status === 'confirmed' ? 'Confirm Approval?' : 'Confirm Rejection?'}</h2>
          <p>Updating status for <strong>{confirmAction.title}</strong> in the C++ backend.</p>
          
          <div className="modal-actions-v2">
            <button 
              className={`modal-confirm-btn ${confirmAction.status}`} 
              onClick={handleUpdateStatus}
            >
              Yes, {confirmAction.status === 'confirmed' ? 'Approve' : 'Reject'}
            </button>
            <button 
              className="modal-cancel-btn" 
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default TripReview;