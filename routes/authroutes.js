const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/authcontroller.js');

router.post('/signup', signup);

module.exports = router;