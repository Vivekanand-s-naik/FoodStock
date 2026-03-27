const API_BASE_URL = "http://localhost:4000";

const handleResponse = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
    return {};
  }
};

export const api = {
  // Recipes (formerly Books)
  getRecipes: () => fetch(`${API_BASE_URL}/recipes`).then(handleResponse),
  getCategories: () => fetch(`${API_BASE_URL}/recipes/categories`).then(handleResponse),
  addRecipe: (recipe) => fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe)
  }).then(handleResponse),
  updateRecipe: (id, recipe) => fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe)
  }).then(handleResponse),
  deleteRecipe: (id) => fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "DELETE"
  }).then(handleResponse),
  searchRecipes: (query, category) => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    return fetch(`${API_BASE_URL}/recipes/search?${params}`).then(handleResponse);
  },

  // Users
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(handleResponse),
  register: (user) => fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).then(handleResponse),
  login: (credentials) => fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }).then(handleResponse),

  // Orders
  getOrders: () => fetch(`${API_BASE_URL}/orders`).then(handleResponse),
  createOrder: (order) => fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  }).then(handleResponse),

  // Notifications (Admin only)
  getNotifications: () => fetch(`${API_BASE_URL}/notifications`).then(handleResponse)
};
