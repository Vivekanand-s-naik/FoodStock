import React from "react";

const Navbar = ({ activeTab, setActiveTab, user }) => {
  const isAdmin = user?.role === "admin";
  
  return (
    <nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "var(--card-bg)", borderRadius: "15px", marginBottom: "30px", backdropFilter: "var(--glass-blur)" }}>
      <div className="navbar-brand">
        <h1 style={{ fontSize: "1.8em", margin: 0 }}>🍱 FoodApp</h1>
      </div>
      <div className="tabs" style={{ margin: 0 }}>
        <button 
          className={`tab-btn ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => setActiveTab("recipes")}
        >
          🍳 Recipes
        </button>
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          {user ? "👤 Profile" : "👥 Login"}
        </button>
        {isAdmin && (
          <button 
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            🛠️ Admin
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
