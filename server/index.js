require('dotenv').config();
const express = require('express');
const cors = require('cors');


const missionRoutes = require('./routes/missionRoutes');
const researcherRoutes = require('./routes/researcherRoutes');
const launchVehicleRoutes = require('./routes/launchVehicleRoutes'); 
const instrumentRoutes = require('./routes/instrumentRoutes');  
const auditLogRoutes = require('./routes/auditLogRoutes');     
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the NASA Missions API!');
});

// Using the routes for different parts of the API
app.use('/api/v1', missionRoutes);
app.use('/api/v1/researchers', researcherRoutes);
app.use('/api/v1/launch_vehicles', launchVehicleRoutes); 
app.use('/api/v1/instruments', instrumentRoutes);    
app.use('/api/v1/audit-logs', auditLogRoutes);     
app.use('/api/v1/analytics', analyticsRoutes);

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});