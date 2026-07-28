import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";
import { paths } from "../config/paths";
import "./BikeCard.css";

export interface Bike {
  _id: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  pricePerDay: number;
  engineCC?: number;
  motorPowerWatts?: number;
  image: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
}

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

export default function BikeCard({ bike }: { bike: Bike }) {
  const statusClass =
    bike.status === "AVAILABLE" ? "badge-available" : bike.status === "RENTED" ? "badge-rented" : "badge-maintenance";

  return (
    <Link to={paths.bikeDetail(bike._id)} className="card br-bike-card">
      <div className="br-bike-image" style={{ backgroundImage: `url(${API_ORIGIN}${bike.image})` }}>
        <span className={`badge ${statusClass}`}>{bike.status}</span>
      </div>
      <div className="br-bike-info">
        <span className="br-bike-brand">{bike.brand}</span>
        <h3>{bike.name}</h3>
        <div className="br-bike-spec">
          <Gauge size={16} />
          <span>{bike.engineCC ? `${bike.engineCC}cc` : `${bike.motorPowerWatts}W`}</span>
          <span className="br-bike-category">{bike.category}</span>
        </div>
        <div className="br-bike-price">
          Rs. {bike.pricePerDay} <span>/ day</span>
        </div>
      </div>
    </Link>
  );
}
