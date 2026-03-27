import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
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

  return (
    <div className="tab-content">
      <h2>🍳 Delicious Recipes</h2>
      {error && <div className="error-message">❌ {error}</div>}
      {loading && <p>Loading recipes...</p>}
      
      <div className="books-grid">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onDelete={handleDelete}
            onEdit={(r) => alert("Edit: " + r.name)} // Simplified for now
          />
        ))}
        {recipes.length === 0 && !loading && <p>No recipes found. Be the first to add one!</p>}
      </div>
    </div>
  );
};

export default Home;
