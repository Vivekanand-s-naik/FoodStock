
import React, { useEffect, useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("foods");
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form states
  const [foodName, setFoodName] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  
  const [editingFood, setEditingFood] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const readApiResponse = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    throw new Error(text || "Request failed with a non-JSON response");
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // FOODS OPERATIONS
  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:4000/foods");
      if (!res.ok) throw new Error(`Failed to fetch foods (${res.status})`);
      const data = await readApiResponse(res);
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch foods: " + err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/foods/categories");
      if (!res.ok) return;
      const data = await readApiResponse(res);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const addFood = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) {
      showMessage("error", "Food name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: foodName,
          category: foodCategory || "Other",
          price: parseFloat(foodPrice) || 0,
          description: foodDescription
        })
      });

      if (!res.ok) {
        const error = await readApiResponse(res);
        throw new Error(error.error || "Failed to add food");
      }

      setFoodName("");
      setFoodCategory("");
      setFoodPrice("");
      setFoodDescription("");
      showMessage("success", "Food added successfully!");
      fetchFoods();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFood = async (e) => {
    e.preventDefault();
    if (!editingFood || !foodName.trim()) {
      showMessage("error", "Food name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/foods/${editingFood.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: foodName,
          category: foodCategory,
          price: parseFloat(foodPrice),
          description: foodDescription
        })
      });

      if (!res.ok) {
        const error = await readApiResponse(res);
        throw new Error(error.error || "Failed to update food");
      }

      setShowEditModal(false);
      setEditingFood(null);
      setFoodName("");
      setFoodCategory("");
      setFoodPrice("");
      setFoodDescription("");
      showMessage("success", "Food updated successfully!");
      fetchFoods();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    if (!confirm("Are you sure you want to delete this food?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/foods/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        try {
          const error = await readApiResponse(res);
          throw new Error(error.error || `Failed to delete food (${res.status})`);
        } catch (parseErr) {
          throw new Error(`Failed to delete food (${res.status})`);
        }
      }

      const data = await readApiResponse(res);
      showMessage("success", "Food deleted successfully!");
      fetchFoods();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFoodName(food.name);
    setFoodCategory(food.category);
    setFoodPrice(food.price);
    setFoodDescription(food.description || "");
    setShowEditModal(true);
  };

  const searchFoods = async () => {
    if (!searchQuery.trim() && !filterCategory) {
      fetchFoods();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (filterCategory) params.append("category", filterCategory);

      const res = await fetch(`http://localhost:4000/foods/search?${params}`);
      if (!res.ok) throw new Error(`Failed to search (${res.status})`);
      const data = await readApiResponse(res);
      setFoods(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage("error", "Search failed: " + err.message);
    }
  };

  // USERS OPERATIONS
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/users");
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data = await readApiResponse(res);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch users: " + err.message);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      showMessage("error", "Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword
        })
      });

      if (!res.ok) {
        const error = await readApiResponse(res);
        throw new Error(error.error || "Registration failed");
      }

      setUserName("");
      setUserEmail("");
      setUserPassword("");
      showMessage("success", "User registered successfully!");
      fetchUsers();
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchUsers();
  }, []);

  const filteredFoods = foods.filter(food => {
    const matchSearch = !searchQuery || 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !filterCategory || food.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalFoods = foods.length;
  const totalUsers = users.length;
  const averagePrice = foods.length > 0 
    ? (foods.reduce((sum, f) => sum + (f.price || 0), 0) / foods.length).toFixed(2)
    : 0;

  return (
    <div className="container">
      <header>
        <h1>🍽️ Food Management System</h1>
        <p>Manage your food inventory with ease and style</p>
      </header>

      {message.text && (
        <div className={`${message.type}-message`}>
          {message.type === "error" ? "❌" : "✅"} {message.text}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === "foods" ? "active" : ""}`}
          onClick={() => setActiveTab("foods")}
        >
          🍔 Foods
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

      {activeTab === "foods" && (
        <div className="tab-content">
          <div className="form-section">
            <h2>{editingFood ? "Edit Food" : "Add New Food"}</h2>
            <form onSubmit={editingFood ? updateFood : addFood}>
              <div className="form-row">
                <div className="form-group">
                  <label>Food Name *</label>
                  <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g., Pizza"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select or type new</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(e.target.value)}
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                  placeholder="Describe your food..."
                  disabled={loading}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Processing..." : editingFood ? "Update Food" : "Add Food"}
                </button>
                {editingFood && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingFood(null);
                      setFoodName("");
                      setFoodCategory("");
                      setFoodPrice("");
                      setFoodDescription("");
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={searchFoods}>
              Search
            </button>
          </div>

          <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <button 
              className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </button>
            <button 
              className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setViewMode("list")}
            >
              List View
            </button>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="empty-state">
              <h3>No foods found</h3>
              <p>Try adjusting your search or add a new food item</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="foods-grid">
              {filteredFoods.map((food) => (
                <div key={food.id} className="food-card">
                  <div className="food-card-header">
                    <h3>{food.name}</h3>
                  </div>
                  <div className="food-card-body">
                    <span className="food-category">{food.category}</span>
                    {food.price > 0 && <div className="food-price">${food.price.toFixed(2)}</div>}
                    <p className="food-description">{food.description || "No description"}</p>
                  </div>
                  <div className="food-card-footer">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(food)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteFood(food.id)}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food.id}>
                    <td><strong>{food.name}</strong></td>
                    <td>{food.category}</td>
                    <td>${food.price.toFixed(2)}</td>
                    <td>{food.description || "-"}</td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(food)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteFood(food.id)}
                        disabled={loading}
                        style={{ marginLeft: "5px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="tab-content">
          <div className="form-section">
            <h2>Register New User</h2>
            <form onSubmit={registerUser}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full name"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Email address"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Register User"}
              </button>
            </form>
          </div>

          <h2 style={{ marginTop: "30px", marginBottom: "15px" }}>Registered Users</h2>
          {users.length === 0 ? (
            <div className="empty-state">
              <h3>No users registered yet</h3>
              <p>Register your first user above</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>📧 {user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "dashboard" && (
        <div className="tab-content">
          <div className="dashboard">
            <div className="stat-card">
              <h3>Total Foods</h3>
              <div className="value">{totalFoods}</div>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="value">{totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Average Price</h3>
              <div className="value">${averagePrice}</div>
            </div>
            <div className="stat-card">
              <h3>Categories</h3>
              <div className="value">{categories.length}</div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <h2>Food Breakdown by Category</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Average Price</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => {
                  const catFoods = foods.filter(f => f.category === cat);
                  const avgPrice = catFoods.length > 0 
                    ? (catFoods.reduce((sum, f) => sum + (f.price || 0), 0) / catFoods.length).toFixed(2)
                    : 0;
                  return (
                    <tr key={cat}>
                      <td><strong>{cat}</strong></td>
                      <td>{catFoods.length}</td>
                      <td>${avgPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showEditModal && editingFood && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Food Item</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFood(null);
                  setFoodName("");
                  setFoodCategory("");
                  setFoodPrice("");
                  setFoodDescription("");
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={updateFood}>
              <div className="form-group">
                <label>Food Name *</label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., Pizza"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  placeholder="Category"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={foodPrice}
                  onChange={(e) => setFoodPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                  placeholder="Describe your food..."
                  disabled={loading}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Food"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFood(null);
                    setFoodName("");
                    setFoodCategory("");
                    setFoodPrice("");
                    setFoodDescription("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
