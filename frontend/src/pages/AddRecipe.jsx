import React, { useState } from "react";
import { api } from "../services/api";

const AddRecipe = ({ onRecipeAdded }) => {
  const [formData, setFormData] = useState({ name: "", category: "Lunch", price: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addRecipe({ ...formData, price: parseFloat(formData.price) || 0 });
      alert("Recipe added successfully!");
      setFormData({ name: "", category: "Lunch", price: "", description: "" });
      if (onRecipeAdded) onRecipeAdded();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2>➕ Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={e => setFormData({...formData, price: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Save Recipe"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
