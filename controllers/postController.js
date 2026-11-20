const mongoose = require('mongoose');
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post text is required'
      });
    }

    if (text.trim().length > 280) {
      return res.status(400).json({
        success: false,
        message: 'Post cannot exceed 280 characters'
      });
    }

    const post = await Post.create({
      text: text.trim(),
      author: req.user.id
    });

    return res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Create post error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Get posts error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you are not allowed to delete it'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted'
    });
  } catch (error) {
    console.error('Delete post error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};