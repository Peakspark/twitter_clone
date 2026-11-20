const express = require('express');
const {
  createComment,
  getComments,
  deleteComment
} = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Anyone can read comments for a post.
router.get('/posts/:postId/comments', getComments);

// Signed-in users can comment and delete their own comments.
router.post('/posts/:postId/comments', authMiddleware, createComment);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
