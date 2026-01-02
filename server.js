const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;  <-- Comment this out
const PORT = 3000; // <-- Force this // Fallback to 3000 if .env fails

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/users', userRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('API is running on Port 3000...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});