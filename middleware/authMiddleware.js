const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  // 1. Check if the header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // 2. Reject if no token is found
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }

  let decoded;
  
  // 3. Verify the token (Isolated try-catch)
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    res.status(401)
    // 👇 This will now tell you exactly what is wrong (e.g., "jwt malformed" or "jwt expired")
    throw new Error(`Not authorized, token failed: ${error.message}`)
  }

  // 4. Find the user in the database (Isolated try-catch)
  try {
    req.user = await User.findById(decoded.id).select('-password')
  } catch (error) {
    res.status(500)
    throw new Error('Server error while searching for user')
  }

  // 5. Reject if user was deleted
  if (!req.user) {
    res.status(401)
    throw new Error('Not authorized, user not found in database')
  }

  next()
})

module.exports = { protect }