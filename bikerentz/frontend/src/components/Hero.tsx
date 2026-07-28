import { Link } from "react-router-dom";
import { paths } from "../config/paths";
import "./Hero.css";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

export default function Hero() {
  return (
    <section className="br-hero">
      <div className="br-hero-text">
        <h1>Ride Free. <span className="br-logo-accent">Rent Now.</span></h1>
        <p>
          From city scooters to touring motorbikes — book the ride you need,
          for as long as you need it.
        </p>
        <div className="br-hero-actions">
          <Link to={paths.bikes} className="btn-primary">Home</Link>
          <Link to={paths.about} className="btn-outline">How It Works</Link>
        </div>
      </div>
      <div
        className="br-hero-image"
        aria-hidden="true"
        style={{ backgroundImage: `url(${API_ORIGIN}/bikes/Royal_Enfield_Classic_350_vs_Bullet_350_.avif)` }}
      />
    </section>
  );
}
