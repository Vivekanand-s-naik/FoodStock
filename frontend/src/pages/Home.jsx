import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await api.getRecipes();
      setRecipes(Array.isArray(data) ? data.map(r => ({ ...r, id: r._id || r.id })) : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await api.deleteRecipe(id);
      fetchRecipes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOrder = async (recipe) => {
    if (!user) {
      alert("Please login as a User to place an order.");
      return;
    }
    
    if (user.role === "admin") {
      alert("Admins cannot place orders. Please use a User account.");
      return;
    }

    setLoading(true);
    try {
      await api.createOrder({
        userId: user._id,
        customerName: user.name,
        items: [{ recipeId: recipe.id, name: recipe.name, quantity: 1, price: recipe.price }],
        totalAmount: recipe.price
      });
      alert("Order placed successfully! Admin has been notified.");
      fetchRecipes(); // Refresh for stock count
    } catch (err) {
      alert("Order failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="header-flex">
        <h2>🍳 Delicious Recipes</h2>
        <button className="btn btn-secondary btn-sm" onClick={fetchRecipes}>🔄 Refresh</button>
      </div>
      
      {error && <div className="error-message">❌ {error}</div>}
      {loading && <p>Processing...</p>}
      
      <div className="books-grid">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            userRole={user?.role}
            onDelete={handleDelete}
            onOrder={handleOrder}
            onEdit={(r) => alert("Edit: " + r.name)}
          />
        ))}
        {recipes.length === 0 && !loading && <p>No recipes found. Be the first to add one!</p>}
      </div>
    </div>
  );
};

export default Home;
