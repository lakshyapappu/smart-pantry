const PantryItem = require('../models/PantryItem');
const Recipe = require('../models/Recipe');
const GroceryItem = require('../models/GroceryItem');
const CookingHistory = require('../models/CookingHistory');
const { calculateExpiryStatus } = require('../utils/expiryHelper');
const { rankRecipes } = require('../services/recipeMatcher');

// @desc    Get dashboard summary statistics and sections for logged-in user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user's pantry items
    const pantryItems = await PantryItem.find({ userId }).sort({ expiryDate: 1 });

    let expiringSoonCount = 0;
    const expiringSoonList = [];

    for (const item of pantryItems) {
      const status = calculateExpiryStatus(item.expiryDate);
      if (status.isExpiringSoon) {
        expiringSoonCount += 1;
        const plain = item.toObject();
        plain.expiryStatus = status;
        expiringSoonList.push(plain);
      }
    }

    // 2. Fetch pending grocery items
    const pendingGroceryCount = await GroceryItem.countDocuments({
      userId,
      purchased: false
    });

    // 3. Compute food waste saved statistics from CookingHistory
    const cookingHistory = await CookingHistory.find({ userId });
    const totalFoodWasteSavedGrams = cookingHistory.reduce((sum, entry) => sum + (entry.savedQuantity || 0), 0);
    const totalMealsCooked = cookingHistory.length;

    // 4. Recipe match suggestions
    const recipes = await Recipe.find({});
    const rankedRecipes = rankRecipes(recipes, pantryItems);

    // Recipes with at least 50% match or fully cookable
    const availableRecipesCount = rankedRecipes.filter(r => r.match.matchPercentage >= 50 || r.match.isFullyCookable).length;

    // Top 4 suggestions for today
    const topSuggestions = rankedRecipes.slice(0, 4);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        },
        stats: {
          totalPantryItems: pantryItems.length,
          expiringSoonCount,
          recipesAvailable: availableRecipesCount,
          pendingGroceryItems: pendingGroceryCount,
          foodWasteSavedGrams: totalFoodWasteSavedGrams,
          foodWasteSavedKg: Math.round((totalFoodWasteSavedGrams / 1000) * 10) / 10,
          totalMealsCooked
        },
        expiringSoon: expiringSoonList.slice(0, 6),
        todaySuggestions: topSuggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};

