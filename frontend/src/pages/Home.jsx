// import React, { useState, useEffect } from "react";
// import { api } from "../services/api";
// import RecipeCard from "../components/RecipeCard";

// const Home = ({ user }) => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchRecipes = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getRecipes();
//       setRecipes(Array.isArray(data) ? data.map(r => ({ ...r, id: r._id || r.id })) : []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecipes();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this recipe?")) return;
//     try {
//       await api.deleteRecipe(id);
//       fetchRecipes();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleOrder = async (recipe) => {
//     if (!user) {
//       alert("Please login as a User to place an order.");
//       return;
//     }

//     if (user.role === "admin") {
//       alert("Admins cannot place orders. Please use a User account.");
//       return;
//     }

//     console.log("handleOrder called for recipe:", recipe.name, recipe.id);
//     setLoading(true);
//     try {
//       const orderData = {
//         userId: user._id,
//         customerName: user.name,
//         items: [{ recipeId: recipe.id, name: recipe.name, quantity: 1, price: recipe.price }],
//         totalAmount: recipe.price
//       };
//       console.log("Sending order request:", orderData);

//       const response = await api.createOrder(orderData);
//       console.log("Order response:", response);

//       alert("Order placed successfully! Admin has been notified.");
//       fetchRecipes(); // Refresh for stock count
//     } catch (err) {
//       console.error("Order process error:", err);
//       alert("Order failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="tab-content">
//       <div className="header-flex">
//         <h2>🍳 Delicious Recipes</h2>
//         <button className="btn btn-secondary btn-sm" onClick={fetchRecipes}>🔄 Refresh</button>
//       </div>

//       {error && <div className="error-message">❌ {error}</div>}
//       {loading && <p>Processing...</p>}

//       <div className="books-grid">
//         {recipes.map(recipe => (
//           <RecipeCard
//             key={recipe.id}
//             recipe={recipe}
//             userRole={user?.role}
//             onDelete={handleDelete}
//             onOrder={handleOrder}
//             onEdit={(r) => alert("Edit: " + r.name)}
//           />
//         ))}
//         {recipes.length === 0 && !loading && <p>No recipes found. Be the first to add one!</p>}
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import RecipeCard from "../components/RecipeCard";

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderingId, setOrderingId] = useState(null); // ✅ track per-button loading
  const [error, setError] = useState("");

  // ✅ Fetch Recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getRecipes();

      const formatted = Array.isArray(data)
        ? data.map((r) => ({
          ...r,
          id: r._id || r.id, // normalize id
        }))
        : [];

      setRecipes(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;

    try {
      await api.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id)); // instant UI update
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ✅ Order (FIXED)
  const handleOrder = async (recipe) => {
    if (!user) {
      alert("Please login as a User to place an order.");
      return;
    }

    if (user.role === "admin") {
      alert("Admins cannot place orders.");
      return;
    }

    if (!recipe?.id) {
      alert("Invalid recipe data.");
      return;
    }

    setOrderingId(recipe.id); // ✅ only disable clicked button

    try {
      const orderData = {
        userId: user._id,
        customerName: user.name,
        items: [
          {
            recipeId: recipe.id,
            name: recipe.name,
            quantity: 1,
            price: recipe.price,
          },
        ],
        totalAmount: recipe.price,
      };

      console.log("Order Request:", orderData);

      await api.createOrder(orderData);

      alert("✅ Order placed successfully!");

      // ✅ Optimistic UI update (reduce stock if exists)
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipe.id && r.quantity !== undefined
            ? { ...r, quantity: r.quantity - 1 }
            : r
        )
      );
    } catch (err) {
      console.error("Order error:", err);
      alert("Order failed: " + (err.message || "Unknown error"));
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="header-flex">
        <h2>🍳 Delicious Recipes</h2>
        <button
          className="btn btn-secondary btn-sm"
          onClick={fetchRecipes}
          disabled={loading}
        >
          🔄 {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-message">❌ {error}</div>}

      {/* Global Loader */}
      {loading && <p>Loading recipes...</p>}

      {/* Recipes */}
      <div className="books-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              userRole={user?.role}
              onDelete={handleDelete}
              onOrder={handleOrder}
              onEdit={(r) => alert("Edit: " + r.name)}
              isOrdering={orderingId === recipe.id} // ✅ pass loading state
            />
          ))
        ) : (
          !loading && <p>No recipes found. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
