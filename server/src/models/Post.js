const mongoose = require('mongoose');

const postCategories = [
  'Leftover Recipes',
  'Vegetable Waste Hacks',
  'Food Storage Tips',
  'Budget Cooking',
  'Sustainable Kitchen'
];

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: postCategories,
        message: '{VALUE} is not a valid community category'
      },
      default: 'Sustainable Kitchen'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

