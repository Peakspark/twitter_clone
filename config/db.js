const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing from your .env file');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

module.exports = connectDB;