const express = require('express')
const router = express.Router()
const {
  registerUser, loginUser, getMe, updateUserProfile, searchUsers,
  sendFriendRequest, acceptFriendRequest, getNotifications, getFriends
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/profile', protect, upload.single('image'), updateUserProfile)

// 👇 Make sure to place these ABOVE the /:id routes
router.get('/search', protect, searchUsers)
router.get('/notifications', protect, getNotifications)
router.get('/friends', protect, getFriends) // <-- NEW FRIEND LIST ROUTE

router.post('/friend-request/:id', protect, sendFriendRequest)
router.post('/accept-request/:id', protect, acceptFriendRequest)

module.exports = router