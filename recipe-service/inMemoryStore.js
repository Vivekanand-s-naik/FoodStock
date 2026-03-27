// In-memory data store fallback when MongoDB is not available
// Useful for development/testing without MongoDB

class InMemoryRecipeStore {
  constructor() {
    this.recipes = [];
    this.idCounter = 1;
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
