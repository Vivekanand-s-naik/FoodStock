const mongoose = require("mongoose");

async function checkDB() {
  try {
    console.log("Connecting to MongoDB...");
    
    // Connect to user-service
    await mongoose.connect("mongodb://localhost:27017/user-service");
    const userDb = mongoose.connection.db;
    
    console.log("\n✓ USER-SERVICE DATABASE ✓");
    const userCollections = await userDb.listCollections().toArray();
    console.log("Collections:", userCollections.map(c => c.name));
    
    const users = await userDb.collection("users").find().toArray();
    console.log("Users count:", users.length);
    if (users.length > 0) {
      console.log("Users data:", users);
    }
    
    await mongoose.disconnect();
    
    // Connect to book-service
    await mongoose.connect("mongodb://localhost:27017/book-service");
    const bookDb = mongoose.connection.db;
    
    console.log("\n✓ FOOD-SERVICE DATABASE ✓");
    const bookCollections = await bookDb.listCollections().toArray();
    console.log("Collections:", bookCollections.map(c => c.name));
    
    const books = await bookDb.collection("books").find().toArray();
    console.log("Books count:", books.length);
    if (books.length > 0) {
      console.log("Books data:", books);
    }
    
    await mongoose.disconnect();
    
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkDB();
