const express = require('express');
const { registerUser, loginUser, getUserProfile, refreshToken } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const router = express.Router();

// Define routes for user management
router.post('/register', registerUser);          // Register a new user
router.post('/login', loginUser);                // Login to get access and refresh tokens
router.get('/profile', protect, getUserProfile); // Get profile of logged-in user
router.post('/refresh-token', refreshToken);     // Refresh access token

module.exports = router; // Export the router to be used in server.js
