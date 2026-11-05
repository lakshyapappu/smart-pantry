const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  toggleLikePost,
  deletePost
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLikePost);
router.delete('/:id', protect, deletePost);

module.exports = router;

