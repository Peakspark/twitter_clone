const express = require('express');
const mongoose = require('mongoose');
const Like = require('../models/Like');
const Post = require('../models/Post');

const router = express.Router();

// GET /api/posts/:postId/likes?userId=<ObjectId>
router.get('/posts/:postId/likes', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: 'Invalid post id' });
    }
    if (userId && !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    if (!(await Post.exists({ _id: postId }))) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const [likeCount, likedByUser] = await Promise.all([
      Like.countDocuments({ postId }),
      userId ? Like.exists({ postId, userId }) : false,
    ]);
    return res.json({ postId, likeCount, likedByUser: Boolean(likedByUser) });
  } catch (error) {
    next(error);
  }
});
// PUT /api/posts/:postId/likes  Body: { "userId": "<ObjectId>" }
router.put('/posts/:postId/likes', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Valid postId and userId are required' });
    }
    if (!(await Post.exists({ _id: postId }))) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Like.updateOne({ postId, userId }, { $setOnInsert: { postId, userId } }, { upsert: true });
    const likeCount = await Like.countDocuments({ postId });
    return res.json({ postId, userId, liked: true, likeCount });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:postId/likes  Body: { "userId": "<ObjectId>" }
router.delete('/posts/:postId/likes', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Valid postId and userId are required' });
          }
    if (!(await Post.exists({ _id: postId }))) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Like.deleteOne({ postId, userId });
    const likeCount = await Like.countDocuments({ postId });
    return res.json({ postId, userId, liked: false, likeCount });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
