import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { apiClient } from "../lib/api-client";
import "./NotificationBell.css";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function load() {
    try {
      const res = await apiClient.get("/notifications");
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch {
      // silently ignore if not logged in yet
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  async function handleOpen() {
    setOpen((o) => !o);
    if (unreadCount > 0) {
      await apiClient.patch("/notifications/read-all");
      setUnreadCount(0);
    }
  }

  return (
    <div className="br-notif-wrapper">
      <button className="br-icon-btn br-notif-btn" onClick={handleOpen}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="br-notif-dot">{unreadCount}</span>}
      </button>

      {open && (
        <div className="br-notif-dropdown">
          {notifications.length === 0 ? (
            <p className="br-notif-empty">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={`br-notif-item ${n.read ? "" : "unread"}`}>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
