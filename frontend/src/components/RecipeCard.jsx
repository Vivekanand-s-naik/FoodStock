import React from "react";

const RecipeCard = ({ recipe, onEdit, onDelete, onOrder, userRole, loading }) => {
  const isAdmin = userRole === "admin";
  
  return (
    <div className="book-card">
      {recipe.imageUrl && (
        <div className="book-image">
          <img src={recipe.imageUrl} alt={recipe.name} style={{ width: "100%", borderRadius: "8px", height: "200px", objectFit: "cover" }} />
        </div>
      )}
      <div className="book-card-header">
        <h3>{recipe.name}</h3>
      </div>
      <div className="book-card-body">
        <span className="book-category">{recipe.category}</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          {recipe.price > 0 && <span className="book-price">${recipe.price.toFixed(2)}</span>}
          <span className={`stock-tag ${recipe.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
            {recipe.quantity > 0 ? `${recipe.quantity} left` : "Out of stock"}
          </span>
        </div>
        <p className="book-description">{recipe.description || "No description provided"}</p>
      </div>
      <div className="book-card-footer">
        {isAdmin ? (
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(recipe)} style={{ flex: 1 }}>✏️ Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(recipe.id)} disabled={loading === recipe.id} style={{ flex: 1 }}>
              {loading === recipe.id ? "..." : "🗑️ Delete"}
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => onOrder(recipe)} 
            disabled={recipe.quantity <= 0}
            style={{ width: "100%" }}
          >
            🛒 {recipe.quantity > 0 ? "Order Now" : "Unavailable"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
