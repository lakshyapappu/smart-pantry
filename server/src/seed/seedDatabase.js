const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const PantryItem = require('../models/PantryItem');
const Post = require('../models/Post');
const GroceryItem = require('../models/GroceryItem');
const recipesData = require('./recipesData');
const { normalizeName } = require('../utils/normalize');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_pantry';
    console.log(`[Seed] Connecting to: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('[Seed] Database connected successfully.');

    // Normalize ingredients
    const formattedRecipes = recipesData.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        normalizedName: normalizeName(ing.name)
      }))
    }));

    // Clear existing recipes and re-seed
    await Recipe.deleteMany({});
    const createdRecipes = await Recipe.insertMany(formattedRecipes);
    console.log(`[Seed] Successfully inserted ${createdRecipes.length} recipes into the database!`);

    // Create a demo user if doesn't exist
    let demoUser = await User.findOne({ email: 'demo@smartpantry.app' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'demo@smartpantry.app',
        password: 'password123'
      });
      console.log('[Seed] Created demo user: demo@smartpantry.app (password: password123)');
    }

    // Seed initial pantry items for demo user if empty
    const existingPantry = await PantryItem.find({ userId: demoUser._id });
    if (existingPantry.length === 0) {
      const now = new Date();
      const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

      const demoPantry = [
        {
          userId: demoUser._id,
          name: 'Tomatoes',
          category: 'Vegetables',
          quantity: 500,
          unit: 'g',
          purchaseDate: addDays(-3),
          expiryDate: addDays(1), // RED: 1 day left!
          notes: 'Ripe farm fresh tomatoes, great for curry or tomato rice'
        },
        {
          userId: demoUser._id,
          name: 'Eggs',
          category: 'Dairy',
          quantity: 6,
          unit: 'pieces',
          purchaseDate: addDays(-2),
          expiryDate: addDays(0), // RED: Expiring today!
          notes: 'Brown free-range eggs'
        },
        {
          userId: demoUser._id,
          name: 'Basmati Rice',
          category: 'Grains and Cereals',
          quantity: 1,
          unit: 'kg',
          purchaseDate: addDays(-7),
          expiryDate: addDays(45), // GREEN: fresh
          notes: 'Aged long grain rice'
        },
        {
          userId: demoUser._id,
          name: 'Onions',
          category: 'Vegetables',
          quantity: 400,
          unit: 'g',
          purchaseDate: addDays(-4),
          expiryDate: addDays(3), // YELLOW: 3 days left
          notes: 'Yellow onions'
        },
        {
          userId: demoUser._id,
          name: 'Green Chillies',
          category: 'Vegetables',
          quantity: 8,
          unit: 'pieces',
          purchaseDate: addDays(-2),
          expiryDate: addDays(4), // YELLOW: 4 days left
          notes: 'Fresh chillies'
        },
        {
          userId: demoUser._id,
          name: 'Fresh Paneer',
          category: 'Dairy',
          quantity: 200,
          unit: 'g',
          purchaseDate: addDays(-1),
          expiryDate: addDays(2), // YELLOW: 2 days left
          notes: 'Malai paneer block'
        },
        {
          userId: demoUser._id,
          name: 'Milk',
          category: 'Dairy',
          quantity: 1,
          unit: 'L',
          purchaseDate: addDays(-1),
          expiryDate: addDays(3), // YELLOW
          notes: 'Toned milk'
        },
        {
          userId: demoUser._id,
          name: 'Garlic',
          category: 'Vegetables',
          quantity: 100,
          unit: 'g',
          purchaseDate: addDays(-5),
          expiryDate: addDays(14), // GREEN
          notes: 'Whole heads'
        }
      ];

      await PantryItem.insertMany(demoPantry);
      console.log(`[Seed] Seeded ${demoPantry.length} pantry items for demo user.`);
    }

    // Seed community posts if empty
    const existingPosts = await Post.find({});
    if (existingPosts.length === 0) {
      const demoPosts = [
        {
          userId: demoUser._id,
          category: 'Vegetable Waste Hacks',
          content: 'Never toss coriander or parsley stems! Finely dice them and saute with garlic at the start of your curry or soup. They have 3x more aromatic flavor than the leaves alone! 🌿✨',
          likes: [demoUser._id]
        },
        {
          userId: demoUser._id,
          category: 'Leftover Recipes',
          content: 'Got day-old cold rice sitting in the fridge? That is literally the secret to perfect crispy fried rice or spicy lemon rice. The grains dry out and do not get mushy when stir-fried on high heat!',
          likes: []
        },
        {
          userId: demoUser._id,
          category: 'Food Storage Tips',
          content: 'Wrap your celery and broccoli tightly in tin foil before keeping in the crisper drawer. It lets ethylene gas escape and keeps them crunchy for nearly 4 weeks!',
          likes: []
        }
      ];
      await Post.insertMany(demoPosts);
      console.log(`[Seed] Seeded ${demoPosts.length} community posts.`);
    }

    console.log('[Seed] Database seeding completed successfully! ✨');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;

