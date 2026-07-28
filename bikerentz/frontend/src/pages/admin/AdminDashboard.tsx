import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client";
import "./Admin.css";

interface Stats {
  totalBikes: number;
  availableBikes: number;
  rentedBikes: number;
  activeRentals: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiClient.get("/admin/dashboard/stats").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const cards = [
    { label: "Total Bikes", value: stats.totalBikes },
    { label: "Available", value: stats.availableBikes },
    { label: "Currently Rented", value: stats.rentedBikes },
    { label: "Active Rentals", value: stats.activeRentals },
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Revenue", value: `Rs. ${stats.totalRevenue}` },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="br-admin-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="card br-stat-card">
            <span className="br-stat-value">{c.value}</span>
            <span className="br-stat-label">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
