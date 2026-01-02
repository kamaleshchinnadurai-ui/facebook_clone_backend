const express = require('express');
const router = express.Router();

// Import the functions we just wrote in the controller
const { getUsers, registerUser } = require('../controllers/userController');

// This says: When someone visits '/' (which will be /api/users)...
// If it's a GET request -> run getUsers
// If it's a POST request -> run registerUser
router.route('/').get(getUsers).post(registerUser);

module.exports = router;