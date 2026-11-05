const { normalizeName } = require('../utils/normalize');
const { checkQuantityAvailability, areUnitsCompatible, convertQuantity } = require('../utils/unitConverter');
const { calculateExpiryStatus } = require('../utils/expiryHelper');

/**
 * Compare recipe ingredients against user's pantry items.
 * Returns detailed match information for a recipe:
 * - matchPercentage: (availableIngredientTypes / totalRequiredIngredientTypes) * 100
 * - isFullyCookable: boolean
 * - availableIngredients: array of { recipeIngredient, pantryItem, quantityAvailable, quantityNeeded, unit, isExpiringSoon, daysRemaining }
 * - missingIngredients: array of { name, quantityNeeded, unit }
 * - expiringCount: number of ingredients used that expire <= 5 days
 * - criticalExpiringCount: number of ingredients used that expire <= 1 day
 * - priorityScore: numerical score for zero-waste ranking
 */
function analyzeRecipeMatch(recipe, pantryItems) {
  const ingredients = recipe.ingredients || [];
  if (ingredients.length === 0) {
    return {
      matchPercentage: 0,
      isFullyCookable: false,
      availableIngredients: [],
      missingIngredients: [],
      expiringCount: 0,
      criticalExpiringCount: 0,
      priorityScore: 0
    };
  }

  // Index pantry items by normalized name for quick lookup
  const pantryMap = new Map();
  for (const item of pantryItems) {
    const norm = item.normalizedName || normalizeName(item.name);
    if (!pantryMap.has(norm)) {
      pantryMap.set(norm, []);
    }
    pantryMap.get(norm).push(item);
  }

  const availableIngredients = [];
  const missingIngredients = [];
  let availableTypesCount = 0;
  let expiringCount = 0;
  let criticalExpiringCount = 0;

  for (const recIng of ingredients) {
    const recNorm = recIng.normalizedName || normalizeName(recIng.name);
    
    // Find pantry matches: exact match, or substring match (e.g. "basmati rice" has "rice")
    let matchedPantryItems = pantryMap.get(recNorm) || [];
    
    if (matchedPantryItems.length === 0) {
      // Look for fuzzy/substring matches
      for (const [pNorm, items] of pantryMap.entries()) {
        if (pNorm.includes(recNorm) || recNorm.includes(pNorm)) {
          matchedPantryItems = items;
          break;
        }
      }
    }

    if (matchedPantryItems.length > 0) {
      // Find item with closest expiry date first (zero-waste priority, non-perishable last)
      const sortedByExpiry = [...matchedPantryItems].sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });
      const bestPantryItem = sortedByExpiry[0];
      
      // Calculate total available quantity across matching items
      let totalQtyInRecUnit = 0;
      let anyItemExpiringSoon = false;
      let anyItemCritical = false;
      let minDaysRemaining = 999;

      for (const pItem of matchedPantryItems) {
        const expStatus = calculateExpiryStatus(pItem.expiryDate);
        if (expStatus.isExpiringSoon) {
          anyItemExpiringSoon = true;
          if (expStatus.daysRemaining <= 1) {
            anyItemCritical = true;
          }
        }
        if (expStatus.daysRemaining < minDaysRemaining) {
          minDaysRemaining = expStatus.daysRemaining;
        }

        if (areUnitsCompatible(pItem.unit, recIng.unit)) {
          totalQtyInRecUnit += convertQuantity(pItem.quantity, pItem.unit, recIng.unit);
        } else {
          totalQtyInRecUnit += pItem.quantity;
        }
      }

      const isSufficient = totalQtyInRecUnit >= recIng.quantity;

      if (isSufficient) {
        availableTypesCount += 1;
        if (anyItemExpiringSoon) expiringCount += 1;
        if (anyItemCritical) criticalExpiringCount += 1;

        availableIngredients.push({
          name: recIng.name,
          normalizedName: recNorm,
          pantryItemId: bestPantryItem._id,
          pantryItemName: bestPantryItem.name,
          requiredQuantity: recIng.quantity,
          availableQuantity: totalQtyInRecUnit,
          unit: recIng.unit,
          isSufficient: true,
          isExpiringSoon: anyItemExpiringSoon,
          isCritical: anyItemCritical,
          daysRemaining: minDaysRemaining
        });
      } else {
        // Partially available - not counted as fully available type
        const missingAmount = Math.max(0, recIng.quantity - totalQtyInRecUnit);
        missingIngredients.push({
          name: recIng.name,
          normalizedName: recNorm,
          requiredQuantity: recIng.quantity,
          availableQuantity: totalQtyInRecUnit,
          missingQuantity: Math.round(missingAmount * 100) / 100,
          unit: recIng.unit
        });

        if (totalQtyInRecUnit > 0) {
          availableIngredients.push({
            name: recIng.name,
            normalizedName: recNorm,
            pantryItemId: bestPantryItem._id,
            pantryItemName: bestPantryItem.name,
            requiredQuantity: recIng.quantity,
            availableQuantity: totalQtyInRecUnit,
            unit: recIng.unit,
            isSufficient: false,
            isExpiringSoon: anyItemExpiringSoon,
            isCritical: anyItemCritical,
            daysRemaining: minDaysRemaining
          });
        }
      }
    } else {
      // Completely missing
      missingIngredients.push({
        name: recIng.name,
        normalizedName: recNorm,
        requiredQuantity: recIng.quantity,
        availableQuantity: 0,
        missingQuantity: recIng.quantity,
        unit: recIng.unit
      });
    }
  }

  const totalRequired = ingredients.length;
  const matchPercentage = totalRequired > 0 
    ? Math.round((availableTypesCount / totalRequired) * 100) 
    : 0;

  const isFullyCookable = availableTypesCount === totalRequired && missingIngredients.length === 0;

  // Calculate Zero-Waste Ranking Priority Score
  // 1. Critical expiring (<= 1 day): 1000 points per item
  // 2. Expiring soon (<= 5 days): 300 points per item
  // 3. Match percentage: up to 100 points
  // 4. Fewer missing ingredients penalty: -10 points per missing item
  const priorityScore =
    (criticalExpiringCount * 1000) +
    (expiringCount * 300) +
    matchPercentage -
    (missingIngredients.length * 10);

  return {
    matchPercentage,
    isFullyCookable,
    availableIngredients,
    missingIngredients,
    expiringCount,
    criticalExpiringCount,
    priorityScore
  };
}

/**
 * Rank and annotate a list of recipes according to user's pantry.
 */
function rankRecipes(recipes, pantryItems) {
  const annotated = recipes.map(recipe => {
    const match = analyzeRecipeMatch(recipe, pantryItems);
    return {
      ...recipe.toObject ? recipe.toObject() : recipe,
      match
    };
  });

  // Sort descending by priorityScore, then by matchPercentage, then fewer missing
  annotated.sort((a, b) => {
    if (b.match.criticalExpiringCount !== a.match.criticalExpiringCount) {
      return b.match.criticalExpiringCount - a.match.criticalExpiringCount;
    }
    if (b.match.expiringCount !== a.match.expiringCount) {
      return b.match.expiringCount - a.match.expiringCount;
    }
    if (b.match.matchPercentage !== a.match.matchPercentage) {
      return b.match.matchPercentage - a.match.matchPercentage;
    }
    return a.match.missingIngredients.length - b.match.missingIngredients.length;
  });

  return annotated;
}

module.exports = {
  analyzeRecipeMatch,
  rankRecipes
};

