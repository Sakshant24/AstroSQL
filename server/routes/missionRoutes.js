// server/routes/missionRoutes.js
const express = require('express');
const router = express.Router();
const missionModel = require('../models/missionModel');

// Route for GET /api/missions
router.get('/missions', async (req, res) => {
  try {
    const missions = await missionModel.getAllMissions();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for GET /api/missions/:id
router.get('/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mission = await missionModel.getMissionById(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;