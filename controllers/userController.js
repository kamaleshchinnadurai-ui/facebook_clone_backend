const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')

// @desc    Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = await User.create({ name, email, password: hashedPassword })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      friends: user.friends,
      friendRequests: user.friendRequests,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.bio = req.body.bio || user.bio
    user.location = req.body.location || user.location
    if (req.file) { user.profilePicture = req.file.path }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      location: updatedUser.location,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Search users
const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? {
    name: { $regex: req.query.keyword, $options: 'i' }
  } : {}
  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
    .select('name profilePicture bio location')
  res.json(users)
})

// @desc    Send Friend Request
const sendFriendRequest = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id)
  if (!targetUser) {
    res.status(404)
    throw new Error('User not found')
  }
  if (targetUser.friendRequests.includes(req.user.id)) {
    res.status(400)
    throw new Error('Request already sent')
  }
  targetUser.friendRequests.push(req.user.id)
  await targetUser.save()
  
  await Notification.create({
    recipient: targetUser._id,
    sender: req.user.id,
    type: 'friendRequest',
    content: `${req.user.name} sent you a friend request.`,
  })
  res.status(200).json({ message: 'Request sent' })
})

// @desc    Accept Friend Request
const acceptFriendRequest = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  const requester = await User.findById(req.params.id)
  
  if (!requester) {
    res.status(404)
    throw new Error('Requester not found')
  }

  // Add to friends lists (Check prevents duplicates)
  if (!currentUser.friends.includes(requester._id)) {
    currentUser.friends.push(requester._id)
  }
  if (!requester.friends.includes(currentUser._id)) {
    requester.friends.push(currentUser._id)
  }

  // Remove from pending requests
  currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== req.params.id)
  
  await currentUser.save()
  await requester.save()

  // 👇 NEW: Delete the old notification so it disappears from the UI
  await Notification.findOneAndDelete({
    recipient: req.user.id,
    sender: req.params.id,
    type: 'friendRequest'
  })
  
  // Notify the requester that you accepted
  await Notification.create({
    recipient: requester._id,
    sender: req.user.id,
    type: 'acceptRequest',
    content: `${req.user.name} accepted your request.`,
  })
  
  res.status(200).json({ message: 'Accepted' })
})

// @desc    Get Notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .populate('sender', 'name profilePicture')
    .sort({ createdAt: -1 })
  res.status(200).json(notifications)
})

// 👇 NEW: Get Friends List
// @desc    Get logged in user's friends
const getFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('friends', 'name profilePicture location bio')
  res.status(200).json(user.friends)
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
  registerUser, loginUser, getMe, updateUserProfile, searchUsers,
  sendFriendRequest, acceptFriendRequest, getNotifications, getFriends // Make sure getFriends is exported!
}