const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const router = express.Router();

// POST /api/posts/:postId/comments
// Body: { "text": "Nice post", "authorId": "<MongoDB ObjectId>" }
router.post('/posts/:postId/comments', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text, authorId } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: 'Invalid post id' });
    }

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).json({ error: 'authorId must be a valid MongoDB ObjectId' });
    }
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
        if (text.trim().length > 1000) {
      return res.status(400).json({ error: 'text cannot exceed 1000 characters' });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) return res.status(404).json({ error: 'Post not found' });

    const comment = await Comment.create({ postId, authorId, text: text.trim() });
    return res.status(201).json({ comment });