const express = require('express');
const router = express.Router();
const launchVehicleModel = require('../models/launchVehicleModel');

// GET /api/v1/launch_vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await launchVehicleModel.getAllLaunchVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/v1/launch_vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await launchVehicleModel.getLaunchVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Launch vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;