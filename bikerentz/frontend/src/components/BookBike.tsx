import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { apiClient } from "../lib/api-client";
import "./BookBike.css";

interface BookBikeProps {
  bikeId: string;
  pricePerDay: number;
  disabled?: boolean;
}

export default function BookBike({ bikeId, pricePerDay, disabled }: BookBikeProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const days =
    startDate && endDate ? Math.max(1, dayjs(endDate).diff(dayjs(startDate), "day")) : 0;
  const total = days * pricePerDay;

  async function handleBook() {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/rentals", { bikeId, startDate, endDate });
      window.location.href = res.data.data.paymentUrl;
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card br-book-panel">
      <h3>Book This Bike</h3>
      <label>
        Start Date
        <input type="date" value={startDate} min={dayjs().format("YYYY-MM-DD")} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date
        <input type="date" value={endDate} min={startDate || dayjs().format("YYYY-MM-DD")} onChange={(e) => setEndDate(e.target.value)} />
      </label>

      {days > 0 && (
        <div className="br-book-summary">
          <span>{days} day(s)</span>
          <span className="br-book-total">Rs. {total}</span>
        </div>
      )}

      <button className="btn-primary" onClick={handleBook} disabled={disabled || loading}>
        {loading ? "Redirecting to Khalti..." : disabled ? "Currently Unavailable" : "Book & Pay with Khalti"}
      </button>
    </div>
  );
}
