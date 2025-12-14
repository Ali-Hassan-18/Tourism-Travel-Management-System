// App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginTemp from "./pages/LoginTemp";
import Dashboard from "./pages/UserTemp/Dashboard";
import AdminDashboard from "./pages/AdminTemp/AdminDashboard";
import CustomItinerary from "./pages/UserTemp/CustomItinerary"
function App()
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginTemp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
       <Route path="/custom-itinerary" element={<CustomItinerary />} />
      </Routes>
    </Router>
  );
}

export default App;