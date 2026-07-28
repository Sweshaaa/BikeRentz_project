import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../lib/api-client";
import { useAuth } from "../../lib/auth";
import "./Admin.css";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roles = ["user", "admin"];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);

  async function load() {
    const res = await apiClient.get("/admin/users");
    setUsers(res.data.data);
  }

  useEffect(() => { load(); }, []);

  async function updateRole(id: string, role: string) {
    try {
      await apiClient.patch(`/admin/users/${id}/role`, { role });
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div>
      <h1>Users</h1>
      <div className="br-admin-table-wrap">
        <table className="br-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={u._id === currentUser?.id}
                    title={u._id === currentUser?.id ? "You can't change your own role" : undefined}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                  >
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
