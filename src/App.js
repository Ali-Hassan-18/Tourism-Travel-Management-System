import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing Page Components
import LandingPage from "./pages/LandingPage";
import LoginTemp from "./pages/LoginTemp";
import Dashboard from "./pages/UserTemp/Dashboard";
import AdminDashboard from "./pages/AdminTemp/AdminDashboard";
import CityDetail from "./pages/UserTemp/CityDetail";
import EconomicalPackages from "./pages/UserTemp/EconomicalPackages"; 
import PremiumPackages from "./pages/UserTemp/PremiumPackages"; 
import DiscountPackages from "./pages/UserTemp/DiscountPackages"; 
import Testimonials from "./pages/UserTemp/Testimonials";  // ✅ FIXED

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginTemp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/city/:cityName" element={<CityDetail />} />
        <Route path="/economical-packages" element={<EconomicalPackages />} />
        <Route path="/premium-packages" element={<PremiumPackages />} />
        <Route path="/discount-packages" element={<DiscountPackages />} />
        <Route path="/testimonials" element={<Testimonials />} />
      </Routes>
    </Router>
  );
}

export default App;
