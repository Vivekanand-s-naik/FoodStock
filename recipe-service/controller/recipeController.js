const Recipe = require("../models/recipeModel");
const store = require("../inMemoryStore");

const useInMemory = process.env.USE_IN_MEMORY === "true";

exports.createRecipe = async (req, res) => {
  try {
    const { name, category = "Other", price = 0, description = "", imageUrl = "", quantity = 0 } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Recipe name is required" });
    }
    
    if (useInMemory) {
      const recipe = await store.addRecipe({ name, category, price, description, imageUrl, quantity });
      return res.json({ msg: "Recipe added", recipe });
    }

    const recipe = new Recipe({ name, category, price, description, imageUrl, quantity });
    await recipe.save();
    res.json({ msg: "Recipe added", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = useInMemory ? await store.getAllRecipes() : await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    const query = req.query.q || "";
    const category = req.query.category || "";
    
    let filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    const results = useInMemory
      ? await store.searchRecipes(query, category)
      : await Recipe.find(filter);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = useInMemory
      ? await store.getCategories()
      : await Recipe.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = useInMemory
      ? await store.updateRecipe(id, { ...req.body, updatedAt: new Date() })
      : await Recipe.findByIdAndUpdate(
          id,
          { 
            ...req.body,
            updatedAt: new Date()
          },
          { new: true }
        );
    
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    res.json({ msg: "Recipe updated", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // use negative for decrement
    
    // Simple logic: fetch, check, update
    const recipe = useInMemory ? await store.getRecipeById(id) : await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const newQty = (recipe.quantity || 0) + amount;
    if (newQty < 0) return res.status(400).json({ error: "Insufficient stock" });

    if (useInMemory) {
      await store.updateRecipe(id, { quantity: newQty });
    } else {
      recipe.quantity = newQty;
      await recipe.save();
    }
    
    res.json({ msg: "Quantity updated", quantity: newQty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = useInMemory
      ? await store.deleteRecipe(id)
      : await Recipe.findByIdAndDelete(id);
    
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    res.json({ msg: "Recipe deleted", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
