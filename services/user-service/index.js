
const express = require("express");
const connectDB = require("./db");
const User = require("./models/User");
const store = require("./inMemoryStore");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const useInMemory = process.env.USE_IN_MEMORY === "true";

// Initialize database connection unless we intentionally run in-memory
let dbReady = false;
if (!useInMemory) {
  connectDB()
    .then(() => { dbReady = true; })
    .catch(err => {
      console.error("MongoDB connection failed (service will stay up but DB ops will fail):", err.message);
    });
} else {
  console.log("Using in-memory user store (MongoDB disabled)");
  dbReady = true;
}

// POST - Register a new user
app.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    if (useInMemory) {
      const existing = await store.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const user = await store.addUser({ email, name, password });
      return res.json({ msg: "User registered", user });
    }

    if (!dbReady) {
      return res.status(503).json({ error: "Database not connected. Please try again shortly." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({ email, name, password });
    await user.save();
    res.json({ msg: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch all users
app.get("/", async (req, res) => {
  try {
    if (!useInMemory && !dbReady) {
      return res.json([]); // return empty list gracefully while DB is connecting
    }
    const users = useInMemory
      ? await store.getAllUsers()
      : await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (useInMemory) {
      const user = await store.verifyUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      return res.json({ msg: "Login successful", user });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    // Note: In production, use bcrypt to hash and compare passwords
    // For now, we're just checking if the email exists
    res.json({ msg: "Login successful", user: { _id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4001, () => console.log("User Service running on port 4001"));
