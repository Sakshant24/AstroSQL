// server/routes/missionRoutes.js
const express = require('express');
const router = express.Router();
const missionModel = require('../models/missionModel');
const milestoneRoutes = require('./milestoneRoutes'); // <-- ADD THIS
const instrumentRoutes = require('./instrumentRoutes');

// --- THIS IS THE FIXED CODE ---
// GET all missions
router.get('/missions', async (req, res) => {
  try {
    const missions = await missionModel.getAllMissions();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one mission by ID
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
// --- END OF FIX ---


// --- NEW ROUTE: CREATE a mission ---
router.post('/missions', async (req, res) => {
  try {
    const newMission = await missionModel.createMission(req.body);
    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- NEW ROUTE: UPDATE a mission ---
router.put('/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await missionModel.updateMission(id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Mission not found or no changes made' });
    }
    res.json({ message: 'Mission updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- NEW ROUTE: DELETE a mission ---
router.delete('/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await missionModel.deleteMission(id);
    if (!success) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.use('/missions/:id/milestones', milestoneRoutes);
router.use('/missions/:id/instruments', instrumentRoutes);

module.exports = router;