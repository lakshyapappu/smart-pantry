const mongoose = require('mongoose');
const { normalizeName } = require('../utils/normalize');

const units = ['kg', 'g', 'L', 'ml', 'pieces', 'packets', 'cups'];

const groceryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    normalizedName: {
      type: String,
      index: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than zero']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: units,
        message: '{VALUE} is not a valid unit'
      }
    },
    purchased: {
      type: Boolean,
      default: false,
      index: true
    },
    transferredToPantry: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      default: 'Other'
    },
    expiryDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

groceryItemSchema.pre('save', function (next) {
  if (this.name) {
    this.normalizedName = normalizeName(this.name);
  }
  next();
});

// Compound index for user and status
groceryItemSchema.index({ userId: 1, purchased: 1 });

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);
module.exports = GroceryItem;

