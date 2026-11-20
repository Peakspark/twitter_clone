const mongoose = require('mongoose');
const Like = require('../models/Like');
const Post = require('../models/Post');

exports.likePost = async (req, res) => {
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

    // upsert makes repeating the request safe and avoids duplicate likes.
    await Like.updateOne(
      { post: postId, user: req.user.id },
      { $setOnInsert: { post: postId, user: req.user.id } },
      { upsert: true }
    );

    const likeCount = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      liked: true,
      likeCount
    });
  } catch (error) {
    console.error('Like post error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    await Like.deleteOne({ post: postId, user: req.user.id });
    const likeCount = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      liked: false,
      likeCount
    });
  } catch (error) {
    console.error('Unlike post error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getLikes = async (req, res) => {
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

    const likeCount = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      likeCount
    });
  } catch (error) {
    console.error('Get likes error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};