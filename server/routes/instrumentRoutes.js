const express = require('express');
// mergeParams allows this router to access params from parent routers (like :id from missions)
const router = express.Router({ mergeParams: true });
const instrumentModel = require('../models/instrumentModel');

// This single route handles BOTH /api/v1/instruments AND /api/v1/missions/:id/instruments
router.get('/', async (req, res) => {
  try {
    const { id } = req.params; 

    if (id) {
      //  Get instruments for one mission.
      const instruments = await instrumentModel.getInstrumentsByMissionId(id);
      res.json(instruments);
    } else {
      // If no ID exists, it's the top-level route. Get all instruments.
      const instruments = await instrumentModel.getAllInstruments();
      res.json(instruments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/v1/instruments/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const instrument = await instrumentModel.getInstrumentById(id);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    res.json(instrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;