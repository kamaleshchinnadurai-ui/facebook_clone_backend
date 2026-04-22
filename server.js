const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 8000
const cors = require('cors')
const { loadModel } = require('./toxicityFilter');

connectDB()

const app = express()

// Allow requests from frontend
app.use(cors({
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 👇 RESTORED: This line was missing! Your dashboard needs this to load posts/goals.
app.use('/api/posts', require('./routes/postRoutes')) 

// Routes
app.use('/api/users', require('./routes/userRoutes'))

// Serve images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')))

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)
loadModel();
app.listen(port, () => console.log(`Server started on port ${port}`))