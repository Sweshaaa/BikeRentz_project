import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../lib/api-client";
import { paths } from "../config/paths";
import "./AuthForms.css";

export default function Forgot() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestReset() {
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("If that email exists, a reset link has been sent.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { token, password });
      toast.success("Password reset! You can now log in.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="br-auth-page">
      <div className="card br-auth-card">
        {token ? (
          <>
            <h2>Set New Password</h2>
            <label>
              New Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="btn-primary" onClick={handleResetPassword} disabled={loading}>
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </>
        ) : (
          <>
            <h2>Forgot Password</h2>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button className="btn-primary" onClick={handleRequestReset} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
        <p className="br-auth-footer">
          <Link to={paths.login}>Back to login</Link>
        </p>
      </div>
    </div>
  );
}
