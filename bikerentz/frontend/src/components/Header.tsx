import { Link, useNavigate } from "react-router-dom";
import { Bike, Bell, User as UserIcon, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { paths } from "../config/paths";
import NotificationBell from "./NotificationBell";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate(paths.home);
  }

  return (
    <header className="br-header">
      <Link to={paths.home} className="br-logo">
        <Bike size={26} color="var(--br-accent)" />
        <span>Bike<span className="br-logo-accent">Rentz</span></span>
      </Link>

      <nav className={`br-nav ${menuOpen ? "open" : ""}`}>
        <Link to={paths.bikes}>Home</Link>
        <Link to={paths.about}>About</Link>
        <Link to={paths.contact}>Contact</Link>
        {user && <Link to={paths.myRentals}>My Rentals</Link>}
        {user?.role === "admin" && <Link to={paths.admin}>Admin</Link>}
      </nav>

      <div className="br-header-actions">
        {user ? (
          <>
            <NotificationBell />
            <Link to={paths.profile} className="br-icon-btn" title="Profile">
              <UserIcon size={20} />
            </Link>
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={paths.login} className="btn-outline">Login</Link>
            <Link to={paths.register} className="btn-primary">Sign Up</Link>
          </>
        )}
        <button className="br-icon-btn br-menu-toggle" onClick={() => setMenuOpen((o) => !o)}>
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
