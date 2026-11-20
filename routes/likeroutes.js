const express = require('express');
const {
  likePost,
  unlikePost,
  getLikes
} = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Signed-in users can like or unlike a post.
router.put('/:postId/like', authMiddleware, likePost);
router.delete('/:postId/like', authMiddleware, unlikePost);

// Anyone can check the total likes.
router.get('/:postId/likes', getLikes);

module.exports = router;