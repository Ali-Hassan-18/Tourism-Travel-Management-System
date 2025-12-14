import React, { useState } from "react";
import "./CustomItinerary.css";

// Sample JSON structure (Activities now include a description for detail view)
const itineraryData = [
  {
    day: 1,
    date: "Dec 15",
    activities: [
      { type: "Adventure", name: "Mountain Hiking Trail", icon: "🏔️", time: "Morning", details: "Explore the scenic Blue Ridge trail. Don't forget water and sunblock." },
      { type: "Food", name: "Local Farm-to-Table Breakfast", icon: "🍽️", time: "Morning", details: "Enjoy fresh local produce at 'The Sun Garden' cafe." },
      { type: "Culture", name: "City Historical Museum", icon: "🏛️", time: "Afternoon", details: "Discover the region's ancient history and art exhibits." },
      { type: "Relaxation", name: "Sunset Viewpoint Visit", icon: "🌅", time: "Evening", details: "Drive up to Skyline point for a stunning sunset." },
    ],
  },
  {
    day: 2,
    date: "Dec 16",
    activities: [
      { type: "Nature", name: "River Kayaking & Walk", icon: "🌊", time: "Morning", details: "Two hours of kayaking followed by a relaxed riverside walk." },
      { type: "Food", name: "Street Food Lunch Crawl", icon: "🍜", time: "Lunch", details: "Try local delicacies in the main square's food stalls." },
      { type: "Shopping", name: "Local Artisan Market", icon: "🛍️", time: "Afternoon", details: "Great for unique souvenirs and gifts." },
      { type: "Food", name: "Fine Dining Experience", icon: "🍷", time: "Evening", details: "Reservation at 'The Grand Pearl' at 8:00 PM." },
    ],
  },
  {
    day: 3,
    date: "Dec 17",
    activities: [
      { type: "Relaxation", name: "Spa & Thermal Pool Session", icon: "🛁", time: "Morning", details: "Book a 90-minute deep tissue massage." },
      { type: "Culture", name: "Local Cooking Class", icon: "🧑‍🍳", time: "Afternoon", details: "Learn to prepare regional dishes from a master chef." },
      { type: "Adventure", name: "Night Ziplining", icon: "🌉", time: "Evening", details: "A thrilling experience under the stars." },
    ],
  },
];

const CustomItinerary = () => {
  // State to track which day is currently expanded. Default to day 1.
  const [openDay, setOpenDay] = useState(itineraryData[0]?.day || null);

  const toggleDay = (dayNumber) => {
    setOpenDay(openDay === dayNumber ? null : dayNumber);
  };

  return (
    <div className="custom-itinerary-page">
      <h1>Your Bespoke Journey Plan</h1>
      <p>Click a day to view its detailed schedule.</p>

      <div className="accordion-container">
        {itineraryData.map((dayPlan) => (
          <div key={dayPlan.day} className="day-accordion-item">
            {/* The Clickable Day Header (Bar) */}
            <div 
              className={`day-header-bar ${openDay === dayPlan.day ? 'active' : ''}`}
              onClick={() => toggleDay(dayPlan.day)}
            >
              <div className="day-info">
                <span className="day-number-label">Day {dayPlan.day}</span>
                <span className="day-date-label">({dayPlan.date})</span>
                <span className="day-summary-label">
                  — {dayPlan.activities.length} Activities
                </span>
              </div>
              <span className="expand-icon">
                {openDay === dayPlan.day ? '▼' : '▶'}
              </span>
            </div>

            {/* The Collapsible Content Area */}
            {openDay === dayPlan.day && (
              <div className="day-content-area">
                {dayPlan.activities.map((act, index) => (
                  <div key={index} className={`activity-detail-item ${act.type.toLowerCase()}`}>
                    <div className="activity-main-info">
                      <span className="activity-icon-lg">{act.icon}</span>
                      <div className="text-info">
                        <span className="activity-time">{act.time.toUpperCase()}</span>
                        <h3 className="activity-title">{act.name}</h3>
                      </div>
                    </div>
                    <p className="activity-description">{act.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomItinerary;