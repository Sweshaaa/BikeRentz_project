import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Camera, User as UserIcon } from "lucide-react";
import { useAuth } from "../lib/auth";
import { apiClient } from "../lib/api-client";
import "./Profile.css";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", name);
      if (avatarFile) data.append("avatar", avatarFile);
      await apiClient.put("/users/me", data, { headers: { "Content-Type": "multipart/form-data" } });
      await refreshProfile();
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const avatarSrc = avatarPreview || (user.avatar ? `${API_ORIGIN}${user.avatar}` : null);

  return (
    <div className="br-profile-page">
      <h1>My Profile</h1>
      <div className="card br-profile-card">
        <div className="br-profile-avatar">
          <button
            type="button"
            className="br-profile-avatar-circle"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" />
            ) : (
              <UserIcon size={36} />
            )}
            <span className="br-profile-avatar-overlay">
              <Camera size={18} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
          <button type="button" className="br-profile-avatar-link" onClick={() => fileInputRef.current?.click()}>
            Upload Photo
          </button>
        </div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={user.email} disabled />
        </label>
        <button className="btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
