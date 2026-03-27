import React from "react";

const RecipeCard = ({ recipe, onEdit, onDelete, loading }) => {
  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3>{recipe.name}</h3>
      </div>
      <div className="book-card-body">
        <span className="book-category">{recipe.category}</span>
        {recipe.price > 0 && <div className="book-price">${recipe.price.toFixed(2)}</div>}
        <p className="book-description">{recipe.description || "No description provided"}</p>
      </div>
      <div className="book-card-footer">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(recipe)}
        >
          ✏️ Edit
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(recipe.id)}
          disabled={loading === recipe.id}
        >
          {loading === recipe.id ? "..." : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
