import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./pages/AddRecipe";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("recipes");
  const [user, setUser] = useState(null);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setActiveTab("recipes");
  };

  return (
    <div className="container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      
      <main>
        {user && (
          <div className="user-info">
            <p>Role: <span className="badge">{user.role}</span></p>
            <p>Welcome, <strong>{user.name}</strong>!</p>
          </div>
        )}
        
        {activeTab === "recipes" && <Home user={user} />}
        {activeTab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {!user && <Register />}
            <Login onLogin={handleLogin} />
          </div>
        )}
        {activeTab === "dashboard" && user?.role === "admin" && (
          <div className="tab-content">
            <h2>🛠️ Admin Panel</h2>
            <AddRecipe onRecipeAdded={() => setActiveTab("recipes")} />
          </div>
        )}
        {activeTab === "dashboard" && user?.role !== "admin" && (
          <div className="tab-content">
            <p className="error-message">❌ Access Denied: Admin role required.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;