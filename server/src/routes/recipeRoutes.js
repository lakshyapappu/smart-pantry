const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecommendations,
  getRecipeById,
  cookRecipe
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getRecipes);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', optionalAuth, getRecipeById);
router.post('/:id/cook', protect, cookRecipe);

module.exports = router;

