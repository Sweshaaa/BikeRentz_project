import { Link } from "react-router-dom";
import { paths } from "../config/paths";
import "./Feature.css";

const categories = [
  { name: "Sports", emoji: "🏍️" },
  { name: "Cruiser", emoji: "🛣️" },
  { name: "Commuter", emoji: "🛵" },
  { name: "Adventure/Touring", emoji: "🗺️" },
  { name: "Electric", emoji: "⚡" },
];

export default function Feature() {
  return (
    <section className="br-features">
      <h2>Browse by Category</h2>
      <div className="br-feature-grid">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`${paths.bikes}?category=${encodeURIComponent(cat.name)}`}
            className="br-feature-card"
          >
            <span className="br-feature-emoji">{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
