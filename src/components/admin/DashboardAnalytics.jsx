import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaSuitcase,
  FaMapMarkedAlt,
  FaDollarSign,
} from "react-icons/fa";
import "./DashboardAnalytics.css";

/* KPI DATA */
const kpis = [
  { title: "Total Revenue", value: "$18,500", icon: <FaDollarSign /> },
  { title: "Bookings", value: "245", icon: <FaSuitcase /> },
  { title: "Users", value: "500", icon: <FaUsers /> },
  { title: "Active Packages", value: "3", icon: <FaMapMarkedAlt /> },
];

/* ANALYTICS DATA */
const interestData = [
  { name: "Mountains", value: 40 },
  { name: "Beaches", value: 25 },
  { name: "Historical", value: 20 },
  { name: "Adventure", value: 15 },
];

const packageData = [
  { name: "Basic", value: 120 },
  { name: "Premium", value: 80 },
  { name: "Discount", value: 45 },
];

/* RECENT BOOKINGS */
const recentBookings = [
  { id: "BK-101", user: "Ali Khan", city: "Skardu", amount: "$850", status: "Confirmed" },
  { id: "BK-102", user: "Ayesha Noor", city: "Hunza", amount: "$450", status: "Pending" },
  { id: "BK-103", user: "Usman Ali", city: "Murree", amount: "$320", status: "Confirmed" },
  { id: "BK-104", user: "Sara Ali", city: "Gilgit", amount: "$500", status: "Confirmed" },
  { id: "BK-105", user: "Hassan Shah", city: "Naran", amount: "$400", status: "Pending" },
];

/* REVENUE DATA (12 MONTHS) */
const revenueData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 15000 },
  { month: "Mar", value: 18000 },
  { month: "Apr", value: 16000 },
  { month: "May", value: 21000 },
  { month: "Jun", value: 25000 },
  { month: "Jul", value: 22000 },
  { month: "Aug", value: 24000 },
  { month: "Sep", value: 23000 },
  { month: "Oct", value: 26000 },
  { month: "Nov", value: 28000 },
  { month: "Dec", value: 30000 },
];

const DashboardAnalytics = () => {
  return (
    <div className="dashboard">

      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <span>Admin / Overview</span>
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi">
            <div className="kpi-icon">{kpi.icon}</div>
            <div>
              <p>{kpi.title}</p>
              <h3>{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ANALYTICS CHARTS */}
      <div className="analytics-grid">
        <div className="card">
          <h3>User Interests</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={interestData} dataKey="value" outerRadius={90}>
                {interestData.map((_, i) => (
                  <Cell key={i} fill="#008080" opacity={0.25 + i * 0.15} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Package Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={packageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#008080" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="card table-card">
        <h3>Recent Bookings</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Booking ID</th>
                <th style={{ width: "25%" }}>User</th>
                <th style={{ width: "20%" }}>City</th>
                <th style={{ width: "20%" }}>Amount</th>
                <th style={{ width: "20%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i}>
                  <td>{b.id}</td>
                  <td>{b.user}</td>
                  <td>{b.city}</td>
                  <td>{b.amount}</td>
                  <td>
                    <span className={`status ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVENUE CHART AT END */}
      <div className="card revenue-end">
        <h3>Revenue Over 12 Months</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#008080"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default DashboardAnalytics;