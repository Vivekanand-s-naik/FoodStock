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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {user && <p style={{ textAlign: "right", margin: "10px" }}>Welcome, <strong>{user.name}</strong>!</p>}
        
        {activeTab === "recipes" && <Home />}
        {activeTab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Register />
            <Login onLogin={handleLogin} />
          </div>
        )}
        {activeTab === "dashboard" && (
          <div className="tab-content">
            <h2>📈 Cooking Statistics</h2>
            <AddRecipe onRecipeAdded={() => setActiveTab("recipes")} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;