const express = require('express');
const {
  createPost,
  getPosts,
  deletePost
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Anyone can view posts
router.get('/', getPosts);

// A signed-in user can create and delete their own posts
router.post('/', authMiddleware, createPost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
