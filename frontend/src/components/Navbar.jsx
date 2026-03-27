import React from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🍱 FoodApp</h1>
      </div>
      <div className="tabs">
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
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
