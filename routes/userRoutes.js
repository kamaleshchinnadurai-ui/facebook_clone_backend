const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// Public Routes
router.post('/', registerUser)
router.post('/login', loginUser)

// Private Routes
router.get('/me', protect, getMe)

module.exports = router