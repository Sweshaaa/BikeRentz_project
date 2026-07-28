import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import { paths } from "../config/paths";

export default function RentalCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    if (!pidx) {
      setStatus("failed");
      return;
    }
    apiClient
      .get("/rentals/verify", { params: { pidx } })
      .then((res) => setStatus(res.data.data.paymentStatus === "PAID" ? "success" : "failed"))
      .catch(() => setStatus("failed"));
  }, [searchParams]);

  return (
    <div style={{ padding: "80px 60px", textAlign: "center" }}>
      {status === "loading" && <h2>Verifying your payment...</h2>}
      {status === "success" && (
        <>
          <h2 style={{ color: "var(--br-success)" }}>Booking Confirmed! 🏍️</h2>
          <p>Your rental has been booked successfully. Check your email for confirmation.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h2 style={{ color: "var(--br-danger)" }}>Payment Failed</h2>
          <p>Something went wrong with your payment. Please try booking again.</p>
        </>
      )}
      <Link to={paths.myRentals} className="btn-primary" style={{ display: "inline-block", marginTop: 24 }}>
        View My Rentals
      </Link>
    </div>
  );
}
