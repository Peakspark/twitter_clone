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
