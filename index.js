require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const authroutes = require('./routes/authroutes');
const connectDB = require('./config/db.js');

// Twitter API feature routes
const postRoutes = require('./src/routes/posts');
const commentRoutes = require('./src/routes/comments');
const likeRoutes = require('./src/routes/likes');

// Middleware
app.use(express.json({ limit: '16kb' }));

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Authentication routes
app.use('/auth', authroutes);

// Post, comment, and like routes
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);

// Handle invalid JSON and unexpected errors

app.use((error, req, res, next) => {
    console.error(error);
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }
    return res.status(500).json({ error: 'Internal server error' });
});

// Start server only after the database connection succeeds
const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
