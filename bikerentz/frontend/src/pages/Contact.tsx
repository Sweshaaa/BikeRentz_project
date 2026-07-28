import { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div style={{ padding: "60px", maxWidth: 480, margin: "0 auto" }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ background: "var(--br-charcoal-light)", border: "1px solid var(--br-charcoal-light)", color: "var(--br-white)", padding: 10, borderRadius: 6 }} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ background: "var(--br-charcoal-light)", border: "1px solid var(--br-charcoal-light)", color: "var(--br-white)", padding: 10, borderRadius: 6 }} />
        <textarea placeholder="Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ background: "var(--br-charcoal-light)", border: "1px solid var(--br-charcoal-light)", color: "var(--br-white)", padding: 10, borderRadius: 6 }} />
        <button className="btn-primary" type="submit">Send Message</button>
      </form>
    </div>
  );
}
