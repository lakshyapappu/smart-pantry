const mongoose = require('mongoose');
const { normalizeName } = require('../utils/normalize');
const { calculateExpiryStatus } = require('../utils/expiryHelper');

const categories = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat and Seafood',
  'Grains and Cereals',
  'Bakery',
  'Spices and Condiments',
  'Beverages',
  'Other'
];

const units = ['kg', 'g', 'L', 'ml', 'pieces', 'packets', 'cups'];

const pantryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Grocery item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    normalizedName: {
      type: String,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: categories,
        message: '{VALUE} is not a supported category'
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: units,
        message: '{VALUE} is not a valid unit'
      }
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Auto-normalize name before save
pantryItemSchema.pre('save', function (next) {
  if (this.name) {
    this.normalizedName = normalizeName(this.name);
  }
  next();
});

// Virtual for dynamic expiry calculations
pantryItemSchema.virtual('expiryStatus').get(function () {
  return calculateExpiryStatus(this.expiryDate);
});

// Compound index for user query performance and fast lookups
pantryItemSchema.index({ userId: 1, expiryDate: 1 });
pantryItemSchema.index({ userId: 1, normalizedName: 1 });

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
module.exports = PantryItem;

