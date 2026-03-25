
const express = require("express");
const connectDB = require("./db");
const Food = require("./models/Food");
const store = require("./inMemoryStore");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const useInMemory = process.env.USE_IN_MEMORY === "true";

// Initialize database connection unless we intentionally run in-memory
if (!useInMemory) {
  connectDB().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
} else {
  console.log("Using in-memory food store (MongoDB disabled)");
}

// POST - Create a new food
app.post("/", async (req, res) => {
  try {
    const { name, category = "Other", price = 0, description = "" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Food name is required" });
    }
    
    if (useInMemory) {
      const food = await store.addFood({ name, category, price, description });
      return res.json({ msg: "Food added", food });
    }

    const food = new Food({ name, category, price, description });
    await food.save();
    res.json({ msg: "Food added", food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch all foods
app.get("/", async (req, res) => {
  try {
    const foods = useInMemory ? await store.getAllFoods() : await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Search foods
app.get("/search", async (req, res) => {
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
      ? await store.searchFoods(query, category)
      : await Food.find(filter);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch categories
app.get("/categories", async (req, res) => {
  try {
    const categories = useInMemory
      ? await store.getCategories()
      : await Food.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update food by ID
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = useInMemory
      ? await store.updateFood(id, { ...req.body, updatedAt: new Date() })
      : await Food.findByIdAndUpdate(
          id,
          { 
            ...req.body,
            updatedAt: new Date()
          },
          { new: true }
        );
    
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    
    res.json({ msg: "Food updated", food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete food by ID
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = useInMemory
      ? await store.deleteFood(id)
      : await Food.findByIdAndDelete(id);
    
    if (!food) {
      console.log(`Food with id ${id} not found`);
      return res.status(404).json({ error: "Food not found" });
    }
    
    console.log(`Successfully deleted food: ${food.name}`);
    res.json({ msg: "Food deleted", food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4002, () => console.log("Food Service running on port 4002"));
