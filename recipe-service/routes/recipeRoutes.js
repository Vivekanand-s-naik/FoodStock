const express = require("express");
const router = express.Router();
const recipeController = require("../controller/recipeController");

router.post("/", recipeController.createRecipe);
router.get("/", recipeController.getAllRecipes);
router.get("/search", recipeController.searchRecipes);
router.get("/categories", recipeController.getCategories);
router.put("/:id", recipeController.updateRecipe);
router.patch("/:id/quantity", recipeController.updateQuantity);
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
