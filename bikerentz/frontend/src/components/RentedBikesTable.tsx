import dayjs from "dayjs";
import "./RentedBikesTable.css";

export interface RentalOrder {
  _id: string;
  bike: { name: string; brand: string; image: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

export default function RentedBikesTable({ rentals }: { rentals: RentalOrder[] }) {
  if (rentals.length === 0) {
    return <p className="br-empty-state">You haven't booked any bikes yet.</p>;
  }

  return (
    <table className="br-table">
      <thead>
        <tr>
          <th>Bike</th>
          <th>Dates</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        {rentals.map((r) => (
          <tr key={r._id}>
            <td>{r.bike.brand} {r.bike.name}</td>
            <td>{dayjs(r.startDate).format("MMM D")} → {dayjs(r.endDate).format("MMM D, YYYY")}</td>
            <td>Rs. {r.totalPrice}</td>
            <td><span className={`badge badge-${r.status === "CANCELLED" ? "rented" : "available"}`}>{r.status}</span></td>
            <td>{r.paymentStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
