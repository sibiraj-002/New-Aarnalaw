const express = require('express');
const { register, login, logout, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/reset-password', resetPassword); // Add this line

module.exports = router;

