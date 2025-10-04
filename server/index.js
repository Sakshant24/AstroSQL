// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const missionRoutes = require('./routes/missionRoutes'); // Import the routes

const app = express();
const port = 3001;

// Middleware
app.use(cors());

// --- FIX FOR "Cannot GET /" ---
// This is the default route for the root URL /
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the NASA Missions API!');
});

// Use the mission routes for any URL starting with /api
app.use('/api', missionRoutes);

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});