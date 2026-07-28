import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Bike, Users, ClipboardList, Settings, ArrowLeft } from "lucide-react";
import { paths } from "../config/paths";
import "./adminLayout.css";

const links = [
  { to: paths.admin, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: paths.adminBikes, label: "Fleet", icon: Bike },
  { to: paths.adminOrders, label: "Orders", icon: ClipboardList },
  { to: paths.adminUsers, label: "Users", icon: Users },
  { to: paths.adminSettings, label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="br-admin-shell">
      <aside className="br-admin-sidebar">
        <div className="br-admin-brand">Bike<span className="br-logo-accent">Rentz</span> Admin</div>
        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink to={paths.home} className="br-admin-back">
          <ArrowLeft size={16} /> Back to site
        </NavLink>
      </aside>
      <main className="br-admin-content">
        <Outlet />
      </main>
    </div>
  );
}
