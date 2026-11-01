const express = require('express');
const app = express();
const port = 3000 ;
const authroutes = require('./routes/authroutes')
const connectDB = require('./config/db.js')
app.get('/' , (req , res)=>{
    res.send('Hello World ');
});

connectDB();
app.use("/" , authroutes);

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});