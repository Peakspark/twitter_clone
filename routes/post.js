const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const router = express.Router();

// POST /api/posts
// Body: { "text": "Hello world", "authorId": "<MongoDB ObjectId>" }
router.post('/', async (req, res, next) => {
  try {
    const { text, authorId } = req.body;

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    if (text.trim().length > 280) {
      return res.status(400).json({ error: 'text cannot exceed 280 characters' });
    }
    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).json({ error: 'authorId must be a valid MongoDB ObjectId' });
    }

    const post = await Post.create({ text: text.trim(), authorId });
    return res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
});


// GET /api/posts?limit=20&page=1
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Post.countDocuments(),
    ]);

    return res.json({ posts, page, limit, total });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id' });
    }
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json({ post });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id
// Body: { "authorId": "<MongoDB ObjectId>" }
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorId } = req.body;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(authorId)) {
      return res.status(400).json({ error: 'Valid post id and authorId are required' });
    }

    // The owner check is useful for local development. In production, get the
    // author id from verified authentication middleware, never from the body.
    const post = await Post.findOneAndDelete({ _id: id, authorId });
    if (!post) return res.status(404).json({ error: 'Post not found for this author' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
