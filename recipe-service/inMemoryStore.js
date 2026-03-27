// In-memory data store fallback when MongoDB is not available
// Useful for development/testing without MongoDB

class InMemoryRecipeStore {
  constructor() {
    this.recipes = [
      {
        _id: 101,
        name: "Classic Burger",
        category: "Fast Food",
        price: 9.99,
        description: "Juicy beef patty with lettuce and cheese.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        quantity: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 102,
        name: "Margherita Pizza",
        category: "Italian",
        price: 12.50,
        description: "Fresh tomato, mozzarella, and basil.",
        imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.idCounter = 200;
  }

  // Add a recipe
  async addRecipe(recipeData) {
    const recipe = {
      _id: this.idCounter++,
      ...recipeData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.recipes.push(recipe);
    return recipe;
  }

  // Get all recipes
  async getAllRecipes() {
    return this.recipes;
  }

  // Search recipes
  async searchRecipes(query, category) {
    let results = this.recipes;

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
    return [...new Set(this.recipes.map(f => f.category).filter(Boolean))];
  }

  // Get recipe by ID
  async getRecipeById(id) {
    return this.recipes.find(f => f._id == id);
  }

  // Update recipe
  async updateRecipe(id, updateData) {
    const recipe = this.recipes.find(f => f._id == id);
    if (!recipe) return null;

    Object.assign(recipe, updateData, { 
      _id: recipe._id,
      updatedAt: new Date() 
    });
    return recipe;
  }

  // Delete recipe
  async deleteRecipe(id) {
    const index = this.recipes.findIndex(f => f._id == id);
    if (index === -1) return null;

    const [deleted] = this.recipes.splice(index, 1);
    return deleted;
  }
}

// Singleton instance
const store = new InMemoryRecipeStore();

module.exports = store;
