const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Ideally remove this if you aren't using it yet, but it's fine to keep
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
// We changed this to 8000 earlier to avoid AirPlay conflicts
const PORT = process.env.PORT || 8000; 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- ROUTES ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes')); // <--- THIS WAS MISSING!

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});