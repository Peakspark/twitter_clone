require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const authroutes = require('./routes/authroutes');
const connectDB = require('./config/db.js');

// Middleware
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Authentication routes
app.use('/auth', authroutes);

// Start server
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