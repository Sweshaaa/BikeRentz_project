import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { apiClient } from "../../lib/api-client";
import "./Admin.css";

interface Order {
  _id: string;
  renter: { name: string; email: string };
  bike: { name: string; brand: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

const statuses = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const res = await apiClient.get("/admin/rentals");
    setOrders(res.data.data);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await apiClient.patch(`/admin/rentals/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <h1>Rental Orders</h1>
      <div className="br-admin-table-wrap">
        <table className="br-table">
          <thead>
            <tr><th>Renter</th><th>Bike</th><th>Dates</th><th>Total</th><th>Payment</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.renter?.name}</td>
                <td>{o.bike?.brand} {o.bike?.name}</td>
                <td>{dayjs(o.startDate).format("MMM D")} → {dayjs(o.endDate).format("MMM D")}</td>
                <td>Rs. {o.totalPrice}</td>
                <td>{o.paymentStatus}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
