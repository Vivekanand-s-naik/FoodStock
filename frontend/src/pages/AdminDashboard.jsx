import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import AddRecipe from "./AddRecipe";

const AdminDashboard = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tab-content">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <div>
          <h2>🛠️ Catalog Management</h2>
          <AddRecipe onRecipeAdded={() => alert("Added! check recipes tab.")} />
        </div>
        
        <div>
          <h2>🔔 Recent Alerts</h2>
          {loading && <p>Checking for alerts...</p>}
          <div className="notifications-list" style={{ maxHeight: "600px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map(notif => (
              <div key={notif.id} className="user-card" style={{ borderLeft: "4px solid var(--secondary-color)", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "5px" }}>
                  <strong>{notif.subject}</strong>
                  <small style={{ color: "var(--text-secondary)" }}>{new Date(notif.timestamp).toLocaleTimeString()}</small>
                </div>
                <p style={{ fontSize: "0.9em", margin: 0 }}>{notif.body}</p>
              </div>
            ))}
            {notifications.length === 0 && !loading && (
              <div className="empty-state">
                <p>No new orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
