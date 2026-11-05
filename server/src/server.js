const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env if present, then fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const Recipe = require('./models/Recipe');
const recipesData = require('./seed/recipesData');
const { normalizeName } = require('./utils/normalize');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  const conn = await connectDB();

  // If connected, check if recipes collection needs initial auto-seed
  if (conn) {
    try {
      const count = await Recipe.countDocuments();
      if (count === 0) {
        console.log('[Startup] Recipe collection is empty. Performing initial recipe seeding...');
        const formatted = recipesData.map(r => ({
          ...r,
          ingredients: r.ingredients.map(ing => ({
            ...ing,
            normalizedName: normalizeName(ing.name)
          }))
        }));
        await Recipe.insertMany(formatted);
        console.log(`[Startup] Auto-seeded ${formatted.length} recipes.`);
      }
    } catch (err) {
      console.warn(`[Startup] Auto-seed check notice: ${err.message}`);
    }
  }

  // Start HTTP server on 0.0.0.0 to accept both IPv4 and IPv6 localhost connections
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🌱 Smart Pantry & Zero-Waste Recipe Server Running!`);
    console.log(`📡 Listening on: http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
    console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Fatal] Unhandled Rejection: ${err.message}`);
  });
};

startServer();

