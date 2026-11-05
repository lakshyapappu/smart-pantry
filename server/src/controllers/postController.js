const Post = require('../models/Post');

// @desc    Get all community posts
// @route   GET /api/posts
// @access  Public / Authenticated
const getPosts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    const posts = await Post.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const currentUserId = req.user ? req.user._id.toString() : null;

    const formatted = posts.map(post => {
      const p = post.toObject();
      p.likeCount = post.likes ? post.likes.length : 0;
      p.isLikedByCurrentUser = currentUserId && post.likes 
        ? post.likes.some(id => id.toString() === currentUserId) 
        : false;
      return p;
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a community tip post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, category, image } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty'
      });
    }

    const post = await Post.create({
      userId: req.user._id,
      content: content.trim(),
      category: category || 'Sustainable Kitchen',
      image: image ? image.trim() : ''
    });

    const populated = await Post.findById(post._id).populate('userId', 'name email');
    const p = populated.toObject();
    p.likeCount = 0;
    p.isLikedByCurrentUser = false;

    return res.status(201).json({
      success: true,
      message: 'Cooking tip shared with community!',
      data: p
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like / unlike on a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = post.likes.findIndex(id => id.toString() === userIdStr);

    let isLiked = false;
    if (existingIndex > -1) {
      // User already liked -> unlike
      post.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      // Like post
      post.likes.push(req.user._id);
      isLiked = true;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      isLiked,
      likeCount: post.likes.length,
      message: isLiked ? 'Post liked' : 'Post unliked'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post. Only the author can delete it.'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLikePost,
  deletePost
};

