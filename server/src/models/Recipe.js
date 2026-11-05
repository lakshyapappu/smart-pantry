const mongoose = require('mongoose');
const { normalizeName } = require('../utils/normalize');

const recipeIngredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    normalizedName: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'L', 'ml', 'pieces', 'packets', 'cups']
    },
    optional: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Breakfast',
        'Main Course',
        'Rice & Noodles',
        'Snacks & Breads',
        'Soups & Salads',
        'Quick Meals'
      ],
      index: true
    },
    image: {
      type: String,
      required: [true, 'Recipe image URL is required']
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time in minutes is required'],
      min: 0
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time in minutes is required'],
      min: 0
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    servings: {
      type: Number,
      default: 2,
      min: 1
    },
    ingredients: {
      type: [recipeIngredientSchema],
      required: true,
      validate: [val => val.length > 0, 'Recipe must have at least one ingredient']
    },
    instructions: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'Recipe must have at least one instruction step']
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure ingredients have normalizedName
recipeSchema.pre('save', function (next) {
  if (this.ingredients && this.ingredients.length > 0) {
    this.ingredients.forEach(ing => {
      if (!ing.normalizedName && ing.name) {
        ing.normalizedName = normalizeName(ing.name);
      }
    });
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;

