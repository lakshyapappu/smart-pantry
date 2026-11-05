const mongoose = require('mongoose');

const cookingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    ingredientsUsed: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        wasExpiring: { type: Boolean, default: false }
      }
    ],
    savedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    cookedAt: {
      type: Date,
      default: Date.now
    },
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

cookingHistorySchema.index({ userId: 1, cookedAt: -1 });

const CookingHistory = mongoose.model('CookingHistory', cookingHistorySchema);
module.exports = CookingHistory;

