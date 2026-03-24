
const express = require("express");
const app = express();
app.use(express.json());

let users = [
  { id: 1, email: "demo@example.com", name: "Demo User", createdAt: new Date() }
];
let nextId = 2;

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const user = { id: nextId++, email, name, createdAt: new Date() };
  users.push(user);
  res.json({ msg: "User registered", user });
});

app.get("/", (req, res) => res.json(users));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  res.json({ msg: "Login successful", user });
});

app.listen(4001, () => console.log("User Service running"));
