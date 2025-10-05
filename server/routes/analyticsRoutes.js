const express = require('express');
const router = express.Router();
const analyticsModel = require('../models/analyticsModel');

router.get('/success-by-destination', async (req, res) => {
  res.json(await analyticsModel.getSuccessByDestination());
});
router.get('/avg-cost-by-type', async (req, res) => {
  res.json(await analyticsModel.getAvgCostByType());
});
router.get('/top-launch-vehicles', async (req, res) => {
  res.json(await analyticsModel.getTopLaunchVehicles());
});
router.get('/successful-summary', async (req, res) => {
  try {
    const summary = await analyticsModel.getSuccessfulMissionSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;