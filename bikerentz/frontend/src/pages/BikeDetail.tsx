import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import BookBike from "../components/BookBike";
import { Bike } from "../components/BikeCard";
import "./BikeDetail.css";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

export default function BikeDetail() {
  const { id } = useParams();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/bikes/${id}`).then((res) => setBike(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="br-loading">Loading bike details...</p>;
  if (!bike) return <p className="br-loading">Bike not found.</p>;

  return (
    <div className="br-bike-detail">
      <div className="br-bike-detail-image" style={{ backgroundImage: `url(${API_ORIGIN}${bike.image})` }} />
      <div className="br-bike-detail-info">
        <span className="br-bike-brand">{bike.brand}</span>
        <h1>{bike.name}</h1>
        <p className="br-bike-detail-meta">
          {bike.type} • {bike.category} • {bike.engineCC ? `${bike.engineCC}cc` : `${bike.motorPowerWatts}W motor`}
        </p>
        <BookBike bikeId={bike._id} pricePerDay={bike.pricePerDay} disabled={bike.status !== "AVAILABLE"} />
      </div>
    </div>
  );
}
