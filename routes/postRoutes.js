const express = require('express')
const router = express.Router()
const {
  getPosts,
  setPost,
  updatePost,
  deletePost,
} = require('../controllers/postController')

const { protect } = require('../middleware/authMiddleware')
const { checkToxicity } = require('../toxicityFilter') 

const toxicityMiddleware = async (req, res, next) => {
  console.log("--- NEW POST INCOMING ---");
  console.log("Data received from frontend:", req.body);

  try {
    // Make sure text actually exists and isn't empty
    if (req.body.text && req.body.text.trim() !== '') {
      
      const isToxic = await checkToxicity(req.body.text);

      if (isToxic) {
        return res.status(400).json({ message: 'Blocked: This post violates our community guidelines.' });
      }
    } else {
      console.log("⚠️ No valid 'text' found in req.body. Passing to controller anyway.");
    }
    
    // Everything is safe, move to the database!
    next();
    
  } catch (error) {
    console.error("❌ Middleware Error:", error.message);
    next(); // Move forward even if there's an error
  }
}

router.route('/')
  .get(protect, getPosts)
  .post(protect, toxicityMiddleware, setPost) 

router.route('/:id')
  .delete(protect, deletePost)
  .put(protect, toxicityMiddleware, updatePost) 

module.exports = router