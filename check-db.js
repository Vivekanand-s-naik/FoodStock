const mongoose = require("mongoose");

async function checkDB() {
  try {
    console.log("Connecting to MongoDB...");
    
    // Connect to both databases
    const userConn = await mongoose.connect("mongodb://localhost:27017/user-service");
    const userDb = mongoose.connection.db;
    
    console.log("\n=== USER-SERVICE DATABASE ===");
    const userCollections = await userDb.listCollections().toArray();
    console.log("Collections:", userCollections.map(c => c.name));
    
    const users = await userDb.collection("users").find().toArray();
    console.log("Users count:", users.length);
    console.log("Users:", JSON.stringify(users, null, 2));
    
    await mongoose.disconnect();
    
    // Connect to food-service
    const foodConn = await mongoose.connect("mongodb://localhost:27017/food-service");
    const foodDb = mongoose.connection.db;
    
    console.log("\n=== FOOD-SERVICE DATABASE ===");
    const foodCollections = await foodDb.listCollections().toArray();
    console.log("Collections:", foodCollections.map(c => c.name));
    
    const foods = await foodDb.collection("foods").find().toArray();
    console.log("Foods count:", foods.length);
    console.log("Foods:", JSON.stringify(foods, null, 2));
    
    await mongoose.disconnect();
    
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkDB();
