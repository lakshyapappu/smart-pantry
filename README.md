# 🌱 SMART PANTRY — Zero-Waste Recipe Generator

A complete, full-stack MERN web application designed to help households track groceries, monitor expiry dates, eliminate food waste, and discover delicious zero-waste recipes using ingredients already stored in their pantry.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Project Architecture & Folder Structure](#-project-architecture--folder-structure)
5. [Getting Started Locally](#-getting-started-locally)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Database Seeding](#database-seeding)
   - [Running the Application](#running-the-application)
6. [Testing & Quality Assurance](#-testing--quality-assurance)
7. [Render Deployment Guide](#-render-deployment-guide)
   - [One-Click Blueprint (render.yaml)](#one-click-blueprint-renderyaml)
   - [Manual Web Service Configuration](#manual-web-service-configuration)
   - [Required Environment Variables on Render](#required-environment-variables-on-render)
8. [Design System](#-design-system)

---

## 🌿 Project Overview

Smart Pantry solves two pervasive household challenges:
1. **"What can I cook today using the ingredients I already have?"**
2. **"How can I prevent groceries from expiring and going to waste?"**

Through an intelligent, unit-aware ingredient matching algorithm and dynamic expiry alert system, the platform ranks recipes by ingredients nearing expiration, calculates real food waste saved, and automatically syncs missing items with a smart grocery list.

---

## ✨ Key Features

### 1. 🗄️ Pantry Inventory Tracker
- **Dynamic Expiry Status System**:
  - 🟢 **Fresh (Green)**: More than 5 days remaining.
  - 🟡 **Expiring Soon (Yellow)**: 2 to 5 days remaining.
  - 🔴 **Expiring Today / Expired (Red)**: 1 day or less remaining (including today and expired).
- **CRUD Operations**: Add, edit, delete, and adjust quantities inline.
- **Search & Filters**: Instant search by grocery name, category pills, and sorting by soonest expiry, quantity, or name.
- **Strict Data Isolation**: Multi-tenant architecture ensuring each user accesses only their own private groceries.

### 2. 🍲 Smart Recipe Recommendation Engine
- **32 Predefined Recipes**: Curated database of authentic Indian recipes (Vegetable Pulao, Paneer Bhurji, Aloo Paratha, Dal Tadka, Tomato Rice, Poha, etc.) and international staples (Pasta, Stir Fry, French Toast, Shakshuka, Mushroom Soup, etc.).
- **Real-Time Matching Algorithm**:
  - Normalized name comparison (handles plurals: *tomatoes* ➔ *tomato*, *eggs* ➔ *egg*, *onions* ➔ *onion*).
  - Compatible unit conversion (kg ↔ g, L ↔ ml).
  - Match percentage: `(Available Required Ingredients / Total Required Ingredients) × 100`.
- **Zero-Waste Priority Ranking**: Prioritizes recipes using ingredients expiring within 1 day, then 5 days, followed by highest match percentage and fewest missing groceries.
- **Mark as Cooked**:
  - Verifies sufficient pantry stock.
  - Safely deducts quantities from pantry items without negative inventory.
  - Idempotency key protection to prevent accidental duplicate deductions.
  - Records cooking event and computes total grams of food waste saved.

### 3. 🛒 Smart Grocery List
- **One-Click Recipe Restock**: Push missing ingredients directly from any recipe into your shopping list.
- **Manual Item Management**: Add custom items with quantities and units.
- **Mark as Purchased Flow**:
  - Checks if item already exists in pantry (increments quantity if present, creates new entry if not).
  - Allows user to set estimated shelf life / expiry date upon purchase.
  - Safeguarded against duplicate transfers.
- **Separate Views**: Pending vs. Purchased items with "Clear Purchased" option.

### 4. 👥 Zero-Waste Community Wall
- **Social Feed**: Authenticated users can share leftover hacks, peel broth ideas, storage tips, and budget cooking tricks.
- **Categories**: Leftover Recipes, Vegetable Waste Hacks, Food Storage Tips, Budget Cooking, Sustainable Kitchen.
- **Interactivity**: Like/unlike posts (atomic user list preventing duplicate likes), author-only post deletion.

### 5. 📊 Real-Time Dashboard
- Personalized time-sensitive greeting ("Good morning/afternoon/evening, [User]!").
- 5 Live Metrics directly from MongoDB:
  - Total Pantry Items
  - Items Expiring Soon
  - Ready-to-Cook Recipes
  - Pending Grocery Items
  - Total Food Waste Saved (grams / kg)
- "Expiring Soon" priority alert carousel.
- "Today's Zero-Waste Recipe Suggestions".
- Instant quick actions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), JavaScript (ES Modules), Tailwind CSS, React Router DOM v6, Axios, Lucide React, React Context API |
| **Backend** | Node.js, Express.js (REST API), JWT Auth, bcryptjs, cookie-parser, CORS, express-rate-limit |
| **Database** | MongoDB Atlas / Mongoose ODM |
| **Testing** | Node assert, Supertest, MongoMemoryServer |
| **Deployment** | Render Web Service (Single Unified Service serving React production static build with SPA fallback) |

---

## 📁 Project Architecture & Folder Structure

```text
smart-pantry/
├── package.json              # Root package configuration with unified scripts
├── render.yaml               # Render Blueprint specification
├── .gitignore
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # Mongoose connection with Atlas support
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── PantryItem.js
│   │   │   ├── Recipe.js
│   │   │   ├── GroceryItem.js
│   │   │   ├── Post.js
│   │   │   └── CookingHistory.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── pantryController.js
│   │   │   ├── recipeController.js
│   │   │   ├── groceryController.js
│   │   │   ├── postController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── pantryRoutes.js
│   │   │   ├── recipeRoutes.js
│   │   │   ├── groceryRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT cookie & Bearer token verification
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── services/
│   │   │   └── recipeMatcher.js # Normalized matching & zero-waste ranking engine
│   │   ├── utils/
│   │   │   ├── normalize.js  # Culinary plural & casing normalization
│   │   │   ├── unitConverter.js # Compatible unit conversions
│   │   │   └── expiryHelper.js  # Dynamic date difference math
│   │   ├── seed/
│   │   │   ├── recipesData.js   # 32 curated recipes
│   │   │   └── seedDatabase.js  # Standalone seeder with demo accounts
│   │   ├── app.js            # Express app configuration & production SPA fallback
│   │   └── server.js         # Server bootstrap with auto-seed on first launch
│   └── tests/
│       ├── unit.test.js      # Unit tests for matching, normalization, expiry
│       ├── integration.test.js # End-to-end integration tests (MongoMemoryServer)
│       └── prod-serving.test.js# Tests static build serving & SPA routing
└── client/
    ├── package.json
    ├── vite.config.js        # Vite config with /api proxy
    ├── tailwind.config.js    # Custom forest & nature palette
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── PantryCard.jsx
        │   ├── RecipeCard.jsx
        │   ├── GroceryItem.jsx
        │   ├── PostCard.jsx
        │   ├── StatCard.jsx
        │   ├── ExpiryBadge.jsx
        │   ├── Loading.jsx
        │   └── EmptyState.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── services/
        │   └── api.js        # Centralized Axios client with credentials
        ├── utils/
        │   └── dateUtils.js
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Pantry.jsx
        │   ├── Recipes.jsx
        │   ├── RecipeDetails.jsx
        │   ├── GroceryList.jsx
        │   ├── Community.jsx
        │   └── NotFound.jsx
        ├── App.jsx           # React Router route registry
        ├── index.css
        └── main.jsx
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/smart-pantry.git
   cd smart-pantry
   ```

2. **Install all dependencies (root, server, and client)**:
   ```bash
   npm run install:all
   ```

### Environment Variables

Create a `.env` file in the `server` directory:
```bash
cp server/.env.example server/.env
```

Configure your environment values in `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_pantry?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note**: If you are using a local MongoDB instance, set `MONGO_URI=mongodb://127.0.0.1:27017/smart_pantry`.

### Database Seeding

Populate the database with the 32 predefined Indian and International recipes, along with an optional demo user (`demo@smartpantry.app` / `password123`):
```bash
npm run seed
```
*(Note: If the recipe database is empty on server boot, it automatically self-seeds as well!)*

### Running the Application

You can start both frontend and backend concurrently with one command from the project root:
```bash
npm run dev
```

- **Frontend Client**: Runs on [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: Runs on [http://localhost:5000](http://localhost:5000)
- **API Health Check**: Accessible at [http://localhost:5000/api/health](http://localhost:5000/api/health)

Alternatively, run them separately:
```bash
# Terminal 1 (Backend)
npm run server

# Terminal 2 (Frontend)
npm run client
```

---

## 🧪 Testing & Quality Assurance

The codebase includes comprehensive unit and integration test suites:

### 1. Run Unit Tests
Tests normalized name conversions, dynamic expiry day boundaries (red/yellow/green), unit conversions, and recipe matching algorithm:
```bash
npm test
```

### 2. Run Integration Tests
Tests full user journeys (registration, login, auth protection, pantry CRUD, recipe ranking, shopping list transfer, mark as cooked with idempotency, community posts and likes) using an in-memory MongoDB server:
```bash
npm run test:integration
```

---

## 🌐 Render Deployment Guide

The application is architected to deploy cleanly to **Render** as a single, cost-effective Web Service where Express serves the compiled React static files and handles all `/api` routes.

### One-Click Blueprint (`render.yaml`)

A `render.yaml` specification is included at the root of the repository. In Render:
1. Connect your GitHub repository.
2. Choose **"Blueprints"** from the Render Dashboard.
3. Select your repository and Render will automatically detect `render.yaml`.

---

### Manual Web Service Configuration

If creating a **Web Service** manually on [Render Dashboard](https://dashboard.render.com):

1. **Service Type**: Web Service
2. **Environment**: `Node`
3. **Region**: Oregon (or nearest to your MongoDB Atlas region)
4. **Branch**: `main`
5. **Build Command**:
   ```bash
   npm run build:all
   ```
   *(This installs server and client packages and compiles Vite into `client/dist`)*
6. **Start Command**:
   ```bash
   npm start
   ```
7. **Health Check Path**:
   ```text
   /api/health
   ```

### Required Environment Variables on Render

In the Render Web Service Settings under **Environment Variables**, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production cookies, compression, and static serving |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/smart_pantry?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | *(Random 32+ character string)* | Secret key used to sign and verify JWT tokens |
| `CLIENT_URL` | `https://smart-pantry.onrender.com` | Your live Render application URL |

---

## 🎨 Design System

Smart Pantry features a custom, nature-inspired palette tailored for sustainability and food-tech:

- **Forest Green (`#234B35`)**: Primary brand identity, buttons, active navigation.
- **Deep Green (`#173B2B`)**: Headings and deep contrast text.
- **Sage (`#8DAA91`)**: Secondary accents, progress tags, zero-waste indicators.
- **Warm Cream (`#F7F5EC`)**: Main background providing warmth and legibility.
- **Muted Beige (`#E9E4D5`)**: Card borders, dividers, subtle input backgrounds.
- **Off-White (`#FFFFFF`)**: Card surfaces, elevated modals.
- **Expiry Indicators**:
  - 🟢 **Fresh**: `#2E7D32`
  - 🟡 **Expiring Soon**: `#B7791F`
  - 🔴 **Danger / Expiring Today**: `#C53030`

---

## 📄 License

This project is licensed under the MIT License.

