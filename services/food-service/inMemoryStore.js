// In-memory data store fallback when MongoDB is not available
// Useful for development/testing without MongoDB

class InMemoryFoodStore {
  constructor() {
    this.foods = [];
    this.idCounter = 1;
  }

  // Add a food
  async addFood(foodData) {
    const food = {
      _id: this.idCounter++,
      ...foodData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.foods.push(food);
    return food;
  }

  // Get all foods
  async getAllFoods() {
    return this.foods;
  }

  // Search foods
  async searchFoods(query, category) {
    let results = this.foods;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(f =>
        f.name.toLowerCase().includes(lowerQuery) ||
        (f.description && f.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (category) {
      results = results.filter(f => f.category === category);
    }

    return results;
  }

  // Get distinct categories
  async getCategories() {
    return [...new Set(this.foods.map(f => f.category).filter(Boolean))];
  }

  // Get food by ID
  async getFoodById(id) {
    return this.foods.find(f => f._id == id);
  }

  // Update food
  async updateFood(id, updateData) {
    const food = this.foods.find(f => f._id == id);
    if (!food) return null;

    Object.assign(food, updateData, { 
      _id: food._id,
      updatedAt: new Date() 
    });
    return food;
  }

  // Delete food
  async deleteFood(id) {
    const index = this.foods.findIndex(f => f._id == id);
    if (index === -1) return null;

    const [deleted] = this.foods.splice(index, 1);
    return deleted;
  }
}

// Singleton instance
const store = new InMemoryFoodStore();

module.exports = store;
