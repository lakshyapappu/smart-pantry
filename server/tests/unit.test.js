const assert = require('assert');
const { normalizeName } = require('../src/utils/normalize');
const { calculateExpiryStatus } = require('../src/utils/expiryHelper');
const {
  normalizeUnit,
  areUnitsCompatible,
  convertQuantity,
  checkQuantityAvailability
} = require('../src/utils/unitConverter');
const { analyzeRecipeMatch, rankRecipes } = require('../src/services/recipeMatcher');

console.log('🧪 Starting Unit Tests...');

// 1. Test normalizeName
console.log('\n--- 1. Testing normalizeName ---');
assert.strictEqual(normalizeName('Tomatoes'), 'tomato');
assert.strictEqual(normalizeName('  POTATOES  '), 'potato');
assert.strictEqual(normalizeName('Eggs'), 'egg');
assert.strictEqual(normalizeName('carrots'), 'carrot');
assert.strictEqual(normalizeName('chillies'), 'chilli');
assert.strictEqual(normalizeName('Onions'), 'onion');
assert.strictEqual(normalizeName('Basmati Rice!'), 'basmati rice');
console.log('✅ normalizeName tests passed!');

// 2. Test expiryHelper
console.log('\n--- 2. Testing calculateExpiryStatus ---');
const today = new Date();
const addDays = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

const expiredStatus = calculateExpiryStatus(addDays(-2));
assert.strictEqual(expiredStatus.status, 'red', 'Expired items must be red');
assert.strictEqual(expiredStatus.isExpiringSoon, true);

const todayStatus = calculateExpiryStatus(addDays(0));
assert.strictEqual(todayStatus.status, 'red', 'Expiring today must be red');
assert.strictEqual(todayStatus.label, 'Expiring Today');

const oneDayStatus = calculateExpiryStatus(addDays(1));
assert.strictEqual(oneDayStatus.status, 'red', '1 day remaining must be red');

const threeDaysStatus = calculateExpiryStatus(addDays(3));
assert.strictEqual(threeDaysStatus.status, 'yellow', '3 days remaining must be yellow');
assert.strictEqual(threeDaysStatus.isExpiringSoon, true);

const tenDaysStatus = calculateExpiryStatus(addDays(10));
assert.strictEqual(tenDaysStatus.status, 'green', '10 days remaining must be green');
assert.strictEqual(tenDaysStatus.isExpiringSoon, false);

const noExpiryStatus = calculateExpiryStatus(null);
assert.strictEqual(noExpiryStatus.status, 'none', 'Null expiry date must have none status');
assert.strictEqual(noExpiryStatus.label, 'No Expiry');
assert.strictEqual(noExpiryStatus.isExpiringSoon, false, 'No expiry must not be expiring soon');

const undefExpiryStatus = calculateExpiryStatus(undefined);
assert.strictEqual(undefExpiryStatus.status, 'none', 'Undefined expiry date must have none status');
assert.strictEqual(undefExpiryStatus.label, 'No Expiry');
assert.strictEqual(undefExpiryStatus.isExpiringSoon, false, 'No expiry must not be expiring soon');
console.log('✅ calculateExpiryStatus tests passed!');

// 3. Test unitConverter
console.log('\n--- 3. Testing unitConverter ---');
assert.strictEqual(normalizeUnit('KG'), 'kg');
assert.strictEqual(normalizeUnit('litres'), 'L');
assert.strictEqual(normalizeUnit('pcs'), 'pieces');

assert.strictEqual(areUnitsCompatible('kg', 'g'), true);
assert.strictEqual(areUnitsCompatible('L', 'ml'), true);
assert.strictEqual(areUnitsCompatible('kg', 'L'), false);

assert.strictEqual(convertQuantity(1.5, 'kg', 'g'), 1500);
assert.strictEqual(convertQuantity(500, 'g', 'kg'), 0.5);
assert.strictEqual(convertQuantity(2, 'L', 'ml'), 2000);
assert.strictEqual(convertQuantity(250, 'ml', 'L'), 0.25);

// Check availability: 1kg in pantry vs 200g required
const check1 = checkQuantityAvailability(1, 'kg', 200, 'g');
assert.strictEqual(check1.satisfied, true);
assert.strictEqual(check1.availableInRecipeUnit, 1000);
assert.strictEqual(check1.missingInRecipeUnit, 0);

// Check insufficient: 100g in pantry vs 300g required
const check2 = checkQuantityAvailability(100, 'g', 300, 'g');
assert.strictEqual(check2.satisfied, false);
assert.strictEqual(check2.missingInRecipeUnit, 200);
console.log('✅ unitConverter tests passed!');

// 4. Test recipeMatcher
console.log('\n--- 4. Testing recipeMatcher ---');
const sampleRecipe = {
  name: 'Egg Fried Rice',
  ingredients: [
    { name: 'Rice', normalizedName: 'rice', quantity: 300, unit: 'g' },
    { name: 'Egg', normalizedName: 'egg', quantity: 2, unit: 'pieces' },
    { name: 'Soy Sauce', normalizedName: 'soy sauce', quantity: 15, unit: 'ml' }
  ]
};

// Case A: User has all ingredients, eggs expiring today
const pantryFull = [
  { name: 'Basmati Rice', normalizedName: 'basmati rice', quantity: 1, unit: 'kg', expiryDate: addDays(30) },
  { name: 'Eggs', normalizedName: 'egg', quantity: 4, unit: 'pieces', expiryDate: addDays(0) }, // expiring today!
  { name: 'Soy Sauce', normalizedName: 'soy sauce', quantity: 100, unit: 'ml', expiryDate: addDays(60) }
];

const matchFull = analyzeRecipeMatch(sampleRecipe, pantryFull);
assert.strictEqual(matchFull.matchPercentage, 100, 'All 3 ingredients present should be 100%');
assert.strictEqual(matchFull.isFullyCookable, true);
assert.strictEqual(matchFull.missingIngredients.length, 0);
assert.strictEqual(matchFull.criticalExpiringCount, 1, 'Eggs should be counted as critical expiring');
assert.ok(matchFull.priorityScore > 1000, 'Critical expiring ingredient should give high priority score');

// Case B: User has only Rice
const pantryPartial = [
  { name: 'Rice', normalizedName: 'rice', quantity: 500, unit: 'g', expiryDate: addDays(30) }
];

const matchPartial = analyzeRecipeMatch(sampleRecipe, pantryPartial);
assert.strictEqual(matchPartial.matchPercentage, 33, '1 out of 3 ingredients should be 33%');
assert.strictEqual(matchPartial.isFullyCookable, false);
assert.strictEqual(matchPartial.missingIngredients.length, 2);
console.log('✅ recipeMatcher tests passed!');

console.log('\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY! ✨\n');

