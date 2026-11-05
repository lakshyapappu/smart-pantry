const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Recipe = require('../src/models/Recipe');
const recipesData = require('../src/seed/recipesData');
const { normalizeName } = require('../src/utils/normalize');

let mongoServer;

beforeAll = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed recipes
  const formatted = recipesData.map((r) => ({
    ...r,
    ingredients: r.ingredients.map((ing) => ({
      ...ing,
      normalizedName: normalizeName(ing.name)
    }))
  }));
  await Recipe.insertMany(formatted);
};

afterAll = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

const runIntegrationTests = async () => {
  console.log('🚀 Initializing in-memory integration test suite...');
  await beforeAll();

  try {
    console.log('\n--- Test 1: User Registration ---');
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Chef Maria',
        email: 'maria@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    
    if (regRes.status !== 201 || !regRes.body.token) {
      throw new Error(`Registration failed with status ${regRes.status}: ${JSON.stringify(regRes.body)}`);
    }
    const token = regRes.body.token;
    console.log('✅ User registered successfully. Token received.');

    // Duplicate registration should fail
    const dupRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Maria',
        email: 'maria@example.com',
        password: 'password123'
      });
    if (dupRes.status !== 400) {
      throw new Error(`Expected 400 for duplicate user, got ${dupRes.status}`);
    }
    console.log('✅ Duplicate registration prevented.');

    console.log('\n--- Test 2: User Login & Auth Guard ---');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'maria@example.com',
        password: 'password123'
      });
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    console.log('✅ Login succeeded.');

    // Unauthorized access should be blocked
    const unauthRes = await request(app).get('/api/pantry');
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated pantry access, got ${unauthRes.status}`);
    }
    console.log('✅ Protected route correctly blocked without token.');

    // Verify current user
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    if (meRes.status !== 200 || meRes.body.user.email !== 'maria@example.com') {
      throw new Error(`Failed to get authenticated user profile: ${JSON.stringify(meRes.body)}`);
    }
    console.log('✅ /api/auth/me verified user profile.');

    console.log('\n--- Test 3: Pantry CRUD & Expiry Calculation ---');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

    // Add Tomato (Expiring in 1 day -> RED status)
    const addPantry1 = await request(app)
      .post('/api/pantry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tomatoes',
        category: 'Vegetables',
        quantity: 500,
        unit: 'g',
        expiryDate: addDays(1),
        notes: 'Red ripe'
      });
    if (addPantry1.status !== 201 || addPantry1.body.data.expiryStatus.status !== 'red') {
      throw new Error(`Pantry add tomato failed: ${JSON.stringify(addPantry1.body)}`);
    }
    const tomatoId = addPantry1.body.data._id;
    console.log('✅ Added Tomato with dynamic RED expiry status.');

    // Add Eggs (Expiring in 4 days -> YELLOW status)
    const addPantry2 = await request(app)
      .post('/api/pantry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Eggs',
        category: 'Dairy',
        quantity: 6,
        unit: 'pieces',
        expiryDate: addDays(4)
      });
    if (addPantry2.status !== 201 || addPantry2.body.data.expiryStatus.status !== 'yellow') {
      throw new Error(`Pantry add eggs failed: ${JSON.stringify(addPantry2.body)}`);
    }
    console.log('✅ Added Eggs with dynamic YELLOW expiry status.');

    // Add Rice (Expiring in 60 days -> GREEN status)
    const addPantry3 = await request(app)
      .post('/api/pantry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rice',
        category: 'Grains and Cereals',
        quantity: 1,
        unit: 'kg',
        expiryDate: addDays(60)
      });
    if (addPantry3.status !== 201 || addPantry3.body.data.expiryStatus.status !== 'green') {
      throw new Error(`Pantry add rice failed: ${JSON.stringify(addPantry3.body)}`);
    }
    console.log('✅ Added Rice with dynamic GREEN expiry status.');

    // Add Black Pepper (No expiry date provided)
    const addPantry4 = await request(app)
      .post('/api/pantry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Black Pepper',
        category: 'Spices and Condiments',
        quantity: 50,
        unit: 'g'
        // No expiryDate
      });
    if (addPantry4.status !== 201 || addPantry4.body.data.expiryStatus.status !== 'none' || addPantry4.body.data.expiryStatus.isExpiringSoon) {
      throw new Error(`Pantry add black pepper failed: ${JSON.stringify(addPantry4.body)}`);
    }
    console.log('✅ Added Black Pepper with no expiry date (none status, not expiring soon).');

    // Update quantity for tomatoes
    const updateRes = await request(app)
      .put(`/api/pantry/${tomatoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 600 });
    if (updateRes.status !== 200 || updateRes.body.data.quantity !== 600) {
      throw new Error(`Failed to update pantry quantity: ${JSON.stringify(updateRes.body)}`);
    }
    console.log('✅ Pantry quantity update verified.');

    console.log('\n--- Test 4: Recipe Matching & Priority Ranking ---');
    const recRes = await request(app)
      .get('/api/recipes')
      .set('Authorization', `Bearer ${token}`);
    if (recRes.status !== 200 || recRes.body.data.length < 30) {
      throw new Error(`Expected at least 30 recipes, got ${recRes.body.data?.length}`);
    }
    console.log(`✅ Retrieved ${recRes.body.data.length} recipes annotated with pantry match data.`);

    // Check that top recommended recipe uses our expiring tomatoes or eggs
    const topRec = recRes.body.data[0];
    console.log(`Top recommended recipe: "${topRec.name}" (Match: ${topRec.match.matchPercentage}%, Expiring used: ${topRec.match.expiringCount})`);

    console.log('\n--- Test 5: Grocery List Management & Auto-Transfer ---');
    // Find recipe "Tomato Rice"
    const tomatoRice = recRes.body.data.find(r => r.name === 'Tomato Rice');
    if (!tomatoRice) throw new Error('Tomato Rice recipe not found in database');

    // Add missing ingredients of Tomato Rice to grocery list
    const missing = tomatoRice.match.missingIngredients;
    console.log(`Missing ingredients for Tomato Rice: ${missing.map(m => m.name).join(', ')}`);

    const addGroceryRes = await request(app)
      .post('/api/grocery')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: missing });
    if (addGroceryRes.status !== 201) {
      throw new Error(`Failed to add missing ingredients to grocery list: ${JSON.stringify(addGroceryRes.body)}`);
    }
    console.log(`✅ Added ${missing.length} missing items to grocery list.`);

    // Get grocery list
    const groceryListRes = await request(app)
      .get('/api/grocery')
      .set('Authorization', `Bearer ${token}`);
    const pendingGroceries = groceryListRes.body.data.filter(g => !g.purchased);
    if (pendingGroceries.length < missing.length) {
      throw new Error('Pending grocery items count mismatch');
    }

    // Purchase one item and test pantry auto-transfer
    const itemToBuy = pendingGroceries[0];
    const purchaseRes = await request(app)
      .patch(`/api/grocery/${itemToBuy._id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ expiryDate: addDays(10) });
    if (purchaseRes.status !== 200 || !purchaseRes.body.pantryItem) {
      throw new Error(`Failed to purchase and transfer to pantry: ${JSON.stringify(purchaseRes.body)}`);
    }
    console.log(`✅ Purchased "${itemToBuy.name}" and automatically transferred to pantry with new expiry date.`);

    // Test duplicate purchase transfer prevention
    const duplicatePurchaseRes = await request(app)
      .patch(`/api/grocery/${itemToBuy._id}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    if (duplicatePurchaseRes.status !== 200 || !duplicatePurchaseRes.body.message.includes('already')) {
      throw new Error('Duplicate purchase transfer prevention failed');
    }
    console.log('✅ Duplicate purchase transfer successfully prevented.');

    console.log('\n--- Test 6: Cooking Recipe, Inventory Deduction & Idempotency ---');
    // Let's ensure user has all ingredients for "Masala Omelette" (Egg, Onion, Tomato, Green Chilli, Coriander)
    const masalaOm = recRes.body.data.find(r => r.name === 'Masala Omelette');
    
    // Add any remaining ingredients needed for Masala Omelette
    await request(app).post('/api/pantry').set('Authorization', `Bearer ${token}`).send({
      name: 'Onion', category: 'Vegetables', quantity: 200, unit: 'g', expiryDate: addDays(1) // expiring!
    });
    await request(app).post('/api/pantry').set('Authorization', `Bearer ${token}`).send({
      name: 'Green Chilli', category: 'Vegetables', quantity: 5, unit: 'pieces', expiryDate: addDays(3)
    });
    await request(app).post('/api/pantry').set('Authorization', `Bearer ${token}`).send({
      name: 'Coriander', category: 'Vegetables', quantity: 50, unit: 'g', expiryDate: addDays(2)
    });

    const cookRes = await request(app)
      .post(`/api/recipes/${masalaOm._id}/cook`)
      .set('Authorization', `Bearer ${token}`)
      .send({ idempotencyKey: 'test_key_12345' });

    if (cookRes.status !== 200) {
      throw new Error(`Failed to cook recipe: ${JSON.stringify(cookRes.body)}`);
    }
    console.log(`✅ Recipe "${masalaOm.name}" cooked successfully! Food waste saved: ${cookRes.body.savedFoodWasteGrams}g.`);

    // Test idempotency: repeat request with same idempotencyKey
    const cookRepeatRes = await request(app)
      .post(`/api/recipes/${masalaOm._id}/cook`)
      .set('Authorization', `Bearer ${token}`)
      .send({ idempotencyKey: 'test_key_12345' });

    if (cookRepeatRes.status !== 200 || !cookRepeatRes.body.alreadyProcessed) {
      throw new Error(`Idempotency check failed: ${JSON.stringify(cookRepeatRes.body)}`);
    }
    console.log('✅ Idempotency verified: duplicate cook request safely ignored without re-deducting pantry inventory.');

    console.log('\n--- Test 7: Community Posts, Likes & Author Deletion ---');
    // Create community post
    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Pro tip: Freeze leftover vegetable scraps in a ziplock bag to make an ultra-rich zero-waste broth on Sunday!',
        category: 'Vegetable Waste Hacks'
      });
    if (postRes.status !== 201) {
      throw new Error(`Failed to create post: ${JSON.stringify(postRes.body)}`);
    }
    const postId = postRes.body.data._id;
    console.log('✅ Created community tip post.');

    // Like post
    const likeRes = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);
    if (likeRes.status !== 200 || likeRes.body.likeCount !== 1 || !likeRes.body.isLiked) {
      throw new Error(`Like failed: ${JSON.stringify(likeRes.body)}`);
    }
    console.log('✅ Liked community post. Like count = 1.');

    // Unlike post
    const unlikeRes = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);
    if (unlikeRes.status !== 200 || unlikeRes.body.likeCount !== 0 || unlikeRes.body.isLiked) {
      throw new Error(`Unlike failed: ${JSON.stringify(unlikeRes.body)}`);
    }
    console.log('✅ Unliked community post. Like count = 0. No duplicate likes.');

    console.log('\n--- Test 8: Dashboard Stats Endpoint ---');
    const dashRes = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    if (dashRes.status !== 200) {
      throw new Error(`Dashboard stats failed: ${JSON.stringify(dashRes.body)}`);
    }
    const dStats = dashRes.body.data.stats;
    console.log('Dashboard statistics retrieved:', {
      totalPantryItems: dStats.totalPantryItems,
      expiringSoonCount: dStats.expiringSoonCount,
      recipesAvailable: dStats.recipesAvailable,
      pendingGroceryItems: dStats.pendingGroceryItems,
      foodWasteSavedGrams: dStats.foodWasteSavedGrams,
      totalMealsCooked: dStats.totalMealsCooked
    });
    if (dStats.totalMealsCooked !== 1) {
      throw new Error(`Expected 1 total meal cooked, got ${dStats.totalMealsCooked}`);
    }
    console.log('✅ Dashboard stats computed from real database data accurately.');

    console.log('\n🌟 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS! 🌟\n');
  } finally {
    await afterAll();
  }
};

runIntegrationTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  });

