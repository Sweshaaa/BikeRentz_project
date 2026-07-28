import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";
import RentedBikesTable, { RentalOrder } from "../components/RentedBikesTable";

export default function MyRentals() {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/rentals/mine").then((res) => setRentals(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px 60px" }}>
      <h1>My Rentals</h1>
      {loading ? <p>Loading...</p> : <RentedBikesTable rentals={rentals} />}
    </div>
  );
}
