import React, { useState, useEffect } from 'react';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.email) {
      fetch(`http://localhost:18080/api/history/${userData.email}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="loading text-center mt-20">Loading your journeys...</div>;

  return (
    <div className="bookings-container">
      <h2 className="section-title">My Booked Trips</h2>

      {bookings.length > 0 ? (
        <div className="bookings-grid">
          {bookings.map((trip) => (
            <div key={trip.id} className="booking-card">
              
              <div 
                className="card-image" 
                style={{ backgroundImage: trip.img ? `url(${trip.img})` : 'none' }}
              >
                <span className={`package-badge badge-${trip.category.toLowerCase()}`}>
                  {trip.category === 'Special' ? 'Discounted' : trip.category}
                </span>
              </div>

              <div className="card-body">
                <div className="card-header-row">
                  <h3>{trip.package}</h3>
                  <span className="price">
                    {trip.bill > 0 ? `$${trip.bill}` : "Price: TBD"}
                  </span>
                </div>

                <p className="card-details">📍 {trip.city}</p>
<div className="card-details">
  {/* Dates Row */}
  <div className="detail-row">
    <span className="detail-icon">📅</span>
    <div className="detail-text">
       <span>{trip.dates}</span>
    </div>
  </div>
  
  {/* Travelers Row */}
  <div className="detail-row">
    <span className="detail-icon">👥</span>
    <div className="detail-text">
      <span><strong>Travelers:</strong> {trip.travelers}</span>
    </div>
  </div>

  {/* Interests/Diet Row */}
  {trip.details && (
    <div className="detail-row interests-wrap">
      <span className="detail-icon">📝</span>
      <div className="detail-text">
        <span>{trip.details}</span>
      </div>
    </div>
  )}
</div>
                <hr className="divider" />
              </div>

              <div className="card-footer">
                <div className="status-container">
                  <span className={`status-text status-${trip.status.toLowerCase()}`}>
                    ● {trip.status}
                  </span>
                </div>
                <span className="booking-id">ID: #{trip.id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state text-center py-20 bg-white rounded-xl shadow-inner">
          <p className="text-gray-400">No bookings found! Visit "Plan Your Trip" to create one.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;