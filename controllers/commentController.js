const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      post: postId,
      author: req.user.id
    });

    return res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error('Get comments error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID'
      });
    }

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      author: req.user.id
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not allowed to delete it'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};