import { Link } from "react-router-dom";
import { Bike, Facebook, Instagram, Twitter } from "lucide-react";
import { paths } from "../config/paths";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="br-footer">
      <div className="br-footer-brand">
        <Bike size={22} color="var(--br-accent)" />
        <span>Bike<span className="br-logo-accent">Rentz</span></span>
        <p>Motorbikes and scooters, ready when you are.</p>
      </div>

      <div className="br-footer-links">
        <div>
          <h4>Explore</h4>
          <Link to={paths.bikes}>Home</Link>
          <Link to={paths.about}>About Us</Link>
          <Link to={paths.contact}>Contact</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to={paths.login}>Login</Link>
          <Link to={paths.register}>Sign Up</Link>
          <Link to={paths.myRentals}>My Rentals</Link>
        </div>
      </div>

      <div className="br-footer-social">
        <Facebook size={18} />
        <Instagram size={18} />
        <Twitter size={18} />
      </div>

      <p className="br-footer-copy">© {new Date().getFullYear()} BikeRentz. All rights reserved.</p>
    </footer>
  );
}
