const mongoose = require("mongoose");

async function prime() {
  try {
    console.log("Priming Recipe Service...");
    await mongoose.connect("mongodb://localhost:27017/foodapp-recipe-service");
    const Recipe = mongoose.model("Recipe", new mongoose.Schema({}, { strict: false }));
    const rResult = await Recipe.updateMany({}, { $set: { quantity: 20 } });
    console.log(`Updated ${rResult.modifiedCount} recipes with stock.`);
    await mongoose.disconnect();

    console.log("Priming User Service...");
    await mongoose.connect("mongodb://localhost:27017/foodapp-user-service");
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const uResult = await User.updateMany({ role: { $exists: false } }, { $set: { role: "user" } });
    console.log(`Updated ${uResult.modifiedCount} users with default role 'user'.`);
    await mongoose.disconnect();

    console.log("Database primed successfully!");
  } catch (err) {
    console.error("Priming failed:", err.message);
  }
}

prime();
