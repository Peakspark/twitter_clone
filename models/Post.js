const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Post text is required'],
      trim: true,
      minlength: [1, 'Post cannot be empty'],
      maxlength: [280, 'Post cannot exceed 280 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
