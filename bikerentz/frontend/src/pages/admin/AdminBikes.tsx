import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../lib/api-client";
import { Bike } from "../../components/BikeCard";
import "./Admin.css";

const emptyForm = {
  name: "", brand: "", type: "Motorbike", category: "Commuter",
  pricePerDay: "", engineCC: "", motorPowerWatts: "", description: "",
};

export default function AdminBikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    const res = await apiClient.get("/bikes");
    setBikes(res.data.data);
  }

  useEffect(() => { load(); }, []);

  function startEdit(bike: Bike) {
    setEditingId(bike._id);
    setForm({
      name: bike.name, brand: bike.brand, type: bike.type, category: bike.category,
      pricePerDay: String(bike.pricePerDay), engineCC: String(bike.engineCC || ""),
      motorPowerWatts: String(bike.motorPowerWatts || ""), description: "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("image", file);

    try {
      if (editingId) {
        await apiClient.put(`/admin/bikes/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Bike updated");
      } else {
        await apiClient.post("/admin/bikes", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Bike added to fleet");
      }
      setForm(emptyForm);
      setFile(null);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this bike from the fleet?")) return;
    await apiClient.delete(`/admin/bikes/${id}`);
    toast.success("Bike removed");
    load();
  }

  async function handleStatusChange(id: string, status: string) {
    await apiClient.patch(`/admin/bikes/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="br-admin-toolbar">
        <h1>Fleet</h1>
        <button className="btn-primary" onClick={() => { setShowForm((s) => !s); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? "Cancel" : "+ Add Bike"}
        </button>
      </div>

      {showForm && (
        <form className="card br-admin-form" onSubmit={handleSubmit}>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required /></label>
          <label>Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Motorbike</option><option>Scooter</option><option>Electric Scooter</option>
            </select>
          </label>
          <label>Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Sports</option><option>Cruiser</option><option>Commuter</option><option>Adventure/Touring</option><option>Electric</option><option>Other</option>
            </select>
          </label>
          <label>Price/Day (Rs.)<input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required /></label>
          <label>Engine CC<input type="number" value={form.engineCC} onChange={(e) => setForm({ ...form, engineCC: e.target.value })} /></label>
          <label>Motor Watts (electric)<input type="number" value={form.motorPowerWatts} onChange={(e) => setForm({ ...form, motorPowerWatts: e.target.value })} /></label>
          <label>Photo<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
          <label className="br-admin-form-full">Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button className="btn-primary br-admin-form-full" type="submit">{editingId ? "Save Changes" : "Add to Fleet"}</button>
        </form>
      )}

      <div className="br-admin-table-wrap">
        <table className="br-table">
          <thead>
            <tr><th>Name</th><th>Brand</th><th>Type</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bikes.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.brand}</td>
                <td>{b.type}</td>
                <td>Rs. {b.pricePerDay}</td>
                <td>
                  <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RENTED">RENTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn-outline" onClick={() => startEdit(b)}>Edit</button>
                  <button className="btn-outline" onClick={() => handleDelete(b._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
