const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// A user can like a post only once.
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });
likeSchema.index({ postId: 1 });

module.exports = mongoose.model('Like', likeSchema);
