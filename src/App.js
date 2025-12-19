import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing Page Components
import LandingPage from "./pages/LandingPage";
import LoginTemp from "./pages/LoginTemp";
import Dashboard from "./pages/UserTemp/Dashboard";
import AdminDashboard from "./pages/AdminTemp/AdminDashboard";
import CustomItinerary from "./pages/UserTemp/CustomItinerary";
import CityDetail from "./pages/UserTemp/CityDetail";
import EconomicalPackages from "./pages/UserTemp/EconomicalPackages"; 
import PremiumPackages from "./pages/UserTemp/PremiumPackages"; 
import DiscountPackages from "./pages/UserTemp/DiscountPackages"; 
// ❌ REMOVED: import MyBookings... (The Dashboard handles this now!)

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginTemp />} />
          
          {/* This one route handles Home, MyBookings, Plans, etc. via the Sidebar */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/city/:cityName" element={<CityDetail />} />
          <Route path="/custom-itinerary" element={<CustomItinerary />} />
         <Route path="/economical-packages" element={<EconomicalPackages />} />
          <Route path="/premium-packages" element={<PremiumPackages />} />
          <Route path="/discount-packages" element={<DiscountPackages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;