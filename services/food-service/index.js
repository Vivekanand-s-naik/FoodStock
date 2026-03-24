
const express = require("express");
const app = express();
app.use(express.json());

let foods = [
  { id: 1, name: "Pizza", category: "Italian", price: 12.99, description: "Delicious cheese pizza" },
  { id: 2, name: "Burger", category: "American", price: 8.99, description: "Juicy beef burger" },
  { id: 3, name: "Sushi", category: "Japanese", price: 15.99, description: "Fresh assorted sushi rolls" }
];
let nextId = 4;

app.post("/", (req, res) => {
  const { name, category = "Other", price = 0, description = "" } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Food name is required" });
  }
  const food = { id: nextId++, name, category, price, description, createdAt: new Date() };
  foods.push(food);
  res.json({ msg: "Food added", food });
});

app.get("/", (req, res) => res.json(foods));

app.get("/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const category = req.query.category || "";
  let results = foods;
  
  if (query) {
    results = results.filter(f => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query));
  }
  if (category) {
    results = results.filter(f => f.category === category);
  }
  res.json(results);
});

app.get("/categories", (req, res) => {
  const categories = [...new Set(foods.map(f => f.category))];
  res.json(categories);
});

app.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const food = foods.find(f => f.id === id);
  if (!food) {
    return res.status(404).json({ error: "Food not found" });
  }
  
  if (req.body.name) food.name = req.body.name;
  if (req.body.category) food.category = req.body.category;
  if (req.body.price !== undefined) food.price = req.body.price;
  if (req.body.description) food.description = req.body.description;
  
  res.json({ msg: "Food updated", food });
});

app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE request for id: ${id}`);
  
  const index = foods.findIndex(f => f.id === id);
  if (index === -1) {
    console.log(`Food with id ${id} not found`);
    return res.status(404).json({ error: "Food not found" });
  }
  
  const deleted = foods.splice(index, 1);
  console.log(`Successfully deleted food: ${deleted[0].name}`);
  res.json({ msg: "Food deleted", food: deleted[0] });
});

app.listen(4002, () => console.log("Food Service running"));
