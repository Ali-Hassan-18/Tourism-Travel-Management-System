import React, { useState } from 'react';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      destination: "Hunza Valley Expedition",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop",
      date: "Dec 25, 2025 - Dec 30, 2025",
      packageType: "Premium", 
      price: "$450",
      status: "Confirmed", // Changed to Confirmed
      guests: 2
    },
    {
      id: 2,
      destination: "Naran Kaghan Weekend",
      image: "https://images.unsplash.com/photo-1627896455113-7a9561066060?q=80&w=1000&auto=format&fit=crop",
      date: "Jan 10, 2026 - Jan 12, 2026",
      packageType: "Economical",
      price: "$150",
      status: "Confirmed", // Changed to Confirmed
      guests: 4
    }
  ]);

  const getBadgeClass = (type) => (type === 'Premium' ? 'badge-premium' : 'badge-economical');
  const getStatusClass = (status) => (status === 'Confirmed' ? 'status-confirmed' : 'status-pending');

  return (
    <div className="bookings-container">
      <h2 className="section-title">My Booked Trips</h2>
      
      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any trips yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="card-image" style={{ backgroundImage: `url(${booking.image})` }}>
                <span className={`package-badge ${getBadgeClass(booking.packageType)}`}>
                  {booking.packageType}
                </span>
              </div>

              <div className="card-body">
                <div className="card-header-row">
                  <h3>{booking.destination}</h3>
                  <span className="price">{booking.price}</span>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <span>📅 {booking.date}</span>
                  </div>
                  <div className="detail-row">
                    <span>👥 {booking.guests} Guests</span>
                  </div>
                </div>

                <hr className="divider" />

                <div className="card-footer">
                  <div className="status-container">
                    <span className="label">Status: </span>
                    <span className={`status-text ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;