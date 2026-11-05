/**
 * Unit conversion utility for recipe-pantry matching and quantity deductions.
 */

// Canonical unit categories
const UNIT_FACTORS = {
  // Mass in grams
  kg: { base: 'g', factor: 1000 },
  g: { base: 'g', factor: 1 },

  // Volume in milliliters
  l: { base: 'ml', factor: 1000 },
  ml: { base: 'ml', factor: 1 },

  // Discrete counts
  pieces: { base: 'pieces', factor: 1 },
  piece: { base: 'pieces', factor: 1 },
  packets: { base: 'packets', factor: 1 },
  packet: { base: 'packets', factor: 1 },
  cups: { base: 'cups', factor: 1 },
  cup: { base: 'cups', factor: 1 }
};

function normalizeUnit(unit) {
  if (!unit) return 'pieces';
  const u = unit.toString().toLowerCase().trim();
  if (u === 'l' || u === 'liter' || u === 'litre' || u === 'liters' || u === 'litres') return 'L';
  if (u === 'ml' || u === 'milliliter' || u === 'millilitre') return 'ml';
  if (u === 'kg' || u === 'kilogram' || u === 'kilograms') return 'kg';
  if (u === 'g' || u === 'gram' || u === 'grams') return 'g';
  if (u === 'pieces' || u === 'piece' || u === 'pcs' || u === 'pc') return 'pieces';
  if (u === 'packets' || u === 'packet' || u === 'pkt' || u === 'pkts') return 'packets';
  if (u === 'cups' || u === 'cup') return 'cups';
  return u;
}

/**
 * Check if two units are compatible for conversion.
 */
function areUnitsCompatible(unitA, unitB) {
  const normA = normalizeUnit(unitA).toLowerCase();
  const normB = normalizeUnit(unitB).toLowerCase();

  if (normA === normB) return true;

  const infoA = UNIT_FACTORS[normA];
  const infoB = UNIT_FACTORS[normB];

  if (infoA && infoB && infoA.base === infoB.base) {
    return true;
  }

  return false;
}

/**
 * Convert quantity from sourceUnit to targetUnit.
 * Returns null if units are not compatible.
 */
function convertQuantity(quantity, fromUnit, toUnit) {
  const normFrom = normalizeUnit(fromUnit).toLowerCase();
  const normTo = normalizeUnit(toUnit).toLowerCase();

  if (normFrom === normTo) return quantity;

  const infoFrom = UNIT_FACTORS[normFrom];
  const infoTo = UNIT_FACTORS[normTo];

  if (infoFrom && infoTo && infoFrom.base === infoTo.base) {
    const baseVal = quantity * infoFrom.factor;
    return baseVal / infoTo.factor;
  }

  return null;
}

/**
 * Check if available pantry quantity satisfies required recipe quantity.
 * Returns { satisfied: boolean, availableInRecipeUnit: number, missingInRecipeUnit: number }
 */
function checkQuantityAvailability(pantryQty, pantryUnit, requiredQty, requiredUnit) {
  const normPantryUnit = normalizeUnit(pantryUnit);
  const normReqUnit = normalizeUnit(requiredUnit);

  if (areUnitsCompatible(normPantryUnit, normReqUnit)) {
    const pantryQtyInReqUnit = convertQuantity(pantryQty, normPantryUnit, normReqUnit);
    if (pantryQtyInReqUnit >= requiredQty) {
      return {
        satisfied: true,
        availableInRecipeUnit: pantryQtyInReqUnit,
        missingInRecipeUnit: 0
      };
    } else {
      return {
        satisfied: false,
        availableInRecipeUnit: pantryQtyInReqUnit,
        missingInRecipeUnit: Math.max(0, requiredQty - pantryQtyInReqUnit)
      };
    }
  }

  // If units cannot be mathematically converted (e.g., pieces vs cups), treat nominal count
  // with lenient check: if pantry has positive quantity, check >= required
  const satisfied = pantryQty >= requiredQty;
  return {
    satisfied,
    availableInRecipeUnit: pantryQty,
    missingInRecipeUnit: satisfied ? 0 : Math.max(0, requiredQty - pantryQty)
  };
}

module.exports = {
  normalizeUnit,
  areUnitsCompatible,
  convertQuantity,
  checkQuantityAvailability
};

