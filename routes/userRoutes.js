const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUsers } = require('../controllers/userController'); // Added getMe
const { protect } = require('../middleware/authMiddleware'); // Added protect middleware

// Public Routes
router.post('/', registerUser);
router.get('/', getUsers);
router.post('/login', loginUser);

// Protected Route (This was missing!)
router.get('/me', protect, getMe);

module.exports = router;