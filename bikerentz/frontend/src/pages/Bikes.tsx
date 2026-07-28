import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import BikeCard, { Bike } from "../components/BikeCard";
import "./Bikes.css";

const types = ["Motorbike", "Scooter", "Electric Scooter"];
const categories = ["Sports", "Cruiser", "Commuter", "Adventure/Touring", "Electric", "Other"];

export default function Bikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get("/bikes", { params: { category, type, search } });
      setBikes(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, type]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="br-bikes-page">
      <h1>Browse the Fleet</h1>

      <div className="br-filters">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select value={type} onChange={(e) => updateFilter("type", e.target.value)}>
          <option value="">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={category} onChange={(e) => updateFilter("category", e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-primary" onClick={load}>Search</button>
      </div>

      {loading ? (
        <p>Loading fleet...</p>
      ) : bikes.length === 0 ? (
        <p className="br-empty-state">No bikes match your filters.</p>
      ) : (
        <div className="br-bikes-grid">
          {bikes.map((bike) => <BikeCard key={bike._id} bike={bike} />)}
        </div>
      )}
    </div>
  );
}
