const mongoose = require('mongoose');

/**
 * Safely parse and sanitize MongoDB URI.
 * Handles unencoded special characters in passwords (such as '@', '#', '%')
 * which break MongoDB's standard connection string parser.
 */
function sanitizeMongoURI(rawURI) {
  if (!rawURI || typeof rawURI !== 'string') return { sanitizedURI: '', maskedURI: '' };

  // Masked URI for safe logging
  const maskedURI = rawURI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');

  try {
    // Regex matches: protocol, user, rawPassword, host, rest
    const match = rawURI.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)@([^/?#]+)(.*)$/);
    if (match) {
      const protocol = match[1];
      const user = match[2];
      const rawPassword = match[3];
      const host = match[4];
      const rest = match[5] || '';

      // URL encode username and password safely
      const safeUser = encodeURIComponent(decodeURIComponent(user));
      const safePass = encodeURIComponent(decodeURIComponent(rawPassword));

      const sanitized = `${protocol}${safeUser}:${safePass}@${host}${rest}`;
      return { sanitizedURI: sanitized, maskedURI };
    }
  } catch (err) {
    // Fall back to raw if regex parsing fails
  }

  return { sanitizedURI: rawURI, maskedURI };
}

const connectDB = async () => {
  const rawURI = process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === 'production';
  const { sanitizedURI, maskedURI } = sanitizeMongoURI(rawURI);

  // Set mongoose strictQuery
  mongoose.set('strictQuery', false);
  // Buffer timeout for Mongoose queries
  mongoose.set('bufferTimeoutMS', isProduction ? 10000 : 5000);

  if (sanitizedURI) {
    try {
      console.log(`[MongoDB] Attempting to connect to: ${maskedURI}`);
      const timeoutMs = isProduction ? 15000 : 4000;

      let conn;
      if (isProduction) {
        conn = await mongoose.connect(sanitizedURI, {
          serverSelectionTimeoutMS: timeoutMs,
          connectTimeoutMS: timeoutMs
        });
      } else {
        const connectPromise = mongoose.connect(sanitizedURI, {
          serverSelectionTimeoutMS: timeoutMs,
          connectTimeoutMS: timeoutMs
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Connection timed out after ${timeoutMs}ms`)), timeoutMs)
        );
        conn = await Promise.race([connectPromise, timeoutPromise]);
      }

      console.log(`[MongoDB] ✅ Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB] ❌ Connection to ${maskedURI} failed: ${error.message}`);
      if (error.message.includes('authentication failed')) {
        console.warn(`[MongoDB] ⚠️  Authentication failed. Check your MongoDB Atlas Database Access username and password.`);
      }
      if (isProduction) {
        console.error(`[MongoDB] Fatal: Could not connect to MongoDB Atlas in production. Please check your MONGO_URI on Render.`);
      } else {
        try {
          await mongoose.disconnect();
        } catch (_) {}
      }
    }
  } else if (isProduction) {
    console.error(`[MongoDB] Fatal: MONGO_URI environment variable is not defined in production.`);
  }

  // Fallback in development/test: Spin up in-memory MongoDB so local dev works seamlessly
  if (!isProduction) {
    try {
      console.log(`[MongoDB] 🚀 Launching in-memory MongoDB fallback for local development...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryURI = mongoServer.getUri();

      const conn = await mongoose.connect(memoryURI);
      console.log(`[MongoDB] ✅ In-memory MongoDB connected successfully at: ${memoryURI}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB] In-memory MongoDB initialization failed: ${memError.message}`);
    }
  }

  return null;
};

module.exports = connectDB;
