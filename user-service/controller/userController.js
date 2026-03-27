const User = require("../models/userModel");
const store = require("../inMemoryStore");

const useInMemory = process.env.USE_IN_MEMORY === "true";

exports.registerUser = async (req, res) => {
  try {
    const { email, name, password, role = "user" } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    if (useInMemory) {
      const existing = await store.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const user = await store.addUser({ email, name, password, role });
      return res.json({ msg: "User registered", user });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({ email, name, password, role });
    await user.save();
    res.json({ msg: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = useInMemory
      ? await store.getAllUsers()
      : await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
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
    
    res.json({ 
      msg: "Login successful", 
      user: { 
        _id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
