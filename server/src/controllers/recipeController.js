const Recipe = require('../models/Recipe');
const PantryItem = require('../models/PantryItem');
const CookingHistory = require('../models/CookingHistory');
const { analyzeRecipeMatch, rankRecipes } = require('../services/recipeMatcher');
const { normalizeName } = require('../utils/normalize');
const { calculateExpiryStatus } = require('../utils/expiryHelper');
const { areUnitsCompatible, convertQuantity } = require('../utils/unitConverter');

// @desc    Get all recipes with optional filters and match calculations
// @route   GET /api/recipes
// @access  Public / Authenticated
const getRecipes = async (req, res, next) => {
  try {
    const { category, search, tag } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (tag && tag !== 'All') {
      filter.tags = tag;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(filter);

    // If user is authenticated, calculate pantry match info
    let userPantry = [];
    if (req.user) {
      userPantry = await PantryItem.find({ userId: req.user._id });
    }

    const ranked = rankRecipes(recipes, userPantry);

    return res.status(200).json({
      success: true,
      count: ranked.length,
      data: ranked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get zero-waste recipe recommendations for logged-in user
// @route   GET /api/recipes/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const pantryItems = await PantryItem.find({ userId: req.user._id });
    const recipes = await Recipe.find({});

    const ranked = rankRecipes(recipes, pantryItems);

    // Filter top recommendations that have at least some match or use expiring items
    const expiringItemsCount = pantryItems.filter(i => calculateExpiryStatus(i.expiryDate).isExpiringSoon).length;

    return res.status(200).json({
      success: true,
      count: ranked.length,
      expiringIngredientsInPantry: expiringItemsCount,
      data: ranked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID with match details
// @route   GET /api/recipes/:id
// @access  Public / Authenticated
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    let userPantry = [];
    if (req.user) {
      userPantry = await PantryItem.find({ userId: req.user._id });
    }

    const match = analyzeRecipeMatch(recipe, userPantry);

    return res.status(200).json({
      success: true,
      data: {
        ...recipe.toObject(),
        match
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cook a recipe: deduct inventory, prevent double deduction, record food waste saved
// @route   POST /api/recipes/:id/cook
// @access  Private
const cookRecipe = async (req, res, next) => {
  try {
    const { idempotencyKey } = req.body;

    // Check idempotency if key was provided
    if (idempotencyKey) {
      const existingHistory = await CookingHistory.findOne({
        userId: req.user._id,
        idempotencyKey
      });

      if (existingHistory) {
        return res.status(200).json({
          success: true,
          message: 'Recipe was already marked as cooked.',
          alreadyProcessed: true,
          data: existingHistory
        });
      }
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Fetch user's pantry items
    const pantryItems = await PantryItem.find({ userId: req.user._id });

    // Validate availability of all required ingredients
    const match = analyzeRecipeMatch(recipe, pantryItems);

    if (!match.isFullyCookable) {
      const missingNames = match.missingIngredients.map(m => `${m.missingQuantity} ${m.unit} ${m.name}`).join(', ');
      return res.status(400).json({
        success: false,
        message: `Cannot cook this recipe. Missing or insufficient ingredients: ${missingNames}`,
        missingIngredients: match.missingIngredients
      });
    }

    // Track deductions and food waste saved
    let totalSavedQuantityGrams = 0;
    const ingredientsUsedSummary = [];

    // Deduct each required ingredient
    for (const recIng of recipe.ingredients) {
      const recNorm = recIng.normalizedName || normalizeName(recIng.name);
      let needed = recIng.quantity; // in recipe's unit

      // Find matching pantry items for this ingredient, sorted by soonest expiry
      const matchingPantryItems = pantryItems
        .filter(item => {
          const itemNorm = item.normalizedName || normalizeName(item.name);
          return itemNorm === recNorm || itemNorm.includes(recNorm) || recNorm.includes(itemNorm);
        })
        .sort((a, b) => {
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        });

      for (const pItem of matchingPantryItems) {
        if (needed <= 0) break;

        const expStatus = calculateExpiryStatus(pItem.expiryDate);
        const wasExpiring = expStatus.isExpiringSoon;

        // Convert available quantity to recipe's unit
        let availableInReqUnit = pItem.quantity;
        if (areUnitsCompatible(pItem.unit, recIng.unit)) {
          availableInReqUnit = convertQuantity(pItem.quantity, pItem.unit, recIng.unit);
        }

        const deductInReqUnit = Math.min(needed, availableInReqUnit);
        
        // Convert deduction back to pantry item's unit
        let deductInPantryUnit = deductInReqUnit;
        if (areUnitsCompatible(recIng.unit, pItem.unit)) {
          deductInPantryUnit = convertQuantity(deductInReqUnit, recIng.unit, pItem.unit);
        }

        const newPantryQty = Math.max(0, pItem.quantity - deductInPantryUnit);
        pItem.quantity = Math.round(newPantryQty * 100) / 100;

        if (pItem.quantity <= 0.001) {
          await PantryItem.findByIdAndDelete(pItem._id);
        } else {
          await pItem.save();
        }

        // If ingredient was expiring soon, calculate food waste saved
        if (wasExpiring) {
          // Approximate grams: if g/kg convert to g, if pieces/cups estimate 100g each
          let gramEquivalent = deductInReqUnit;
          if (recIng.unit === 'kg') gramEquivalent = deductInReqUnit * 1000;
          else if (recIng.unit === 'pieces' || recIng.unit === 'cups') gramEquivalent = deductInReqUnit * 100;
          else if (recIng.unit === 'L') gramEquivalent = deductInReqUnit * 1000;
          totalSavedQuantityGrams += gramEquivalent;
        }

        ingredientsUsedSummary.push({
          name: pItem.name,
          quantity: Math.round(deductInReqUnit * 100) / 100,
          unit: recIng.unit,
          wasExpiring
        });

        needed -= deductInReqUnit;
      }
    }

    // Record CookingHistory
    const history = await CookingHistory.create({
      userId: req.user._id,
      recipeId: recipe._id,
      ingredientsUsed: ingredientsUsedSummary,
      savedQuantity: Math.round(totalSavedQuantityGrams),
      idempotencyKey: idempotencyKey || undefined
    });

    return res.status(200).json({
      success: true,
      message: `Delicious! "${recipe.name}" cooked successfully. Pantry inventory updated.`,
      savedFoodWasteGrams: Math.round(totalSavedQuantityGrams),
      history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipes,
  getRecommendations,
  getRecipeById,
  cookRecipe
};

